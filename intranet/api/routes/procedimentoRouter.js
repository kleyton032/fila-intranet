const express = require("express");
const router = new express.Router();
const procedimento = require("../controllers/procedimentoController");

router.route("/listar").get(procedimento.get);

module.exports = router;
