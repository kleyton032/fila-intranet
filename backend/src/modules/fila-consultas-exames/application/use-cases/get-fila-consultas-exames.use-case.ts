import { Injectable, Inject } from '@nestjs/common';
import { FILA_CONSULTAS_EXAMES_REPOSITORY, IFilaConsultasExamesRepository } from '../../domain/repositories/fila-consultas-exames.repository.interface';
import { GetFilaConsultasExamesQueryDto } from '../dtos/get-fila-consultas-exames.dto';
import { FilaConsultasExamesEntity } from '../../domain/entities/fila-consultas-exames.entity';

@Injectable()
export class GetFilaConsultasExamesUseCase {
  constructor(
    @Inject(FILA_CONSULTAS_EXAMES_REPOSITORY)
    private readonly filaConsultasExamesRepository: IFilaConsultasExamesRepository,
  ) {}

  async execute(query: GetFilaConsultasExamesQueryDto): Promise<FilaConsultasExamesEntity[]> {
    const { dataInicio, dataFim } = query;
    return this.filaConsultasExamesRepository.findFilaByPeriodo(dataInicio, dataFim);
  }
}
