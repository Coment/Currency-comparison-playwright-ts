# Currency comparison — Playwright + TypeScript

Фреймворк відкриває Minfin і Kurs.com.ua у Chromium, отримує курси купівлі та продажу USD/EUR, порівнює їх і записує результат у `output.xlsx`.

## Що вже реалізовано

- Playwright Test + TypeScript;
- Page Object Model для Minfin і Kurs.com.ua;
- нормалізація значень із комою або крапкою як десятковим роздільником;
- порівняння курсів купівлі та продажу;
- Excel-звіт із фільтром, форматуванням і різницею `Minfin - Kurs.com.ua`;
- HTML, JSON та Allure reporters;
- зрозуміла помилка, якщо джерело повертає Cloudflare/Access Denied.

## Запуск

Потрібен Node.js 20 або новіший.

```bash
npm ci
npx playwright install chromium
npm test
```

Після успішного тесту в корені проєкту з'явиться `output.xlsx` із чотирма рядками: купівля/продаж для USD та EUR.

Перевірити TypeScript без запуску браузера:

```bash
npm run build
```

## Налаштування

Значення можна перевизначити змінними середовища:

```dotenv
MINFIN_URL=https://minfin.com.ua/ua/currency/
KURS_URL=https://kurs.com.ua/
EXCEL_OUTPUT_FILE=output.xlsx
```

`.env` не додається до Git.

## Структура

```text
tests/       E2E-сценарії та перевірки
pages/       Page Objects і локатори джерел
helpers/     порівняння, Excel, логування та конфігурація
types/       спільні TypeScript-моделі
```

Щоб додати новий банк або сайт, потрібно створити Page Object, який повертає масив `CurrencyRate`. Логіка порівняння та Excel-звіту від HTML нового джерела не залежить.
