import { CurrencyCode } from '../models/Currency';
import { ExchangeRate } from '../models/ExchangeRate';

export interface ExchangeRateSource {
  readonly name: string;
  collectRates(currencies: CurrencyCode[]): Promise<ExchangeRate[]>;
}
