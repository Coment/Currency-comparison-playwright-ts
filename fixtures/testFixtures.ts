import { test as base, expect } from '@playwright/test';
import { CurrencyCode } from '../domain/models/Currency';
import { CurrencyComparison } from '../domain/models/CurrencyComparison';
import { ExchangeRateSource } from '../domain/ports/ExchangeRateSource';
import { excelOutputFile } from '../helpers/envVars';
import { KursComUaPage } from '../pages/KursComUa';
import { MinFinPage } from '../pages/MinFin';
import { ExcelComparisonReporter } from '../reporters/ExcelComparisonReporter';
import { TextComparisonReporter } from '../reporters/TextComparisonReporter';
import { CurrencyComparisonService } from '../services/CurrencyComparisonService';

interface CurrencyComparisonRunner {
  compare(currencies: CurrencyCode[]): Promise<CurrencyComparison[]>;
}

interface TestFixtures {
  currencyComparison: CurrencyComparisonRunner;
}

export const test = base.extend<TestFixtures>({
  currencyComparison: async ({ page }, use, testInfo) => {
    const minfinSource = withStep(
      new MinFinPage(page),
      'Collect rates from Minfin'
    );
    const kursSource = withStep(
      new KursComUaPage(page),
      'Collect rates from Kurs.com.ua'
    );
    const service = new CurrencyComparisonService(
      minfinSource,
      kursSource
    );
    const excelReporter = new ExcelComparisonReporter();
    const textReporter = new TextComparisonReporter();
    let result: CurrencyComparison[] | undefined;

    await use({
      compare: (currencies) =>
        base.step('Compare exchange rates', async () => {
          result = await service.compare(currencies);
          return result;
        }),
    });

    if (!result) return;
    const comparisonResult = result;

    await base.step('Generate Excel report', async () => {
      await excelReporter.write(comparisonResult, excelOutputFile);
    });

    const summary = textReporter.format(comparisonResult);
    console.info(`\n${summary}`);

    await base.step('Attach comparison artifacts', async () => {
      await testInfo.attach('Comparison summary', {
        body: summary,
        contentType: 'text/plain',
      });
      await testInfo.attach('Currency comparison JSON', {
        body: JSON.stringify(comparisonResult, null, 2),
        contentType: 'application/json',
      });
      await testInfo.attach('Excel comparison report', {
        path: excelOutputFile,
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
    });
  },
});

export { expect };

function withStep(
  source: ExchangeRateSource,
  stepName: string
): ExchangeRateSource {
  return {
    name: source.name,
    collectRates: (currencies) =>
      base.step(stepName, () => source.collectRates(currencies)),
  };
}
