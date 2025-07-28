import { lang } from './envVars';

const translations = {
  ua: {
    pageTitle: (date: string) => new RegExp(`Курс валют на ${date}`),
    usdLabel: 'USD міжбанк',
  },
  en: {
    pageTitle: (date: string) => new RegExp(`Exchange rates as of ${date}`),
    usdLabel: 'USD interbank',
  },
};

export const t = translations[lang as 'ua' | 'en'];