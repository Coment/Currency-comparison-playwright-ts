# Currency Comparison — Playwright + TypeScript

This framework opens Minfin and Kurs.com.ua in Chromium, collects USD and EUR buy/sell exchange rates, compares them, and writes the results to `output.xlsx`.

## Features

- Playwright Test with TypeScript;
- executable BDD scenarios written in Gherkin with `playwright-bdd`;
- parameterized API tests for the official NBU exchange-rate endpoint;
- Page Object Model implementation for Minfin and Kurs.com.ua;
- exchange-rate normalization for comma and dot decimal separators;
- buy and sell rate comparison;
- formatted Excel report with filtering and the `Minfin - Kurs.com.ua` difference;
- automatic text summary, JSON, and Excel test attachments managed by a Playwright fixture;
- opt-in AI-assisted failure analysis with structured recommendations;
- HTML and Allure reporters;
- clear error reporting when a source returns a Cloudflare or Access Denied page.

## Getting Started

Node.js 20.19+, 22.13+, or 24+ is required by the code-quality toolchain.

```bash
npm ci
npx playwright install chromium
npm test
```

`npm test` generates native Playwright tests from the `.feature` files and then runs the UI BDD, API BDD, and unit-test projects.

After a successful test run, an `output.xlsx` file is created in the project root. It contains four data rows: buy and sell rates for USD and EUR.

The same comparison is printed as a readable text summary in the terminal and attached to the Playwright HTML report together with the JSON data and Excel file. Runtime logs and generated reports are test artifacts and are not committed to the repository.

To validate the TypeScript code without starting a browser, run:

```bash
npm run build
```

Check code quality or apply automatic fixes and formatting:

```bash
npm run lint
npm run lint:fix
npm run format:check
npm run format
```

Husky runs `lint-staged` before each commit. Only staged JavaScript, TypeScript, JSON,
Markdown, and YAML files are checked or formatted; browser and API tests remain explicit commands.

Run only the domain unit tests, the live website scenario, or the API scenarios:

```bash
npm run test:unit
npm run test:e2e
npm run test:api
```

The `bdd-chromium` project runs scenarios tagged with `@e2e`, while the `api` project runs scenarios tagged with `@api`.

Generate Playwright tests from Gherkin without running them:

```bash
npm run bddgen
```

Generated files are written to `.features-gen/` and are excluded from Git.

## BDD Scenario

The currencies used by the acceptance test are configured directly in `features/currencyComparison.feature`:

```gherkin
Given the following currencies are selected:
  | currency |
  | USD      |
  | EUR      |
```

The step definitions only orchestrate the existing Playwright fixtures and application service. Page locators, comparison rules, and report generation remain outside the Gherkin layer.

## Configuration

The source URLs and output filename can be overridden with environment variables:

```dotenv
MINFIN_URL=https://minfin.com.ua/ua/currency/
KURS_URL=https://kurs.com.ua/
EXCEL_OUTPUT_FILE=output.xlsx
```

The `.env` file is excluded from Git.

## AI-Assisted Failure Analysis

AI analysis is disabled by default. Copy `.env.example` to `.env` and configure:

```dotenv
AI_ANALYSIS=true
OPENAI_API_KEY=your_api_key
OPENAI_MODEL=gpt-5.6-terra
AI_ANALYSIS_INCLUDE_SCREENSHOT=false
AI_ANALYSIS_TIMEOUT_MS=30000
```

The analyzer runs only after the final failed attempt. It collects the Playwright error, stack trace, test metadata, and sanitized text attachments. UI failures also attach console errors, failed requests, a screenshot, and an ARIA snapshot to the test report.

Screenshots are sent to the model only when `AI_ANALYSIS_INCLUDE_SCREENSHOT=true`. Trace, video, Excel files, cookies, and environment files are never sent by the analyzer. Common credential patterns are redacted before analysis.

The result is attached as Markdown and JSON. It is advisory only: the analyzer never edits files, retries tests, or changes the test status.

## Project Structure

```text
domain/      Business models, source contracts, and pure comparison rules
analysis/    Failure evidence collection and AI-assisted diagnostics
api/         HTTP clients and API response contracts
services/    Application-level comparison orchestration
pages/       Playwright Page Objects and source-specific locators
reporters/   Excel and human-readable output generation
fixtures/    Playwright dependency composition and test artifacts
features/    Gherkin scenarios and their step definitions
helpers/     Environment and report utilities
tests/       Domain and application unit tests
```

## Adding Another Exchange-Rate Source

Implement the `ExchangeRateSource` contract for the new website. The domain comparison service and Excel reporter are independent of Playwright locators and the source website's HTML structure, so they can be reused without modification.
