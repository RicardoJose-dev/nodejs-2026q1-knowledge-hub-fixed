import { LoggerService, LogLevel } from '@nestjs/common';

export class CustomLogger implements LoggerService {
  private logLevels: LogLevel[];
  private isProduction: boolean;

  constructor(logLevel: LogLevel = 'log', isProduction = false) {
    this.isProduction = isProduction;
    this.logLevels = this.mapLogLevel(logLevel);
  }

  log(message: any, ...optionalParams: any[]) {
    if (this.logLevels.includes('log')) {
      this.print('log', message, optionalParams);
    }
  }

  error(message: any, ...optionalParams: any[]) {
    if (this.logLevels.includes('error')) {
      this.print('error', message, optionalParams);
    }
  }

  warn(message: any, ...optionalParams: any[]) {
    if (this.logLevels.includes('warn')) {
      this.print('warn', message, optionalParams);
    }
  }

  debug(message: any, ...optionalParams: any[]) {
    if (this.logLevels.includes('debug')) {
      this.print('debug', message, optionalParams);
    }
  }

  verbose(message: any, ...optionalParams: any[]) {
    if (this.logLevels.includes('verbose')) {
      this.print('verbose', message, optionalParams);
    }
  }

  private print(level: LogLevel, message: any, optionalParams: any[]) {
    if (this.isProduction) {
      console.log(
        JSON.stringify({
          timestamp: new Date().toISOString(),
          level,
          message,
          context: optionalParams,
        }),
      );
    } else {
      console[level]?.(
        `[${level.toUpperCase()}] ${new Date().toISOString()} -`,
        message,
        ...optionalParams,
      );
    }
  }

  private mapLogLevel(level: LogLevel): LogLevel[] {
    switch (level) {
      case 'error':
        return ['error'];
      case 'warn':
        return ['warn', 'error'];
      case 'log':
        return ['log', 'warn', 'error'];
      case 'debug':
        return ['debug', 'log', 'warn', 'error'];
      case 'verbose':
        return ['verbose', 'debug', 'log', 'warn', 'error'];
      default:
        return ['log', 'warn', 'error'];
    }
  }
}
