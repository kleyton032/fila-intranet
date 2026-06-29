import { Global, Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import { AppLoggerService } from './app-logger.service';

@Global()
@Module({
  imports: [
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transports: [
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
              winston.format.colorize(),
              winston.format.printf(({ timestamp, level, message, context, stack }) => {
                const ctx = context ? `[${context}]` : '';
                const err = stack ? `\n${stack}` : '';
                return `${timestamp} ${level} ${ctx} ${message}${err}`;
              }),
            ),
          }),
          new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.json(),
            ),
          }),
          new winston.transports.File({
            filename: 'logs/combined.log',
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.json(),
            ),
          }),
        ],
        exitOnError: false,
      }),
    }),
  ],
  providers: [AppLoggerService],
  exports: [AppLoggerService],
})
export class LoggerModule {}
