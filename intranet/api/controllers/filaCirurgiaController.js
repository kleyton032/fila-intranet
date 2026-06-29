const filaCirurgia = require("../models/FilaCirurgia.js");

const get = async (req, res, next) => {
  try {
    const params = req.query;
    console.log(params)

    const rows = await filaCirurgia.getFilaCirurgica(params);

    if (rows.length > 0) {
      res.status(200).json(rows);
    } else {
      res.status(204).end();
    }
  } catch (error) {
    console.log(error)
    next(error);
  }
};

module.exports = { get };