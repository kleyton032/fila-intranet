const express = require("express");
const router = new express.Router();
const cirurgia = require("../controllers/cirurgiaController");

router.route("/listar").get(cirurgia.get);
router.route("/listar/cid").get(cirurgia.relatorioCheck);
router.route("/relatorios/sintetico").get(cirurgia.relatorioSintetico);

module.exports = router;
