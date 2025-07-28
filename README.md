# currency-comparison-playwright-ts

This is an automated testing framework built with Playwright and TypeScript. It compares currency exchange rates (USD and EUR) between two financial websites. The project supports both UI and API testing. There is also optional support for Excel-based reporting and mock API stubs.

## Features

- Compares currency exchange rates between two sources
- UI automation using Playwright
- API testing with optional mocking
- Excel reporting of rate differences
- Written in TypeScript with Playwright Test Runner
- Page Object Model structure
- Allure reporting support

## Tech Stack

- Playwright
- TypeScript
- Node.js
- ExcelJS
- Axios or node-fetch (for API tests)
- Allure (optional)

## Getting Started

Install dependencies:

```
npm install
```

Run the full test suite (UI + API):

```
npx playwright test
```

## Running Specific Tests

UI tests only:

```
npx playwright test tests/ui
```

API tests only:

```
npx playwright test tests/api
```

## Allure Reporting (CI-friendly)

Generate Allure report after running tests:

```
npx allure generate allure-results --clean -o allure-report
```

You can then serve the report locally if needed:

```
npx allure open allure-report
```

In CI/CD, publish the `allure-report/` folder as an artifact or host it as static content.

## Project Structure

- `tests/` – contains UI and API test files
- `pages/` – Page Object Model classes
- `helpers/` – utility functions
- `mocks/` – mock API responses (if used)
- `utils/` – Excel logic or shared modules
- `.gitignore` – ignores logs, reports, node_modules, etc.
- `playwright.config.ts` – Playwright configuration file
- `README.md` – this file

## Notes

- Do not push `.env`, `allure-results/`, or Excel output files.
- Uses Page Object Model for UI tests.
- Can be extended for more currencies or different data providers.

## Status

This project is a work in progress. Suggestions and improvements are welcome.
