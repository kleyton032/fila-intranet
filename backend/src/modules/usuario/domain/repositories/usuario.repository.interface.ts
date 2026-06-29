import { UsuarioEntity } from '../entities/usuario.entity';
import { PaginationVO, PaginatedResult } from '@shared/domain/value-objects/pagination.vo';

export interface IUsuarioRepository {
  findAll(pagination: PaginationVO): Promise<PaginatedResult<UsuarioEntity>>;
  findById(id: number): Promise<UsuarioEntity | null>;
  findByUsername(username: string): Promise<UsuarioEntity | null>;
}

export const USUARIO_REPOSITORY = Symbol('IUsuarioRepository');
