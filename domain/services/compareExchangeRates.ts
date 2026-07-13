import { CurrencyComparison } from '../models/CurrencyComparison';
import { RATE_TYPES } from '../models/Currency';
import { ExchangeRate } from '../models/ExchangeRate';

export function compareExchangeRates(
  firstRates: ExchangeRate[],
  secondRates: ExchangeRate[]
): CurrencyComparison[] {
  return firstRates.flatMap((firstRate) => {
    const secondRate = secondRates.find(
      ({ currency }) => currency === firstRate.currency
    );

    if (!secondRate) {
      throw new Error(
        `Missing ${firstRate.currency} exchange rate from the second source`
      );
    }

    const comparedAt = new Date();

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
        difference: round(firstValue - secondValue),
        comparedAt,
      };
    });
  });
}

function round(value: number): number {
  return Math.round(value * 10_000) / 10_000;
}
