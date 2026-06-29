const database = require("../databases/mvPrd");

const relatorioPreAgendamentoCirurgico = async (
  dataInicio,
  dataFim,
  dataExameInicio,
  dataExameFim,
  idadeMin,
  idadeMax,
  medicoSolicitante,
  medicoCirurgia,
  cirurgia,
  cidade,
  ret,
  lente
) => {
  let query = `SELECT PRONTUARIO "id_paciente", 
    INITCAP(PACIENTE) "nome_paciente", 
    CNS "cns_paciente", 
    FONE1 || ' / ' || FONE2 || ' / ' || FONE3 "fone_paciente", 
    IDADE "idade_paciente", 
    INITCAP(CIDADE) "cidade_paciente", 
    UF "uf_cidade_paciente", 
    COD_CIRURG || ' - ' || INITCAP(CIRURGIA) "cirurgia", 
    STATUS "status_cirurgia", 
    COD_MED_SOLIC || ' - ' || INITCAP(MEDICO_SOLIC) "medico_solicitante", 
    COD_MED_CIRUR || ' - ' || INITCAP(MEDICO_CIRURG) "medico_cirurgia", 
    TO_CHAR(DATA_SOLIC, 'DD/MM/YYYY') "data_solicitacao", 
    TO_CHAR(DATA_EXAME, 'DD/MM/YYYY') "data_exame", 
    EMPRESA "empresa",
    COD_LENTE || ' - ' || INITCAP(LENTE) "lente",
    CONVENIO "convenio",
    INITCAP(RET) "ret"
  FROM VDIC_PRE_AGENDAMENTO VPA`;

  let binds = {};
  let joiner = "WHERE";

  if (dataInicio) {
    binds.dataInicio = dataInicio;
    query += `\n${joiner} DATA_SOLIC >= TO_DATE(:dataInicio, 'DD/MM/YYYY')`;
    joiner = "AND";
  }

  if (dataFim) {
    binds.dataFim = dataFim;
    query += `\n${joiner} DATA_SOLIC <= TO_DATE(:dataFim, 'DD/MM/YYYY')`;
    joiner = "AND";
  }

  if (dataExameInicio) {
    binds.dataExameInicio = dataExameInicio;
    query += `\n${joiner} DATA_EXAME >= TO_DATE(:dataExameInicio, 'DD/MM/YYYY')`;
    joiner = "AND";
  }

  if (dataExameFim) {
    binds.dataExameFim = dataExameFim;
    query += `\n${joiner} DATA_EXAME <= TO_DATE(:dataExameFim, 'DD/MM/YYYY')`;
    joiner = "AND";
  }

  if (idadeMin) {
    binds.idadeMin = idadeMin;
    query += `\n${joiner} IDADE >= :idadeMin`;
    joiner = "AND";
  }

  if (idadeMax) {
    binds.idadeMax = idadeMax;
    query += `\n${joiner} IDADE <= :idadeMax`;
    joiner = "AND";
  }

  if (medicoSolicitante) {
    let ids = "";

    if (Array.isArray(medicoSolicitante)) {
      const In = database.whereIn(medicoSolicitante, "medicoSolicitante");
      binds = { ...binds, ...In.binds };
      ids = In.values;
    } else {
      binds.id = id;
      ids = ":medicoSolicitante";
    }
    query += `\nAND COD_MED_SOLIC IN (${ids})`;

    joiner = "AND";
  }

  if (medicoCirurgia) {
    let ids = "";

    if (Array.isArray(medicoCirurgia)) {
      const In = database.whereIn(medicoCirurgia, "medicoCirurgia");
      binds = { ...binds, ...In.binds };
      ids = In.values;
    } else {
      binds.id = id;
      ids = ":medicoCirurgia";
    }
    query += `\nAND COD_MED_CIRUR IN (${ids})`;

    joiner = "AND";
  }

  if (cirurgia) {
    let ids = "";

    if (Array.isArray(cirurgia)) {
      const In = database.whereIn(cirurgia, "cirurgia");
      binds = { ...binds, ...In.binds };
      ids = In.values;
    } else {
      binds.id = id;
      ids = ":cirurgia";
    }
    query += `\nAND COD_CIRURG IN (${ids})`;

    joiner = "AND";
  }

  if (cidade) {
    let ids = "";

    if (Array.isArray(cidade)) {
      const In = database.whereIn(cidade, "cidade");
      binds = { ...binds, ...In.binds };
      ids = In.values;
    } else {
      binds.id = id;
      ids = ":cidade";
    }
    query += `\nAND CD_CIDADE IN (${ids})`;

    joiner = "AND";
  }

  if (lente) {
    let ids = "";

    if (Array.isArray(lente)) {
      const In = database.whereIn(lente, "lente");
      binds = { ...binds, ...In.binds };
      ids = In.values;
    } else {
      binds.id = id;
      ids = ":lente";
    }
    query += `\nAND COD_LENTE IN (${ids})`;

    joiner = "AND";
  }

  if (ret) {
    binds.ret = `%${ret}%`.toUpperCase();
    query += `\n${joiner} UPPER(RET) LIKE :ret`;
    joiner = "AND";
  }

  console.log(query);
  console.log(binds);

  const result = await database.execute(query, binds);

  return result.rows;
};

const getLentePreAgendamento = async () => {
  const query = `SELECT COD_LENTE "id", INITCAP(LENTE) "lente"
  FROM VDIC_PRE_AGENDAMENTO VPA
  WHERE DATA_SOLIC = TRUNC(SYSDATE)
  AND COD_LENTE IS NOT NULL
  GROUP BY COD_LENTE, LENTE`;

  let binds = {};
  const result = await database.execute(query, binds);

  return result.rows;
};

module.exports = { relatorioPreAgendamentoCirurgico, getLentePreAgendamento };
