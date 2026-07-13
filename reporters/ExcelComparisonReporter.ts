import ExcelJS from 'exceljs';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { CurrencyComparison } from '../domain/models/CurrencyComparison';

export class ExcelComparisonReporter {
  async write(comparisons: CurrencyComparison[], filename: string): Promise<void> {
    if (comparisons.length === 0) {
      throw new Error('Cannot create an Excel report without comparison data');
    }

    const workbook = this.createWorkbook(comparisons);
    await mkdir(path.dirname(path.resolve(filename)), { recursive: true });
    await workbook.xlsx.writeFile(filename);
  }

  private createWorkbook(comparisons: CurrencyComparison[]): ExcelJS.Workbook {
    const workbook = new ExcelJS.Workbook();
    const firstSource = comparisons[0].firstSource;
    const secondSource = comparisons[0].secondSource;
    const worksheet = workbook.addWorksheet('Comparison');

    workbook.creator = 'Currency comparison Playwright tests';
    workbook.created = new Date();

    worksheet.columns = [
      { header: 'Currency', key: 'currency', width: 12 },
      { header: 'Rate type', key: 'rateType', width: 14 },
      { header: `${firstSource} rate`, key: 'firstRate', width: 18 },
      { header: `${secondSource} rate`, key: 'secondRate', width: 18 },
      {
        header: `Difference (${firstSource} - ${secondSource})`,
        key: 'difference',
        width: 32,
      },
      { header: 'Compared at', key: 'comparedAt', width: 22 },
    ];

    worksheet.views = [{ state: 'frozen', ySplit: 1 }];
    worksheet.autoFilter = 'A1:F1';
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1F4E78' },
    };

    comparisons.forEach((comparison) => {
      const row = worksheet.addRow(comparison);
      row.getCell('C').numFmt = '0.0000';
      row.getCell('D').numFmt = '0.0000';
      row.getCell('E').numFmt = '0.0000;[Red]-0.0000';
      row.getCell('F').numFmt = 'yyyy-mm-dd hh:mm:ss';
    });

    return workbook;
  }
}
