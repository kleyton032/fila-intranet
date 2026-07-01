import { Global, Module, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as oracledb from 'oracledb';
import { AppLoggerService } from '@shared/infrastructure/logger/app-logger.service';

export const ORACLE_POOL = 'ORACLE_POOL';

@Global()
@Module({
  providers: [
    {
      provide: ORACLE_POOL,
      inject: [ConfigService, AppLoggerService],
      useFactory: async (configService: ConfigService, logger: AppLoggerService) => {
        const config = {
          user: configService.get<string>('database.user'),
          password: configService.get<string>('database.password'),
          connectString: configService.get<string>('database.connectString'),
          poolMin: configService.get<number>('database.poolMin'),
          poolMax: configService.get<number>('database.poolMax'),
          poolIncrement: configService.get<number>('database.poolIncrement'),
        };

        try {
          try {
            // Tenta inicializar o cliente nativo (Thick mode) do Oracle Instant Client configurado no Dockerfile
            oracledb.initOracleClient({ libDir: '/opt/oracle/instantclient_19_22' });
            logger.log('Oracle Instant Client (Thick mode) inicializado com sucesso', 'DatabaseModule');
          } catch (clientErr) {
            // Ignora o erro se o cliente já estiver inicializado (DPI-1044)
            if (!(clientErr as Error).message.includes('DPI-1044')) {
              logger.warn('Não foi possível inicializar o Oracle Instant Client. Detalhes: ' + (clientErr as Error).message, 'DatabaseModule');
            }
          }

          await oracledb.createPool(config);
          logger.log('Pool Oracle criado com sucesso', 'DatabaseModule');
          return oracledb.getPool();
        } catch (error) {
          logger.error('Erro ao criar pool Oracle', (error as Error).stack, 'DatabaseModule');
          throw error;
        }
      },
    },
    DatabaseService,
  ],
  exports: [DatabaseService],
})
export class DatabaseModule implements OnModuleDestroy {
  async onModuleDestroy(): Promise<void> {
    try {
      await oracledb.getPool().close(10);
    } catch {
      // Pool já fechado
    }
  }
}

import { Injectable, Inject } from '@nestjs/common';
import { Pool, Connection, BindParameters, ExecuteOptions } from 'oracledb';

@Injectable()
export class DatabaseService {
  constructor(@Inject(ORACLE_POOL) private readonly pool: Pool) {}

  async execute<T = Record<string, unknown>>(
    sql: string,
    binds: BindParameters = {},
    options: ExecuteOptions = {},
  ): Promise<T[]> {
    let connection: Connection | undefined;
    try {
      connection = await this.pool.getConnection();
      const result = await connection.execute(sql, binds, {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
        ...options,
      });
      return (result.rows as T[]) || [];
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  }

  async executeMany(
    sql: string,
    binds: BindParameters[],
    options: ExecuteOptions = {},
  ): Promise<number> {
    let connection: Connection | undefined;
    try {
      connection = await this.pool.getConnection();
      const result = await connection.executeMany(sql, binds, {
        autoCommit: true,
        ...options,
      });
      return result.rowsAffected || 0;
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  }
}
