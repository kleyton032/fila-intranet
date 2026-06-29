const database = require("../databases/mvPrd");

const get = async () => {
  const baseQuery = `SELECT S.CD_SETOR "id", S.NM_SETOR "setor" 
  FROM SETOR S
  ORDER BY S.NM_SETOR`;
  const binds = {};
  const result = await database.execute(baseQuery, binds);

  return result.rows;
};

module.exports = { get };
