import { Controller, Get, Query, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GetUsuariosUseCase } from '../../application/use-cases/get-usuarios.use-case';
import { GetUsuariosQueryDto } from '../../application/dtos/usuario.dto';
import { Roles } from '@modules/auth/infrastructure/decorators/roles.decorator';

@ApiTags('Usuários')
@ApiBearerAuth()
@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly getUsuariosUseCase: GetUsuariosUseCase) {}

  @Get()
  @Roles('ADMIN', 'GESTOR')
  @ApiOperation({ summary: 'Listar usuários com paginação' })
  findAll(@Query() query: GetUsuariosQueryDto) {
    return this.getUsuariosUseCase.execute(query);
  }
}
