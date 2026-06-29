import { Module } from '@nestjs/common';
import { UsuarioController } from './presentation/controllers/usuario.controller';
import { GetUsuariosUseCase } from './application/use-cases/get-usuarios.use-case';
import { UsuarioRepository } from './infrastructure/repositories/usuario.repository';
import { USUARIO_REPOSITORY } from './domain/repositories/usuario.repository.interface';

@Module({
  controllers: [UsuarioController],
  providers: [
    GetUsuariosUseCase,
    {
      provide: USUARIO_REPOSITORY,
      useClass: UsuarioRepository,
    },
  ],
})
export class UsuarioModule {}
