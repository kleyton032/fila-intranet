const usuario = require("../models/Usuario");
var _ = require('underscore');
const ActiveDirectory = require('activedirectory');
const jwt = require("jsonwebtoken");
const authConfig = require('../config/auth');

class UsuarioController {

    async get(req, res, next) {
        try {
            const rows = await usuario.get(req.query);

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

     async getListUsers(req, res, next) {
    
        const userAD = req.body.user;

        const config = {
                url: process.env.LDAP_URL || 'ldap://192.168.8.13',
                baseDN: process.env.LDAP_BASE_DN || 'dc=fav,dc=com,dc=br',
                username: process.env.LDAP_BIND_USER,
                password: process.env.LDAP_BIND_PASSWORD
        }
            var ad = new ActiveDirectory(config);

            var result = `cn=*${userAD}*`;

         ad.findUsers(result, (err, user) => {
                if (err) {
                    console.log('ERROR: ' +JSON.stringify(err));
                    return;
                  }
                
                  if (! user) console.log('Usuário:' + user + 'não existe no AD.');
                  else {
                    res.status(200).json(user);
                    console.log(JSON.stringify(user));
                  }
        })
    }


    async auth(req, res, next) {
        const config = {
            url: process.env.LDAP_URL || 'ldap://192.168.8.13',
            baseDN: process.env.LDAP_BASE_DN || 'dc=fav,dc=com,dc=br',
            username: process.env.LDAP_ADMIN_USER,
            password: process.env.LDAP_ADMIN_PASSWORD
        }

        const ad = new ActiveDirectory(config);
        const user = req.body.user;
        const senha = req.body.senha;

        let userD = `${user + "@fav.com.br"}`
   
       ad.authenticate(userD, senha, async (err, auth) => {
            try {
                
                if (err) {
                    console.log('ERROR: ' + JSON.stringify(err));
                    res.status(400).json({ error: "Usuário ou Senha Inválidos" });
                }
                if (auth) {
                    console.log('Sucesso', user);
                } else {
                    res.status(400).json({ error: "Error na autenticação" });
                }

                const result = await usuario.verificarAcesso(user) 
                
                if (result.length > 0) {
                    
                    const rowsID = result.map((item) => {
                        return item.CD_ID
                    })

                    const rowsPerfis = result.map((item) => {
                        return item.CD_TELA
                    })

                    const rowsCdUsuario = result.map((item) => {
                        return item.CD_USUARIO
                    })
                    
                    const id = rowsID[0];
                    const perfis = rowsPerfis
                    console.log(id)
                    console.log(perfis)
                    console.log(rowsCdUsuario);
                    var token = await jwt.sign({ id }, 
                        authConfig.secret, {
                        expiresIn: authConfig.expiresIn // expires in 5min
                    });  
                    res.status(200).json({usuario: rowsCdUsuario[0], perfis: perfis, token: token});
                } else {
                    res.status(204).json({true: "ok"});
                }    


            } catch (error) {
                console.log(error)
                next(error);
            }
        });
    }
}

module.exports = new UsuarioController();