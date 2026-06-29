import { Injectable, LoggerService, Inject, Optional } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

/**
 * Serviço de log centralizado da aplicação.
 * Abstrai a implementação do Winston, permitindo troca futura sem impactar os módulos.
 */
@Injectable()
export class AppLoggerService implements LoggerService {
  constructor(
    @Optional()
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly winstonLogger?: Logger,
  ) {}

  log(message: string, context?: string): void {
    this.winstonLogger
      ? this.winstonLogger.info(message, { context })
      : console.log(`[${context}] ${message}`);
  }

  error(message: string, stack?: string, context?: string): void {
    this.winstonLogger
      ? this.winstonLogger.error(message, { context, stack })
      : console.error(`[${context}] ${message}`, stack);
  }

  warn(message: string, context?: string): void {
    this.winstonLogger
      ? this.winstonLogger.warn(message, { context })
      : console.warn(`[${context}] ${message}`);
  }

  debug(message: string, context?: string): void {
    this.winstonLogger
      ? this.winstonLogger.debug(message, { context })
      : console.debug(`[${context}] ${message}`);
  }

  verbose(message: string, context?: string): void {
    this.winstonLogger
      ? this.winstonLogger.verbose(message, { context })
      : console.log(`[${context}] ${message}`);
  }
}
