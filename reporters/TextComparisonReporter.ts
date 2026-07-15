import { CurrencyComparison } from '../domain/models/CurrencyComparison';

export class TextComparisonReporter {
  format(comparisons: CurrencyComparison[]): string {
    if (comparisons.length === 0) {
      return 'Currency comparison\n\nNo comparison data.';
    }

    const lines = [
      'Currency comparison',
      `Compared at: ${comparisons[0].comparedAt.toISOString()}`,
      '',
    ];

    for (const comparison of comparisons) {
      lines.push(
        `${comparison.currency} ${comparison.rateType}:`,
        `  ${comparison.firstSource}: ${formatRate(comparison.firstRate)}`,
        `  ${comparison.secondSource}: ${formatRate(comparison.secondRate)}`,
        `  Difference: ${formatDifference(comparison.difference)}`,
        ''
      );
    }

    return lines.join('\n').trimEnd();
  }
}

function formatRate(value: number): string {
  return value.toFixed(4);
}

function formatDifference(value: number): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(4)}`;
}
