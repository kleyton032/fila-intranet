const database = require("../databases/mvPrd");
const oracledb = require("oracledb");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });


const credentials = { user: process.env.MV_PRD_USER, password: process.env.MV_PRD_PASSWORD, connectionString: process.env.MV_PRD_CONNECTIONSTRING };


const getContato = async () => {
  let query = `select * from fav_registro_contato_marc order by dt_registro`
  console.log(query);
  const result = await database.execute(query);
  return result.rows;
}

const register = async (cd_paciente, tp_situacao, cd_usuario, ds_observacao, contato, loc) => {

  const options = {
    autoCommit: true,
    bindDefs: {
      col_p: { type: oracledb.NUMBER },
      col_t: { type: oracledb.STRING, maxSize: 200 },
      col_dt: { type: oracledb.DATE },
      col_u: { type: oracledb.STRING, maxSize: 200 },
      col_obs: { type: oracledb.STRING, maxSize: 200 },
      col_con: { type: oracledb.STRING, maxSize: 200 },
      col_loc: { type: oracledb.STRING, maxSize: 200 },
    }
  };

  const binds = [
    {
      col_p: cd_paciente,
      col_t: tp_situacao,
      col_dt: new Date(),
      col_u: cd_usuario,
      col_obs: ds_observacao,
      col_con: contato,
      col_loc: loc
    }
  ];

  const sql = `INSERT INTO fav_registro_contato_marc(cd_seq, cd_paciente, tp_situacao, dt_registro, cd_usuario, ds_observacao, contato, loc) 
              VALUES(seq_fav_reg_cont_marc.nextval, :col_p, :col_t, :col_dt, :col_u, :col_obs, :col_con, :col_loc)`;

  let conn;
  try {
    conn = await oracledb.getConnection(credentials);
    console.log(binds);
    const result = await conn.executeMany(sql, binds, options);
    console.log("Query: ", result);
  } catch (error) {
    console.error(error);
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (error) {
        console.error(error);
      }
    }
  }
};


const listRegistroContato = async () => {
  let query = `
  select
    distinct(substr(upper(tp_situacao),instr(upper(tp_situacao),';')+1)) situacao
  from
    fav_registro_contato_marc
    where tp_situacao is not null
    and substr(upper(tp_situacao),instr(upper(tp_situacao),';')+1) 
    not in ('TRATAMENTO EM OUTRO HOSP','TEST','FALTA','TELEFONE FORA DA ÁREA OU DESLIGADO', 'PACIENTE NÃO DESEJA ATENDIMENTO')`
  console.log(query);
  const result = await database.execute(query);
  return result.rows;
}

module.exports = { getContato, register, listRegistroContato }