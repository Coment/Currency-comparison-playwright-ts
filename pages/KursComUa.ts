import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { CurrencyCode, CurrencyRate } from '../types/currency';
import { parseRate } from '../helpers/currencyComparison';
import { kursUrl } from '../helpers/envVars';

export class KursComUaPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open(): Promise<void> {
    await this.goto(kursUrl);
    await this.assertPageIsAvailable('Kurs.com.ua');
  }

  async getRates(currencies: CurrencyCode[]): Promise<CurrencyRate[]> {
    const rates: CurrencyRate[] = [];

    for (const currency of currencies) {
      const row = this.page
        .locator('tbody.text-right tr')
        .filter({ has: this.page.getByText(currency, { exact: true }) })
        .first();

      await row.waitFor({ state: 'visible' });
      const cells = row.locator('td');

      rates.push({
        source: 'Kurs.com.ua',
        currency,
        buy: parseRate(await this.readFirstNumber(cells.nth(1))),
        sell: parseRate(await this.readFirstNumber(cells.nth(2))),
        collectedAt: new Date().toISOString(),
      });
    }

    return rates;
  }
}
