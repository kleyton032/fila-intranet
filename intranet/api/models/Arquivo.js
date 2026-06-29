const database = require("../databases/mvPrd");
const oracledb = require("oracledb");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });



const credentials = { user: process.env.MV_PRD_USER, password: process.env.MV_PRD_PASSWORD, connectionString: process.env.MV_PRD_CONNECTIONSTRING };

const getImagesId = async (params) => {

    let query = `
    select rownum SEQ, IDENTIFICADOR, DOC
    from(
    select l.gedid IDENTIFICADOR,
           to_char(g.creationdate,'dd/mm/yyyy hh24:mi') DATA,
           g.filename DOC
    from GEMMIUS.GEDLEGACY l, 
         gemmius.ged g
    where l.gedid = g.gedid`
    const binds = {};
    const auxBinds = {};

    binds.id_paciente = params.id_paciente;
    query += `\nAND l.patientid = :id_paciente`;
    query += `\norder by l.gedid)`
    const result = await database.execute(query, binds);
    console.log(result);
    return result.rows;
}


const excluirFotoGed = async (identificadores) => {

    const options = {
        autoCommit: true,
    };
    console.log(identificadores)

    const binds = {};
    const auxBinds = {};
    const binds2 = [];

    auxBinds.identificadores = [];
    identificadores.forEach((element, index) => {
        binds[`:gedid${index}`] = element
        auxBinds.identificadores.push(`:gedid${index}`);

    })
    
    binds2.push(binds);

    auxQuery = Object.values(auxBinds.identificadores).join(",");

      const sql = `insert into gemmius.log_ged (
        select gedid, patientid,filename,userid,creationdate,pagecount,active,caredate,documentkindid,careunitid,idfather, sysdate dt_log
        from gemmius.ged g where g.gedid in (${auxQuery}))`; 

    const sql2 = `insert into gemmius.log_gedlegacy (
    select gedid, patientid,patientname, patientbirthdate, patientmothername, sysdate dt_log
    from GEMMIUS.GEDLEGACY l where l.gedid in (${auxQuery}))`;


    const sql3 = `delete gemmius.ged g where g.gedid in (${auxQuery})`;


    const sql4 = `delete GEMMIUS.GEDLEGACY l where l.gedid in (${auxQuery})`;

let conn;


//console.log(sql)
try {
    conn = await oracledb.getConnection(credentials)
    const result = await conn.executeMany(sql, binds2, options)
    const result2 = await conn.executeMany(sql2, binds2, options)
    const result3 = await conn.executeMany(sql3, binds2, options)
    const result4 = await conn.executeMany(sql4, binds2, options)
    
    //console.log(result, result2, result3, result4);
} catch (error) {
    console.error(error);
    //console.log(sql);
}finally{
    if (conn) {
        try {
          await conn.close();
        } catch (error) {
          console.error(error);
        }
      }
}

}

module.exports = {
    getImagesId,
    excluirFotoGed
}