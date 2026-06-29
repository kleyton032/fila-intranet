const registroContato = require("../models/RegistroContato");
var _ = require('underscore');

class RegistroContato {

    async getContato(req, res, next) {
        try {
            const rows = await registroContato.getContato(req.query);

            if (rows.length > 0) {
                res.status(200).json(rows);
            } else {
                res.status(204).end();
            }
        } catch (error) {
            next(error);
        }
    };

    async insereRegistro(req, res, next) {
        try {

            const { paciente, statusPac, user, obs, contato, loc } = req.body

            if (!paciente || !statusPac || !user || !obs || !contato || !loc) {
                return res.status(422).json({ error: "Preencha todos os campos para o cadastro." })
            }
            const rows = await registroContato.register(paciente, statusPac, user, obs, contato, loc)
            res.status(200).json(rows);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    async listRegistroContato(req, res, next) {

        try {
            const list = await registroContato.listRegistroContato(req.query);
          
            if (list.length > 0) {
                res.status(200).json(list);

            } else {
                res.status(400).json({ error: "Não Há dados a serem retornados" });
            }
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new RegistroContato();