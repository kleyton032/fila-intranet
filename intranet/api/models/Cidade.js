const database = require("../databases/mvPrd");

const get = async (params) => {
  let query = `SELECT CD_CIDADE "id", INITCAP(NM_CIDADE) || '/' || CD_UF "cidade" FROM CIDADE c `;
  const binds = {};

  if ("uf" in params) {
    binds.uf = params.uf;
    query += `\nWHERE CD_UF = :uf`;
  }
  const result = await database.execute(query, binds);

  return result.rows;
};

module.exports = { get };
