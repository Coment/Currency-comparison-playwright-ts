import { test as base, expect } from '@playwright/test';


export const test = base.extend({
  page: async ({ page }, use, testInfo) => {
    await use(page);

    if (testInfo.status !== testInfo.expectedStatus) {
      const screenshot = await page.screenshot();

      testInfo.attach('Failure Screenshot', {
        body: screenshot,
        contentType: 'image/png',
      });
    }
  },
});

export { expect };