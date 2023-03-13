import {Logger, LogLevel, LogMessage} from "./logger";

export class ConsoleLogger implements Logger {
  error(message: string): void {
    console.error(coloredConsoleOutput(ConsoleColor.Red, message));
  }

  info(message: string): void {
    console.info(message);
  }

  success(message: string): void {
    console.info(coloredConsoleOutput(ConsoleColor.Green, message));
  }

  warn(message: string): void {
    console.warn(coloredConsoleOutput(ConsoleColor.Yellow, message));
  }

  log(message: LogMessage): void {
    switch (message.level) {
      case LogLevel.Error:
        this.error(message.message);
        break;
      case LogLevel.Info:
        this.info(message.message);
        break;
      case LogLevel.Success:
        this.success(message.message);
        break;
      case LogLevel.Warn:
        this.warn(message.message);
        break;
    }
  }
}

export enum ConsoleColor {
  Red = "\x1b[31m",
  Green = "\x1b[32m",
  Yellow = "\x1b[33m",
  Reset = "\x1b[0m",
}

export function coloredConsoleOutput(color: ConsoleColor, message: string): string {
  return `${color}${message}${ConsoleColor.Reset}`;
}
