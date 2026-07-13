export interface CurrencyRateData {
  currency: string;
  minfinRate: number;
  kursRate: number;
  difference: number;
  rateType: 'buy' | 'sell';
  timestamp: string;
}
