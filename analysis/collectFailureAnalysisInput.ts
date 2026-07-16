import { readFile } from 'fs/promises';
import { TestInfo } from '@playwright/test';
import { FailureAnalysisInput } from './FailureAnalysis';
import { sanitizeAndTruncate } from './redactSensitiveData';

const MAX_ATTACHMENT_TEXT_LENGTH = 6_000;
const MAX_SCREENSHOT_SIZE = 5 * 1024 * 1024;

export async function collectFailureAnalysisInput(
  testInfo: TestInfo,
  includeScreenshot: boolean,
): Promise<FailureAnalysisInput> {
  const source = resolveSourceFile(testInfo.file);
  const attachments = [];
  let screenshotDataUrl: string | undefined;

  for (const attachment of testInfo.attachments) {
    const item: {
      name: string;
      contentType: string;
      text?: string;
    } = {
      name: attachment.name,
      contentType: attachment.contentType,
    };

    if (isTextAttachment(attachment.contentType)) {
      const content = await readAttachment(attachment);
      if (content) {
        item.text = sanitizeAndTruncate(content.toString('utf8'), MAX_ATTACHMENT_TEXT_LENGTH);
      }
    }

    if (includeScreenshot && !screenshotDataUrl && isSupportedImage(attachment.contentType)) {
      const content = await readAttachment(attachment);
      if (content && content.length <= MAX_SCREENSHOT_SIZE) {
        screenshotDataUrl = `data:${attachment.contentType};base64,${content.toString('base64')}`;
      }
    }

    attachments.push(item);
  }

  return {
    context: {
      testTitle: testInfo.title,
      titlePath: testInfo.titlePath,
      projectName: testInfo.project.name,
      tags: testInfo.tags,
      status: testInfo.status ?? 'unknown',
      expectedStatus: testInfo.expectedStatus,
      retry: testInfo.retry,
      durationMs: testInfo.duration,
      source: {
        ...source,
        line: testInfo.line,
        column: testInfo.column,
      },
      errors: testInfo.errors.map((error) => ({
        message: sanitizeOptional(error.message, 4_000),
        stack: sanitizeOptional(error.stack, 8_000),
      })),
      attachments,
    },
    screenshotDataUrl,
  };
}

function resolveSourceFile(file: string): {
  file: string;
  featureFile?: string;
} {
  const normalized = file.replace(/\\/g, '/');
  const generatedMarker = '.features-gen/';
  const generatedIndex = normalized.indexOf(generatedMarker);

  if (generatedIndex === -1 || !normalized.endsWith('.spec.js')) {
    return { file: normalized };
  }

  return {
    file: normalized,
    featureFile: normalized
      .slice(generatedIndex + generatedMarker.length)
      .replace(/\.spec\.js$/, ''),
  };
}

function isTextAttachment(contentType: string): boolean {
  return (
    contentType.startsWith('text/') ||
    contentType === 'application/json' ||
    contentType === 'application/yaml' ||
    contentType === 'application/x-yaml'
  );
}

function isSupportedImage(contentType: string): boolean {
  return ['image/png', 'image/jpeg', 'image/webp'].includes(contentType);
}

async function readAttachment(attachment: {
  path?: string;
  body?: Buffer;
}): Promise<Buffer | undefined> {
  try {
    if (attachment.body) return attachment.body;
    if (attachment.path) return await readFile(attachment.path);
  } catch {
    return undefined;
  }

  return undefined;
}

function sanitizeOptional(value: string | undefined, maxLength: number): string | undefined {
  return value ? sanitizeAndTruncate(value, maxLength) : undefined;
}
