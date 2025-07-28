import ExcelJS from 'exceljs';
import { CurrencyRateData } from '../types/excelView';

export function createWorkbook(): ExcelJS.Workbook {
  const workbook = new ExcelJS.Workbook();

  const worksheet = workbook.addWorksheet('Comparison');
  worksheet.columns = [
    { header: 'Валюта', key: 'currency', width: 10 },
    { header: 'Курс (Minfin)', key: 'minfinRate', width: 15 },
    { header: 'Курс (Kurs.com.ua)', key: 'kursRate', width: 18 },
    { header: 'Різниця', key: 'difference', width: 10 },
    { header: 'Тип курсу', key: 'rateType', width: 12 },
    { header: 'Дата / Час', key: 'timestamp', width: 22 },
  ];

  return workbook;
}

export function addDataToWorksheet(
  workbook: ExcelJS.Workbook,
  data: CurrencyRateData[]
): void {
  const worksheet = workbook.getWorksheet('Comparison');
  if (!worksheet) throw new Error('Worksheet not found');

  data.forEach(item => worksheet.addRow(item));
}

export async function saveWorkbook(workbook: ExcelJS.Workbook, filename: string): Promise<void> {
  await workbook.xlsx.writeFile(filename);
  console.log(`Excel file saved: ${filename}`);
}