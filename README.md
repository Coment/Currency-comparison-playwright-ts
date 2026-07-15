# Currency Comparison — Playwright + TypeScript

This framework opens Minfin and Kurs.com.ua in Chromium, collects USD and EUR buy/sell exchange rates, compares them, and writes the results to `output.xlsx`.

## Features

- Playwright Test with TypeScript;
- Page Object Model implementation for Minfin and Kurs.com.ua;
- exchange-rate normalization for comma and dot decimal separators;
- buy and sell rate comparison;
- formatted Excel report with filtering and the `Minfin - Kurs.com.ua` difference;
- automatic text summary, JSON, and Excel test attachments managed by a Playwright fixture;
- HTML, JSON, and Allure reporters;
- clear error reporting when a source returns a Cloudflare or Access Denied page.

## Getting Started

Node.js 20 or later is recommended.

```bash
npm ci
npx playwright install chromium
npm test
```

After a successful test run, an `output.xlsx` file is created in the project root. It contains four data rows: buy and sell rates for USD and EUR.

The same comparison is printed as a readable text summary in the terminal and attached to the Playwright HTML report together with the JSON data and Excel file. Runtime logs and generated reports are test artifacts and are not committed to the repository.

To validate the TypeScript code without starting a browser, run:

```bash
npm run build
```

Run only the domain unit tests or the live website scenario:

```bash
npm run test:unit
npm run test:e2e
```

## Configuration

The source URLs and output filename can be overridden with environment variables:

```dotenv
MINFIN_URL=https://minfin.com.ua/ua/currency/
KURS_URL=https://kurs.com.ua/
EXCEL_OUTPUT_FILE=output.xlsx
```

The `.env` file is excluded from Git.

## Project Structure

```text
domain/      Business models, source contracts, and pure comparison rules
services/    Application-level comparison orchestration
pages/       Playwright Page Objects and source-specific locators
reporters/   Excel output generation
fixtures/    Playwright dependency composition and test artifacts
helpers/     Environment, logging, and report utilities
tests/       End-to-end scenarios and domain unit tests
```

## Adding Another Exchange-Rate Source

Implement the `ExchangeRateSource` contract for the new website. The domain comparison service and Excel reporter are independent of Playwright locators and the source website's HTML structure, so they can be reused without modification.
