const arquivo = require('../models/Arquivo');


const getImages = async (req, res, next) => {

  try {

    const params = req.query;

    const rows = await arquivo.getImagesId(params)

    if (rows.length > 0) {
      res.status(200).json(rows);
    } else {
      res.status(404).end();
    }
  } catch (error) {
    next(error);
  }
}


const excluiFoto = async (req, res, next) => {
  try {

    const identificadores = req.body;
    const rows = await arquivo.excluirFotoGed(identificadores.id)
    res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    next(error);
  }
}

module.exports = {
  getImages,
  excluiFoto
}