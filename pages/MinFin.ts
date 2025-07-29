import { Page, Locator } from '@playwright/test';

export class MinFinPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }


    async goto(url: string) {
        //await this.page.goto(url);
        await this.page.goto('https://minfin.com.ua/ua/currency/');
        await this.page.waitForLoadState('domcontentloaded');
    }

    get usdValueLocator(): Locator {
        return this.page.locator(
            '//h2[contains(., "Динаміка")]/following::a[contains(., "USD")]/../../td[2]/div'
        );
    }

    async getUsdValue(): Promise<string | null> {
        //await this.page.waitForSelector(this.usdValueLocator);
        await this.usdValueLocator.first().waitFor();
        return await this.usdValueLocator.first().textContent();
    }

    async getUsdValue1(): Promise<string | null> {
        const usdValueLocator = this.page.locator(
            '//tbody[@class="text-right"]/tr/td/a[contains(., "USD")]/../following-sibling::td[1]/div'
        );
        return await usdValueLocator.textContent();
    }

    async getUsdRow(interbankSection: Locator): Promise<Locator> {
        return interbankSection.locator('tr:has(td:text("USD"))');
    }
}