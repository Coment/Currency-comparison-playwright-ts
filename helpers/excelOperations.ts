import ExcelJS from 'exceljs';
import { CurrencyRateData } from '../types/excelView';

export function createWorkbook(): ExcelJS.Workbook {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Currency comparison Playwright tests';
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet('Comparison');
  worksheet.columns = [
    { header: 'Валюта', key: 'currency', width: 10 },
    { header: 'Тип курсу', key: 'rateType', width: 14 },
    { header: 'Курс (Minfin)', key: 'minfinRate', width: 15 },
    { header: 'Курс (Kurs.com.ua)', key: 'kursRate', width: 18 },
    { header: 'Різниця (Minfin - Kurs)', key: 'difference', width: 25 },
    { header: 'Дата / Час', key: 'timestamp', width: 22 },
  ];

  worksheet.views = [{ state: 'frozen', ySplit: 1 }];
  worksheet.autoFilter = 'A1:F1';
  worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF1F4E78' },
  };

  return workbook;
}

export function addDataToWorksheet(
  workbook: ExcelJS.Workbook,
  data: CurrencyRateData[]
): void {
  const worksheet = workbook.getWorksheet('Comparison');
  if (!worksheet) throw new Error('Worksheet not found');

  data.forEach((item) => {
    const row = worksheet.addRow(item);
    row.getCell('C').numFmt = '0.0000';
    row.getCell('D').numFmt = '0.0000';
    row.getCell('E').numFmt = '0.0000;[Red]-0.0000';
  });
}

export async function saveWorkbook(workbook: ExcelJS.Workbook, filename: string): Promise<void> {
  await workbook.xlsx.writeFile(filename);
  console.log(`Excel file saved: ${filename}`);
}
