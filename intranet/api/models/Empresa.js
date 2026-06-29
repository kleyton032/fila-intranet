const database = require("../databases/mvPrd");

const get = async () => {
  const baseQuery = `SELECT CD_MULTI_EMPRESA "id", INITCAP(DS_MULTI_EMPRESA) "empresa" FROM MULTI_EMPRESAS ORDER BY CD_MULTI_EMPRESA`;
  const binds = {};
  const result = await database.execute(baseQuery, binds);

  return result.rows;
};

module.exports = { get };
