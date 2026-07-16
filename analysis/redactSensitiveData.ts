const SECRET_VALUE = '[REDACTED]';

const SECRET_PATTERNS: Array<{
  pattern: RegExp;
  replacement: string;
}> = [
  {
    pattern: /\bsk-[a-z0-9_-]{10,}\b/gi,
    replacement: SECRET_VALUE,
  },
  {
    pattern: /(\b(?:authorization|proxy-authorization)\b["']?\s*[:=]\s*)(?:bearer\s+)?[^\s,;"']+/gi,
    replacement: `$1${SECRET_VALUE}`,
  },
  {
    pattern:
      /(\b(?:api[_-]?key|token|access[_-]?token|refresh[_-]?token|secret|signature|password|cookie|set-cookie)\b["']?\s*[:=]\s*)("[^"]*"|'[^']*'|[^\s,;&]+)/gi,
    replacement: `$1${SECRET_VALUE}`,
  },
];

export function redactSensitiveData(value: string): string {
  return SECRET_PATTERNS.reduce(
    (redacted, { pattern, replacement }) => redacted.replace(pattern, replacement),
    value,
  );
}

export function sanitizeAndTruncate(value: string, maxLength: number): string {
  const redacted = redactSensitiveData(value);

  if (redacted.length <= maxLength) return redacted;

  return `${redacted.slice(0, maxLength)}\n...[truncated]`;
}
