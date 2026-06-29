const express = require("express");
const usuarioController = require("../controllers/usuarioController");
const router = new express.Router();

router.route("/login").post(usuarioController.auth);
router.route("/listar").get(usuarioController.get);
router.route("/listUsers").post(usuarioController.getListUsers);


module.exports = router;
