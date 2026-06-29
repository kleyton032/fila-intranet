const express = require("express");
const router = new express.Router();
const portalRetina = require("../controllers/portalRetinaController");

router.route("/listar").get(portalRetina.get);
router.route("/itens_retina/listar").get(portalRetina.getItensPRetina);

module.exports = router;