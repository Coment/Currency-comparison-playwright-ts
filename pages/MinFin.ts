import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { CurrencyCode } from '../domain/models/Currency';
import { ExchangeRate } from '../domain/models/ExchangeRate';
import { ExchangeRateSource } from '../domain/ports/ExchangeRateSource';
import { minfinUrl } from '../helpers/envVars';

export class MinFinPage extends BasePage implements ExchangeRateSource {
  readonly name = 'Minfin';

  constructor(page: Page) {
    super(page);
  }

  private async open(): Promise<void> {
    await this.goto(minfinUrl);
    await this.assertPageIsAvailable('Minfin');
  }

  async collectRates(currencies: CurrencyCode[]): Promise<ExchangeRate[]> {
    await this.open();
    const rates: ExchangeRate[] = [];

    for (const currency of currencies) {
      const row = this.page
        .locator('tr')
        .filter({ has: this.page.locator(`a[href*="/currency/mb/${currency.toLowerCase()}/"]`) })
        .first();

      await row.waitFor({ state: 'visible' });
      const cells = row.locator('td');

      rates.push({
        source: this.name,
        currency,
        buy: this.parseRate(await this.readFirstNumber(cells.nth(1))),
        sell: this.parseRate(await this.readFirstNumber(cells.nth(2))),
        collectedAt: new Date(),
      });
    }

    return rates;
  }
}
