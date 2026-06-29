const express = require("express");
const router = new express.Router();
const paciente = require("../controllers/pacienteController");

router.route("/getPaciente").get(paciente.get);

module.exports = router;