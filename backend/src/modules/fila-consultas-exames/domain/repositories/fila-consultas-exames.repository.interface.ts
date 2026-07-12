import { FilaConsultasExamesEntity } from '../entities/fila-consultas-exames.entity';
import { PacienteDetalhesEntity } from '../entities/paciente-detalhes.entity';

export const FILA_CONSULTAS_EXAMES_REPOSITORY = 'FILA_CONSULTAS_EXAMES_REPOSITORY';

export interface IFilaConsultasExamesRepository {
  findFilaByPeriodo(dataInicio: string, dataFim: string, itemAgendamento?: number[]): Promise<FilaConsultasExamesEntity[]>;
  findHistoricoPaciente(idPaciente: number): Promise<PacienteDetalhesEntity[]>;
}
