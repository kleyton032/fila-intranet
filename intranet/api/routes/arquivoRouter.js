const express = require("express");
const router = new express.Router();
const arquivo = require("../controllers/arquivoController");

router.route("/listar").get(arquivo.getImages);
router.route("/excluir").post(arquivo.excluiFoto);


module.exports = router;