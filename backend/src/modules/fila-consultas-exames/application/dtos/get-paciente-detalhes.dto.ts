import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class GetPacienteDetalhesParamDto {
  @ApiProperty({
    description: 'Código do paciente (id_paciente)',
    example: 12345,
  })
  @IsNotEmpty({ message: 'O ID do paciente é obrigatório.' })
  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: 'O ID do paciente deve ser um número válido.' })
  idPaciente: number;
}
