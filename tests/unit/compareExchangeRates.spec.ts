import { expect, test } from '@playwright/test';
import { ExchangeRate } from '../../domain/models/ExchangeRate';
import { compareExchangeRates } from '../../domain/services/compareExchangeRates';

test('creates buy and sell comparisons for each currency', () => {
  const collectedAt = new Date('2026-01-01T12:00:00Z');
  const firstRates: ExchangeRate[] = [
    {
      source: 'First bank',
      currency: 'USD',
      buy: 40.1,
      sell: 40.5,
      collectedAt,
    },
  ];
  const secondRates: ExchangeRate[] = [
    {
      source: 'Second bank',
      currency: 'USD',
      buy: 40,
      sell: 40.7,
      collectedAt,
    },
  ];

  const result = compareExchangeRates(firstRates, secondRates);

  expect(result).toMatchObject([
    { currency: 'USD', rateType: 'buy', difference: 0.1 },
    { currency: 'USD', rateType: 'sell', difference: -0.2 },
  ]);
});

test('fails when the second source has no matching currency', () => {
  const firstRates: ExchangeRate[] = [
    {
      source: 'First bank',
      currency: 'EUR',
      buy: 45,
      sell: 46,
      collectedAt: new Date(),
    },
  ];

  expect(() => compareExchangeRates(firstRates, [])).toThrow(
    'Missing EUR exchange rate from the second source'
  );
});
