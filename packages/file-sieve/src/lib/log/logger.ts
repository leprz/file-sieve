export abstract class Logger {
  abstract info(message: string): void;
  abstract warn(message: string): void;
  abstract error(message: string): void;
  abstract success(message: string): void;
  abstract log(message: LogMessage): void;
}

export enum LogLevel {
  Info = "info",
  Warn = "warn",
  Error = "error",
  Success = "success",
}

export interface LogMessage {
  level: LogLevel;
  message: string;
}

export class FakeLogger implements Logger {
  error(message: string): void {
  }

  info(message: string): void {
  }

  log(message: LogMessage): void {
  }

  success(message: string): void {
  }

  warn(message: string): void {
  }
}
