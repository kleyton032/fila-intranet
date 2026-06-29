const prestador = require("../models/Prestador.js");

const get = async (req, res, next) => {
  try {
    
    const rows = await prestador.get(req.query);

    if (rows.length > 0) {
      res.status(200).json(rows);
    } else {
      res.status(404).end();
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { get };
