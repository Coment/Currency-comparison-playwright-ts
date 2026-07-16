import { expect, test, TestInfo } from '@playwright/test';
import { analyzeTestFailure } from '../../analysis/analyzeTestFailure';
import {
  FailureAnalysisInput,
  FailureAnalyzer,
  FailureRecommendation,
} from '../../analysis/FailureAnalysis';

test('attaches advisory Markdown and JSON after a final unexpected failure', async () => {
  const attached: Array<{
    name: string;
    body?: string | Buffer;
    contentType?: string;
  }> = [];
  const testInfo = {
    title: 'failing UI scenario',
    titlePath: ['bdd-chromium', 'feature', 'failing UI scenario'],
    project: { name: 'bdd-chromium', retries: 0 },
    tags: ['@e2e'],
    status: 'failed',
    expectedStatus: 'passed',
    retry: 0,
    duration: 1_000,
    file: 'features/currencyComparison.feature',
    line: 4,
    column: 3,
    errors: [{ message: 'Timeout while resolving locator' }],
    attachments: [],
    attach: async (name: string, options: { body?: string | Buffer; contentType?: string }) => {
      attached.push({ name, ...options });
    },
  } as unknown as TestInfo;
  const analyzer: FailureAnalyzer = {
    analyze: async (_input: FailureAnalysisInput) => recommendation(),
  };

  await analyzeTestFailure(testInfo, {
    enabled: true,
    includeScreenshot: false,
    analyzer,
  });

  expect(attached.map(({ name }) => name)).toEqual([
    'AI failure analysis',
    'AI failure analysis JSON',
  ]);
  expect(String(attached[0].body)).toContain('Category: `locator`');
  expect(JSON.parse(String(attached[1].body))).toEqual(recommendation());
});

function recommendation(): FailureRecommendation {
  return {
    category: 'locator',
    confidence: 0.8,
    summary: 'The locator likely changed.',
    evidence: ['The locator timed out.'],
    recommendations: ['Inspect the current accessible name.'],
    suspectedFiles: ['pages/MinFin.ts'],
    requiresHumanReview: true,
  };
}
