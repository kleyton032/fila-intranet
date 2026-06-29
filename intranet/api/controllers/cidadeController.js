const cidade = require("../models/Cidade.js");

const get = async (req, res, next) => {
  try {
    const rows = await cidade.get(req.query);

    let result = rows.sort((a, b) => {
      return a.cidade < b.cidade ? -1 : 1;
    });

    console.log(result);

    if (rows.length > 0) {
      res.status(200).json(result);
    } else {
      res.status(204).end();
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { get };
