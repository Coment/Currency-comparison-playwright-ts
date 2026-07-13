import { CurrencyCode } from '../domain/models/Currency';
import { expect, test } from '../fixtures/testFixtures';

const currencies: CurrencyCode[] = ['USD', 'EUR'];

test('compares USD and EUR exchange rates', async ({ currencyComparison }) => {
  const result = await currencyComparison.compare(currencies);

  expect(result).toHaveLength(currencies.length * 2);

  for (const comparison of result) {
    expect(comparison.firstRate).toBeGreaterThan(0);
    expect(comparison.secondRate).toBeGreaterThan(0);
  }
});
