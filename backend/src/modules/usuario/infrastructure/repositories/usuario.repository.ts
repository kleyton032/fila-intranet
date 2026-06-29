import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@shared/infrastructure/database/database.module';
import { IUsuarioRepository } from '../../domain/repositories/usuario.repository.interface';
import { UsuarioEntity } from '../../domain/entities/usuario.entity';
import { PaginationVO, PaginatedResult } from '@shared/domain/value-objects/pagination.vo';

interface UsuarioRow {
  CD_ID: number;
  CD_USUARIO: string;
  NM_USUARIO: string;
  DS_EMAIL: string;
  NM_SETOR: string;
  FL_ATIVO: string;
  TOTAL: number;
}

@Injectable()
export class UsuarioRepository implements IUsuarioRepository {
  constructor(private readonly db: DatabaseService) {}

  async findAll(pagination: PaginationVO): Promise<PaginatedResult<UsuarioEntity>> {
    const rows = await this.db.execute<UsuarioRow>(
      `SELECT
         u.cd_id,
         u.cd_usuario,
         u.nm_usuario,
         u.ds_email,
         s.nm_setor,
         u.fl_ativo,
         COUNT(*) OVER() AS total
       FROM fav_usuario_intranet u
       LEFT JOIN fav_setor s ON s.cd_setor = u.cd_setor
       ORDER BY u.nm_usuario
       OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY`,
      { offset: pagination.offset, limit: pagination.limit },
    );

    const total = rows[0]?.TOTAL ?? 0;
    const data = rows.map(this.toEntity);

    return {
      data,
      total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(total / pagination.limit),
    };
  }

  async findById(id: number): Promise<UsuarioEntity | null> {
    const rows = await this.db.execute<UsuarioRow>(
      `SELECT cd_id, cd_usuario, nm_usuario, ds_email, fl_ativo
       FROM fav_usuario_intranet
       WHERE cd_id = :id`,
      { id },
    );
    return rows.length ? this.toEntity(rows[0]) : null;
  }

  async findByUsername(username: string): Promise<UsuarioEntity | null> {
    const rows = await this.db.execute<UsuarioRow>(
      `SELECT cd_id, cd_usuario, nm_usuario, ds_email, fl_ativo
       FROM fav_usuario_intranet
       WHERE nm_usuario = :username`,
      { username },
    );
    return rows.length ? this.toEntity(rows[0]) : null;
  }

  private toEntity(row: UsuarioRow): UsuarioEntity {
    return new UsuarioEntity({
      id: row.CD_ID,
      cdUsuario: row.CD_USUARIO,
      nmUsuario: row.NM_USUARIO,
      dsEmail: row.DS_EMAIL,
      nmSetor: row.NM_SETOR,
      flAtivo: row.FL_ATIVO === 'S',
      perfis: [],
    });
  }
}
