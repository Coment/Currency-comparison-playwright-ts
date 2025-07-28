import * as dotenv from 'dotenv';
dotenv.config();

export const baseUrl = process.env.BASE_URL || 'https://minfin.com.ua/';
export const lang = process.env.LANG || 'ua';