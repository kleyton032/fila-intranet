
const database = require("../databases/mvPrd");

const getFilaCirurgica = async (params) => {

  const {
    dataInicio,
    dataFim,
  } = params
  const binds = {};
  const auxBinds = {};

  let query = ` 
      select
          ROW_NUMBER() OVER(ORDER BY cast(pi.dt_pedido as date) asc) "posicao",
            pi.cd_paciente "prontuario",
            pi.nm_paciente"nome_paciente",
            pic.cd_cirurgia  ||   '-'  ||  c.ds_cirurgia "cirurgia",
            pi.dt_pedido "entrada_fila",
            c.cd_cirurgia_integra "grupo",
            pi.ds_obs "obs",
            (select
            substr(ta.ds_tip_anest, instr(ta.ds_tip_anest, 'L-') + 2)
            from 
            tip_anest ta
            where ta.cd_tip_anest = PI.CD_TIP_ANEST) "olho",
            
            (select 
            COUNT(*)
            from
            atendime a
            where a.cd_atendimento = PI.CD_SEQ_INTEGRA
            and a.nm_usuario_alta = PI.NM_USUARIO_PRE_INTERNACAO
            and c.Cd_Cirurgia <> 28
            )"validacao_pre",

            (select
              case 
                when  MONTHS_BETWEEN(trunc(sysdate), max(ev.dt_eve_siasus)) > 10 then 'VENCIDO'
                when  MONTHS_BETWEEN(trunc(sysdate), max(ev.dt_eve_siasus)) <= 10 then 'EM DIA'
                when  max(ev.dt_eve_siasus) is null then 'SEM EXAMES NA FAV'
                  END
                
       
       from
       eve_siasus ev
       where ev.cd_paciente = PI.CD_PACIENTE
       and trunc(cast(ev.dt_eve_siasus as date))<= trunc(cast(PI.DT_PEDIDO as date))
       and ev.cd_procedimento  = 0202020380) "status_exa_sangue",
       
       
       (select
              case 
                when  MONTHS_BETWEEN(trunc(sysdate), max(ev.dt_eve_siasus)) > 10 then 'VENCIDO'
                when  MONTHS_BETWEEN(trunc(sysdate), max(ev.dt_eve_siasus)) <= 10 then 'EM DIA'
                when  max(ev.dt_eve_siasus) is null then 'SEM EXAMES NA FAV'
                  END
                
       
       from
       eve_siasus ev
       where ev.cd_paciente = PI.CD_PACIENTE
       and trunc(cast(ev.dt_eve_siasus as date))<= trunc(cast(PI.DT_PEDIDO as date))
       and ev.cd_procedimento  = 0211020036) "status_exa_cardio",
            
            
            (select max(cast(ev.dt_eve_siasus as date))
            from
            eve_siasus ev
            where ev.cd_paciente = PI.CD_PACIENTE
            and trunc(cast(ev.dt_eve_siasus as date))<= trunc(cast(PI.DT_PEDIDO as date))
            and ev.cd_procedimento = 0202020380) "exame_sangue", -- PROCEDIMENTO HEMOGRAMA
            
            (select max(cast(ev.dt_eve_siasus as date))
            from
            eve_siasus ev
            where ev.cd_paciente = PI.CD_PACIENTE
            and trunc(cast(ev.dt_eve_siasus as date))<= trunc(cast(PI.DT_PEDIDO as date))
            and ev.cd_procedimento = 0211020036) "exame_cardio", -- PROCEDIMENTO ELETRO
            
            (select  
            replace(to_char(wmsys.wm_concat(DECODE(CA.CD_VIA_DE_ACESSO, 1, 'OD', 2, 'OE', 'AO'))),',',' / ')
            from
            aviso_cirurgia ac,
            cirurgia_aviso ca
            where ac.cd_aviso_cirurgia = ca.cd_aviso_cirurgia 
            and ac.cd_paciente = PI.CD_PACIENTE
            and ca.cd_cirurgia = PIC.CD_CIRURGIA
            and trunc(cast(ac.dt_inicio_cirurgia as date)) >= trunc(cast(PI.DT_PEDIDO as date)))"olho_operado"
                  
                  
            from
            pre_internacao pi,
            pre_internacao_cirurgia pic,
            cirurgia c
            where pi.cd_pre_internacao = pic.cd_pre_internacao 
            and pic.cd_cirurgia = c.cd_cirurgia 
            and c.ds_cirurgia not like '%CFAV%'
            and pi.status = 'S'
            and pi.cd_aviso_internacao is null`



  if (dataInicio) {
    binds.dataInicio = dataInicio;
    query += `\nAND TRUNC(pi.dt_pedido) >= TO_DATE(:dataInicio, 'DD/MM/YYYY')`;
  }

  if (dataFim) {
    binds.dataFim = dataFim;
    query += `\nAND TRUNC(pi.dt_pedido) <= TO_DATE(:dataFim, 'DD/MM/YYYY')`;
  }

  const result = await database.execute(query, binds);

  return result.rows;

}

const getPreAgendamentoDetails = async (params) => {

  const {
    prontuario
  } = params

  let query = `
      select
      pi.cd_pre_internacao cd_pre,
      pic.cd_cirurgia || ' - ' || c.ds_cirurgia cir,
      pi.dt_sugestao_cirurgia DT_SUG, 
      decode(pi.status,'A','MARCADO','C','CONTATO','N','CANCELADO','S','SOLICITADO','L','LIBERADO','G','AGUARDANDO','INDEFINIDO')status_pre,
      ac.dt_cancelamento, 
      pi.cd_aviso_internacao,  
      ac.cd_aviso_cirurgia,
      decode(ac.tp_situacao,'R','REALIZADA','C','CANCELADO', 'G', 'AGENDADA', 'A', 'EM AVISO', 'T', 'CONTROLE DE CHECAGEM')STATUS_CIR,
      pi.nm_paciente,
      ac.dt_realizacao,
      ac.dt_inicio_cirurgia 
      from
      pre_internacao pi,
      pre_internacao_cirurgia pic,
      cirurgia c,
      aviso_cirurgia ac
      where pi.cd_aviso_internacao = ac.cd_aviso_cirurgia
      and   pi.cd_pre_internacao   = pic.cd_pre_internacao
      and   pic.cd_cirurgia        = c.cd_cirurgia`;

  const binds = {};

  binds.prontuario = params.prontuario;
  query += `\nAND pi.cd_paciente = :prontuario`;
  //query += `order by pi.dt_sugestao_cirurgia`;

  console.log(query);
  const result = await database.execute(query, binds);
  return result.rows;
}

module.exports = { getFilaCirurgica, getPreAgendamentoDetails };