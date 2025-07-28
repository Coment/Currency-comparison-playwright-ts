import * as dotenv from 'dotenv';
dotenv.config();

export const baseUrl = process.env.BASE_URL || 'https://minfin.com.ua/';
const rawLang = process.env.APP_LANG || 'en';
export const lang = rawLang.split('_')[0];