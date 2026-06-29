const express = require("express");
const router = new express.Router();
const filaCirurgia = require("../controllers/filaCirurgiaController");

router.route("/listar").get(filaCirurgia.get);


module.exports = router;