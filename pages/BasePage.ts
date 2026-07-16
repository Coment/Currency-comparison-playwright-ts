import { Page, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(url: string): Promise<void> {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  async waitForTitle(title: string) {
    await this.page.waitForSelector(`text=${title}`);
  }

  getTitleLocator(): Locator {
    return this.page.locator('title');
  }

  protected async assertPageIsAvailable(source: string): Promise<void> {
    const title = await this.page.title();
    const bodyText = await this.page
      .locator('body')
      .innerText()
      .catch(() => '');

    if (/cloudflare|attention required|access denied/i.test(`${title} ${bodyText}`)) {
      throw new Error(
        `${source} blocked the automated browser request. ` +
          'Try again from an allowed network or configure another exchange-rate source.',
      );
    }
  }

  protected async readFirstNumber(locator: Locator): Promise<string> {
    const text = await locator.innerText();
    const match = text.replace(/\u00a0/g, ' ').match(/-?\d[\d\s]*(?:[.,]\d+)?/);

    if (!match) {
      throw new Error(`No numeric exchange rate found in: "${text.trim()}"`);
    }

    return match[0];
  }

  protected parseRate(rawValue: string): number {
    const normalized = rawValue
      .replace(/\s/g, '')
      .replace(/,(?=.*\.)/g, '')
      .replace(',', '.')
      .replace(/[^\d.-]/g, '');
    const value = Number(normalized);

    if (!Number.isFinite(value) || value <= 0) {
      throw new Error(`Invalid exchange rate: "${rawValue}"`);
    }

    return value;
  }
}
