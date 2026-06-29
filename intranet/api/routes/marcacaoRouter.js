const express = require("express");
const router = new express.Router();
const marcacao = require("../controllers/marcacaoController");

router
  .route("/relatorios/pre-agendamento-cirurgico")
  .get(marcacao.relatorioPreAgendamentoCirurgico);

router.route("/listar/lente").get(marcacao.listarLentePreAgendamento);

module.exports = router;
