import { CurrencyRateData } from '../types/excelView';
import { CurrencyCode, CurrencyRate } from '../types/currency';

export function parseRate(rawValue: string): number {
  const normalized = rawValue
    .replace(/\s/g, '')
    .replace(/,(?=.*\.)/g, '')
    .replace(',', '.')
    .replace(/[^\d.-]/g, '');
  const value = Number(normalized);

  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`Invalid exchange rate: "${rawValue}"`);
  }

  return value;
}

export function compareRates(
  minfinRates: CurrencyRate[],
  kursRates: CurrencyRate[]
): CurrencyRateData[] {
  const currencies: CurrencyCode[] = ['USD', 'EUR'];

  return currencies.flatMap((currency) => {
    const minfin = findRate(minfinRates, currency, 'Minfin');
    const kurs = findRate(kursRates, currency, 'Kurs.com.ua');
    const timestamp = new Date().toISOString();

    return [
      {
        currency,
        rateType: 'buy' as const,
        minfinRate: minfin.buy,
        kursRate: kurs.buy,
        difference: round(minfin.buy - kurs.buy),
        timestamp,
      },
      {
        currency,
        rateType: 'sell' as const,
        minfinRate: minfin.sell,
        kursRate: kurs.sell,
        difference: round(minfin.sell - kurs.sell),
        timestamp,
      },
    ];
  });
}

function findRate(
  rates: CurrencyRate[],
  currency: CurrencyCode,
  source: CurrencyRate['source']
): CurrencyRate {
  const rate = rates.find((item) => item.currency === currency && item.source === source);

  if (!rate) {
    throw new Error(`Missing ${currency} exchange rate from ${source}`);
  }

  return rate;
}

function round(value: number): number {
  return Math.round(value * 10_000) / 10_000;
}
