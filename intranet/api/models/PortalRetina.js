const database = require("../databases/mvPrd");

const get = async (params) => {

    let query = ` 
    SELECT
        P.CD_PACIENTE "id_paciente",
        P.NM_PACIENTE "nome_paciente",
        (CASE WHEN LE.CD_IT_AGEND = 2 THEN 'RETINA CIRÚRGICA'
            WHEN LE.CD_IT_AGEND = 27 THEN 'RETINA DPO ANTIANGIOGÊNICO'
            WHEN LE.CD_IT_AGEND = 2302 THEN 'RETINA CLÍNICA' 
            WHEN LE.CD_IT_AGEND = 1682 THEN 'RETINA OCLUSÕES VASCULARES'
            WHEN LE.CD_IT_AGEND = 4882 THEN 'RETINA PEDIÁTRICA'
            WHEN LE.CD_IT_AGEND = 4922 THEN 'RETINA DISTROFIAS RETINIANAS' 
            END) "tipo_solicitacao",
        LE.DT_LANCA_LISTA "data_solicitacao",
        TO_CHAR(LE.DT_RETORNO,'Month "de" YYYY') "data_retorno",
        (case when LE.OBSERV = 'CANCELADO POR DUPLICIDADE' then null
           when LE.OBSERV LIKE '%CANCELADO POR DUPLICIDADE%' then SUBSTR(LE.OBSERV, INSTR(LE.OBSERV,'-')+1)
           else LE.OBSERV end) "observacao",
        (case when TRUNC(LE.DT_RETORNO - SYSDATE) > 30 then 'NO PRAZO'
            when TRUNC(LE.DT_RETORNO - SYSDATE) BETWEEN 15 AND 30 then 'PERTO DO PRAZO' 
            when TRUNC(LE.DT_RETORNO - SYSDATE) < 15 then 'EM ATRASO' END) "situacao"
        
    FROM
        PACIENTE P,
        FAV_LISTA_ESPERA LE,
        ITEM_AGENDAMENTO IA

    WHERE P.CD_PACIENTE = LE.CD_PACIENTE
    AND   LE.CD_IT_AGEND = IA.CD_ITEM_AGENDAMENTO
    AND   LE.TP_SITUACAO NOT IN ('C','T')`;

    const {
        dataInicio,
        dataFim,
        dataRetornoInicio,
        dataRetornoFim,
        itensRetina,
        filtroSituacao,
        empresa,
    } = params;
    const binds = {};
    const auxBinds = {};

    if (dataInicio) {
        binds.dataInicio = dataInicio;
        query += `\nAND TRUNC(LE.DT_LANCA_LISTA) >= TO_DATE(:dataInicio, 'DD/MM/YYYY')`;
    }

    if (dataFim) {
        binds.dataFim = dataFim;
        query += `\nAND TRUNC(LE.DT_LANCA_LISTA) <= TO_DATE(:dataFim, 'DD/MM/YYYY')`;
    }

    if ((dataInicio != "" && dataFim != "") && itensRetina === undefined) {
        query += `\nAND   LE.CD_IT_AGEND IN (2,2302,4922,4882,27,1682)`;
    }

    if (itensRetina) {
        auxBinds.itensRetina = [];
        itensRetina.forEach((element, index) => {
            binds[`itensRetina${index}`] = element;
            auxBinds.itensRetina.push(`:itensRetina${index}`);
        });

        auxQuery = Object.values(auxBinds.itensRetina).join(",");
        query += `\nAND LE.CD_IT_AGEND IN (${auxQuery})`;
    }

    
    if (filtroSituacao) {
        //binds.filtroSituacao = filtroSituacao;
        if (filtroSituacao == 1) {
            query += `\nAND TRUNC(LE.DT_RETORNO - SYSDATE) > 30`;
        }
        if (filtroSituacao == 2) {
            query += `\nAND TRUNC(LE.DT_RETORNO - SYSDATE) BETWEEN 15 AND 30`;
        }
        if (filtroSituacao == 3) {
            query += `\nAND   TRUNC(LE.DT_RETORNO - SYSDATE) < 15`;
        }
    }

    if (dataRetornoInicio) {
        binds.dataRetornoInicio = dataRetornoInicio;
        query += `\nAND TRUNC(LE.DT_RETORNO) >= TO_DATE(:dataRetornoInicio, 'DD/MM/YYYY')`;
    }

    if (dataRetornoFim) {
        binds.dataRetornoFim = dataRetornoFim;
        query += `\nAND TRUNC(LE.DT_RETORNO) <= TO_DATE(:dataRetornoFim, 'DD/MM/YYYY')`;
    }


    query += `\nGROUP BY P.CD_PACIENTE, P.NM_PACIENTE, LE.CD_IT_AGEND, LE.DT_LANCA_LISTA, TO_CHAR(LE.DT_RETORNO,'Month "de" YYYY'), LE.OBSERV, TRUNC(LE.DT_RETORNO - SYSDATE)`;


    console.log("Query: ", query);

    const result = await database.execute(query, binds);

    return result.rows;
};


const getitensRetina = async (params) => {
    let query = `
    select 
    it.cd_item_agendamento id,
    it.ds_item_agendamento item
    from
    item_agendamento it
    where it.cd_item_agendamento in (2,2302,4882,4922,27,1682)
    order by it.cd_item_agendamento`;

    const binds = {};
    const resultItens = await database.execute(query, binds);
    return resultItens.rows
}

module.exports = { get, getitensRetina };