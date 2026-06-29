const express = require("express");
const router = new express.Router();
const filaEspera = require("../controllers/filaEsperaController");

router.route("/listar").get(filaEspera.get);
router.route("/listar/detalhes").get(filaEspera.getDetails);
router.route("/listar/contato").get(filaEspera.contatoPaciente);
router.route("/contar").get(filaEspera.count);
router.route("/origens/listar").get(filaEspera.getOrigens);
router.route("/itens_cer/listar").get(filaEspera.getItensCerIV);
router.route("/listar/detalhesCer").get(filaEspera.getDetailsCer);
router.route("/listar/excel").get(filaEspera.getListExcel);

module.exports = router;
