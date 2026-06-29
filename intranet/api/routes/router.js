const express = require("express");
const router = new express.Router();
const cirurgia = require("./cirurgiaRouter");
const atendimentos = require("./atendimentosRouter");
const procedimento = require("./procedimentoRouter");
const empresa = require("./empresaRouter");
const setor = require("./setorRouter");
const marcacao = require("./marcacaoRouter");
const prestador = require("./prestadorRouter");
const cidade = require("./cidadeRouter");
const filaEspera = require("./filaEsperaRouter");
const itemAgendamento = require("./itemAgendamentoRouter");
const usuario = require("./usuarioRouter");
const acesso = require("./acessoRouter");
const contato = require("./registroContatoRouter");
const filaCirurgia = require("./filaCirurgiaRouter");
const portalRetina = require("./portalRetinaRouter");
const arquivo = require("./arquivoRouter");
const paciente = require("./pacienteRouter");

router.use("/cirurgia", cirurgia);
router.use("/atendimentos", atendimentos);
router.use("/procedimentos", procedimento);
router.use("/empresas", empresa);
router.use("/setores", setor);
router.use("/marcacao", marcacao);
router.use("/prestador", prestador);
router.use("/cidade", cidade);
router.use("/fila_espera", filaEspera);
router.use("/item_agendamento", itemAgendamento);
router.use("/usuarios", usuario);
router.use("/acesso", acesso);
router.use("/contato", contato);
router.use("/fila_cirurgia", filaCirurgia);
router.use("/portalRetina", portalRetina);
router.use("/imagens", arquivo);
router.use("/paciente", paciente)

module.exports = router;
