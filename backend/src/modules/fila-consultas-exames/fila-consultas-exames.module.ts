import { Module } from '@nestjs/common';
import { FilaConsultasExamesController } from './presentation/controllers/fila-consultas-exames.controller';
import { GetFilaConsultasExamesUseCase } from './application/use-cases/get-fila-consultas-exames.use-case';
import { FilaConsultasExamesRepository } from './infrastructure/repositories/fila-consultas-exames.repository';
import { FILA_CONSULTAS_EXAMES_REPOSITORY } from './domain/repositories/fila-consultas-exames.repository.interface';
import { GetPacienteDetalhesUseCase } from './application/use-cases/get-paciente-detalhes.use-case';

@Module({
  controllers: [FilaConsultasExamesController],
  providers: [
    GetFilaConsultasExamesUseCase,
    GetPacienteDetalhesUseCase,
    {
      provide: FILA_CONSULTAS_EXAMES_REPOSITORY,
      useClass: FilaConsultasExamesRepository,
    },
  ],
})
export class FilaConsultasExamesModule {}
