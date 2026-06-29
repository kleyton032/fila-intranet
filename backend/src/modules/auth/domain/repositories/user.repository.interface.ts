import { UserEntity } from '../entities/user.entity';

/**
 * Interface do repositório de usuários para autenticação.
 * O domínio depende desta abstração — nunca da implementação concreta.
 */
export interface IUserRepository {
  findByUsername(username: string): Promise<UserEntity | null>;
  findById(id: string | number): Promise<UserEntity | null>;
}

export const USER_REPOSITORY = Symbol('IUserRepository');
