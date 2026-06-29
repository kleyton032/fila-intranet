const itemAgendamento = require("../models/ItemAgendamento.js");

const get = async (req, res, next) => {
  try {
    const rows = await itemAgendamento.get(req.query);

    let result = rows.sort((a, b) => {
      return a.item_agendamento < b.item_agendamento ? -1 : 1;
    });

    if (rows.length > 0) {
      res.status(200).json(result);
    } else {
      res.status(404).end();
    }
  } catch (error) {
    next(error);
  }
};

// const getByTipo = async (req, res, next) => {
//   try {
//     const params = req.query;

//     const rows = await itemAgendamento.get(params);

//     let result = rows.sort((a, b) => {
//       return a.item_agendamento < b.item_agendamento ? -1 : 1;
//     });

//     if (rows.length > 0) {
//       res.status(200).json(result);
//     } else {
//       res.status(404).end();
//     }
//   } catch (err) {
//     throw err;
//   }
// };

module.exports = { get };
