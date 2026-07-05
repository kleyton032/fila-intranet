import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import appConfig from '@config/app.config';
import databaseConfig from '@config/database.config';
import jwtConfig from '@config/jwt.config';
import { DatabaseModule } from '@shared/infrastructure/database/database.module';
import { LoggerModule } from '@shared/infrastructure/logger/logger.module';
import { FilaConsultasExamesModule } from '@modules/fila-consultas-exames/fila-consultas-exames.module';

@Module({
  imports: [
    // Configurações de ambiente
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [appConfig, databaseConfig, jwtConfig],
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),

    // Infraestrutura compartilhada
    LoggerModule,
    DatabaseModule,

    // Módulos de domínio
    FilaConsultasExamesModule,
  ],
})
export class AppModule {}
