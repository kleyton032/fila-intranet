const express = require("express");
const router = new express.Router();
const atendimentos = require("../controllers/atendimentosController");

router.route("/relatorios/covid19/casos").get(atendimentos.atendimentosCovid19);
router
  .route("/relatorios/por-hora")
  .get(atendimentos.relatorioAtendimentosPorHora);
router
  .route("/relatorios/por-classificacao")
  .get(atendimentos.relatorioAtendimentosPorClassificacao);
router.route("/relatorios/evasoes").get(atendimentos.relatorioEvasoes);
module.exports = router;
