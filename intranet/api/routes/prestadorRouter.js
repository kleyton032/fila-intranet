const express = require("express");
const router = new express.Router();
const prestador = require("../controllers/prestadorController");

router.route("/listar").get(prestador.get);

module.exports = router;
