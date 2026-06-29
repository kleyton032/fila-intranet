const express = require("express");
const router = new express.Router();
const empresa = require("../controllers/empresaController");

router.route("/listar").get(empresa.get);

module.exports = router;
