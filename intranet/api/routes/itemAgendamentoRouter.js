const express = require("express");
const router = new express.Router();
const itemAgendamento = require("../controllers/ItemAgendamentoController");

router.route("/listar").get(itemAgendamento.get);
// router.route("/listar_por_tipo").get(itemAgendamento.get);

module.exports = router;
