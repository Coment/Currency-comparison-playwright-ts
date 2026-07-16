import { expect, test } from '@playwright/test';
import { CurrencyComparison } from '../../domain/models/CurrencyComparison';
import { TextComparisonReporter } from '../../reporters/TextComparisonReporter';

test('formats comparison data as a readable text summary', () => {
  const comparison: CurrencyComparison = {
    currency: 'USD',
    rateType: 'buy',
    firstSource: 'Minfin',
    firstRate: 44.8,
    secondSource: 'Kurs.com.ua',
    secondRate: 44.397,
    difference: 0.403,
    comparedAt: new Date('2026-07-15T10:00:00Z'),
  };

  const summary = new TextComparisonReporter().format([comparison]);

  expect(summary).toBe(`Currency comparison
Compared at: 2026-07-15T10:00:00.000Z

USD buy:
  Minfin: 44.8000
  Kurs.com.ua: 44.3970
  Difference: +0.4030`);
});

test('formats an empty result explicitly', () => {
  expect(new TextComparisonReporter().format([])).toBe(
    'Currency comparison\n\nNo comparison data.',
  );
});
