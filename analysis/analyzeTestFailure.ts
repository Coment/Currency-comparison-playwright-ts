import 'dotenv/config';
import { TestInfo } from '@playwright/test';
import { FailureAnalyzer } from './FailureAnalysis';
import { collectFailureAnalysisInput } from './collectFailureAnalysisInput';
import { formatFailureRecommendation } from './formatFailureRecommendation';
import { OpenAiFailureAnalyzer } from './OpenAiFailureAnalyzer';

const DEFAULT_MODEL = 'gpt-5.6-terra';

interface AnalyzeTestFailureOptions {
  enabled?: boolean;
  includeScreenshot?: boolean;
  analyzer?: FailureAnalyzer;
}

export async function analyzeTestFailure(
  testInfo: TestInfo,
  options: AnalyzeTestFailureOptions = {}
): Promise<void> {
  const enabled = options.enabled ?? (process.env.AI_ANALYSIS === 'true');
  if (!enabled) return;
  if (!isUnexpectedFailure(testInfo)) return;
  if (testInfo.retry < testInfo.project.retries) return;

  const analyzer = options.analyzer ?? createOpenAiAnalyzer();
  if (!analyzer) return;

  try {
    const input = await collectFailureAnalysisInput(
      testInfo,
      options.includeScreenshot ??
        (process.env.AI_ANALYSIS_INCLUDE_SCREENSHOT === 'true')
    );
    const recommendation = await analyzer.analyze(input);
    const markdown = formatFailureRecommendation(recommendation);

    await testInfo.attach('AI failure analysis', {
      body: markdown,
      contentType: 'text/markdown',
    });
    await testInfo.attach('AI failure analysis JSON', {
      body: JSON.stringify(recommendation, null, 2),
      contentType: 'application/json',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[AI analysis] Failed without affecting the test: ${message}`);
  }
}

function createOpenAiAnalyzer(): FailureAnalyzer | undefined {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn(
      '[AI analysis] Skipped: OPENAI_API_KEY is not configured.'
    );
    return undefined;
  }

  return new OpenAiFailureAnalyzer({
    apiKey,
    model: process.env.OPENAI_MODEL ?? DEFAULT_MODEL,
    timeoutMs: parsePositiveInteger(process.env.AI_ANALYSIS_TIMEOUT_MS),
  });
}

function isUnexpectedFailure(testInfo: TestInfo): boolean {
  return (
    (testInfo.status === 'failed' || testInfo.status === 'timedOut') &&
    testInfo.status !== testInfo.expectedStatus
  );
}

function parsePositiveInteger(value: string | undefined): number | undefined {
  if (!value) return undefined;

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}
