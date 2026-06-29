const marcacao = require("../models/Marcacao.js");

const relatorioPreAgendamentoCirurgico = async (req, res, next) => {
  try {
    const {
      dataInicio,
      dataFim,
      dataExameInicio,
      dataExameFim,
      idadeMin,
      idadeMax,
      medicoSolicitante,
      medicoCirurgia,
      cirurgia,
      cidade,
      ret,
      lente,
    } = req.query;

    const rows = await marcacao.relatorioPreAgendamentoCirurgico(
      dataInicio,
      dataFim,
      dataExameInicio,
      dataExameFim,
      idadeMin,
      idadeMax,
      medicoSolicitante,
      medicoCirurgia,
      cirurgia,
      cidade,
      ret,
      lente
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

const listarLentePreAgendamento = async (req, res, next) => {
  try {
    const rows = await marcacao.getLentePreAgendamento();

    if (rows.length > 0) {
      res.status(200).json(rows);
    } else {
      res.status(204).json([]);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  relatorioPreAgendamentoCirurgico,
  listarLentePreAgendamento,
};
