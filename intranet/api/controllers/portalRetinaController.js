const portalRetina = require("../models/PortalRetina.js");

const get = async (req, res, next) => {
    try {
      const params = req.query;
      
      console.log(params)
  
      const rows = await portalRetina.get(params);
  
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

const getItensPRetina = async (request, responde, next) => {
  try {
    const params = request.query;

    const rows = await portalRetina.getitensRetina(params);
    
    if (rows.length > 0) {
      responde.status(200).json(rows);
    } else {
      responde.status(204).end();
    }
  } catch (error) {
    next(error);
  }
}

module.exports = { get, getItensPRetina};