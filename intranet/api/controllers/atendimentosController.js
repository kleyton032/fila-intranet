const atendimentos = require("../models/Atendimentos.js");

const atendimentosCovid19 = async (req, res, next) => {
  try {
    const { dataInicio, dataFim } = req.query;

    const rows = await atendimentos.atendimentosCovid19(dataInicio, dataFim);
    console.warn({rows})

    if (rows.length > 0) {
      res.status(200).json([rows]);
    } else {
      res.status(204).json([]);
    }
  } catch (error) {
    console.log(error)
    next(error);
  }
};

const relatorioAtendimentosPorHora = async (req, res, next) => {
  try {
    const { dataInicio, dataFim, empresas, setores } = req.query;

    const rows = await atendimentos.relatorioAtendimentosPorHora(
      dataInicio,
      dataFim,
      empresas,
      setores
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

const relatorioAtendimentosPorClassificacao = async (req, res, next) => {
  try {
    const { dataInicio, dataFim } = req.query;

    const rows = await atendimentos.relatorioAtendimentosPorClassificacao(
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

const relatorioEvasoes = async (req, res, next) => {
  try {
    const { dataInicio, dataFim } = req.query;

    const rows = await atendimentos.relatorioEvasoes(dataInicio, dataFim);
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
  atendimentosCovid19,
  relatorioAtendimentosPorHora,
  relatorioAtendimentosPorClassificacao,
  relatorioEvasoes,
};
