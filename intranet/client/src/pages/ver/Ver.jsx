import React, { Component } from "react";
import Button from '../../components/buttons/buttonVerExames';
import fundo from '../../img/ver-fundo2.jpeg';

class Ver extends Component {

    async visualizarExames() {
        return await window.open("http://favsrvexm/fav_exames/m_pep_visualiza/todos_pacientes/?pesquisa=&t=n", "_blank");

    }

    async salvarExames() {
        return await window.open("http://favsrvexm/fav_exames/m_pep/todos_pacientes/?pesquisa=&t=n", "_blank");
    }

    render() {
        return (
            <div className="container-center">
                <img src={fundo} width="80%" style={{ marginBottom: 20 }} alt="fundo" />
                       
                       <div className="verDivButton">
                       <Button label="Visualizar" onClick={() => this.visualizarExames()} />
                       <Button label="Anexar" onClick={() => this.salvarExames()} />
                       </div>
                       
                       
            </div>
        )
    }
}

export default Ver;


