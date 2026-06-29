const database = require("../databases/mvPrd");
//const config = require('../config/activeDirectory');
var ActiveDirectory = require('activedirectory');

class Usuario {

    async get() {
        let query = `select * from fav_usuario_intranet`;

        console.log(query)
        const result = await database.execute(query);
        return result.rows;
    }

    //verificar na base do oracle usuario
    async auth(username) {
        let query = `select * from fav_usuario_intranet where nm_usuario='${username}'`;

        if(username === ''){
            return JSON.stringify({error: "Erro no acesso ao banco de dados"})
        }else{
            console.log(query);
            const result = await database.execute(query)
            if(result.length == 0){
                return JSON.stringify({error: "Erro"})
            }
            return result.rows;
        }
    }

    //verificar os acesso na base do oracle - premissões telas
    async verificarAcesso(user){
        try {
            let query = 
            `select
            ui.CD_ID, 
            au.cd_tela,
            au.cd_usuario
            from 
            fav_acessos_usuarios au,
            fav_usuario_intranet ui
            where ui.cd_usuario = au.cd_usuario
            and ui.nm_usuario='${user}'`;
            
            if(user == ''){
                return JSON.stringify({error: "Erro no acesso ao banco"})
            }else{
                const result = await database.execute(query)
                //console.log(user);
                if(result.length == 0){
                    return JSON.stringify({error: "Erro, nenhum retorno"})
                }
                console.log(result)
                return result.rows;
            }
            

        } catch (error) {
            console.log('Error', error);
        }
    }
    
    

       
}
module.exports = new Usuario;