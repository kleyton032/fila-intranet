const cirurgias = require("../models/Cirurgia.js");

const get = async (req, res, next) => {
  try {
    const context = {};

    const rows = await cirurgias.get(context);

    if (rows.length > 0) {
      res.status(200).json(rows);
    } else {
      res.status(404).end();
    }
  } catch (error) {
    next(error);
  }
};

const relatorioSintetico = async (req, res, next) => {
  try {
    const { cirurgia, dataInicio, dataFim } = req.query;

    const rows = await cirurgias.listSinteticReport(
      cirurgia,
      dataInicio,
      dataFim
    );
    if (rows.length > 0) {
      res.status(200).json(rows);
    } else {
      res.status(204).json([]);
    }
  } catch (error) {
    next(error);
  }
};

const relatorioCheck = async (req, res, next) => {
  try {

    const params = req.query;
    const rows = await cirurgias.listCid(params);

    if (rows.length > 0) {
      res.status(200).json(rows);
    } else {
      res.send({error: "Não existe regitros para pesquisa"});
    }
  } catch (error) {
    next(error);
  }
}

module.exports = { get, relatorioSintetico, relatorioCheck };
