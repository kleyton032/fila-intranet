import { IsNotEmpty, Matches, IsOptional, IsArray, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

const dataRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/\d{4}$/;

export class GetFilaConsultasExamesQueryDto {
  @ApiProperty({
    description: 'Data de início do período (formato DD/MM/YYYY)',
    example: '01/01/2023',
  })
  @IsNotEmpty({ message: 'A data de início é obrigatória.' })
  @Matches(dataRegex, { message: 'A data de início deve estar no formato DD/MM/YYYY.' })
  dataInicio: string;

  @ApiProperty({
    description: 'Data final do período (formato DD/MM/YYYY)',
    example: '31/12/2023',
  })
  @IsNotEmpty({ message: 'A data final é obrigatória.' })
  @Matches(dataRegex, { message: 'A data final deve estar no formato DD/MM/YYYY.' })
  dataFim: string;

  @ApiPropertyOptional({
    description: 'IDs de item de agendamento',
    example: '1,2,3',
  })
  @IsOptional()
  @IsArray({ message: 'O item de agendamento deve ser um array ou string separada por vírgula' })
  @Transform(({ value }) => {
    if (typeof value === 'string') return value.split(',').map(v => Number(v.trim()));
    if (Array.isArray(value)) return value.map(v => Number(v));
    return value;
  })
  @IsNumber({}, { each: true, message: 'Cada item de agendamento deve ser um número' })
  itemAgendamento?: number[];
}
