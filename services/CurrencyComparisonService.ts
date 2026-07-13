import { CurrencyCode } from '../domain/models/Currency';
import { CurrencyComparison } from '../domain/models/CurrencyComparison';
import { ExchangeRate } from '../domain/models/ExchangeRate';
import { ExchangeRateSource } from '../domain/ports/ExchangeRateSource';
import { compareExchangeRates } from '../domain/services/compareExchangeRates';

export class CurrencyComparisonService {
  constructor(
    private readonly firstSource: ExchangeRateSource,
    private readonly secondSource: ExchangeRateSource
  ) {}

  async compare(currencies: CurrencyCode[]): Promise<CurrencyComparison[]> {
    validateRequestedCurrencies(currencies);

    // Collection is intentionally sequential because sources may share browser state.
    const firstRates = await this.firstSource.collectRates(currencies);
    validateSourceResponse(this.firstSource.name, currencies, firstRates);

    const secondRates = await this.secondSource.collectRates(currencies);
    validateSourceResponse(this.secondSource.name, currencies, secondRates);

    return compareExchangeRates(firstRates, secondRates);
  }
}

function validateRequestedCurrencies(currencies: CurrencyCode[]): void {
  if (currencies.length === 0) {
    throw new Error('At least one currency must be requested');
  }

  const uniqueCurrencies = new Set(currencies);
  if (uniqueCurrencies.size !== currencies.length) {
    throw new Error('Requested currencies must be unique');
  }
}

function validateSourceResponse(
  sourceName: string,
  requestedCurrencies: CurrencyCode[],
  rates: ExchangeRate[]
): void {
  const requested = new Set(requestedCurrencies);
  const received = new Set<CurrencyCode>();

  for (const rate of rates) {
    if (!requested.has(rate.currency)) {
      throw new Error(`${sourceName} returned unexpected currency ${rate.currency}`);
    }

    if (received.has(rate.currency)) {
      throw new Error(`${sourceName} returned duplicate currency ${rate.currency}`);
    }

    received.add(rate.currency);
  }

  for (const currency of requestedCurrencies) {
    if (!received.has(currency)) {
      throw new Error(`${sourceName} did not return requested currency ${currency}`);
    }
  }
}
