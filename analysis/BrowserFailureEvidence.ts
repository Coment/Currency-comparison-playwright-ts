import { ConsoleMessage, Page, Request, TestInfo } from '@playwright/test';
import { sanitizeAndTruncate } from './redactSensitiveData';

export class BrowserFailureEvidence {
  private readonly consoleErrors: string[] = [];
  private readonly pageErrors: string[] = [];
  private readonly requestFailures: string[] = [];

  constructor(private readonly page: Page) {
    page.on('console', this.onConsole);
    page.on('pageerror', this.onPageError);
    page.on('requestfailed', this.onRequestFailed);
  }

  async attachIfFailed(testInfo: TestInfo): Promise<void> {
    if (
      testInfo.status === testInfo.expectedStatus ||
      (testInfo.status !== 'failed' && testInfo.status !== 'timedOut')
    ) {
      return;
    }

    await testInfo.attach('Browser failure signals', {
      body: JSON.stringify(
        {
          url: sanitizeAndTruncate(this.page.url(), 2_000),
          consoleErrors: this.consoleErrors,
          pageErrors: this.pageErrors,
          requestFailures: this.requestFailures,
        },
        null,
        2
      ),
      contentType: 'application/json',
    });

    try {
      await testInfo.attach('Failure screenshot', {
        body: await this.page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });
    } catch {
      // The page may already be closed after a browser-level failure.
    }

    try {
      const ariaSnapshot = await this.page
        .locator('body')
        .ariaSnapshot({ timeout: 3_000 });

      await testInfo.attach('ARIA snapshot', {
        body: sanitizeAndTruncate(ariaSnapshot, 20_000),
        contentType: 'text/yaml',
      });
    } catch {
      // The page may be unavailable or have no body after a navigation failure.
    }
  }

  dispose(): void {
    this.page.off('console', this.onConsole);
    this.page.off('pageerror', this.onPageError);
    this.page.off('requestfailed', this.onRequestFailed);
  }

  private readonly onConsole = (message: ConsoleMessage): void => {
    if (message.type() !== 'error' && message.type() !== 'warning') return;

    this.pushLimited(
      this.consoleErrors,
      `${message.type()}: ${message.text()}`
    );
  };

  private readonly onPageError = (error: Error): void => {
    this.pushLimited(this.pageErrors, error.stack ?? error.message);
  };

  private readonly onRequestFailed = (request: Request): void => {
    const failure = request.failure();
    this.pushLimited(
      this.requestFailures,
      `${request.method()} ${request.url()}: ${failure?.errorText ?? 'unknown error'}`
    );
  };

  private pushLimited(target: string[], value: string): void {
    if (target.length >= 20) return;

    target.push(sanitizeAndTruncate(value, 2_000));
  }
}
