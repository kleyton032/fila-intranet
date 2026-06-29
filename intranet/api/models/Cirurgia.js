const database = require("../databases/mvPrd");

const get = async () => {
  const baseQuery = `SELECT CD_CIRURGIA "id", INITCAP(DS_CIRURGIA) "cirurgia" FROM CIRURGIA ORDER BY DS_CIRURGIA`;
  const binds = {};
  const result = await database.execute(baseQuery, binds);

  return result.rows;
};

const listSinteticReport = async (cirurgia, dataInicio, dataFim) => {
  let query = `SELECT COD_CIR "id", INITCAP(CIRURGIA) "cirurgia", INITCAP(TP_CIR) "tipo_cirurgia", COUNT(QTD_OLHOS) "count_pacientes", SUM(QTD_OLHOS) "sum_olhos" FROM VDIC_CIRURGIAS`;
  query += `\nWHERE SITUACAO = 'Realizada'`;
  let binds = {};

  if (dataInicio) {
    binds.dataInicio = dataInicio;
    query += `\nAND DATA_CIR >= TO_DATE(:dataInicio, 'DD/MM/YYYY')`;

    joiner = "AND";
  }

  if (dataFim) {
    binds.dataFim = dataFim;
    query += `\nAND DATA_CIR <= TO_DATE(:dataFim, 'DD/MM/YYYY')`;

    joiner = "AND";
  }

  if (cirurgia) {
    let ids = "";

    if (Array.isArray(cirurgia)) {
      const In = database.whereIn(cirurgia, "id");
      binds = { ...binds, ...In.binds };
      ids = In.values;
    } else {
      binds.cirurgia = id;
      ids = ":id";
    }
    query += `\nAND COD_CIR IN (${ids})`;

    joiner = "AND";
  }

  query += `\nGROUP BY COD_CIR, CIRURGIA, TP_CIR`;

  const result = await database.execute(query, binds);

  return result.rows;
};


const listCid = async (params) => {
  let query = `
  SELECT 
  c.PRONTUARIO,
  c.NOME_PACIENTE,
  c.ATENDIMENTO,
  TO_CHAR(c.DATA_ITEM, 'DD/MM/YYYY') "DATA_ITEM",
  TO_CHAR(c.DATA_DOC, 'DD/MM/YYYY') "DATA_DOC",
  c.CLASSIFICACAO,
  c.CHEKLIST,
  c.cidade,
  c.ITEM,
  c.AVISO_CIR,
  c.PRE_AGEND,
  c.DATA_CHEKLIST,
  c.ORIGEM,
  c.EMPRESA,
  c.DESCR_ORIGEM    
  from VDIC_FAV_CHECKLIST c where c.PRE_AGEND='N'`

  const {
    prontuario,
    dataDoc,
    empresa,
    cidade,
    origem
  } = params;
  const binds = {};


  if (dataDoc) {
    binds.dataDoc = dataDoc;
    query += `\nAND TRUNC(c.DATA_DOC) = TO_DATE(:dataDoc, 'DD/MM/YYYY')`;
  }
  if (prontuario) {
    binds.prontuario = prontuario;
    query += `\nAND C.PRONTUARIO = :prontuario`;
  }
  if (empresa) {
    binds.empresa = empresa;
    query += `\nAND C.EMPRESA = :empresa`;
  }
  if (cidade) {
    binds.cidade = cidade;
    query += `\nAND C.CIDADE = :cidade`;
  }
  if(origem){
    binds.origem = origem;
    query += `\nAND C.ORIGEM = :origem`
  }

  console.log("Binds: ", binds);
  console.log("query:", query);
  
  const result = await database.execute(
    query,
    binds,
    // [180],
    // {
    //   resultSet: true, 
    //   maxRows: 10
    // }
  );

  // if(result){
  //   const result = await database.execute(query, binds)
  //   return result.rows;
  // }

  return result.rows;

}

module.exports = { get, listSinteticReport, listCid };
