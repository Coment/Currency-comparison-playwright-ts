import { expect, test } from '@playwright/test';
import { ExchangeRate } from '../../domain/models/ExchangeRate';
import { compareExchangeRates } from '../../domain/services/compareExchangeRates';

const collectedAt = new Date('2026-01-01T11:00:00Z');
const comparedAt = new Date('2026-01-01T12:00:00Z');

test('compares buy and sell rates, rounds differences, and preserves first-source order', () => {
  const firstRates = [
    rate('First bank', 'USD', 40.1234, 40.5),
    rate('First bank', 'EUR', 45, 46),
  ];
  const secondRates = [
    rate('Second bank', 'EUR', 44.8, 46.1),
    rate('Second bank', 'USD', 40, 40.7),
  ];

  const result = compareExchangeRates(firstRates, secondRates, comparedAt);

  expect(result).toEqual([
    comparison('USD', 'buy', 40.1234, 40, 0.1234),
    comparison('USD', 'sell', 40.5, 40.7, -0.2),
    comparison('EUR', 'buy', 45, 44.8, 0.2),
    comparison('EUR', 'sell', 46, 46.1, -0.1),
  ]);
});

test('fails when the second source has no matching currency', () => {
  expect(() =>
    compareExchangeRates([rate('First bank', 'EUR', 45, 46)], [])
  ).toThrow('Missing EUR exchange rate from the second source');
});

test('fails when a source returns a currency more than once', () => {
  const duplicateRates = [
    rate('First bank', 'USD', 40, 41),
    rate('First bank', 'USD', 40.1, 41.1),
  ];

  expect(() => compareExchangeRates(duplicateRates, [])).toThrow(
    'Duplicate USD exchange rate in first source'
  );
});

test('rejects non-finite, zero, and negative rates', () => {
  for (const invalidValue of [Number.NaN, Number.POSITIVE_INFINITY, 0, -1]) {
    expect(() =>
      compareExchangeRates(
        [rate('First bank', 'USD', invalidValue, 41)],
        [rate('Second bank', 'USD', 40, 41)]
      )
    ).toThrow('Invalid USD buy rate from First bank');
  }
});

function rate(
  source: string,
  currency: ExchangeRate['currency'],
  buy: number,
  sell: number
): ExchangeRate {
  return { source, currency, buy, sell, collectedAt };
}

function comparison(
  currency: ExchangeRate['currency'],
  rateType: 'buy' | 'sell',
  firstRate: number,
  secondRate: number,
  difference: number
) {
  return {
    currency,
    rateType,
    firstSource: 'First bank',
    firstRate,
    secondSource: 'Second bank',
    secondRate,
    difference,
    comparedAt,
  };
}
