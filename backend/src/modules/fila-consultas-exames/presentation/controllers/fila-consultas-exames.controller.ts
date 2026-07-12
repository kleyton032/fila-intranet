import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetFilaConsultasExamesUseCase } from '../../application/use-cases/get-fila-consultas-exames.use-case';
import { GetFilaConsultasExamesQueryDto } from '../../application/dtos/get-fila-consultas-exames.dto';
import { GetPacienteDetalhesUseCase } from '../../application/use-cases/get-paciente-detalhes.use-case';
import { GetPacienteDetalhesParamDto } from '../../application/dtos/get-paciente-detalhes.dto';

@ApiTags('Fila Consultas e Exames')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('fila-consultas-exames')
export class FilaConsultasExamesController {
  constructor(
    private readonly getFilaConsultasExamesUseCase: GetFilaConsultasExamesUseCase,
    private readonly getPacienteDetalhesUseCase: GetPacienteDetalhesUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Consultar fila de consultas e exames por período' })
  @ApiOkResponse({ description: 'Retorna a lista de pacientes da fila.' })
  findAll(@Query() query: GetFilaConsultasExamesQueryDto) {
    return this.getFilaConsultasExamesUseCase.execute(query);
  }

  @Get(':idPaciente/detalhes')
  @ApiOperation({ summary: 'Consultar o histórico do paciente na fila de espera' })
  @ApiParam({ name: 'idPaciente', description: 'Código do paciente', type: 'number' })
  @ApiOkResponse({ description: 'Retorna o histórico de solicitações do paciente na fila.' })
  findDetalhes(@Param() params: GetPacienteDetalhesParamDto) {
    return this.getPacienteDetalhesUseCase.execute(params.idPaciente);
  }
}
