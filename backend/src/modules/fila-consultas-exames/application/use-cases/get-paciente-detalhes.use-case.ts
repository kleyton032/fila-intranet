import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IFilaConsultasExamesRepository, FILA_CONSULTAS_EXAMES_REPOSITORY } from '../../domain/repositories/fila-consultas-exames.repository.interface';
import { PacienteDetalhesEntity } from '../../domain/entities/paciente-detalhes.entity';

@Injectable()
export class GetPacienteDetalhesUseCase {
  constructor(
    @Inject(FILA_CONSULTAS_EXAMES_REPOSITORY)
    private readonly repository: IFilaConsultasExamesRepository,
  ) {}

  async execute(idPaciente: number): Promise<PacienteDetalhesEntity[]> {
    const historico = await this.repository.findHistoricoPaciente(idPaciente);

    if (!historico || historico.length === 0) {
      throw new NotFoundException(`Nenhum registro encontrado na fila para o paciente ID ${idPaciente}`);
    }

    return historico;
  }
}
