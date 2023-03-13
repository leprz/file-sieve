import {Logger, LogLevel, LogMessage} from "./logger";
import ProgressBar from 'cli-progress';
import {coloredConsoleOutput, ConsoleColor} from "./console";

export class ProgressLogger implements Logger {
  private readonly bar: ProgressBar.SingleBar = new ProgressBar.SingleBar({
    format: ' {bar} | {message} | {value}/{total}'
  }, ProgressBar.Presets.shades_classic);
  private count = 1;

  public readonly summary: {
    success: LogMessage[],
    error: LogMessage[],
    warn: LogMessage[],
  } = {
    success: [],
    error: [],
    warn: [],
  };

  constructor(private readonly total: number) {
    this.bar.start(this.total, 0);
  }

  error(message: string): void {
    this.summary.error.push({level: LogLevel.Error, message});
    this.bar.update(this.count++, {message: coloredConsoleOutput(ConsoleColor.Red, message)});
  }

  info(message: string): void {
    this.bar.update(this.count++, {message: message});
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

  success(message: string): void {
    this.summary.success.push({level: LogLevel.Info, message});
    this.bar.update(this.count++, {message: coloredConsoleOutput(ConsoleColor.Green, message)});
  }

  warn(message: string): void {
    this.summary.warn.push({level: LogLevel.Warn, message});
    this.bar.update(this.count++, {message: coloredConsoleOutput(ConsoleColor.Yellow, message)});
  }

  stop(): void {
    this.bar.stop();
  }
}
