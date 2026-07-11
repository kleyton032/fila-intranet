import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@shared/infrastructure/database/database.module';
import { IFilaConsultasExamesRepository } from '../../domain/repositories/fila-consultas-exames.repository.interface';
import { FilaConsultasExamesEntity } from '../../domain/entities/fila-consultas-exames.entity';

interface FilaRow {
  POSICAO: number;
  ID_PACIENTE: string | number;
  NOME_PACIENTE: string;
  SEXO_PACIENTE: string;
  NASCIMENTO_PACIENTE: string;
  IDADE_PACIENTE: number;
  CNS_PACIENTE: string;
  CIDADE_PACIENTE: string;
}

@Injectable()
export class FilaConsultasExamesRepository implements IFilaConsultasExamesRepository {
  constructor(private readonly db: DatabaseService) {}

  async findFilaByPeriodo(dataInicio: string, dataFim: string, itemAgendamento?: number[]): Promise<FilaConsultasExamesEntity[]> {
    let sql = `
      SELECT
          ROW_NUMBER() OVER (ORDER BY F.CD_PRIORI, TRUNC(F.DT_LANCA_LISTA)) AS POSICAO,
          F.CD_PACIENTE AS ID_PACIENTE,
          P.NM_PACIENTE AS NOME_PACIENTE,
          P.TP_SEXO AS SEXO_PACIENTE,
          TO_CHAR(P.DT_NASCIMENTO,'DD/MM/YYYY') AS NASCIMENTO_PACIENTE,
          TRUNC((SYSDATE - P.DT_NASCIMENTO)/365) AS IDADE_PACIENTE,
          P.NR_CNS AS CNS_PACIENTE,
          INITCAP(C.NM_CIDADE) || ' - ' || C.CD_UF AS CIDADE_PACIENTE
      FROM
          FILA_CONSULTAS_EXAMES_TABLE F
          INNER JOIN PACIENTES_TABLE P ON F.CD_PACIENTE = P.CD_PACIENTE
          LEFT JOIN CIDADES_TABLE C ON P.CD_CIDADE = C.CD_CIDADE
      WHERE 1=1
      AND TRUNC(F.DT_LANCA_LISTA) >= TO_DATE(:dataInicio,'DD/MM/YYYY')
      AND TRUNC(F.DT_LANCA_LISTA) <= TO_DATE(:dataFim,'DD/MM/YYYY')
    `;

    const binds: any = { dataInicio, dataFim };

    if (itemAgendamento && itemAgendamento.length > 0) {
      const itemAgendamentoKeys = itemAgendamento.map((_, index) => `:itemAgendamento${index}`);
      itemAgendamento.forEach((element, index) => {
        binds[`itemAgendamento${index}`] = element;
      });
      sql += `\n      AND F.CD_IT_AGEND IN (${itemAgendamentoKeys.join(', ')})`;
    }

    const rows = await this.db.execute<FilaRow>(sql, binds);

    return rows.map((row) => new FilaConsultasExamesEntity({
      posicao: row.POSICAO,
      idPaciente: row.ID_PACIENTE,
      nomePaciente: row.NOME_PACIENTE,
      sexoPaciente: row.SEXO_PACIENTE,
      nascimentoPaciente: row.NASCIMENTO_PACIENTE,
      idadePaciente: row.IDADE_PACIENTE,
      cnsPaciente: row.CNS_PACIENTE,
      cidadePaciente: row.CIDADE_PACIENTE,
    }));
  }
}
