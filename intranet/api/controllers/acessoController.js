const usuario = require("../models/Usuario");
const ldap = require('ldapjs');
const ActiveDirectory = require('activedirectory');
const database = require("../databases/mvPrd");
const jwt = require("jsonwebtoken");
const authConfig = require('../config/auth');
const Usuario = require("../models/Usuario");


class AcessoController {

    //PERFIL GERENCIAL
    async listUser(req, res, next) {

        const userAD = req.body.user;

        const config = {
            url: process.env.LDAP_URL || 'ldap://192.168.8.13',
            baseDN: process.env.LDAP_BASE_DN || 'dc=fav,dc=com,dc=br',
            username: process.env.LDAP_BIND_USER,
            password: process.env.LDAP_BIND_PASSWORD
        }

        //instância do AD - Passando as config
        const ad = new ActiveDirectory(config);

        var query = `cn=*${userAD}*`;
         ad.findUsers(query, function (err, users) {
            if (err) {
                console.log('ERROR: ' + JSON.stringify(err));
                return;
            }

            if ((!users) || (users.length == 0)){
                console.log('Usuário não existe no AD');
                return res.json({error: "Usuário não existe no AD"})
            } else {
                console.log('findUsers: ' + JSON.stringify(users));
                return res.send(
                    { 
                        users
                    }
                 )

            }
        });
    }

    //INSERÇÃO DE DADOS NO ORACLE

    // VERIFICAÇÃO SE EXISTER NO AD

    //FAZER CONTROLE DE ACESSO DOS USUÁRIOS

    //REALIZAR TESTE DE USUÁRIO NO REACT COM AD - TESTE FUNCIONAL - APENAS SUPORTE
}

module.exports = new AcessoController();

