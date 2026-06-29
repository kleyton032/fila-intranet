const database = require("../databases/mvPrd");

const getPaciente = async (params) => {
    let query = `
    SELECT 
    p.cd_paciente,
    p.nm_paciente,
    p.nr_cpf,
    p.nm_mae,
    p.nr_cns FROM PACIENTE p`;

    const binds = {};

    binds.cpf = params.cpf;
    query += `\nwhere p.nr_cpf=:cpf`;


    const resultItens = await database.execute(query, binds);
    return resultItens.rows
}

module.exports = { getPaciente };
