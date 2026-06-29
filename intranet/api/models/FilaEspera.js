const database = require("../databases/mvPrd");

const get = async (params) => {

  let query = ` 
  SELECT
      ROW_NUMBER() OVER (ORDER BY F.CD_PRIORI, TRUNC(f.DT_LANCA_LISTA)) "posicao",
      F.CD_PACIENTE "id_paciente",
      P.NM_PACIENTE "nome_paciente",
      P.TP_SEXO "sexo_paciente",
      TO_CHAR(P.DT_NASCIMENTO, 'DD/MM/YYYY') "nascimento_paciente",
      TRUNC((SYSDATE - P.DT_NASCIMENTO) / 365) "idade_paciente",
      P.NR_CNS "cns_paciente",
      INITCAP(C.NM_CIDADE) || ' - ' || C.CD_UF "cidade_paciente",
      ( CASE WHEN (select count(*) from fav_registro_contato_marc rc2 where rc2.cd_paciente = F.CD_PACIENTE and upper(rc2.tp_situacao) like '%FALECEU%') > 0  THEN 'PACIENTE FALECIDO'
                   ELSE            
            (select replace(to_char(wmsys.wm_concat('(' || CP.NR_DDD || ') ' || CP.NR_TELEFONE)),',',' / ')
              from CONTATO_PACIENTE CP
              where CP.CD_PACIENTE = F.CD_PACIENTE) END) "fone_paciente"
  FROM
      FAV_LISTA_ESPERA F,
      ITEM_AGENDAMENTO I,
      PACIENTE P,
      CIDADE C,
      FAV_REGISTRO_CONTATO_MARC RC,
      VDIC_FAV_FILA_RETORNOS R

  WHERE I.CD_ITEM_AGENDAMENTO = F.CD_IT_AGEND
  AND P.CD_PACIENTE = F.CD_PACIENTE
  AND C.CD_CIDADE = P.CD_CIDADE
  AND RC.CD_PACIENTE(+) = F.CD_PACIENTE
  AND R.CD_PACIENTE = F.CD_PACIENTE`;

  const {
    dataInicio,
    dataFim,
    dataRetornoInicio,
    dataRetornoFim,
    dataLimiteAgendamento,
    prontuario,
    empresa,
    itemMarcacao,
    tipoItemAgendamento,
    itemAgendamento,
    tipoItemRetorno,
    itemRetorno,
    uf,
    cidade,
    situacao,
    registro,
    origem,
    idadeInicio,
    idadeFim,
    itemAgendamentoCer,
    dataAgendamentoInicio,
    dataAgendamentoFim,
    setor,
    projeto,
    tipoPaciente,
    prioridadeCer,
    prestador
  } = params;
  const binds = {};
  const auxBinds = {};

  if(!(dataAgendamentoInicio ==="" || dataAgendamentoInicio === undefined) && !(dataAgendamentoFim ==="" || dataAgendamentoFim === undefined) && !(setor ==="" || setor === undefined)){
    binds.dataAgendamentoInicio = dataAgendamentoInicio;
    binds.dataAgendamentoFim = dataAgendamentoFim;
  
    auxBinds.setor = [];
    setor.forEach((element, index)=> {
      binds[`setor${index}`] = element;
      auxBinds.setor.push(`:setor${index}`);
    })

    auxQuery = Object.values(auxBinds.setor).join(",");

      query = `SELECT DISTINCT
      --ROW_NUMBER() OVER (ORDER BY F.CD_PRIORI, TRUNC(f.DT_LANCA_LISTA)) "posicao",
      F.CD_PACIENTE "id_paciente",
      P.NM_PACIENTE "nome_paciente",
      P.TP_SEXO "sexo_paciente",
      TO_CHAR(P.DT_NASCIMENTO, 'DD/MM/YYYY') "nascimento_paciente",
      TRUNC((SYSDATE - P.DT_NASCIMENTO) / 365) "idade_paciente",
      P.NR_CNS "cns_paciente",
      INITCAP(C.NM_CIDADE) || ' - ' || C.CD_UF "cidade_paciente",
      ( CASE WHEN (select count(*) from fav_registro_contato_marc rc2 where rc2.cd_paciente = F.CD_PACIENTE and upper(rc2.tp_situacao) like '%FALECEU%') > 0  THEN 'PACIENTE FALECIDO'
                   ELSE            
            (select replace(to_char(wmsys.wm_concat('(' || CP.NR_DDD || ') ' || CP.NR_TELEFONE)),',',' / ')
              from CONTATO_PACIENTE CP
              where CP.CD_PACIENTE = F.CD_PACIENTE) END) "fone_paciente"
    FROM
      FAV_LISTA_ESPERA F,
      ITEM_AGENDAMENTO I,
      PACIENTE P,
      CIDADE C,
      FAV_REGISTRO_CONTATO_MARC RC,
      VDIC_FAV_FILA_RETORNOS R,
      AGENDA_CENTRAL AC,
      IT_AGENDA_CENTRAL IT

    WHERE I.CD_ITEM_AGENDAMENTO = F.CD_IT_AGEND
    AND P.CD_PACIENTE = F.CD_PACIENTE
    AND C.CD_CIDADE = P.CD_CIDADE
    AND RC.CD_PACIENTE(+) = F.CD_PACIENTE
    AND R.CD_PACIENTE = F.CD_PACIENTE
    AND AC.CD_AGENDA_CENTRAL = IT.CD_AGENDA_CENTRAL
    AND IT.CD_PACIENTE = F.CD_PACIENTE
    AND AC.CD_SETOR in (${auxQuery})
    AND TRUNC(IT.HR_AGENDA) >= TO_DATE(:dataAgendamentoInicio, 'DD/MM/YYYY')
    AND TRUNC(IT.HR_AGENDA) <= TO_DATE(:dataAgendamentoFim, 'DD/MM/YYYY')`;
}

  if (situacao) {
    auxBinds.situacao = [];

    situacao.forEach((element, index) => {
      binds[`situacao${index}`] = element;
      auxBinds.situacao.push(`:situacao${index}`);
    });

    auxQuery = Object.values(auxBinds.situacao).join(",");
    query += `\nAND F.TP_SITUACAO IN (${auxQuery})`;
  } else {
    query += `\nAND F.TP_SITUACAO IN ('S', 'A', 'G')`;
  }

  if (dataInicio) {
    binds.dataInicio = dataInicio;
    query += `\nAND TRUNC(F.DT_LANCA_LISTA) >= TO_DATE(:dataInicio, 'DD/MM/YYYY')`;
  }

  if (dataFim) {
    binds.dataFim = dataFim;
    query += `\nAND TRUNC(F.DT_LANCA_LISTA) <= TO_DATE(:dataFim, 'DD/MM/YYYY')`;
  }

  if (dataRetornoInicio) {
    binds.dataRetornoInicio = dataRetornoInicio;
    query += `\nAND TRUNC(F.DT_RETORNO) >= TO_DATE(:dataRetornoInicio, 'DD/MM/YYYY')`;
  }

  if (dataRetornoFim) {
    binds.dataRetornoFim = dataRetornoFim;
    query += `\nAND TRUNC(F.DT_RETORNO) <= TO_DATE(:dataRetornoFim, 'DD/MM/YYYY')`;
  }

  if (dataLimiteAgendamento) {
    binds.dataLimiteAgendamento = dataLimiteAgendamento;
    query += `\nAND (TRUNC(F.DT_AGENDAMENTO) <= TO_DATE(:dataLimiteAgendamento, 'DD/MM/YYYY') OR F.DT_AGENDAMENTO IS NULL)`;
  }

  if (prontuario !== "") {
    binds.prontuario = prontuario;

    query = `SELECT
            F.CD_PACIENTE "id_paciente",
            P.NM_PACIENTE "nome_paciente",
            P.TP_SEXO "sexo_paciente",
            TO_CHAR(P.DT_NASCIMENTO, 'DD/MM/YYYY') "nascimento_paciente",
            TRUNC((SYSDATE - P.DT_NASCIMENTO) / 365) "idade_paciente",
            P.NR_CNS "cns_paciente",
            INITCAP(C.NM_CIDADE) || ' - ' || C.CD_UF "cidade_paciente",
            (select replace(to_char(wmsys.wm_concat('(' || CP.NR_DDD || ') ' || CP.NR_TELEFONE)),',',' / ')
              from CONTATO_PACIENTE CP
              where CP.CD_PACIENTE = F.CD_PACIENTE) "fone_paciente"
        FROM
            FAV_LISTA_ESPERA F,
            ITEM_AGENDAMENTO I,
            PACIENTE P,
            CIDADE C,
            FAV_REGISTRO_CONTATO_MARC RC,
            VDIC_FAV_FILA_RETORNOS R

        WHERE I.CD_ITEM_AGENDAMENTO = F.CD_IT_AGEND
        AND P.CD_PACIENTE = F.CD_PACIENTE
        AND C.CD_CIDADE = P.CD_CIDADE
        AND RC.CD_PACIENTE(+) = F.CD_PACIENTE
        AND R.CD_PACIENTE = F.CD_PACIENTE
        AND F.TP_SITUACAO IN ('S', 'A', 'G')
        AND F.CD_PACIENTE = :prontuario`
  }

  if (empresa) {
    auxBinds.empresa = [];

    empresa.forEach((element, index) => {
      binds[`empresa${index}`] = element;
      auxBinds.empresa.push(`:empresa${index}`);
    });

    auxQuery = Object.values(auxBinds.empresa).join(",");
    query += `\nAND F.CD_MULTI_EMPRESA IN (${auxQuery})`;
  }

  if(origem){
    auxBinds.origem = [];
    origem.forEach((element, index)=> {
      binds[`origem${index}`] = element;
      auxBinds.origem.push(`:origem${index}`);
    })

    auxQuery = Object.values(auxBinds.origem).join(",");
    query += `\nAND F.CD_ORI_ATE IN (${auxQuery})`;
  }

  if (itemMarcacao) {
    auxBinds.itemMarcacao = [];

    itemMarcacao.forEach((element, index) => {
      binds[`itemMarcacao${index}`] = element;
      auxBinds.itemMarcacao.push(`:itemMarcacao${index}`);
    });

    auxQuery = Object.values(auxBinds.itemMarcacao).join(",");
    query += `\nAND F.CD_IT_AGEND IN (${auxQuery})`;
  }

  if (tipoItemAgendamento) {
    if (Array.isArray(tipoItemAgendamento)) {
      binds.tipoItemAgendamento0 = tipoItemAgendamento[0];
      binds.tipoItemAgendamento1 = tipoItemAgendamento[1];
      query += `\nAND I.TP_ITEM IN (:tipoItemAgendamento0, :tipoItemAgendamento1)`;
    }  else {
      binds.tipoItemAgendamento = tipoItemAgendamento;
      query += `\nAND I.TP_ITEM = :tipoItemAgendamento`;
    } 
  }

  if (itemAgendamento) {
    auxBinds.itemAgendamento = [];

    itemAgendamento.forEach((element, index) => {
      binds[`itemAgendamento${index}`] = element;
      auxBinds.itemAgendamento.push(`:itemAgendamento${index}`);
    });

    auxQuery = Object.values(auxBinds.itemAgendamento).join(",");
    query += `\nAND F.CD_IT_AGEND  IN (${auxQuery})`;
  }

  if (tipoItemRetorno && itemRetorno) {
    itemRetorno.forEach((item) => {
      binds[`itemRetorno${item}`] = tipoItemRetorno;
      query += `\nAND R.ITEM${item} = :itemRetorno${item}`;
    });
  }

  if (uf) {
    auxBinds.uf = [];

    uf.forEach((element, index) => {
      binds[`uf${index}`] = element;
      auxBinds.uf.push(`:uf${index}`);
    });

    auxQuery = Object.values(auxBinds.uf).join(",");
    query += `\nAND C.CD_UF IN (${auxQuery})`;
  }

  if (cidade) {
    auxBinds.cidade = [];

    cidade.forEach((element, index) => {
      binds[`cidade${index}`] = element;
      auxBinds.cidade.push(`:cidade${index}`);
    });

    auxQuery = Object.values(auxBinds.cidade).join(",");
    query += `\nAND C.CD_CIDADE IN (${auxQuery})`;
  }

  if (prestador) {
    auxBinds.prestador = [];

    prestador.forEach((element, index) => {
      binds[`prestador${index}`] = element;
      auxBinds.prestador.push(`:prestador${index}`);
    });

    auxQuery = Object.values(auxBinds.prestador).join(",");
    query += `\nAND( F.CD_PRESTADOR  IN (${auxQuery})
    OR
    F.CD_PACIENTE IN (
    select iac.cd_paciente
    from it_agenda_central iac
         ,agenda_central   ac
    where iac.cd_agenda_central = ac.cd_agenda_central
    and   ac.cd_prestador in (${auxQuery})
    and   trunc(iac.hr_agenda)  = TRUNC(F.DT_LANCA_LISTA))
    )`;
  }

  if (registro) {
    let naoPossui = Object.values(registro).some(element => element === 'NÃO POSSUI REGISTRO DE CONTATO');
    
    binds.dataInicio = dataInicio;
    auxBinds.registro = [];

    registro.forEach((element, index) => {
      binds[`registro${index}`] = element;
      auxBinds.registro.push(`:registro${index}`);
    });

     auxQuery = Object.values(auxBinds.registro).join(",");
    
    if (naoPossui) {
      query += `\nAND (F.CD_PACIENTE NOT IN (SELECT DISTINCT RC2.CD_PACIENTE
                                            FROM FAV_REGISTRO_CONTATO_MARC RC2
                                            WHERE TRUNC(RC2.DT_REGISTRO) >= TO_DATE(:dataInicio, 'DD/MM/YYYY'))
                      OR F.CD_PACIENTE IN (SELECT DISTINCT RC2.CD_PACIENTE
                        FROM FAV_REGISTRO_CONTATO_MARC RC2
                        WHERE TRUNC(RC2.DT_REGISTRO) >= TO_DATE(:dataInicio, 'DD/MM/YYYY')
                        AND RC2.TP_SITUACAO IN (${auxQuery})))`;

    } else {
      query += `\nAND F.CD_PACIENTE IN (SELECT DISTINCT RC2.CD_PACIENTE
                                        FROM FAV_REGISTRO_CONTATO_MARC RC2
                                        WHERE TRUNC(RC2.DT_REGISTRO) >= TO_DATE(:dataInicio, 'DD/MM/YYYY')
                                        AND RC2.TP_SITUACAO IN (${auxQuery}))`;
    }
    
  }

  if(idadeInicio) {
    binds.idadeInicio = idadeInicio;
    query += `\nAND trunc((sysdate-p.dt_nascimento)/365) >= :idadeInicio`;
  }

  if(idadeFim){
    binds.idadeFim = idadeFim;
    query += `\nAND trunc((sysdate-p.dt_nascimento)/365) <= :idadeFim`;
  }

  if (itemAgendamentoCer) {
    auxBinds.itemAgendamentoCer = [];

    itemAgendamentoCer.forEach((element, index) => {
      binds[`itemAgendamentoCer${index}`] = element;
      auxBinds.itemAgendamentoCer.push(`:itemAgendamentoCer${index}`);
    });

    auxQuery = Object.values(auxBinds.itemAgendamentoCer).join(",");
    query += `\nAND F.CD_IT_AGEND  IN (${auxQuery})`;        

  }

  if(projeto){
    console.log(projeto);
    if(projeto == 1) {
      query += `\nAND F.CD_PACIENTE IN (SELECT O.CD_PACIENTE FROM FAV_ALEM_OLHAR O WHERE O.DT_INCL_PROJ IS NOT NULL AND   O.DT_SAI_PROJ  IS NULL)`;
    }
    if(projeto == 2) {
      query += `\nAND F.CD_PACIENTE IN (SELECT FCP.CD_PACIENTE FROM FAV_CLASS_PAC FCP)`;
    }
    if(projeto == 3) {
      query += `\nAND F.CD_PACIENTE NOT IN (SELECT O.CD_PACIENTE FROM FAV_ALEM_OLHAR O WHERE O.DT_INCL_PROJ IS NOT NULL AND   O.DT_SAI_PROJ  IS NULL)
                \nAND F.CD_PACIENTE NOT IN (SELECT FCP.CD_PACIENTE FROM FAV_CLASS_PAC FCP)`;
    }
  }

  if(tipoPaciente){
    if(tipoPaciente == 1) {
      query += `\nAND (select count(*)
                      from fav_lista_espera le4
                      where le4.cd_paciente = F.CD_PACIENTE
                      and   le4.tp_situacao = 'T'
                      and   le4.cer_sessao is not null) > 0`;
    }
    else if(tipoPaciente == 2){
      query += `\nAND (select count (*)
                        from fav_lista_espera le4
                        where le4.cd_paciente = F.CD_PACIENTE
                        and   le4.tp_situacao in ('T','G','M','A')
                        and   le4.cer_sessao is not null) = 0`; 
      query += `\nAND (select count (*)
                        from fav_lista_espera le5
                        where le5.cd_paciente = F.CD_PACIENTE
                        and   le5.cer_sessao is not null) > 0`;
    }
  }

  if(prioridadeCer){
    if(prioridadeCer == 'true'){
      query += `\nAND F.DS_PRIORI = 'Prioridade CER'`;
    }
  }

  //seleciona paciente da fila de espera -CER
  if(!(tipoPaciente === "" || tipoPaciente === undefined) || !(itemAgendamentoCer === "" || itemAgendamentoCer === undefined) || !(dataAgendamentoInicio === "" ||  dataAgendamentoInicio === undefined) || !(projeto === "" || projeto === undefined)|| !(setor === "" || setor===undefined)|| !(prioridadeCer === "" || prioridadeCer===undefined)) {
    query += `\nAND (F.CD_IT_AGEND IN (select ic.cd_item_agendamento from fav_item_cer4 ic) OR F.CD_ORI_ATE IN (83,84))`;
  }

  if (prontuario !== "") {
    query += `\nGROUP BY F.CD_PACIENTE, P.NM_PACIENTE, P.TP_SEXO, P.DT_NASCIMENTO, TRUNC((SYSDATE - P.DT_NASCIMENTO) / 365), P.NR_CNS, INITCAP(C.NM_CIDADE) || ' - ' || C.CD_UF`;
  }else if(!(dataAgendamentoInicio ==="" || dataAgendamentoInicio === undefined) && !(dataAgendamentoFim ==="" || dataAgendamentoFim === undefined) && !(setor ==="" || setor === undefined)){
    query += `\n GROUP BY F.CD_PACIENTE, P.NM_PACIENTE, P.TP_SEXO, P.DT_NASCIMENTO, TRUNC((SYSDATE - P.DT_NASCIMENTO) / 365), P.NR_CNS, INITCAP(C.NM_CIDADE) || ' - ' || C.CD_UF`;

  }else query += `\nGROUP BY F.CD_PACIENTE, P.NM_PACIENTE, P.TP_SEXO, P.DT_NASCIMENTO, TRUNC((SYSDATE - P.DT_NASCIMENTO) / 365), P.NR_CNS, INITCAP(C.NM_CIDADE) || ' - ' || C.CD_UF,   f.cd_priori,trunc(f.dt_lanca_lista)`;


  console.log("Query: ", query);

  const result = await database.execute(query, binds);

  return result.rows;
};

const getDetails = async (params) => {
  let query = `
    SELECT POSICAO "posicao",
    CD_ITEM_AGENDAMENTO || ' - ' || INITCAP(DS_ITEM_AGENDAMENTO) "item_agendamento",
    TO_CHAR(DT_LANCA_LISTA, 'DD/MM/YYYY') "data_entrada",
    CD_ATENDIMENTO "id_atendimento",
    CD_PRIORI || ' - ' || DS_PRIORI "prioridade",
    TP_SITUACAO "situacao",
    TO_CHAR(DT_AGENDAMENTO, 'DD/MM/YYYY') "data_agendamento",
    TO_CHAR(DT_REALIZACAO, 'DD/MM/YYYY') "data_realizacao",
    TO_CHAR(DT_RETORNO, 'DD/MM/YYYY') "data_retorno"
    FROM VDIC_FAV_FILA_POSICAO
    WHERE TP_SITUACAO != 'C'`;

  const binds = {};

  binds.id_paciente = params.id_paciente;
  query += `\nAND CD_PACIENTE = :id_paciente`;
  query += `
    ORDER BY 
    CASE WHEN TP_SITUACAO = 'S' THEN 1
      WHEN TP_SITUACAO IN ('A', 'G') THEN 2
      WHEN TP_SITUACAO = 'T' THEN 3
      ELSE 4
    END, POSICAO`;

  console.log(query);
  const result = await database.execute(query, binds);
  return result.rows;
};

const registroContato = async (params) => {
  let query = `
      SELECT
      RC.CD_PACIENTE,
      RC.TP_SITUACAO,
      RC.DT_REGISTRO,
      RC.DS_OBSERVACAO,
      RC.CD_USUARIO,
      RC.LOC
      from
      fav_registro_contato_marc rc`;

  const binds = {};

  binds.id_paciente = params.id_paciente;
  query += `\nWHERE rc.CD_PACIENTE = :id_paciente`;
  query += `\nORDER BY rc.dt_registro desc`;

  console.log(query);

  const resultContato = await database.execute(query, binds)
  return resultContato.rows

}

const count = async (params) => {
  let query = `SELECT COUNT(*) "contagem" FROM VDIC_FAV_FILA_GERAL F JOIN VDIC_FAV_FILA_RETORNOS R ON R.CD_PACIENTE = F.CD_PACIENTE`;

  const {
    dataInicio,
    dataFim,
    dataLimiteAgendamento,
    prontuario,
    empresa,
    tipoItemAgendamento,
    itemAgendamento,
    tipoItemRetorno,
    itemRetorno,
    uf,
    cidade,
    situacao,
  } = params;

  const binds = {};
  const auxBinds = {};

  if (situacao) {
    auxBinds.situacao = [];

    situacao.forEach((element, index) => {
      binds[`situacao${index}`] = element;
      auxBinds.situacao.push(`:situacao${index}`);
    });

    auxQuery = Object.values(auxBinds).join(",");
    query += `\nWHERE F.TP_SITUACAO IN (${auxQuery})`;
  } else {
    query += `\nWHERE F.TP_SITUACAO IN ('S')`;
    //, 'A', 'G'
  }

  if (dataInicio) {
    binds.dataInicio = dataInicio;
    query += `\nAND TRUNC(DT_LANCA_LISTA) >= TO_DATE(:dataInicio, 'DD/MM/YYYY')`;
  }

  if (dataFim) {
    binds.dataFim = dataFim;
    query += `\nAND TRUNC(DT_LANCA_LISTA) <= TO_DATE(:dataFim, 'DD/MM/YYYY')`;
  }

  if (dataLimiteAgendamento) {
    binds.dataLimiteAgendamento = dataLimiteAgendamento;
    query += `\nAND (TRUNC(DT_AGENDAMENTO) <= TO_DATE(:dataLimiteAgendamento, 'DD/MM/YYYY') OR DT_AGENDAMENTO IS NULL)`;
  }

  if (prontuario !== "") {
    binds.prontuario = prontuario;
    query += `\nAND F.CD_PACIENTE = :prontuario`;
  }

  if (empresa) {
    auxBinds.empresa = [];

    empresa.forEach((element, index) => {
      binds[`empresa${index}`] = element;
      auxBinds.empresa.push(`:empresa${index}`);
    });

    auxQuery = Object.values(auxBinds.empresa).join(",");
    query += `\nAND CD_MULTI_EMPRESA IN (${auxQuery})`;
  }

  if (tipoItemAgendamento) {
    if (Array.isArray(tipoItemAgendamento)) {
      binds.tipoItemAgendamento0 = tipoItemAgendamento[0];
      binds.tipoItemAgendamento1 = tipoItemAgendamento[1];
      query += `\nAND TP_ITEM IN (:tipoItemAgendamento0, :tipoItemAgendamento1)`;
    } else {
      binds.tipoItemAgendamento = tipoItemAgendamento;
      query += `\nAND TP_ITEM = :tipoItemAgendamento`;
    }
  }

  if (itemAgendamento) {
    auxBinds.itemAgendamento = [];

    itemAgendamento.forEach((element, index) => {
      binds[`itemAgendamento${index}`] = element;
      auxBinds.itemAgendamento.push(`:itemAgendamento${index}`);
    });

    auxQuery = Object.values(auxBinds.itemAgendamento).join(",");
    query += `\nAND CD_ITEM_AGENDAMENTO IN (${auxQuery})`;
  }

  if (tipoItemRetorno && itemRetorno) {
    itemRetorno.forEach((item) => {
      binds[`itemRetorno${item}`] = tipoItemRetorno;
      query += `\nAND R.ITEM${item} = :itemRetorno${item}`;
    });
  }

  if (uf) {
    auxBinds.uf = [];

    uf.forEach((element, index) => {
      binds[`uf${index}`] = element;
      auxBinds.uf.push(`:uf${index}`);
    });

    auxQuery = Object.values(auxBinds.uf).join(",");
    query += `\nAND CD_UF IN (${auxQuery})`;
  }

  if (cidade) {
    auxBinds.cidade = [];

    cidade.forEach((element, index) => {
      binds[`cidade${index}`] = element;
      auxBinds.cidade.push(`:cidade${index}`);
    });

    auxQuery = Object.values(auxBinds.cidade).join(",");
    query += `\nAND CD_CIDADE IN (${auxQuery})`;
  }

  console.log("Query: ", query);
  // console.log("Binds: ", binds);

  const result = await database.execute(query, binds);
  return result.rows;
};

const getOrigens = async(params) => {
  let query = `
  SELECT 
  O.CD_ORI_ATE id,
  O.DS_ORI_ATE ori
  FROM
  ORI_ATE O
  order by o.cd_ori_ate`;

const binds = {};

console.log(query);

const resultOgirens = await database.execute(query, binds)
return resultOgirens.rows
}

const getitensCer = async(params) => {
  let query = `
  select 
  it.cd_item_agendamento id,
  it.ds_item_agendamento item
  from
  fav_item_cer4 it
  order by it.cd_item_agendamento`;

const binds = {};
const resultItens = await database.execute(query, binds);
return resultItens.rows
}

const getDetailsCer = async (params) => {
  let query = `
  SELECT distinct --min(POSICAO) "posicao",
  CD_ITEM_AGENDAMENTO || ' - ' || INITCAP(DS_ITEM_AGENDAMENTO) "item_agendamento",
  TO_CHAR(DT_LANCA_LISTA, 'DD/MM/YYYY') "data_entrada",
  CD_ATENDIMENTO "id_atendimento",
  CD_PRIORI || ' - ' || DS_PRIORI "prioridade",
  CASE WHEN CER_TOT_SES is not null THEN 
    ((select count (LE.CER_SESSAO)
      from FAV_LISTA_ESPERA LE
      where LE.CD_ATENDIMENTO = V.CD_ATENDIMENTO
      and   LE.TP_SITUACAO = 'T') ||'/'||CER_TOT_SES)
      ELSE TO_CHAR(CER_TOT_SES) END "total_sessoes",

  (SELECT (case when LE.OBSERV = 'CANCELADO POR DUPLICIDADE' then null
                when LE.OBSERV LIKE '%CANCELADO POR DUPLICIDADE%' then SUBSTR(OBSERV, INSTR(OBSERV,'-')+1)
                else LE.OBSERV end)
  FROM fav_lista_espera le
  WHERE le.cd_atendimento = V.CD_ATENDIMENTO
  AND   le.cd_it_agend = V.CD_ITEM_AGENDAMENTO
  AND   le.tp_situacao not in ('T','C')
  AND   le.cer_sessao = (select min (le2.cer_sessao)
                        FROM fav_lista_espera le2
                          WHERE le2.cd_atendimento = V.CD_ATENDIMENTO
                          AND   le2.cd_it_agend = V.CD_ITEM_AGENDAMENTO
                          AND   le2.tp_situacao not in ('T','C'))) "observacao",

  CASE WHEN (select count(le2.cer_sessao)
             FROM fav_lista_espera le2
             WHERE le2.cd_atendimento = V.CD_ATENDIMENTO
             AND   le2.cd_it_agend = V.CD_ITEM_AGENDAMENTO) >= 1  THEN 
  (select le.tp_situacao
  from fav_lista_espera le
  where le.cd_atendimento = V.CD_ATENDIMENTO
  and   le.cd_it_agend    = V.CD_ITEM_AGENDAMENTO
  and   le.cer_sessao     = (select min (le2.cer_sessao)
                            FROM fav_lista_espera le2
                             WHERE le2.cd_atendimento = V.CD_ATENDIMENTO
                             AND   le2.cd_it_agend = V.CD_ITEM_AGENDAMENTO
                             AND   le2.tp_situacao not in ('T','C'))
  and   le.tp_situacao not in ('T','C'))
  ELSE TP_SITUACAO END "situacao",

  (select max(TO_CHAR(V2.DT_AGENDAMENTO, 'DD/MM/YYYY'))
              from VDIC_FAV_FILA_POSICAO V2
              where V2.CD_ATENDIMENTO = V.CD_ATENDIMENTO
              AND   V2.CD_ITEM_AGENDAMENTO = V.CD_ITEM_AGENDAMENTO) "data_agendamento",
  TO_CHAR(DT_REALIZACAO, 'DD/MM/YYYY') "data_realizacao",
  TO_CHAR(DT_RETORNO, 'DD/MM/YYYY') "data_retorno"
  FROM VDIC_FAV_FILA_POSICAO V
  WHERE TP_SITUACAO not in ('T','C')
  AND (V.CD_ITEM_AGENDAMENTO IN (select ic.cd_item_agendamento from fav_item_cer4 ic) OR V.CD_ORI_ATE IN (83,84))`;

  const binds = {};
  const auxBinds = {};

  binds.id_paciente = params.id_paciente;
  query += `\nAND CD_PACIENTE = :id_paciente`;
  query += `\nGROUP BY CD_ITEM_AGENDAMENTO || ' - ' || INITCAP(DS_ITEM_AGENDAMENTO), TO_CHAR(DT_LANCA_LISTA, 'DD/MM/YYYY'),CD_ATENDIMENTO, CD_PRIORI || ' - ' || DS_PRIORI, CER_TOT_SES,OBSERV,
  CD_ITEM_AGENDAMENTO ,TP_SITUACAO,TO_CHAR(DT_AGENDAMENTO, 'DD/MM/YYYY'), TO_CHAR(DT_REALIZACAO, 'DD/MM/YYYY'), TO_CHAR(DT_RETORNO, 'DD/MM/YYYY')`;

  //auxBinds.item_agendamento = params.item_agendamento;

  //console.log(item_agendamento);
  /* item_agendamento.forEach((element, index) => {
    binds[`itemAgendamentoCer${index}`] = element;
    auxBinds.item_agendamento.push(`:itemAgendamentoCer${index}`);
  });

  auxQuery = Object.values(auxBinds.item_agendamento).join(",");
  query += `\nAND F.CD_IT_AGEND  IN (${auxQuery})`; */


  query += `
    ORDER BY 
    CASE WHEN "situacao" = 'S' THEN 1
      WHEN "situacao" IN ('A', 'G') THEN 2
      ELSE 4
    END`;

  console.log(query);
  const result = await database.execute(query, binds);
  return result.rows;
};

const getListExcel = async(params) => {

  let query = ` 
  SELECT
      F.CD_PACIENTE "id_paciente",
      P.NM_PACIENTE "nome_paciente",
      F.CD_ATENDIMENTO "atendimento",
      TO_CHAR(F.DT_ATENDIMENTO, 'DD/MM/YYYY') "dt_atend",
      TO_CHAR(P.DT_NASCIMENTO, 'MM/DD/YYYY') "nascimento_paciente",      
      TRUNC((SYSDATE - P.DT_NASCIMENTO) / 365) "idade_paciente",
              
      (select '55'|| CP.NR_DDD || CP.NR_TELEFONE
              from CONTATO_PACIENTE CP
              where CP.CD_PACIENTE = F.CD_PACIENTE
              and cp.sn_padrao = 'S'
              and rownum = 1) "fone1_paciente",
             
       (select '55' || CP.NR_DDD || CP.NR_TELEFONE
              from CONTATO_PACIENTE CP
              where CP.CD_PACIENTE = F.CD_PACIENTE
              and   cp.sn_padrao <> 'S'
              and rownum = 1)"fone2_paciente",
              
      P.NR_CNS "cns_paciente",
      F.CD_IT_AGEND "it_agendamento",
      I.DS_ITEM_AGENDAMENTO "item_agend",
      decode(f.cd_multi_empresa,1,'MATRIZ',2,'ARCOVERDE',3,'SALGUEIRO',4,'JABOATAO',6,'IPOJUCA',7,'PAULISTA',9,'CFAV',11,'SERRA', 12, 'RECIFE') "empresa",
      INITCAP(C.NM_CIDADE) || '-' || C.CD_UF "cidade_paciente"
  FROM
      FAV_LISTA_ESPERA F,
      ITEM_AGENDAMENTO I,
      PACIENTE P,
      CIDADE C,
      FAV_REGISTRO_CONTATO_MARC RC,
      VDIC_FAV_FILA_RETORNOS R

  WHERE I.CD_ITEM_AGENDAMENTO = F.CD_IT_AGEND
  AND P.CD_PACIENTE = F.CD_PACIENTE
  AND C.CD_CIDADE = P.CD_CIDADE
  AND RC.CD_PACIENTE(+) = F.CD_PACIENTE
  AND R.CD_PACIENTE = F.CD_PACIENTE`;

  const {
    dataInicio,
    dataFim,
    dataRetornoInicio,
    dataRetornoFim,
    dataLimiteAgendamento,
    prontuario,
    empresa,
    itemMarcacao,
    tipoItemAgendamento,
    itemAgendamento,
    tipoItemRetorno,
    itemRetorno,
    uf,
    cidade,
    situacao,
    registro,
    origem,
    idadeInicio,
    idadeFim,
    itemAgendamentoCer,
    dataAgendamentoInicio,
    dataAgendamentoFim,
    setor,
    projeto,
    tipoPaciente,
    prestador,
    listProntuarios
  } = params;
  const binds = {};
  const auxBinds = {};

  if(!(itemAgendamentoCer === "" || itemAgendamentoCer === undefined)){
  
       query = `SELECT DISTINCT
        ROW_NUMBER() OVER (ORDER BY F.CD_PRIORI, TRUNC(f.DT_LANCA_LISTA)) "posicao",
        F.CD_PACIENTE "id_paciente",
        P.NM_PACIENTE "nome_paciente",
        P.TP_SEXO "sexo_paciente",
        TO_CHAR(P.DT_NASCIMENTO, 'DD/MM/YYYY') "nascimento_paciente",
        TRUNC((SYSDATE - P.DT_NASCIMENTO) / 365) "idade_paciente",
        P.NR_CNS "cns_paciente",
        INITCAP(C.NM_CIDADE) || ' - ' || C.CD_UF "cidade_paciente",
        ( CASE WHEN (select count(*) from fav_registro_contato_marc rc2 where rc2.cd_paciente = F.CD_PACIENTE and upper(rc2.tp_situacao) like '%FALECEU%') > 0 THEN 'PACIENTE FALECIDO'
                     ELSE            
              (select replace(to_char(wmsys.wm_concat('(' || CP.NR_DDD || ') ' || CP.NR_TELEFONE)),',',' / ')
                from CONTATO_PACIENTE CP
                where CP.CD_PACIENTE = F.CD_PACIENTE) END) "fone_paciente",
                F.CD_ATENDIMENTO "atendimento",
                TO_CHAR(F.DT_LANCA_LISTA, 'DD/MM/YYYY') "data_solic",
                I.CD_ITEM_AGENDAMENTO || ' - ' || INITCAP(I.DS_ITEM_AGENDAMENTO) "item_agendamento",
                
                CASE WHEN F.CER_TOT_SES is not null THEN 
                ((select count (LE.CER_SESSAO)
                  from FAV_LISTA_ESPERA LE
                  where LE.CD_ATENDIMENTO = F.CD_ATENDIMENTO
                  and   LE.TP_SITUACAO = 'T') ||'/'||CER_TOT_SES)
                ELSE TO_CHAR(F.CER_TOT_SES) END "total_sessoes",
                  
                (SELECT (case when LE.OBSERV = 'CANCELADO POR DUPLICIDADE' then null
                          when LE.OBSERV LIKE '%CANCELADO POR DUPLICIDADE%' then SUBSTR(OBSERV, INSTR(OBSERV,'-')+1)
                          else LE.OBSERV end)
                FROM fav_lista_espera le
                WHERE le.cd_atendimento = F.CD_ATENDIMENTO
                AND   le.cd_it_agend = I.CD_ITEM_AGENDAMENTO
                AND   le.tp_situacao not in ('T','C')
                AND   le.cer_sessao = (select min (le2.cer_sessao)
                                      FROM fav_lista_espera le2
                                        WHERE le2.cd_atendimento = F.CD_ATENDIMENTO
                                        AND   le2.cd_it_agend = I.CD_ITEM_AGENDAMENTO
                                        AND   le2.tp_situacao not in ('T','C'))) "observacao",
                                    
                decode((CASE WHEN (select count(le2.cer_sessao)
                           FROM fav_lista_espera le2
                           WHERE le2.cd_atendimento = F.CD_ATENDIMENTO
                           AND   le2.cd_it_agend = I.CD_ITEM_AGENDAMENTO) >= 1  THEN 
                            (select le.tp_situacao
                            from fav_lista_espera le
                            where le.cd_atendimento = F.CD_ATENDIMENTO
                            and   le.cd_it_agend    = I.CD_ITEM_AGENDAMENTO
                            and   le.cer_sessao     = (select min (le2.cer_sessao)
                                                      FROM fav_lista_espera le2
                                                       WHERE le2.cd_atendimento = F.CD_ATENDIMENTO
                                                       AND   le2.cd_it_agend = I.CD_ITEM_AGENDAMENTO
                                                       AND   le2.tp_situacao not in ('T','C'))
                            and   le.tp_situacao not in ('T','C'))
                ELSE F.TP_SITUACAO END )   ,'S','SOLICITADO','A','AGENDADO',F.TP_SITUACAO)"situacao",
                (select max(TO_CHAR(V2.DT_AGENDAMENTO, 'DD/MM/YYYY'))
                from VDIC_FAV_FILA_POSICAO V2
                where V2.CD_ATENDIMENTO = F.CD_ATENDIMENTO
                AND   V2.CD_ITEM_AGENDAMENTO = I.CD_ITEM_AGENDAMENTO) "data_agendamento"
      FROM
        FAV_LISTA_ESPERA F,
        ITEM_AGENDAMENTO I,
        PACIENTE P,
        CIDADE C,
        FAV_REGISTRO_CONTATO_MARC RC,
        VDIC_FAV_FILA_RETORNOS R,
        AGENDA_CENTRAL AC,
        IT_AGENDA_CENTRAL IT
  
      WHERE I.CD_ITEM_AGENDAMENTO = F.CD_IT_AGEND
      AND P.CD_PACIENTE = F.CD_PACIENTE
      AND C.CD_CIDADE = P.CD_CIDADE
      AND RC.CD_PACIENTE(+) = F.CD_PACIENTE
      AND R.CD_PACIENTE = F.CD_PACIENTE
      AND AC.CD_AGENDA_CENTRAL = IT.CD_AGENDA_CENTRAL
      AND IT.CD_PACIENTE = F.CD_PACIENTE`;
  }

  if (situacao) {
    auxBinds.situacao = [];

    situacao.forEach((element, index) => {
      binds[`situacao${index}`] = element;
      auxBinds.situacao.push(`:situacao${index}`);
    });

    auxQuery = Object.values(auxBinds.situacao).join(",");
    query += `\nAND F.TP_SITUACAO IN (${auxQuery})`;
  } else {
    query += `\nAND F.TP_SITUACAO IN ('S', 'A', 'G')`;
  }

  if (listProntuarios) {
    auxBinds.listProntuarios = [];

    listProntuarios.forEach((element, index) => {
      binds[`listProntuarios${index}`] = element;
      auxBinds.listProntuarios.push(`:listProntuarios${index}`);
    });

    auxQuery = Object.values(auxBinds.listProntuarios).join(",");
    query += `\nAND F.CD_PACIENTE  IN (${auxQuery})`;
  }

  if (dataInicio) {
    binds.dataInicio = dataInicio;
    query += `\nAND TRUNC(F.DT_LANCA_LISTA) >= TO_DATE(:dataInicio, 'DD/MM/YYYY')`;
  }

  if (dataFim) {
    binds.dataFim = dataFim;
    query += `\nAND TRUNC(F.DT_LANCA_LISTA) <= TO_DATE(:dataFim, 'DD/MM/YYYY')`;
  }

  if (dataRetornoInicio) {
    binds.dataRetornoInicio = dataRetornoInicio;
    query += `\nAND TRUNC(F.DT_RETORNO) >= TO_DATE(:dataRetornoInicio, 'DD/MM/YYYY')`;
  }

  if (dataRetornoFim) {
    binds.dataRetornoFim = dataRetornoFim;
    query += `\nAND TRUNC(F.DT_RETORNO) <= TO_DATE(:dataRetornoFim, 'DD/MM/YYYY')`;
  }

  if (dataLimiteAgendamento) {
    binds.dataLimiteAgendamento = dataLimiteAgendamento;
    query += `\nAND (TRUNC(F.DT_AGENDAMENTO) <= TO_DATE(:dataLimiteAgendamento, 'DD/MM/YYYY') OR F.DT_AGENDAMENTO IS NULL)`;
  }

  if (prontuario !== "") {
    binds.prontuario = prontuario;

    query = ` 
        SELECT
            F.CD_PACIENTE "id_paciente",
            P.NM_PACIENTE "nome_paciente",
            F.CD_ATENDIMENTO "atendimento",
            TO_CHAR(F.DT_ATENDIMENTO, 'DD/MM/YYYY') "dt_atend",
            TO_CHAR(P.DT_NASCIMENTO, 'MM/DD/YYYY') "nascimento_paciente",      
            TRUNC((SYSDATE - P.DT_NASCIMENTO) / 365) "idade_paciente",
                    
            (select '55'|| CP.NR_DDD || CP.NR_TELEFONE
                    from CONTATO_PACIENTE CP
                    where CP.CD_PACIENTE = F.CD_PACIENTE
                    and cp.sn_padrao = 'S'
                    and rownum = 1) "fone1_paciente",
                  
            (select '55' || CP.NR_DDD || CP.NR_TELEFONE
                    from CONTATO_PACIENTE CP
                    where CP.CD_PACIENTE = F.CD_PACIENTE
                    and   cp.sn_padrao <> 'S'
                    and rownum = 1)"fone2_paciente",
                    
            P.NR_CNS "cns_paciente",
            F.CD_IT_AGEND "it_agendamento",
            I.DS_ITEM_AGENDAMENTO "item_agend",
            decode(f.cd_multi_empresa,1,'MATRIZ',2,'ARCOVERDE',3,'SALGUEIRO',4,'JABOATAO',6,'IPOJUCA',7,'PAULISTA',9,'CFAV',11,'SERRA', 12, 'RECIFE') "empresa",
            INITCAP(C.NM_CIDADE) || '-' || C.CD_UF "cidade_paciente"
        FROM
            FAV_LISTA_ESPERA F,
            ITEM_AGENDAMENTO I,
            PACIENTE P,
            CIDADE C,
            FAV_REGISTRO_CONTATO_MARC RC,
            VDIC_FAV_FILA_RETORNOS R

        WHERE I.CD_ITEM_AGENDAMENTO = F.CD_IT_AGEND
        AND P.CD_PACIENTE = F.CD_PACIENTE
        AND C.CD_CIDADE = P.CD_CIDADE
        AND RC.CD_PACIENTE(+) = F.CD_PACIENTE
        AND R.CD_PACIENTE = F.CD_PACIENTE
        AND F.TP_SITUACAO IN ('S', 'A', 'G')
        AND F.CD_PACIENTE = :prontuario`
  }

  if (empresa) {
    auxBinds.empresa = [];

    empresa.forEach((element, index) => {
      binds[`empresa${index}`] = element;
      auxBinds.empresa.push(`:empresa${index}`);
    });

    auxQuery = Object.values(auxBinds.empresa).join(",");
    query += `\nAND F.CD_MULTI_EMPRESA IN (${auxQuery})`;
  }

  if(origem){
    auxBinds.origem = [];
    origem.forEach((element, index)=> {
      binds[`origem${index}`] = element;
      auxBinds.origem.push(`:origem${index}`);
    })

    auxQuery = Object.values(auxBinds.origem).join(",");
    query += `\nAND F.CD_ORI_ATE IN (${auxQuery})`;
  }

  if (itemMarcacao) {
    auxBinds.itemMarcacao = [];

    itemMarcacao.forEach((element, index) => {
      binds[`itemMarcacao${index}`] = element;
      auxBinds.itemMarcacao.push(`:itemMarcacao${index}`);
    });

    auxQuery = Object.values(auxBinds.itemMarcacao).join(",");
    query += `\nAND F.CD_IT_AGEND IN (${auxQuery})`;
  }

  if (tipoItemAgendamento) {
    if (Array.isArray(tipoItemAgendamento)) {
      binds.tipoItemAgendamento0 = tipoItemAgendamento[0];
      binds.tipoItemAgendamento1 = tipoItemAgendamento[1];
      query += `\nAND I.TP_ITEM IN (:tipoItemAgendamento0, :tipoItemAgendamento1)`;
    }  else {
      binds.tipoItemAgendamento = tipoItemAgendamento;
      query += `\nAND I.TP_ITEM = :tipoItemAgendamento`;
    } 
  }

  if (itemAgendamento) {
    auxBinds.itemAgendamento = [];

    itemAgendamento.forEach((element, index) => {
      binds[`itemAgendamento${index}`] = element;
      auxBinds.itemAgendamento.push(`:itemAgendamento${index}`);
    });

    auxQuery = Object.values(auxBinds.itemAgendamento).join(",");
    query += `\nAND F.CD_IT_AGEND  IN (${auxQuery})`;
  }

  if (tipoItemRetorno && itemRetorno) {
    itemRetorno.forEach((item) => {
      binds[`itemRetorno${item}`] = tipoItemRetorno;
      query += `\nAND R.ITEM${item} = :itemRetorno${item}`;
    });
  }

  if (uf) {
    auxBinds.uf = [];

    uf.forEach((element, index) => {
      binds[`uf${index}`] = element;
      auxBinds.uf.push(`:uf${index}`);
    });

    auxQuery = Object.values(auxBinds.uf).join(",");
    query += `\nAND C.CD_UF IN (${auxQuery})`;
  }

  if (cidade) {
    auxBinds.cidade = [];

    cidade.forEach((element, index) => {
      binds[`cidade${index}`] = element;
      auxBinds.cidade.push(`:cidade${index}`);
    });

    auxQuery = Object.values(auxBinds.cidade).join(",");
    query += `\nAND C.CD_CIDADE IN (${auxQuery})`;
  }

  if (prestador) {
    auxBinds.prestador = [];

    prestador.forEach((element, index) => {
      binds[`prestador${index}`] = element;
      auxBinds.prestador.push(`:prestador${index}`);
    });

    auxQuery = Object.values(auxBinds.prestador).join(",");
    query += `\nAND( F.CD_PRESTADOR  IN (${auxQuery})
    OR
    F.CD_PACIENTE IN (
    select iac.cd_paciente
    from it_agenda_central iac
         ,agenda_central   ac
    where iac.cd_agenda_central = ac.cd_agenda_central
    and   ac.cd_prestador in (${auxQuery})
    and   trunc(iac.hr_agenda)  = TRUNC(F.DT_LANCA_LISTA))
    )`;
  }

  
  if(registro) {
    let naoPossui = Object.values(registro).some(element => element === 'NÃO POSSUI REGISTRO DE CONTATO');
    
    binds.dataInicio = dataInicio;
    auxBinds.registro = [];

    registro.forEach((element, index) => {
      binds[`registro${index}`] = element;
      auxBinds.registro.push(`:registro${index}`);
    });

     auxQuery = Object.values(auxBinds.registro).join(",");
    
    if (naoPossui) {
      query += `\nAND (F.CD_PACIENTE NOT IN (SELECT DISTINCT RC2.CD_PACIENTE
                                            FROM FAV_REGISTRO_CONTATO_MARC RC2
                                            WHERE TRUNC(RC2.DT_REGISTRO) >= TO_DATE(:dataInicio, 'DD/MM/YYYY'))
                      OR F.CD_PACIENTE IN (SELECT DISTINCT RC2.CD_PACIENTE
                        FROM FAV_REGISTRO_CONTATO_MARC RC2
                        WHERE TRUNC(RC2.DT_REGISTRO) >= TO_DATE(:dataInicio, 'DD/MM/YYYY')
                        AND RC2.TP_SITUACAO IN (${auxQuery})))`;

    } else {
      query += `\nAND F.CD_PACIENTE IN (SELECT DISTINCT RC2.CD_PACIENTE
                                        FROM FAV_REGISTRO_CONTATO_MARC RC2
                                        WHERE TRUNC(RC2.DT_REGISTRO) >= TO_DATE(:dataInicio, 'DD/MM/YYYY')
                                        AND RC2.TP_SITUACAO IN (${auxQuery}))`;
    }
    
  }

  if(idadeInicio) {
    binds.idadeInicio = idadeInicio;
    query += `\nAND trunc((sysdate-p.dt_nascimento)/365) >= :idadeInicio`;
  }

  if(idadeFim){
    binds.idadeFim = idadeFim;
    query += `\nAND trunc((sysdate-p.dt_nascimento)/365) <= :idadeFim`;
  }

  if (setor) {
    auxBinds.setor = [];

    setor.forEach((element, index) => {
      binds[`setor${index}`] = element;
      auxBinds.setor.push(`:setor${index}`);
    });

    auxQuery = Object.values(auxBinds.setor).join(",");
    query += `\nAND AC.CD_SETOR in (${auxQuery})`;
  }

  if (itemAgendamentoCer) {
    auxBinds.itemAgendamentoCer = [];

    itemAgendamentoCer.forEach((element, index) => {
      binds[`itemAgendamentoCer${index}`] = element;
      auxBinds.itemAgendamentoCer.push(`:itemAgendamentoCer${index}`);
    });

    auxQuery = Object.values(auxBinds.itemAgendamentoCer).join(",");
    query += `\nAND F.CD_IT_AGEND  IN (${auxQuery})`;        

  }

  if(projeto){
    console.log(projeto);
    if(projeto == 1) {
      query += `\nAND F.CD_PACIENTE IN (SELECT O.CD_PACIENTE FROM FAV_ALEM_OLHAR O WHERE O.DT_INCL_PROJ IS NOT NULL AND   O.DT_SAI_PROJ  IS NULL)`;
    } 
    if(projeto == 2) {
      query += `\nAND F.CD_PACIENTE IN (SELECT FCP.CD_PACIENTE FROM FAV_CLASS_PAC FCP)`;
    } 
  }

  if(tipoPaciente){
    if(tipoPaciente == 1) {
      query += `\nAND (select count(*)
                      from fav_lista_espera le4
                      where le4.cd_paciente = F.CD_PACIENTE
                      and   le4.tp_situacao = 'T'
                      and   le4.cer_sessao is not null) > 0`;
    }
    else if(tipoPaciente == 2){
      query += `\nAND (select count (*)
                        from fav_lista_espera le4
                        where le4.cd_paciente = F.CD_PACIENTE
                        and   le4.tp_situacao in ('T','G','M','A')
                        and   le4.cer_sessao is not null) = 0`; 
      query += `\nAND (select count (*)
                        from fav_lista_espera le5
                        where le5.cd_paciente = F.CD_PACIENTE
                        and   le5.cer_sessao is not null) > 0`;
    }
  }
  //seleciona paciente da fila de espera -CER
  if(!(tipoPaciente === "" || tipoPaciente === undefined) || !(itemAgendamentoCer === "" || itemAgendamentoCer === undefined) || !(dataAgendamentoInicio === "" ||  dataAgendamentoInicio === undefined) || !(projeto === "" || projeto === undefined)|| !(setor === "" || setor===undefined)) {
    query += `\nAND (F.CD_IT_AGEND IN (select ic.cd_item_agendamento from fav_item_cer4 ic) OR F.CD_ORI_ATE IN (83,84))`;
  }

  if (prontuario !== "") {
    query += `\nGROUP BY F.CD_PACIENTE, P.NM_PACIENTE,F.CD_ATENDIMENTO,F.DT_ATENDIMENTO, P.DT_NASCIMENTO, TRUNC((SYSDATE - P.DT_NASCIMENTO) / 365), P.NR_CNS, F.CD_IT_AGEND, I.DS_ITEM_AGENDAMENTO, F.CD_MULTI_EMPRESA,  INITCAP(C.NM_CIDADE) || '-' || C.CD_UF`;
  }else if(!(dataAgendamentoInicio ==="" || dataAgendamentoInicio === undefined) && !(dataAgendamentoFim ==="" || dataAgendamentoFim === undefined) && !(setor ==="" || setor === undefined)){
    query += `\nGROUP BY F.CD_PACIENTE, P.NM_PACIENTE, P.DT_NASCIMENTO, TRUNC((SYSDATE - P.DT_NASCIMENTO) / 365), P.NR_CNS, F.CD_IT_AGEND, I.DS_ITEM_AGENDAMENTO, F.CD_MULTI_EMPRESA,  INITCAP(C.NM_CIDADE) || '-' || C.CD_UF`;
  }else if(!(itemAgendamentoCer === "" || itemAgendamentoCer === undefined)){
    query += `\n GROUP BY F.CD_PACIENTE, P.NM_PACIENTE, P.TP_SEXO, P.DT_NASCIMENTO, TRUNC((SYSDATE - P.DT_NASCIMENTO) / 365), P.NR_CNS, INITCAP(C.NM_CIDADE) || ' - ' || C.CD_UF,   f.cd_priori,trunc(f.dt_lanca_lista),F.CD_ATENDIMENTO,TO_CHAR(F.DT_LANCA_LISTA, 'DD/MM/YYYY'),I.CD_ITEM_AGENDAMENTO || ' - ' || INITCAP(I.DS_ITEM_AGENDAMENTO),F.CER_TOT_SES,F.OBSERV,F.TP_SITUACAO,I.CD_ITEM_AGENDAMENTO`;
    query += `\n  ORDER BY ROW_NUMBER() OVER (ORDER BY F.CD_PRIORI, TRUNC(f.DT_LANCA_LISTA))`;
    
  }else query += `\nGROUP BY F.CD_PACIENTE, P.NM_PACIENTE,F.CD_ATENDIMENTO,F.DT_ATENDIMENTO, P.DT_NASCIMENTO, TRUNC((SYSDATE - P.DT_NASCIMENTO) / 365), P.NR_CNS, F.CD_IT_AGEND, I.DS_ITEM_AGENDAMENTO, F.CD_MULTI_EMPRESA,  INITCAP(C.NM_CIDADE) || '-' || C.CD_UF`;


  console.log("Query: ", query);

  const result = await database.execute(query, binds);

  return result.rows;
};

module.exports = { get, getDetails, count, registroContato, getOrigens, getitensCer, getDetailsCer, getListExcel };