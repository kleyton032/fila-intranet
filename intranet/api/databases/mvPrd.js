const dotenv = require("dotenv");
const oracledb = require("oracledb");
const defaultThreadPoolSize = 4;

console.log("Oracle client library version number is " + oracledb.oracleClientVersion)

dotenv.config({ path: "./config/config.env" });

const mvPrdPool = {
  user: process.env.MV_PRD_USER,
  password: process.env.MV_PRD_PASSWORD,
  connectString: process.env.MV_PRD_CONNECTIONSTRING,
  poolMin: +process.env.MV_PRD_NUMBER_CONNECTIONS, //1 em dev, 10 na produção
  poolMax: +process.env.MV_PRD_NUMBER_CONNECTIONS,
  poolIncrement: 0,
};

// Increase thread pool size by poolMax
process.env.UV_THREADPOOL_SIZE = mvPrdPool.poolMax + defaultThreadPoolSize;

async function initialize() {
  const pool = await oracledb.createPool(mvPrdPool);
}

async function close() {
  await oracledb.getPool().close();
}

function execute(statement, binds = [], opts = {}) {
  return new Promise(async (resolve, reject) => {
    let conn;

    opts.outFormat = oracledb.OBJECT;
    // opts.autoCommit = true;

    try {
      conn = await oracledb.getConnection();

      const result = await conn.execute(statement, binds, opts);

      resolve(result);
      console.log(result.metaData);
      console.log(result.rows);
      doRelease(conn)
    } catch (err) {
      reject(err);
    } finally {
      if (conn) {
        // conn assignment worked, need to close
        try {
          await conn.close();
        } catch (err) {
          console.log(err);
        }
      }
    }
  });
}

function executeMany(statement, binds = {}, opts = {}) {
  return new Promise(async (resolve, reject) => {
    let conn;

    opts.outFormat = oracledb.OBJECT;
    opts.autoCommit = true;

    try {
      conn = await oracledb.getConnection();

      const result = await conn.executeMany(statement, binds, opts);

      resolve(result);
      console.log(result.metaData);
      console.log(result.rows);
      doRelease(conn)
    } catch (err) {
      reject(err);
    } finally {
      if (conn) {
        // conn assignment worked, need to close
        try {
          await conn.close();
        } catch (err) {
          console.log(err);
        }
      }
    }
  });
}

 function doRelease(conn){
  conn.close(
     function(error) {
       if(error){
         console.log(error.message);
       }
     }
   )
 }

const whereIn = (paramList, columnName) => {
  const values = {};
  const binds = [];
  paramList.map((value, index) => {
    binds[`${columnName}${index}`] = value;
    values[index] = `:${columnName}${index}`;
  });

  whereInClaus = Object.values(values).join(",");

  return { binds: binds, values: whereInClaus };
};

module.exports = { initialize, close, execute, whereIn, executeMany };
