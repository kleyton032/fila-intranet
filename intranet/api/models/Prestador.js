const database = require("../databases/mvPrd");

const get = async () => {
  const baseQuery = `SELECT CD_PRESTADOR "id", INITCAP(NM_PRESTADOR) "nome_prestador" FROM PRESTADOR P where P.TP_SITUACAO = 'A' AND P.CD_PRESTADOR NOT IN (1) ORDER BY "id"`;
  const binds = {};
  const result = await database.execute(baseQuery, binds);

  return result.rows;
};

module.exports = { get };
