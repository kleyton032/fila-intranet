const procedimento = require("../models/Procedimento.js");

const get = async (req, res, next) => {
  try {
    const context = {};

    const rows = await procedimento.get(context);

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
