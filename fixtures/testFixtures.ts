import { test as base, expect } from '@playwright/test';
import { CurrencyCode } from '../domain/models/Currency';
import { CurrencyComparison } from '../domain/models/CurrencyComparison';
import { excelOutputFile } from '../helpers/envVars';
import { KursComUaPage } from '../pages/KursComUa';
import { MinFinPage } from '../pages/MinFin';
import { ExcelComparisonReporter } from '../reporters/ExcelComparisonReporter';
import { CurrencyComparisonService } from '../services/CurrencyComparisonService';

interface CurrencyComparisonRunner {
  compare(currencies: CurrencyCode[]): Promise<CurrencyComparison[]>;
}

interface TestFixtures {
  currencyComparison: CurrencyComparisonRunner;
}

export const test = base.extend<TestFixtures>({
  currencyComparison: async ({ page }, use, testInfo) => {
    const service = new CurrencyComparisonService(
      new MinFinPage(page),
      new KursComUaPage(page)
    );
    const reporter = new ExcelComparisonReporter();
    let result: CurrencyComparison[] | undefined;

    await use({
      compare: async (currencies) => {
        result = await service.compare(currencies);
        return result;
      },
    });

    if (!result) return;

    await reporter.write(result, excelOutputFile);
    await testInfo.attach('Currency comparison', {
      body: JSON.stringify(result, null, 2),
      contentType: 'application/json',
    });
    await testInfo.attach('Excel comparison report', {
      path: excelOutputFile,
      contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
  },
});

export { expect };
