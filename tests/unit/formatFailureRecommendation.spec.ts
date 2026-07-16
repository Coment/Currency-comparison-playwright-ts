import { expect, test } from '@playwright/test';
import { formatFailureRecommendation } from '../../analysis/formatFailureRecommendation';

test('formats an AI recommendation as a readable report attachment', () => {
  const result = formatFailureRecommendation({
    category: 'locator',
    confidence: 0.87,
    summary: 'The heading locator no longer matches the current page.',
    evidence: ['The locator timed out.', 'The page loaded successfully.'],
    recommendations: ['Inspect the current accessible heading name.'],
    suspectedFiles: ['pages/MinFin.ts'],
    requiresHumanReview: true,
  });

  expect(result).toContain('Category: `locator`');
  expect(result).toContain('Confidence: 87%');
  expect(result).toContain('- pages/MinFin.ts');
  expect(result).toContain('never changes source code or test status');
});
