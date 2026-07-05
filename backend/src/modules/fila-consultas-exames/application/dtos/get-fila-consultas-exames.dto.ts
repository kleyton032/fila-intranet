import { IsNotEmpty, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
}
