import { CurrencyCode } from '../domain/models/Currency';
import { CurrencyComparison } from '../domain/models/CurrencyComparison';
import { ExchangeRateSource } from '../domain/ports/ExchangeRateSource';
import { compareExchangeRates } from '../domain/services/compareExchangeRates';

export class CurrencyComparisonService {
  constructor(
    private readonly firstSource: ExchangeRateSource,
    private readonly secondSource: ExchangeRateSource
  ) {}

  async compare(currencies: CurrencyCode[]): Promise<CurrencyComparison[]> {
    const firstRates = await this.firstSource.collectRates(currencies);
    const secondRates = await this.secondSource.collectRates(currencies);

    return compareExchangeRates(firstRates, secondRates);
  }
}
