import React, { useState, useEffect } from "react";
import axios from "axios";
import "antd/dist/antd.css";
import { Image, Spin } from 'antd'
import { Button, Grid, GridList,Checkbox } from "@material-ui/core";
import LabelInput from "../../components/label/label-text/labelText";
import Input from "../../components/input/Input";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import { verificarAcessoArquivo } from "../../middleware/verificarAcesso/acessoFilaEspera";
//import Icon from '@material-ui/core/Icon';
//import GridList from '@material-ui/core/GridList'
//import { Container } from "react-bootstrap";
//import { ImageList, ImageListItem, ImageListItemBar, IconButton } from '@material-ui/core';



const ArquivoImages = (props) => {

    const [id_paciente, setId_paciente] = useState("");
    const [data, setData] = useState("");
    const [loading, setLoading] = useState("");
    const [loaded, setLoaded] = useState(false);
    const [checkedImagesId, setCheckedImagesId] = useState ([]);

    useEffect(() => {
        verificarAcessoArquivo();
      },[]);
    

    const loadData = async () => {

        setData([]);

        if (id_paciente !== "") {
            setLoading(true);
            const params = {
                id_paciente: id_paciente,
            };


            setLoaded(true);

            let result = await axios.get("http://192.168.4.28:5000/api/imagens/listar/", {
                params: params,
            });

            if (result.status === 200) {

                const results = result.data.map(item => ({
                    seq: item.SEQ,
                    identificador: item.IDENTIFICADOR,
                    doc: item.DOC,

                }))
                setData(results)

            } else {
                setData([]);
            }
        } else {
            alert("Preencha o prontuário para realizar a pesquisa!");
            setData([]);
        }

        setLoading(false);
    };


    const handleIdPaciente = (value) => {
        setId_paciente(value)
    };

    function handleCheckImage(checked, value)  {
        console.log(checked);
        console.log(value);
        
        if (checked == false) {
            setCheckedImagesId(
                (state) => {
                    return state.filter((id) => {
                        return id != value
                    });
                });
        } else {
            setCheckedImagesId([...checkedImagesId, value])
        }
        console.log(checkedImagesId)
    }

    const excluirGed = async (id) => {
        console.log(id)
        await axios.post(`http://192.168.4.28:5000/api/imagens/excluir/`, {id})
        .then((response)=> {
            console.log(response.status);
            if (response.status === 200) {
                alert("Foto(s) Excluída(s) com Sucesso");
               }
            loadData()
        })
        .catch((error)=>{
            const { data } = error.response;
            alert(data.error); 
            console.log(data.error);
        })
    }

    return (
        <div>
            <h1>GED IMAGENS</h1>

            <Grid item lg={2} md={3} sm={12}>
                <LabelInput title={"Prontuário"} />
                <Input
                    id="idpaciente"
                    value={id_paciente}
                    onChange={(event) => handleIdPaciente(event.target.value)}
                    mask="99999999"
                />

            </Grid>

            <Grid container item justify="flex-end" spacing={3}>
                <Grid item lg={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={loadData}
                        fullWidth
                        startIcon={<SearchOutlinedIcon />}
                    >
                        Carregar
                    </Button>
                </Grid>
            </Grid>

            <div>

                {loaded ? (
                    loading ? (
                        <Spin spinning={loaded} size="large" />
                    ) : (
                        <React.Fragment>
                            {/* <GridList >
                            {data.map(({ seq, identificador, doc }) => (
                                <Grid item lg={2} md={10} sm={10}>
                                    
                                    <Image
                                            width={500}
                                            src={`http://gemmius.fav.com.br/GetImage.aspx?path=${doc}`}
                                    />
                                    
                                     <Grid item lg={2}> 
                                            <Button type="submit" onClick={() => {
                                                myFunction(identificador)
                                            }}
                                                color="secondary"
                                                fullWidth
                                                variant="contained"
                                            >

                                                EXCLUIR
                                            </Button>
                                         </Grid> 
                                </Grid>
                                
                            ))}

                            </GridList> */}
                            <GridList cellHeight={'auto'} cols={3}>
                            {data.map(({ seq, identificador, doc }) => (
                                <Grid key={seq}>
                                    <Grid item lg={2} md={3} sm={12}>
                                        <LabelInput title={`PÁGINA ${seq}`} />
                                        <Image
                                            width={500}
                                            src={`http://gemmius.fav.com.br/GetImage.aspx?path=${doc}`}
                                        />
                                        <Grid container md={3} sm={12} lg={11} >
                                            <Checkbox
                                                value = {identificador}
                                                onChange={
                                                    (event) => {
                                                    handleCheckImage(event.target.checked,event.target.value)
                                                    }}
                                            />
                                            
                                           
                                        </Grid>
                                    </Grid>
                                </Grid>
                            ))
                            }
                            </GridList>
                                <Button       
                                    type="submit"  
                                    onClick={() => {
                                                const escolha = window.confirm(
                                                    'Deseja realmente excluir os documentos selecionados?'
                                                );
                                                if (escolha) {
                                                    excluirGed(checkedImagesId)
                                                    //const x = data.indexOf(identificador)
                                                    //console.log(x)
                                                };
                                            }}
                                                color="success"
                                                fullWidth
                                                variant="contained"
                                >

                                                EXCLUIR  <ArrowUpwardIcon fullWidth/>
                                                
                                </Button> 
                        </React.Fragment>
                    )
                ) : (
                    <React.Fragment></React.Fragment>
                )}
            </div >
        </div >
    )
}

export default ArquivoImages;