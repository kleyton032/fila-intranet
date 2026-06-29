const express = require("express");
const router = new express.Router();
const cidade = require("../controllers/cidadeController");

router.route("/listar").get(cidade.get);

module.exports = router;
