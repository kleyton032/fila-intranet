const express = require("express");
const registroContatoController = require("../controllers/registroContatoController");
const { registrarContato } = require("../models/RegistroContato");
const router = new express.Router();

router.route("/listRegistro").get(registroContatoController.getContato);
router.route("/registrar").post(registroContatoController.insereRegistro);
router.route("/getRegistro").get(registroContatoController.listRegistroContato);


module.exports = router;