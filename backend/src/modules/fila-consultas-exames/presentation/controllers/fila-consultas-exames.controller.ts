import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { GetFilaConsultasExamesUseCase } from '../../application/use-cases/get-fila-consultas-exames.use-case';
import { GetFilaConsultasExamesQueryDto } from '../../application/dtos/get-fila-consultas-exames.dto';

@ApiTags('Fila Consultas e Exames')
@Controller('fila-consultas-exames')
export class FilaConsultasExamesController {
  constructor(private readonly getFilaConsultasExamesUseCase: GetFilaConsultasExamesUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Consultar fila de consultas e exames por período' })
  @ApiOkResponse({ description: 'Retorna a lista de pacientes da fila.' })
  findAll(@Query() query: GetFilaConsultasExamesQueryDto) {
    return this.getFilaConsultasExamesUseCase.execute(query);
  }
}
