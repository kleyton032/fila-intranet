const express = require("express");
const router = new express.Router();
const setor = require("../controllers/setorController");

router.route("/listar").get(setor.get);

module.exports = router;
