import * as fs from 'fs';

interface TestResult {
  status: string;
  error?: {
    message?: string;
  };
}

try {
  const raw = fs.readFileSync('report.json', 'utf-8');
  const report = JSON.parse(raw);

  const failed = report.suites
    .flatMap((s: any) => s.specs)
    .flatMap((sp: any) => sp.tests)
    .flatMap((t: any) => t.results as TestResult[])
    .filter((r: TestResult) => r.status !== 'passed');

  if (failed.length) {
    console.error(`❌ Failed tests: ${failed.length}`);
    failed.forEach((r, i) => {
      console.error(`\n#${i + 1}`);
      console.error(`Error: ${r.error?.message || 'No error message'}`);
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