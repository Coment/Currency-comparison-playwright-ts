import { CurrencyComparison } from '../models/CurrencyComparison';
import { CurrencyCode, RATE_TYPES } from '../models/Currency';
import { ExchangeRate } from '../models/ExchangeRate';

export function compareExchangeRates(
  firstRates: ExchangeRate[],
  secondRates: ExchangeRate[],
  comparedAt: Date = new Date()
): CurrencyComparison[] {
  const firstRatesByCurrency = indexRates(firstRates, 'first source');
  const secondRatesByCurrency = indexRates(secondRates, 'second source');

  for (const currency of secondRatesByCurrency.keys()) {
    if (!firstRatesByCurrency.has(currency)) {
      throw new Error(`${currency} exchange rate exists only in the second source`);
    }
  }

  return firstRates.flatMap((firstRate) => {
    const secondRate = secondRatesByCurrency.get(firstRate.currency);

    if (!secondRate) {
      throw new Error(
        `Missing ${firstRate.currency} exchange rate from the second source`
      );
    }

    return RATE_TYPES.map((rateType): CurrencyComparison => {
      const firstValue = firstRate[rateType];
      const secondValue = secondRate[rateType];

      return {
        currency: firstRate.currency,
        rateType,
        firstSource: firstRate.source,
        firstRate: firstValue,
        secondSource: secondRate.source,
        secondRate: secondValue,
        difference: roundToFourDecimals(firstValue - secondValue),
        comparedAt,
      };
    });
  });
}

function indexRates(
  rates: ExchangeRate[],
  sourceLabel: string
): Map<CurrencyCode, ExchangeRate> {
  const ratesByCurrency = new Map<CurrencyCode, ExchangeRate>();

  for (const rate of rates) {
    validateRate(rate);

    if (ratesByCurrency.has(rate.currency)) {
      throw new Error(`Duplicate ${rate.currency} exchange rate in ${sourceLabel}`);
    }

    ratesByCurrency.set(rate.currency, rate);
  }

  return ratesByCurrency;
}

function validateRate(rate: ExchangeRate): void {
  for (const rateType of RATE_TYPES) {
    const value = rate[rateType];

    if (!Number.isFinite(value) || value <= 0) {
      throw new Error(
        `Invalid ${rate.currency} ${rateType} rate from ${rate.source}: ${value}`
      );
    }
  }
}

function roundToFourDecimals(value: number): number {
  return Math.round(value * 10_000) / 10_000;
}
