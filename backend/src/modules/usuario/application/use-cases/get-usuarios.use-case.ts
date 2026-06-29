import { Injectable, Inject } from '@nestjs/common';
import {
  IUsuarioRepository,
  USUARIO_REPOSITORY,
} from '../../domain/repositories/usuario.repository.interface';
import { PaginationVO, PaginatedResult } from '@shared/domain/value-objects/pagination.vo';
import { GetUsuariosQueryDto, UsuarioResponseDto } from '../dtos/usuario.dto';

@Injectable()
export class GetUsuariosUseCase {
  constructor(
    @Inject(USUARIO_REPOSITORY)
    private readonly usuarioRepository: IUsuarioRepository,
  ) {}

  async execute(query: GetUsuariosQueryDto): Promise<PaginatedResult<UsuarioResponseDto>> {
    const pagination = PaginationVO.create(query.page, query.limit);
    const result = await this.usuarioRepository.findAll(pagination);

    return {
      ...result,
      data: result.data.map((u) => ({
        id: u.id as number,
        cdUsuario: u.cdUsuario,
        nmUsuario: u.nmUsuario,
        dsEmail: u.dsEmail,
        nmSetor: u.nmSetor,
        flAtivo: u.flAtivo,
        perfis: u.perfis,
      })),
    };
  }
}
