const database = require("../databases/mvPrd");

const get = async () => {
  const baseQuery = `SELECT CD_PROCEDIMENTO "id", DS_PROCEDIMENTO "procedimento" FROM PROCEDIMENTO_SUS`;
  const binds = {};
  const result = await database.execute(baseQuery, binds);

  return result.rows;
};

module.exports = { get };
