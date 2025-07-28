import { Page, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(url: string) {
    await this.page.goto(url);
  }

  async waitForTitle(title: string) {
    await this.page.waitForSelector(`text=${title}`);
  }

  getTitleLocator(): Locator {
    return this.page.locator('title');
  }
}