import { expect, test } from '@playwright/test';
import { FetchLike, OpenAiFailureAnalyzer } from '../../analysis/OpenAiFailureAnalyzer';
import { FailureAnalysisInput } from '../../analysis/FailureAnalysis';

test('requests and parses a structured failure recommendation', async () => {
  const recommendation = {
    category: 'locator',
    confidence: 0.9,
    summary: 'The locator likely changed.',
    evidence: ['Timeout while resolving a heading.'],
    recommendations: ['Inspect the current accessible heading name.'],
    suspectedFiles: ['pages/MinFin.ts'],
    requiresHumanReview: true,
  };
  let requestBody: unknown;

  const fakeFetch: FetchLike = async (_input, init) => {
    requestBody = JSON.parse(String(init?.body));

    return new Response(
      JSON.stringify({
        output: [
          {
            type: 'message',
            content: [
              {
                type: 'output_text',
                text: JSON.stringify(recommendation),
              },
            ],
          },
        ],
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  };
  const analyzer = new OpenAiFailureAnalyzer(
    {
      apiKey: 'test-key',
      model: 'test-model',
    },
    fakeFetch,
  );

  const result = await analyzer.analyze(failureInput());

  expect(result).toEqual(recommendation);
  expect(requestBody).toMatchObject({
    model: 'test-model',
    store: false,
    text: {
      format: {
        type: 'json_schema',
        strict: true,
      },
    },
  });
});

function failureInput(): FailureAnalysisInput {
  return {
    context: {
      testTitle: 'failing test',
      titlePath: ['project', 'feature', 'failing test'],
      projectName: 'bdd-chromium',
      tags: ['@e2e'],
      status: 'failed',
      expectedStatus: 'passed',
      retry: 0,
      durationMs: 1_000,
      source: {
        file: 'features/currencyComparison.feature',
        line: 4,
        column: 3,
      },
      errors: [
        {
          message: 'Timeout while resolving locator',
          stack: 'at pages/MinFin.ts:20:5',
        },
      ],
      attachments: [],
    },
  };
}
