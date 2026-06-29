import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@shared/infrastructure/database/database.module';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { UserEntity } from '../../domain/entities/user.entity';

interface UserRow {
  CD_ID: number;
  CD_USUARIO: string;
  NM_USUARIO: string;
  DS_EMAIL: string;
  FL_ATIVO: string;
}

interface AccessRow {
  CD_TELA: string;
}

/**
 * Implementação concreta do repositório de usuários.
 * Acessa o banco Oracle e converte os dados para entidades de domínio.
 * Isolada na camada de infraestrutura — o domínio nunca conhece esta classe.
 */
@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly db: DatabaseService) {}

  async findByUsername(username: string): Promise<UserEntity | null> {
    const userRows = await this.db.execute<UserRow>(
      `SELECT cd_id, cd_usuario, nm_usuario, ds_email, fl_ativo
       FROM fav_usuario_intranet
       WHERE nm_usuario = :username`,
      { username },
    );

    if (!userRows.length) return null;

    const row = userRows[0];

    const accessRows = await this.db.execute<AccessRow>(
      `SELECT au.cd_tela
       FROM fav_acessos_usuarios au
       WHERE au.cd_usuario = :cdUsuario`,
      { cdUsuario: row.CD_USUARIO },
    );

    const roles = accessRows.map((a) => a.CD_TELA);

    return new UserEntity({
      id: row.CD_ID,
      username: row.CD_USUARIO,
      name: row.NM_USUARIO,
      email: row.DS_EMAIL,
      roles,
      isActive: row.FL_ATIVO === 'S',
    });
  }

  async findById(id: string | number): Promise<UserEntity | null> {
    const rows = await this.db.execute<UserRow>(
      `SELECT cd_id, cd_usuario, nm_usuario, ds_email, fl_ativo
       FROM fav_usuario_intranet
       WHERE cd_id = :id`,
      { id },
    );

    if (!rows.length) return null;

    const row = rows[0];

    return new UserEntity({
      id: row.CD_ID,
      username: row.CD_USUARIO,
      name: row.NM_USUARIO,
      email: row.DS_EMAIL,
      roles: [],
      isActive: row.FL_ATIVO === 'S',
    });
  }
}
