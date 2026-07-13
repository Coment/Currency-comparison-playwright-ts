export type CurrencyCode = 'USD' | 'EUR';

export interface CurrencyRate {
  source: 'Minfin' | 'Kurs.com.ua';
  currency: CurrencyCode;
  buy: number;
  sell: number;
  collectedAt: string;
}
