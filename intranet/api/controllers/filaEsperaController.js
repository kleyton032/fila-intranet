const filaEspera = require("../models/FilaEspera.js");

const get = async (req, res, next) => {
  try {
    const params = req.query;
    //console.log(params)

    const rows = await filaEspera.get(params);

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

const getDetails = async (req, res, next) => {
  try {
    const params = req.query;

    if ("id_paciente" in params) {
      const rows = await filaEspera.getDetails(params);

      if (rows.length > 0) {
        rows.forEach((row) => {
          switch (row.situacao) {
            case "S":
              row.situacao = "Solicitado";
              break;
            case "A":
            case "G":
              row.situacao = "Agendado";
              break;
            case "C":
              row.situacao = "Cancelado";
              row.posicao = "-";
              break;
            case "T":
              row.situacao = "Atendido";
              row.posicao = "-";
              break;
          }
        });

        if(rows.length > 0){
          rows.forEach((row) => {
            switch(row.prioridade){
              case " - " :
                row.prioridade = "N/A"
                break
            }
          })
        }

        if(rows.length > 0){
          rows.forEach((row) => {
            switch(row.posicao){ 
              case "-" :
                row.posicao = "N/A"
                break
            }
          })
        }


        res.status(200).json(rows);
      } else {
        res.status(204).end();
      }
    } else {
      res.status(204).end();
    }
  } catch (err) {
    next(err);
  }
};

const contatoPaciente = async(req, res, next) => {
  try {
    const params = req.query;

    if ("id_paciente" in params) {
      
      const rows = await filaEspera.registroContato(params);

      if (rows.length > 0) {
        res.status(200).json(rows);
      }else {
        res.status(204).json({msg:"Não existe dados para esse paciente"});
      }
    } 
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const count = async (req, res, next) => {
  try {
    const params = req.query;

    const rows = await filaEspera.count(params);
    console.log(rows);

    if (rows.length > 0) {
      res.status(200).json(rows);
    } else {
      res.status(204).end();
    }
  } catch (error) {
    next(error);
  }
};

const getOrigens = async(req, res, next) => {
  try {
    const params = req.query;

    const rows = await filaEspera.getOrigens(params);
    console.log(rows);

    if (rows.length > 0) {
      res.status(200).json(rows);
    } else {
      res.status(204).end();
    }
  } catch (error) {
    next(error);
  }
};

const getItensCerIV = async (request, responde, next) => {
  try {
    const params = request.query;

    const rows = await filaEspera.getitensCer(params);
    
    if (rows.length > 0) {
      responde.status(200).json(rows);
    } else {
      responde.status(204).end();
    }
  } catch (error) {
    next(error);
  }
};

const getDetailsCer = async (req, res, next) => {
  try {
    const params = req.query;

    if ("id_paciente" in params) {
      const rows = await filaEspera.getDetailsCer(params);

      if (rows.length > 0) {
        rows.forEach((row) => {
          switch (row.situacao) {
            case "S":
              row.situacao = "Solicitado";
              break;
            case "A":
            case "G":
              row.situacao = "Agendado";
              break;
            case "C":
              row.situacao = "Cancelado";
              row.posicao = "-";
              break;
          }
        });

        if(rows.length > 0){
          rows.forEach((row) => {
            switch(row.prioridade){
              case " - " :
                row.prioridade = "N/A"
                break
            }
          })
        }

        if(rows.length > 0){
          rows.forEach((row) => {
            switch(row.posicao){ 
              case "-" :
                row.posicao = "N/A"
                break
            }
          })
        }


        res.status(200).json(rows);
      } else {
        res.status(204).end();
      }
    } else {
      res.status(204).end();
    }
  } catch (err) {
    next(err);
  }
};  

const getListExcel = async (req, res, next) => {
  try {
    const params = req.query;
    //console.log(params)

    const rows = await filaEspera.getListExcel
  (params);

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

module.exports = { get, getDetails, count, contatoPaciente, getOrigens, getItensCerIV, getDetailsCer, getListExcel };
