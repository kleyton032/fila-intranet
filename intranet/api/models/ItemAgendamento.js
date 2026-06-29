const database = require("../databases/mvPrd");

const get = async (params) => {
  let query = `SELECT CD_ITEM_AGENDAMENTO "id", INITCAP(DS_ITEM_AGENDAMENTO) "item_agendamento" FROM ITEM_AGENDAMENTO`;

  const binds = {};

  if ("tipoItem" in params) {
    binds.tipoItem = params.tipoItem;
    query += `\nWHERE TP_ITEM = :tipoItem`;
  }

  console.log(`Query: ${query}`);

  const result = await database.execute(query, binds);
  return result.rows;
};

module.exports = { get };
