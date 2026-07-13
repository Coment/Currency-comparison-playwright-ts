# Currency Comparison — Playwright + TypeScript

This framework opens Minfin and Kurs.com.ua in Chromium, collects USD and EUR buy/sell exchange rates, compares them, and writes the results to `output.xlsx`.

## Features

- Playwright Test with TypeScript;
- Page Object Model implementation for Minfin and Kurs.com.ua;
- exchange-rate normalization for comma and dot decimal separators;
- buy and sell rate comparison;
- formatted Excel report with filtering and the `Minfin - Kurs.com.ua` difference;
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

To validate the TypeScript code without starting a browser, run:

```bash
npm run build
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
tests/       End-to-end scenarios and assertions
pages/       Page Objects and source-specific locators
helpers/     Comparison, Excel, logging, and configuration utilities
types/       Shared TypeScript models
```

## Adding Another Exchange-Rate Source

Create a Page Object that returns an array of `CurrencyRate` objects. The comparison and Excel-reporting logic is independent of the source website's HTML structure, so it can be reused without modification.
