import { expect, test } from '@playwright/test';
import { CurrencyCode } from '../../domain/models/Currency';
import { ExchangeRate } from '../../domain/models/ExchangeRate';
import { ExchangeRateSource } from '../../domain/ports/ExchangeRateSource';
import { CurrencyComparisonService } from '../../services/CurrencyComparisonService';

test('rejects an empty or duplicate currency request before calling providers', async () => {
  const firstSource = new StubSource('First bank', []);
  const service = new CurrencyComparisonService(
    firstSource,
    new StubSource('Second bank', [])
  );

  await expect(service.compare([])).rejects.toThrow(
    'At least one currency must be requested'
  );
  await expect(service.compare(['USD', 'USD'])).rejects.toThrow(
    'Requested currencies must be unique'
  );
  expect(firstSource.calls).toBe(0);
});

test('rejects missing and unexpected provider currencies', async () => {
  const missingRateService = new CurrencyComparisonService(
    new StubSource('First bank', [rate('First bank', 'USD')]),
    new StubSource('Second bank', [])
  );

  await expect(missingRateService.compare(['USD', 'EUR'])).rejects.toThrow(
    'First bank did not return requested currency EUR'
  );

  const unexpectedRateService = new CurrencyComparisonService(
    new StubSource('First bank', [
      rate('First bank', 'USD'),
      rate('First bank', 'EUR'),
    ]),
    new StubSource('Second bank', [])
  );

  await expect(unexpectedRateService.compare(['USD'])).rejects.toThrow(
    'First bank returned unexpected currency EUR'
  );
});

class StubSource implements ExchangeRateSource {
  calls = 0;

  constructor(
    readonly name: string,
    private readonly rates: ExchangeRate[]
  ) {}

  async collectRates(_currencies: CurrencyCode[]): Promise<ExchangeRate[]> {
    this.calls += 1;
    return this.rates;
  }
}

function rate(source: string, currency: CurrencyCode): ExchangeRate {
  return {
    source,
    currency,
    buy: 40,
    sell: 41,
    collectedAt: new Date('2026-01-01T11:00:00Z'),
  };
}
