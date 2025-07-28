import { ContentType, attachment } from 'allure-js-commons';
import chalk from 'chalk';
import * as fs from 'fs';

export class Logger {
  
  private static isCleared = false;
  private static log(level: 'INFO' | 'WARN' | 'ERROR', message: string): void {
    const timestamp = new Date().toISOString();
    const raw = `[${level}] ${timestamp} — ${message}`;


    // Use chalk to color the output based on the log level
    const prefix = (() => {
      switch (level) {
        case 'ERROR': return chalk.red(raw);
        case 'WARN': return chalk.yellow(raw);
        case 'INFO': return chalk.cyan(raw);
        default: return raw;
      }
    })();

    // Console output
    switch (level) {
      case 'ERROR':
        console.error(prefix);
        break;
      case 'WARN':
        console.warn(prefix);
        break;
      default:
        console.log(prefix);
    }

    this.logToFile(raw);
  }
  // private static log(level: 'INFO' | 'WARN' | 'ERROR', message: string): void {
  //   const timestamp = new Date().toISOString();
  //   const prefix = `[${level}] ${timestamp} — ${message}`;
  //   const isWindows = process.platform === 'win32';

  //   if (isWindows && process.env.TERM !== 'xterm-256color') {
  //     require('node:readline').emitKeypressEvents(process.stdin);
  //     process.stdin.setRawMode?.(true);
  //   }

  //   // Concole output
  //   switch (level) {
  //     case 'ERROR':
  //       console.error(prefix);
  //       break;
  //     case 'WARN':
  //       console.warn(prefix);
  //       break;
  //     default:
  //       console.log(prefix);
  //   }

  //   // File output
  //   this.logToFile(prefix);
  // }

  static info(message: string): void {
    this.log('INFO', message);
  }

  static warn(message: string): void {
    this.log('WARN', message);
  }

  static error(message: string): void {
    this.log('ERROR', message);
  }

  private static logToFile(log: string) {
    if (!this.isCleared) {
      fs.writeFileSync('logs.txt', log + '\n');
      this.isCleared = true;
    } else {
      fs.appendFileSync('logs.txt', log + '\n');
    }
  }

  // --- Allure attachments ---

  static attachText(name: string, content: string): void {
    attachment(name, content, ContentType.TEXT);
  }

  static attachJSON(name: string, jsonObj: unknown): void {
    attachment(name, JSON.stringify(jsonObj, null, 2), ContentType.JSON);
  }

  static attachScreenshot(name: string, screenshotBuffer: Buffer): void {
    attachment(name, screenshotBuffer, ContentType.PNG);
  }
}