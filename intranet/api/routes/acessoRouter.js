const express = require("express");
const router = new express.Router();
const acesso = require("../controllers/acessoController");

router.route("/list").post(acesso.listUser);

module.exports = router;