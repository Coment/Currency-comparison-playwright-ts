import * as fs from 'fs';

interface TestResult {
  status: string;
  error?: {
    message?: string;
  };
}

interface Test {
  results: TestResult[];
}

interface Spec {
  tests: Test[];
}

interface Suite {
  specs: Spec[];
}

interface Report {
  suites: Suite[];
}

try {
  const raw = fs.readFileSync('report.json', 'utf-8');
  const report: Report = JSON.parse(raw);

  const failed: TestResult[] = report.suites
    .flatMap((suite) => suite.specs)
    .flatMap((spec) => spec.tests)
    .flatMap((test) => test.results)
    .filter((result) => result.status !== 'passed');

  if (failed.length) {
    console.error(`❌ Failed tests: ${failed.length}`);
    failed.forEach((result, index) => {
      console.error(`\n${index + 1}`);
      console.error(`Error: ${result.error?.message || 'No error message'}`);
    });
    process.exit(1);
  } else {
    console.log('✅ All tests passed.');
  }

} catch (e) {
  if (e instanceof Error) {
    console.error('❗ Error parsing report:', e.message);
  } else {
    console.error('❗ Unknown error during report parsing.');
  }
  process.exit(1);
}
