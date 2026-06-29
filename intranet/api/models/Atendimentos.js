const database = require("../databases/mvPrd");

const atendimentosCovid19 = async (dataInicio, dataFim) => {
  let query = `SELECT
  A.CD_ATENDIMENTO "id_atendimento",
  A.CD_PACIENTE "id_paciente",
  INITCAP(P.NM_PACIENTE) "nome_paciente",
  TRUNC((A.DT_ATENDIMENTO - P.DT_NASCIMENTO) / 365) "idade",
  INITCAP(C.NM_CIDADE) "cidade",
  INITCAP(PR.NM_PRESTADOR) "nome_prestador",
  (SELECT MAX(RESPOSTA) FROM VDIC_FAV_PESQUISA WHERE CD_ATENDIMENTO = A.CD_ATENDIMENTO AND ID_PERGUNTA = 141) "conduta",
  CASE
      WHEN (SELECT COUNT(*) FROM REGISTRO_DOCUMENTO WHERE CD_DOCUMENTO = 532 AND SN_IMPRESSO = 'S' AND CD_ATENDIMENTO = A.CD_ATENDIMENTO) > 0 THEN 'Sim'
      ELSE 'Não'
  END "atestado",
  TO_CHAR(A.DT_ATENDIMENTO, 'DD/MM/YYYY') "data_atendimento",
  CID.CD_CID || ' - ' || INITCAP(CID.DS_CID) "cid"
  FROM TRIAGEM_ATENDIMENTO TA
  JOIN ATENDIME A ON A.CD_ATENDIMENTO = TA.CD_ATENDIMENTO
  JOIN PACIENTE P ON P.CD_PACIENTE = A.CD_PACIENTE
  JOIN CIDADE C ON C.CD_CIDADE = P.CD_CIDADE
  JOIN PRESTADOR PR ON PR.CD_PRESTADOR = A.CD_PRESTADOR
  LEFT JOIN CID CID ON CID.CD_CID = A.CD_CID
  WHERE TA.CD_COR_REFERENCIA = 14`;

  const binds = {};
  // let joiner = "WHERE";

  if (dataInicio) {
    binds.dataInicio = dataInicio;
    query += `\nAND A.DT_ATENDIMENTO >= TO_DATE(:dataInicio, 'DD/MM/YYYY')`;
  }

  if (dataFim) {
    binds.dataFim = dataFim;
    query += `\nAND A.DT_ATENDIMENTO <= TO_DATE(:dataFim, 'DD/MM/YYYY')`;
  }

  console.log(query);

  const result = await database.execute(query, binds);

  return result.rows;
};

const relatorioAtendimentosPorHora = async (
  dataInicio,
  dataFim,
  empresas,
  setores
) => {
  let query = `SELECT HORA "hora", 
  CASE 
		WHEN HORA BETWEEN 0 AND 6 THEN '00:00 a 06:59' 
		WHEN HORA BETWEEN 7 AND 12 THEN '07:00 a 12:59'
		WHEN HORA BETWEEN 13 AND 18 THEN '13:00 a 18:59'
		WHEN HORA BETWEEN 19 AND 23 THEN '19:00 a 23:59'
	END "turno",
  SUM(AGENDADOS) "sum_agendados", SUM(TRIADOS) "sum_triados", SUM(RECEPCIONADOS) "sum_recepcionados", SUM(ATENDIDOS) "sum_atendidos"
  FROM
  (\n`;

  let subQuery1 = `SELECT TO_CHAR(HR_AGENDA, 'HH24') HORA, COUNT(*) AGENDADOS, 0 TRIADOS,  0 RECEPCIONADOS, 0 ATENDIDOS
  FROM IT_AGENDA_CENTRAL iac
  JOIN ITEM_AGENDAMENTO I ON I.CD_ITEM_AGENDAMENTO = IAC.CD_ITEM_AGENDAMENTO
  JOIN AGENDA_CENTRAL AC ON AC.CD_AGENDA_CENTRAL = IAC.CD_AGENDA_CENTRAL
  WHERE CD_PACIENTE != 1113567`;

  let subQuery2 = `SELECT TO_CHAR(HR_ATENDIMENTO, 'HH24') HORA, 0 AGENDADOS, 0 TRIADOS,  COUNT(*) RECEPCIONADOS, 0 ATENDIDOS
  FROM ATENDIME A
  JOIN ORI_ATE O ON O.CD_ORI_ATE = A.CD_ORI_ATE`;

  let subQuery3 = `SELECT TO_CHAR(TA.DH_PRE_ATENDIMENTO_FIM, 'HH24') HORA, 0 AGENDADOS, COUNT(*) TRIADOS, 0 RECEPCIONADOS, 0 ATENDIDOS
  FROM ATENDIME A
  JOIN ORI_ATE O ON O.CD_ORI_ATE = A.CD_ORI_ATE 
  RIGHT JOIN TRIAGEM_ATENDIMENTO ta ON TA.CD_ATENDIMENTO = A.CD_ATENDIMENTO `;

  let subQuery4 = `SELECT TO_CHAR(HR_ATENDIMENTO, 'HH24') HORA, 0 AGENDADOS, 0 TRIADOS, 0 RECEPCIONADOS, COUNT(*) ATENDIDOS
  FROM ATENDIME A
  JOIN ORI_ATE O ON O.CD_ORI_ATE = A.CD_ORI_ATE
  WHERE A.DT_ALTA IS NOT NULL`;

  let binds = {};
  let joiner = "WHERE";
  let ids = "";

  if (dataInicio) {
    binds.dataInicio = dataInicio;
    subQuery1 += `\nAND TRUNC(IAC.HR_AGENDA) >= TO_DATE(:dataInicio,'DD/MM/YYYY')`;
    subQuery2 += `\n${joiner} TRUNC(DT_ATENDIMENTO) >= TO_DATE(:dataInicio,'DD/MM/YYYY')`;
    subQuery3 += `\n${joiner} TRUNC(TA.DH_PRE_ATENDIMENTO_FIM) >= TO_DATE(:dataInicio,'DD/MM/YYYY')`;
    subQuery4 += `\nAND TRUNC(DT_ATENDIMENTO) >= TO_DATE(:dataInicio,'DD/MM/YYYY')`;
    joiner = "AND";
  }

  if (dataFim) {
    binds.dataFim = dataFim;
    subQuery1 += `\nAND TRUNC(IAC.HR_AGENDA) <= TO_DATE(:dataFim,'DD/MM/YYYY')`;
    subQuery2 += `\n${joiner} TRUNC(DT_ATENDIMENTO) <= TO_DATE(:dataFim,'DD/MM/YYYY')`;
    subQuery3 += `\n${joiner} TRUNC(TA.DH_PRE_ATENDIMENTO_FIM) <= TO_DATE(:dataFim,'DD/MM/YYYY')`;
    subQuery4 += `\nAND TRUNC(DT_ATENDIMENTO) <= TO_DATE(:dataFim,'DD/MM/YYYY')`;
    joiner = "AND";
  }

  if (empresas) {
    if (Array.isArray(empresas)) {
      const In = database.whereIn(empresas, "empresa");
      binds = { ...binds, ...In.binds };
      ids = In.values;
    } else {
      binds.empresa = empresas;
      ids = ":empresa";
    }

    subQuery1 += `\nAND AC.CD_MULTI_EMPRESA IN (${ids})`;
    subQuery2 += `\n${joiner} A.CD_MULTI_EMPRESA IN (${ids})`;
    subQuery3 += `\n${joiner} A.CD_MULTI_EMPRESA IN (${ids})`;
    subQuery4 += `\nAND A.CD_MULTI_EMPRESA IN (${ids})`;

    joiner = "AND";
  }

  if (setores) {
    if (Array.isArray(setores)) {
      const In = database.whereIn(setores, "setor");
      binds = { ...binds, ...In.binds };
      ids = In.values;
    } else {
      binds.setor = setores;
      ids = ":setor";
    }

    subQuery1 += `\nAND AC.CD_SETOR IN (${ids})`;
    subQuery2 += `\n${joiner} O.CD_SETOR IN (${ids})`;
    subQuery3 += `\n${joiner} O.CD_SETOR IN (${ids})`;
    subQuery4 += `\nAND O.CD_SETOR IN (${ids})`;

    joiner = "AND";
  }

  subQuery1 += `\nGROUP BY TO_CHAR(HR_AGENDA, 'HH24')`;
  subQuery2 += `\nGROUP BY TO_CHAR(HR_ATENDIMENTO, 'HH24')`;
  subQuery3 += `\nGROUP BY TO_CHAR(TA.DH_PRE_ATENDIMENTO_FIM , 'HH24')`;
  subQuery4 += `\nGROUP BY TO_CHAR(HR_ATENDIMENTO, 'HH24')`;

  query +=
    subQuery1 +
    `\nUNION ALL\n` +
    subQuery2 +
    `\nUNION ALL\n` +
    subQuery3 +
    `\nUNION ALL\n` +
    subQuery4 +
    `\n)`;

  query += `\nGROUP BY HORA`;

  const result = await database.execute(query, binds);

  return result.rows;
};

const relatorioAtendimentosPorClassificacao = async (dataInicio, dataFim) => {
  let query = `SELECT 
                TO_CHAR(DATA_RECEPCAO, 'DD/MM/YYYY') "data_recepcao",
                INITCAP(DIA_SEMANA) "dia_semana",
                (SELECT COUNT(*) FROM VDIC_FAV_TOTAL_ATENDIMENTOS V1 WHERE V1.DATA_RECEPCAO = A.DATA_RECEPCAO) "sum_recepcao",
                --(SELECT COUNT(*) FROM VDIC_FAV_TOTAL_ATENDIMENTOS V1 WHERE V1.DATA_RECEPCAO = A.DATA_RECEPCAO AND V1.DATA_ALTA IS NULL AND V1.DATA_TRIAGEM IS NULL) "sum_evasao_apos_recepcao",
                (SELECT COUNT(*) FROM VDIC_FAV_TOTAL_ATENDIMENTOS V1 WHERE V1.DATA_RECEPCAO = A.DATA_RECEPCAO AND V1.DATA_TRIAGEM = A.DATA_RECEPCAO) "sum_triagem",
                (SELECT COUNT(*) FROM VDIC_FAV_TOTAL_ATENDIMENTOS V1 WHERE V1.DATA_RECEPCAO = A.DATA_RECEPCAO AND V1.DATA_TRIAGEM IS NOT NULL AND V1.DATA_ALTA IS NULL AND V1.CD_TIP_RES != 66) "sum_evasao_apos_triagem",
                SUM(AMARELO) "sum_amarelo",
                SUM(AZUL) "sum_azul",
                SUM(LARANJA) "sum_laranja",
                SUM(VERDE) "sum_verde",
                SUM(VERDE_ULCERA_CORNEA) "sum_verde_ulcera_cornea",
                SUM(VERMELHO_CORONA) "sum_vermelho_coronavirus",
                SUM(VERMELHO) "sum_vermelho",
                SUM(VERMELHO_CIRURGIA) "sum_vermelho_cirurgia"
              FROM 
              (
                SELECT 
                    DATA_RECEPCAO,
                    DIA_SEMANA,
                    CASE WHEN CD_COR_REFERENCIA = 3 THEN COUNT(*) ELSE 0 END AMARELO,
                    CASE WHEN CD_COR_REFERENCIA = 5 THEN COUNT(*) ELSE 0 END AZUL,
                    CASE WHEN CD_COR_REFERENCIA = 2 THEN COUNT(*) ELSE 0 END LARANJA,
                    CASE WHEN CD_COR_REFERENCIA = 4 THEN COUNT(*) ELSE 0 END VERDE,
                    CASE WHEN CD_COR_REFERENCIA = 13 THEN COUNT(*) ELSE 0 END VERDE_ULCERA_CORNEA,
                    CASE WHEN CD_COR_REFERENCIA = 14 THEN COUNT(*) ELSE 0 END VERMELHO_CORONA,
                    CASE WHEN CD_COR_REFERENCIA = 1 THEN COUNT(*) ELSE 0 END VERMELHO,
                    CASE WHEN CD_COR_REFERENCIA = 8 THEN COUNT(*) ELSE 0 END VERMELHO_CIRURGIA
                FROM VDIC_FAV_TOTAL_ATENDIMENTOS
                GROUP BY DATA_RECEPCAO, DIA_SEMANA, CD_TIP_RES, CD_COR_REFERENCIA
              ) A`;

  let binds = {};
  let joiner = "WHERE";

  if (dataInicio) {
    binds.dataInicio = dataInicio;
    query += `\n${joiner} DATA_RECEPCAO >= TO_DATE(:dataInicio, 'DD/MM/YYYY')`;
    joiner = "AND";
  }

  if (dataFim) {
    binds.dataFim = dataFim;
    query += `\n${joiner} DATA_RECEPCAO <= TO_DATE(:dataFim, 'DD/MM/YYYY')`;
    joiner = "AND";
  }

  query += `\nGROUP BY DATA_RECEPCAO, DIA_SEMANA`;

  const result = await database.execute(query, binds);

  return result.rows;
};

const relatorioEvasoes = async (dataInicio, dataFim) => {
  let query = `SELECT 
  TO_CHAR(DATA_RECEPCAO, 'DD/MM/YYYY') "data_recepcao",
  INITCAP(DIA_SEMANA) "dia_semana",
  (SELECT COUNT(*) FROM VDIC_FAV_TOTAL_ATENDIMENTOS V1 WHERE V1.DATA_RECEPCAO = A.DATA_RECEPCAO) "sum_recepcao",
  (SELECT COUNT(*) FROM VDIC_FAV_TOTAL_ATENDIMENTOS V1 WHERE V1.DATA_RECEPCAO = A.DATA_RECEPCAO AND V1.DATA_ALTA IS NULL AND V1.DATA_TRIAGEM IS NULL) "sum_evasao_apos_recepcao",
  (SELECT COUNT(*) FROM VDIC_FAV_TOTAL_ATENDIMENTOS V1 WHERE V1.DATA_RECEPCAO = A.DATA_RECEPCAO AND V1.DATA_TRIAGEM = A.DATA_RECEPCAO) "sum_triagem",
  (SELECT COUNT(*) FROM VDIC_FAV_TOTAL_ATENDIMENTOS V1 WHERE V1.DATA_RECEPCAO = A.DATA_RECEPCAO AND V1.DATA_TRIAGEM IS NOT NULL AND V1.DATA_ALTA IS NULL AND V1.CD_TIP_RES != 66) "sum_evasao_apos_triagem",
  (SELECT COUNT(*) FROM VDIC_FAV_TOTAL_ATENDIMENTOS V1 WHERE V1.DATA_ALTA = A.DATA_RECEPCAO) "sum_atendimento",
  (SELECT COUNT(*) FROM VDIC_FAV_TOTAL_ATENDIMENTOS V1 WHERE V1.DATA_ALTA = A.DATA_RECEPCAO AND V1.DATA_TRIAGEM IS NULL) "sum_atendimento_sem_triagem",
  (SELECT COUNT(*) FROM VDIC_FAV_TOTAL_ATENDIMENTOS V1 WHERE V1.DATA_RECEPCAO = A.DATA_RECEPCAO AND V1.DATA_ALTA IS NULL AND V1.DATA_TRIAGEM = A.DATA_RECEPCAO + 1) "sum_evasao_dia_posterior"
FROM VDIC_FAV_TOTAL_ATENDIMENTOS A`;

  let binds = {};
  let joiner = "WHERE";

  if (dataInicio) {
    binds.dataInicio = dataInicio;
    query += `\n${joiner} DATA_RECEPCAO >= TO_DATE(:dataInicio, 'DD/MM/YYYY')`;
    joiner = "AND";
  }

  if (dataFim) {
    binds.dataFim = dataFim;
    query += `\n${joiner} DATA_RECEPCAO <= TO_DATE(:dataFim, 'DD/MM/YYYY')`;
    joiner = "AND";
  }

  query += `\nGROUP BY DATA_RECEPCAO, DIA_SEMANA`;
  console.log(query);

  const result = await database.execute(query, binds);

  return result.rows;
};

module.exports = {
  atendimentosCovid19,
  relatorioAtendimentosPorHora,
  relatorioAtendimentosPorClassificacao,
  relatorioEvasoes,
};
