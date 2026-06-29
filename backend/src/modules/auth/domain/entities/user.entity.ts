import { BaseEntity } from '@shared/domain/base.entity';

/**
 * Entidade de domínio: Usuário.
 * Representa o conceito de usuário dentro do domínio da aplicação.
 * Contém apenas dados e regras de negócio — sem dependência de frameworks.
 */
export class UserEntity extends BaseEntity {
  username: string;
  name: string;
  email: string;
  roles: string[];
  isActive: boolean;

  constructor(partial: Partial<UserEntity>) {
    super();
    Object.assign(this, partial);
  }

  hasRole(role: string): boolean {
    return this.roles.includes(role);
  }

  hasAnyRole(roles: string[]): boolean {
    return roles.some((role) => this.roles.includes(role));
  }

  deactivate(): void {
    this.isActive = false;
  }

  activate(): void {
    this.isActive = true;
  }
}
