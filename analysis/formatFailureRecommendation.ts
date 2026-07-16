import { FailureRecommendation } from './FailureAnalysis';

export function formatFailureRecommendation(
  recommendation: FailureRecommendation
): string {
  return [
    '# AI failure analysis',
    '',
    `- Category: \`${recommendation.category}\``,
    `- Confidence: ${Math.round(recommendation.confidence * 100)}%`,
    `- Human review required: ${recommendation.requiresHumanReview ? 'yes' : 'no'}`,
    '',
    '## Summary',
    '',
    recommendation.summary,
    '',
    '## Evidence',
    '',
    ...asMarkdownList(recommendation.evidence),
    '',
    '## Recommendations',
    '',
    ...asMarkdownList(recommendation.recommendations),
    '',
    '## Suspected files',
    '',
    ...asMarkdownList(recommendation.suspectedFiles),
    '',
    '> This analysis is advisory. It never changes source code or test status.',
  ].join('\n');
}

function asMarkdownList(items: string[]): string[] {
  return items.length > 0 ? items.map((item) => `- ${item}`) : ['- None'];
}
