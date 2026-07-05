import { FilaConsultasExamesEntity } from '../entities/fila-consultas-exames.entity';

export const FILA_CONSULTAS_EXAMES_REPOSITORY = 'FILA_CONSULTAS_EXAMES_REPOSITORY';

export interface IFilaConsultasExamesRepository {
  findFilaByPeriodo(dataInicio: string, dataFim: string): Promise<FilaConsultasExamesEntity[]>;
}
