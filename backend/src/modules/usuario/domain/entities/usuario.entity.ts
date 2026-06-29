import { BaseEntity } from '@shared/domain/base.entity';

/**
 * Entidade de domínio: Usuario.
 * Representa um usuário cadastrado no sistema da intranet.
 */
export class UsuarioEntity extends BaseEntity {
  cdUsuario: string;
  nmUsuario: string;
  dsEmail: string;
  nmSetor: string;
  flAtivo: boolean;
  perfis: string[];

  constructor(partial: Partial<UsuarioEntity>) {
    super();
    Object.assign(this, partial);
  }

  isActive(): boolean {
    return this.flAtivo;
  }
}
