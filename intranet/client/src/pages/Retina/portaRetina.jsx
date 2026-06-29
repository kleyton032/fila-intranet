import React, { useState, useEffect } from "react";
import axios from "axios";
import { connect } from "react-redux";
import {
    getListItensRetina
} from '../../redux/actions/listActions';
import Grid from "@material-ui/core/Grid";
import { Table, Tag, Spin, Select, Form, Tooltip } from "antd";
import "antd/dist/antd.css";
import Selected from "../../components/input/Select";
import LabelInput from "../../components/label/label-text/labelText";
import Input from "../../components/input/Input";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import { Button } from "@material-ui/core";
import green from "@material-ui/core/colors/green";
import orange from "@material-ui/core/colors/orange";
import red from "@material-ui/core/colors/red";
import moment from 'moment';
import Title from "../../components/layout/Title";
import Helmet from "react-helmet";
import blue from "@material-ui/core/colors/blue";
import grey from '@material-ui/core/colors/grey';
import yellow from '@material-ui/core/colors/yellow';
import Item from "antd/lib/list/Item";

const PortalRetina = (props) => {

    const { list, dispatch } = props;
    const [data, setData] = useState([])
    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");
    const [loaded, setLoaded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [filtros, setFiltros] = useState({
        itensRetina: [],
        filtroSituacao: [],

    })
    const [listItensRetina, setListItensRetina] = useState(list.itensRetina)

    const loadGetFiltros = (filtroName, value) => {
        setFiltros({ ...filtros, [filtroName]: value });
    };

    const handleChangeDataInicio = (value) => {
        setDataInicio(value)
    }

    const handleChangeDataFim = (value) => {
        setDataFim(value)
    }

    const loadItensRetina = () => {
        if (listItensRetina.length === 0) {
            dispatch(getListItensRetina());
        }
    }

    useEffect(() => {
        setListItensRetina(list.itensRetina);
    }, [list.itensRetina])

    const columns = [
        { title: "Prontuário", dataIndex: "key", key: "key" },
        { title: "Nome", dataIndex: "Nome", key: "Nome" },
        { title: "Tipo Solicitação", dataIndex: "TipoSolicitacao", key: "TipoSolicitacao" },
        { title: "Data Solicitação", dataIndex: "DataSolicitacao", key: "DataSolicitacao" },
        { title: "Data Retorno", dataIndex: "DataRetorno", key: "DataRetorno" },
        { title: "Observação", dataIndex: "Obs", key: "Obs" },
        {
            title: "Situação", dataIndex: "Situacao", key: "Situacao",
            render: (Situacao) => {
                let color = '';

                switch (Situacao) {
                    case "PERTO DO PRAZO":
                        color = orange[800];
                        break;
                    case "NO PRAZO":
                        color = green[600];
                        break;
                    case "EM ATRASO":
                        color = red[500];
                        break;
                    default:
                        color = color;
                }
                return (
                    <Tag color={color} key={Situacao}>
                        {Situacao}
                    </Tag>
                );
            }
        },
    ];

    const situacao = [
        { id: 1, situacao: 'NO PRAZO' },
        { id: 2, situacao: 'PERTO DO PRAZO' },
        { id: 3, situacao: 'EM ATRASO' }
    ]

    const loadData = async () => {
        setData([]);

        if ((dataInicio != "" && dataFim != "")) {
            setLoading(true);   
            const params = {
                dataInicio: dataInicio,
                dataFim: dataFim, 
                // prontuario: prontuario,
                // idadeIncio: idadeIncio,
                // idadeFim: idadeFim
            };

            if (filtros.itensRetina.length > 0) {
                params.itensRetina = filtros.itensRetina.map((value) => {
                    return value.ID;
                });
            }

            if (filtros.filtroSituacao) {
                params.filtroSituacao = filtros.filtroSituacao.map((value) => {
                    return value.id;
                });
            }

            setLoaded(true);

            let result = await axios.get("http://192.168.4.28:5000/api/portalRetina/listar/", {
                params: params,
            });

            if (result.status === 200) {

                const results = result.data.map(item => ({
                    key: item.id_paciente,
                    Nome: item.nome_paciente,
                    TipoSolicitacao: item.tipo_solicitacao,
                    DataSolicitacao: moment(item.data_solicitacao).format('DD/MM/YYYY'),
                    DataRetorno: item.data_retorno,
                    Obs: item.observacao,
                    Situacao: item.situacao,

                }))
                setData(results);

            } else {
                setData([]);
            }
        } else {
            alert("Preencha as datas e/ou os itens para realizar a pesquisa!");
            setData([]);
        }

        setLoading(false);

    }

    return (
        <div>
            <Helmet title="Portal Retina" />
            <Title title="Consultas" root="Retina" isFiltersExpanded={null} handleClickFilters={null} />
            <br />
            <Grid container spacing={4}>

                <Grid container item spacing={3}>

                    <Grid item lg={2} md={3} sm={12}>
                        <LabelInput title={"Dt.Início"} />
                        <Input
                            id="dataInicio"
                            value={dataInicio}
                            onChange={(event) => handleChangeDataInicio(event.target.value)}
                            mask="99/99/9999"
                        />
                    </Grid>

                    <Grid item lg={2} md={3} sm={12}>
                        <LabelInput title={"Dt.Fim"} />
                        <Input
                            id="dataFim"
                            value={dataFim}
                            onChange={(event) => handleChangeDataFim(event.target.value)}
                            mask="99/99/9999"
                        />
                    </Grid>

                    <Grid item lg={4} md={3} sm={12}>
                        <LabelInput title={"Item Retina"} />
                        <Selected
                            id="filtroItensRetina"
                            multiple
                            onOpen={() => loadItensRetina()}
                            onChange={(event, value) => loadGetFiltros("itensRetina", value)}
                            options={listItensRetina}
                            label={["ID", "ITEM"]}
                            title="Escolha"
                        />

                    </Grid>

                    <Grid item lg={2} md={3} sm={12}>
                        <LabelInput title={"Situação"} />
                        <Selected
                            id="filtroSituacao"
                            multiple
                            onChange={(event, value) => loadGetFiltros("filtroSituacao", value)}
                            options={situacao}
                            label={"situacao"}
                            title="Escolha"
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


            {loaded ? (
                loading ? (
                    <Spin spinning={loaded} size="large" />
                ) : (
                    <React.Fragment>
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
    )
}

export default connect((store) => ({
    list: store.listReducer,
}))(PortalRetina);

