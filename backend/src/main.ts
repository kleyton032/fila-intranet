import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from '@shared/application/filters/http-exception.filter';
import { LoggingInterceptor } from '@shared/application/interceptors/logging.interceptor';
import { TransformInterceptor } from '@shared/application/interceptors/transform.interceptor';
import { AppLoggerService } from '@shared/infrastructure/logger/app-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);
  const logger = app.get(AppLoggerService);

  app.useLogger(logger);

  // Segurança: headers HTTP
  app.use(helmet());

  // Prefixo global das rotas
  const apiPrefix = configService.get<string>('app.apiPrefix', 'api/v1');
  app.setGlobalPrefix(apiPrefix);

  // Versionamento de API
  app.enableVersioning({ type: VersioningType.URI });

  // CORS
  const corsOrigins = configService.get<string>('app.corsOrigins', '').split(',');
  app.enableCors({
    origin: corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Validação global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Filtros e interceptors globais
  app.useGlobalFilters(new HttpExceptionFilter(logger));
  app.useGlobalInterceptors(
    new LoggingInterceptor(logger),
    new TransformInterceptor(),
  );

  // Swagger (somente em ambiente não-produtivo)
  if (configService.get<string>('app.nodeEnv') !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Intranet FAV API')
      .setDescription('API da Intranet da Fundação Altino Ventura')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, document);
  }

  const port = configService.get<number>('app.port', 3001);
  await app.listen(port);
  logger.log(`Aplicação rodando em: http://localhost:${port}/${apiPrefix}`, 'Bootstrap');
  logger.log(`Documentação Swagger: http://localhost:${port}/docs`, 'Bootstrap');
}

bootstrap();
