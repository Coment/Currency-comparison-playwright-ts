import { CurrencyCode } from './Currency';

export interface ExchangeRate {
  source: string;
  currency: CurrencyCode;
  buy: number;
  sell: number;
  collectedAt: Date;
}
