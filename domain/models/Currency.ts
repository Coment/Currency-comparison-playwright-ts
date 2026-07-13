export type CurrencyCode = 'USD' | 'EUR';

export type RateType = 'buy' | 'sell';

export const RATE_TYPES = ['buy', 'sell'] as const satisfies readonly RateType[];
