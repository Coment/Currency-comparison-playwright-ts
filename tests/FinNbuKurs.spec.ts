import { test, expect } from '../helpers/allureHelper';
import * as ExcelJS from 'exceljs';
import { baseUrl, lang } from '../helpers/envVars';
import { MinFinPage } from '../pages/MinFin';
import { Logger } from '../helpers/logger';



test('Check MinFin page', async ({ page }) => {

  const today = new Date();
  // TODO: Move the date formatting to a helper function
  // to avoid duplication in other tests.
  const date = `${String(today.getDate()).padStart(2, '0')}.${String(today.getMonth() + 1).padStart(2, '0')}.${today.getFullYear()}`;
  await page.goto('https://minfin.com.ua/ua/currency/');
  Logger.info(`Test started for MinFin currency page`);
  Logger.attachText('Full test date', date);
  const title = await page.title();
  console.log('DEBUG TITLE =', title);
  Logger.info(`Page title is: ${title || 'Empty or undefined'}`);
  Logger.attachText('Page title', title || 'Empty or undefined');
  console.log('ENV:', baseUrl, lang);

 

  if (lang === 'uk') {
    await expect(page.getByRole('heading', { name: 'Міжбанк' })).toBeVisible();
    await expect(page).toHaveTitle(new RegExp(`Курс валют на ${date}`));
  } else if (lang === 'ru') {
    await expect(page.getByText('Межбанк')).toBeVisible();
  } else if (lang === 'en') {
    await expect(page.getByText('Interbank')).toBeVisible();
  }

  await page.goto('https://kurs.com.ua/', { waitUntil: 'domcontentloaded', timeout: 10000 });

  const usdValueKurs = await page.locator(
    '//tbody[@class="text-right"]/tr/td/a[contains(., "USD")]/../following-sibling::td[1]/div'
  ).textContent();
  console.log(`USD курс: ${usdValueKurs}`);


  //TODO: Add ExcelJS workbook creation to the helper file
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sales Data');

  worksheet.columns = [
    { header: 'ID', key: 'id', width: 10 },
    { header: 'Product', key: 'product', width: 30 },
    { header: 'Price', key: 'price', width: 15 },
    { header: 'Quantity', key: 'quantity', width: 15 },
  ];

  worksheet.addRow({ id: 1, product: 'Tea', price: 10, quantity: 2 });
  worksheet.addRow({ id: 2, product: 'Coffee', price: 15, quantity: 3 });

  await workbook.xlsx.writeFile('output.xlsx');
  console.log('Excel-файл збережено: output.xlsx');
});


test('Перевірка USD міжбанк', async ({ page }) => {
  const minFin = new MinFinPage(page);

  await minFin.goto('');

  const usd = await minFin.getUsdValue();
  Logger.info(`USD міжбанк: ${usd}`);

  expect(usd).not.toBeNull();

});



// const headers = await page.locator('thead tr th').allTextContents();
// const interbankTable = page.locator('section:has(h2:has-text("Динаміка курсу валют на міжбанку")) table');
// const usdRow = interbankTable.locator('tr', {
//   has: page.locator('td', { hasText: 'USD' }),
// });

// const buy = await usdRow.locator('td').nth(1).textContent();
// const sell = await usdRow.locator('td').nth(2).textContent();

// const interbankSection = page.locator('section:has(h2:has-text("Динаміка курсу валют на міжбанку"))');
// console.log('Знайдено' + await interbankSection.count());
// const usdRow = interbankSection.locator('tr:has(td:text("USD"))');
// const buy = await usdRow.locator('td').nth(1).textContent();
// const sell = await usdRow.locator('td').nth(2).textContent();


