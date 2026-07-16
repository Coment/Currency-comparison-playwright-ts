import { expect, test } from '@playwright/test';
import {
  redactSensitiveData,
  sanitizeAndTruncate,
} from '../../analysis/redactSensitiveData';

test('redacts common credentials before failure evidence is analyzed', () => {
  const input = [
    'Authorization: Bearer very-secret-token',
    'OPENAI_API_KEY="sk-example-secret-value"',
    'password=hunter2',
    'cookie: session=private-session',
    'signature=binance-request-signature',
  ].join('\n');

  const result = redactSensitiveData(input);

  expect(result).not.toContain('very-secret-token');
  expect(result).not.toContain('sk-example-secret-value');
  expect(result).not.toContain('hunter2');
  expect(result).not.toContain('private-session');
  expect(result).not.toContain('binance-request-signature');
  expect(result.match(/\[REDACTED\]/g)?.length).toBe(5);
});

test('truncates oversized evidence after redacting it', () => {
  const result = sanitizeAndTruncate(
    `token=private ${'x'.repeat(100)}`,
    20
  );

  expect(result).not.toContain('private');
  expect(result).toContain('...[truncated]');
});
