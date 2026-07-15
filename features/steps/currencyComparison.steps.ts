import { DataTable, createBdd } from 'playwright-bdd';
import { CurrencyCode, RATE_TYPES } from '../../domain/models/Currency';
import { CurrencyComparison } from '../../domain/models/CurrencyComparison';
import { expect, test } from '../../fixtures/testFixtures';

const { Given, When, Then } = createBdd(test);
const supportedCurrencies = new Set<CurrencyCode>(['USD', 'EUR']);

Given(
  'the following currencies are selected:',
  async ({ comparisonScenario }, table: DataTable) => {
    const currencies = table.hashes().map(({ currency }) => currency);

    comparisonScenario.currencies = currencies.map((currency) => {
      if (!supportedCurrencies.has(currency as CurrencyCode)) {
        throw new Error(`Unsupported currency in feature file: ${currency}`);
      }

      return currency as CurrencyCode;
    });
  }
);

When(
  'I compare rates from Minfin and Kurs.com.ua',
  async ({ comparisonScenario, currencyComparison }) => {
    comparisonScenario.result = await currencyComparison.compare(
      comparisonScenario.currencies
    );
  }
);

Then(
  'buy and sell comparisons should be available for every currency',
  async ({ comparisonScenario }) => {
    const result = getComparisonResult(comparisonScenario.result);

    expect(result).toHaveLength(
      comparisonScenario.currencies.length * RATE_TYPES.length
    );

    for (const currency of comparisonScenario.currencies) {
      const rateTypes = result
        .filter((comparison) => comparison.currency === currency)
        .map((comparison) => comparison.rateType);

      expect(rateTypes).toEqual(RATE_TYPES);
    }
  }
);

Then(
  'every collected exchange rate should be positive',
  async ({ comparisonScenario }) => {
    const result = getComparisonResult(comparisonScenario.result);

    for (const comparison of result) {
      expect(comparison.firstRate).toBeGreaterThan(0);
      expect(comparison.secondRate).toBeGreaterThan(0);
    }
  }
);

function getComparisonResult(
  result: CurrencyComparison[] | undefined
): CurrencyComparison[] {
  if (!result) {
    throw new Error('Currency comparison has not been executed');
  }

  return result;
}
