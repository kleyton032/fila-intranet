import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'joao.silva', description: 'Nome de usuário do AD' })
  @IsString()
  @IsNotEmpty({ message: 'O usuário é obrigatório' })
  username: string;

  @ApiProperty({ example: '********', description: 'Senha do usuário' })
  @IsString()
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @MinLength(4, { message: 'A senha deve ter no mínimo 4 caracteres' })
  password: string;
}
