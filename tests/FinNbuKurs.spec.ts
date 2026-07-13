import { expect, test } from '../helpers/allureHelper';
import { compareRates } from '../helpers/currencyComparison';
import { addDataToWorksheet, createWorkbook, saveWorkbook } from '../helpers/excelOperations';
import { excelOutputFile } from '../helpers/envVars';
import { Logger } from '../helpers/logger';
import { KursComUaPage } from '../pages/KursComUa';
import { MinFinPage } from '../pages/MinFin';
import { CurrencyCode } from '../types/currency';

const currencies: CurrencyCode[] = ['USD', 'EUR'];

test('порівнює курси USD та EUR і створює Excel-звіт', async ({ page }) => {
  const minfinPage = new MinFinPage(page);
  const kursPage = new KursComUaPage(page);

  await test.step('Отримати курси Minfin', async () => {
    await minfinPage.open();
  });
  const minfinRates = await minfinPage.getRates(currencies);

  await test.step('Отримати курси Kurs.com.ua', async () => {
    await kursPage.open();
  });
  const kursRates = await kursPage.getRates(currencies);

  const comparison = compareRates(minfinRates, kursRates);

  expect(comparison).toHaveLength(currencies.length * 2);
  comparison.forEach((row) => {
    expect(row.minfinRate).toBeGreaterThan(0);
    expect(row.kursRate).toBeGreaterThan(0);
  });

  const workbook = createWorkbook();
  addDataToWorksheet(workbook, comparison);
  await saveWorkbook(workbook, excelOutputFile);

  Logger.attachJSON('Currency comparison', comparison);
  Logger.info(`Currency comparison saved to ${excelOutputFile}`);
});
