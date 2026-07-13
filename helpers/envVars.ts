import * as dotenv from 'dotenv';
dotenv.config();

export const baseUrl = process.env.BASE_URL || 'https://minfin.com.ua/';
export const minfinUrl = process.env.MINFIN_URL || 'https://minfin.com.ua/ua/currency/';
export const kursUrl = process.env.KURS_URL || 'https://kurs.com.ua/';
export const excelOutputFile = process.env.EXCEL_OUTPUT_FILE || 'output.xlsx';
const rawLang = process.env.APP_LANG || 'en';
export const lang = rawLang.split('_')[0];
