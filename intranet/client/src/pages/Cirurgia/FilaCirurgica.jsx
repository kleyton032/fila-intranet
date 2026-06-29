import React, { useEffect, useState } from 'react';
import axios from "axios";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import Helmet from "react-helmet";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Input from "../../components/input/Input";
import Title from "../../components/layout/Title";
import { connect } from "react-redux";
import { Table, Spin, Tag } from "antd";
import "antd/dist/antd.css";
import moment from 'moment';
import { green, red, yellow } from '@material-ui/core/colors';

const RelatorioPreAgendamento = (props) => {

    const [data, setData] = useState([]);
    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");
    const [prontuario, setProntuario] = useState("");
    const [loaded, setLoaded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isFiltersExpanded, setIsFiltersExpanded] = useState(true);


    useEffect(() => {
        console.log(prontuario)
    }, []);


    const handleClickFilters = () => {
        setIsFiltersExpanded(!isFiltersExpanded);
    };

    const handleChangeDataInicio = (value) => {
        setDataInicio(value);
    };

    const handleChangeDataFim = (value) => {
        setDataFim(value);
    };

    const handleChangeProntuario = (value) => {
        setProntuario(value);
    };

    const loadData = async () => {

        if ((dataInicio !== "" && dataFim !== "") || prontuario !== "") {

            setLoading(true);

            const params = {
                dataInicio: dataInicio,
                dataFim: dataFim,
                prontuario: prontuario
            };


            console.log(params.prontuario);
            console.log(params.dataFim);
            console.log(params.dataInicio);

            setLoaded(true);

            let result = await axios.get("http://192.168.4.28:5000/api/fila_cirurgia/listar/", {
                params: params,
            });

            if (result.status === 200) {

                const results = result.data.map(item => ({
                    key: item.posicao,
                    prontuario: item.prontuario,
                    nm_paciente: item.nome_paciente,
                    cirurgia: item.cirurgia,
                    entrada: moment(item.entrada_fila).format('DD/MM/YYYY hh:mm:ss'),
                    status_sangue: item.status_exa_sangue,
                    status_cardio: item.status_exa_cardio,
                    grupo: item.grupo,
                    olho: item.olho,
                    dt_nas: moment(item.DT_NAS).format('DD/MM/YYYY')
                }))

                setData(results);

            } else {
                setData([]);
            }

        } else {
            alert("Preencha as datas ou o prontuário para realizar a pesquisa!");
        }

        setLoading(false);
    };

    const columns = [
        { title: "Posição", dataIndex: "key", key: "key" },
        { title: "Prontuário", dataIndex: "prontuario", key: "prontuario" },
        { title: "Nome", dataIndex: "nm_paciente", key: "nm_paciente" },
        { title: "Cirurgia", dataIndex: "cirurgia", key: "cirurgia" },
        { title: "Entrada", dataIndex: "entrada", key: "entrada" },

        {
            title: "Exame Sangue", dataIndex: "status_sangue", key: "status_sangue",
            render: (status_sangue) => {
                let color = '';

                switch (status_sangue) {
                    case "SEM EXAMES NA FAV":
                        color = yellow[800];
                        break;
                    case "EM DIA":
                        color = green[600];
                        break;
                    case "VENCIDO":
                        color = red[500];
                        break;
                    default:
                        color = color;
                }
                return (
                    <Tag color={color} key={status_sangue}>
                        {status_sangue}
                    </Tag>
                );
            }
        },

        {
            title: "Exame Cardio", dataIndex: "status_cardio", key: "status_cardio",
            render: (status_cardio) => {
                let color = '';

                switch (status_cardio) {
                    case "SEM EXAMES NA FAV":
                        color = yellow[800];
                        break;
                    case "EM DIA":
                        color = green[600];
                        break;
                    case "VENCIDO":
                        color = red[500];
                        break;
                    default:
                        color = color;
                }
                return (
                    <Tag color={color} key={status_cardio}>
                        {status_cardio}
                    </Tag>
                );
            }
        },

        { title: "Grupo", dataIndex: "grupo", key: "grupo" },
        { title: "Olho", dataIndex: "olho", key: "olho" },

    ];

    return (
        <div>
            <Helmet title="Cirurgias e Agendamentos" />
            <Title
                title="Relatório Cirurgico e Pré Agendamento"
                root="Fila de Espera Cirurgica"
                isFiltersExpanded={isFiltersExpanded}
                handleClickFilters={handleClickFilters}
            >
                <Grid container spacing={3}>
                    <Grid container item spacing={3}>
                        <Grid item lg={2} md={3} sm={12}>
                            <Input
                                id="dataInicio"
                                label="Data Início"
                                value={dataInicio}
                                onChange={(event) => handleChangeDataInicio(event.target.value)}
                                mask="99/99/9999"
                            />
                        </Grid>

                        <Grid item lg={2} md={3} sm={12}>
                            <Input
                                id="dataFim"
                                label="Data Fim"
                                value={dataFim}
                                onChange={(event) => handleChangeDataFim(event.target.value)}
                                mask="99/99/9999"
                            />
                        </Grid>

                        <Grid item lg={2} md={3} sm={12}>
                            <Input
                                id="prontuario"
                                label="Prontuario"
                                value={prontuario}
                                onChange={(event) => handleChangeProntuario(event.target.value)}
                            />
                        </Grid>


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
                </Grid>
            </Title>

            {loaded ? (
                loading ? (
                    <Spin spinning={loaded} size="large" />
                ) : (
                    <React.Fragment>
                        <Card style={{ marginBottom: "10px" }}>
                            <CardContent>
                                <div>Fila de Espera Cirurgica</div>
                            </CardContent>
                        </Card>

                        <Table
                            className="components-table-demo-nested"
                            size="small"
                            columns={columns}
                            //expandable={{ expandedRowRender, onExpand }}
                            dataSource={data}
                            //rowSelection={{ ...rowSelection }}
                            pagination={true}
                        //   onRow={(record) => ({
                        //     onClick: () => {
                        //       setRowId(record.key);
                        //       getRegistroContato(record.key);
                        //       console.log(record);
                        //       handleClickOpen();
                        //     },
                        //   })}
                        />
                    </React.Fragment>
                )
            ) : (
                <React.Fragment></React.Fragment>
            )}
        </div>
    );

}

export default connect((store) => ({
    list: store.listReducer,
}))(RelatorioPreAgendamento);