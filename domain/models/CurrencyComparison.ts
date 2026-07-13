import { CurrencyCode, RateType } from './Currency';

export interface CurrencyComparison {
  currency: CurrencyCode;
  rateType: RateType;
  firstSource: string;
  firstRate: number;
  secondSource: string;
  secondRate: number;
  difference: number;
  comparedAt: Date;
}
