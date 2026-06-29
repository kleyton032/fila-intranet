import React, { useState, useEffect } from "react";
import axios from "axios";
import { connect } from "react-redux";
import {
    getListItemCer
} from '../../redux/actions/listActions';

import { Table, Tag, Spin, Select, Form, Tooltip, Checkbox } from "antd";
import "antd/dist/antd.css";
import Grid from "@material-ui/core/Grid";
import Selected from "../../components/input/Select";
import LabelInput from "../../components/label/label-text/labelText";
import Input from "../../components/input/Input";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import { Button, TextField } from "@material-ui/core";
import green from "@material-ui/core/colors/green";
import orange from "@material-ui/core/colors/orange";
import red from "@material-ui/core/colors/red";
import blue from "@material-ui/core/colors/blue";
import grey from '@material-ui/core/colors/grey';
import moment from 'moment';

import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core'

import { Excel } from "antd-table-saveas-excel";


const FilaEsperaCer = (props) => {

    const { list, dispatch } = props;
    const [open, setOpen] = useState(false);
    const [expandTablesContato, setExpantTablesContato] = useState({});
    const [loaded, setLoaded] = useState(false);
    const [loadTable, setLoadTable] = useState(false);
    const [dataRetornoInicio, setDataRetornoInicio] = useState("");
    const [dataRetornoFim, setDataRetornoFim] = useState("");
    const [loading, setLoading] = useState(false);
    const [dataInicio, setDataInicio] = useState("");
    const [detalhePaciente, setDetalhePaciente] = useState([]);
    const [expandTables, setExpandTables] = useState({});
    const [dataFim, setDataFim] = useState("");
    const [prontuario, setProntuario] = useState("");
    const [idadeInicio, setIdadeInicio] = useState("");
    const [idadeFim, setIdadeFim] = useState("");
    const [dataAgendamentoInicio, setDataAgendamentoInicio] = useState("");
    const [dataAgendamentoFim, setDataAgendamentoFim] = useState("");
    const [prioridadeCer, setPrioridadeCer] = useState(false);
    const [rowId, setRowId] = useState([])
    const [contato, setContato] = useState({ paciente: "", statusPac: "", contato: "", date: "", obs: "", und: "", user: "", loc: "", atendente: "" });
    const [filtros, setFiltros] = useState({
        situacao: [],
        itemAgendamentoCer: [],
        setor: [],
        projeto: [],
        tipoPaciente: []
    })
    const [data, setData] = useState([]);

    const [listItensCer, setListItensCer] = useState(list.itemAgendamentoCer)


    const handleChangeDataInicio = (value) => {
        setDataInicio(value);
    };

    const handleChangeDataFim = (value) => {
        setDataFim(value);
    };

    const handleChangeDataRetornoInicio = (value) => {
        setDataRetornoInicio(value);
    }
    const handleChangeDataRetornoFim = (value) => {
        setDataRetornoFim(value)
    }

    const handleProntuario = (value) => {
        setProntuario(value)
    }

    const handleIdadeInicio = (value) => {
        setIdadeInicio(value);
    }

    const handleIdadeFim = (value) => {
        setIdadeFim(value);
    }

    const handleChangeDataAgendamentoInicio = (value) => {
        setDataAgendamentoInicio(value);
    };

    const handleChangeDataAgendamentoFim = (value) => {
        setDataAgendamentoFim(value);
    };

    const handleChangePrioridadeCer = (checked) => {
        setPrioridadeCer(checked);
    };

    const loadItensCer = () => {
        if (listItensCer.length === 0) {
            dispatch(getListItemCer());
        }
    }

    useEffect(() => {
        setListItensCer(list.itemAgendamentoCer);
    }, [list.itemAgendamentoCer])

    const columns = [
        { title: "Posição", dataIndex: "Posicao", key: "Posicao" },
        { title: "Prontuário", dataIndex: "key", key: "key" },
        { title: "Nome", dataIndex: "Nome", key: "Nome" },
        { title: "Nascimento", dataIndex: "Nascimento", key: "Nascimento" },
        { title: "Idade", dataIndex: "Idade", key: "Idade" },
        { title: "CNS", dataIndex: "Cns", key: "Cns" },
        { title: "Cidade", dataIndex: "Cidade", key: "Cidade" },
        { title: "Telefones", dataIndex: "Telefones", key: "Telefones" },
        { title: "Sexo", dataIndex: "Sexo", key: "Sexo" },

        {
            title: "Ações",
            key: 10,
            render: () => <Button variant="outlined" color="primary" onClick={handleClickOpen}>REGISTRO CONTATO</Button>
        }
    ];

    const columnsContato = [

        { title: 'Prontuário', dataIndex: 'paciente', key: 'paciente', render: text => <a>{text}</a> },
        { title: 'Obs.', dataIndex: 'obs', key: 'obs' },
        { title: 'Dt.Registro', dataIndex: 'dtRegistro', key: 'dtRegistro' },
        { title: 'Situação', dataIndex: 'situacao', key: 'situacao' },
        { title: 'Usuário', dataIndex: 'usuario', key: 'usuario' },
        { title: 'Ref.', dataIndex: 'loc', key: 'loc' },
    ];

    const { Option } = Select;

    const columnsExcel = [
        { title: "Posição", dataIndex: "Posicao", key: "Posicao" },
        { title: "Prontuário", dataIndex: "key", key: "key" },
        { title: "Nome", dataIndex: "Nome", key: "Nome" },
        { title: "Nascimento", dataIndex: "Nascimento", key: "Nascimento" },
        { title: "Idade", dataIndex: "Idade", key: "Idade" },
        { title: "CNS", dataIndex: "Cns", key: "Cns" },
        { title: "Cidade", dataIndex: "Cidade", key: "Cidade" },
        { title: "Telefones", dataIndex: "Telefones", key: "Telefones" },
        { title: "Atendimento", dataIndex: "Atendimento", key: "Atendimento" },
        { title: "DtSolic", dataIndex: "DtSolic", key: "DtSolic" },
        { title: "ItemAgend", dataIndex: "ItemAgend", key: "ItemAgend" },
        { title: "TtSessoes", dataIndex: "TtSessoes", key: "TtSessoes" },
        { title: "Observ", dataIndex: "Observ", key: "Observ" },
        { title: "Situacao", dataIndex: "Situacao", key: "Situacao" },
        { title: "DtAgend", dataIndex: "DtAgend", key: "DtAgend" },
    ];

    const success = green['A400'];
    const cancel = red[500];
    const title = grey[700];



    const loadGetFiltros = (filtroName, value) => {
        setFiltros({ ...filtros, [filtroName]: value });
    };

    const loadData = async () => {
        setData([]);

        if ((dataInicio != "" && dataFim != "") || (prontuario != "") || (idadeInicio != "" && idadeFim != "") || (dataAgendamentoInicio != "" && dataAgendamentoFim != "" && setor !== "") || (dataRetornoInicio !== "" && dataRetornoFim !== "")) {
            setLoading(true);
            const params = {
                dataInicio: dataInicio,
                dataFim: dataFim,
                prontuario: prontuario,
                idadeInicio: idadeInicio,
                idadeFim: idadeFim,
                dataAgendamentoInicio: dataAgendamentoInicio,
                dataAgendamentoFim: dataAgendamentoFim,
                dataRetornoInicio: dataRetornoInicio,
                dataRetornoFim: dataRetornoFim,
                prioridadeCer: prioridadeCer
            };

            if (filtros.situacao.length > 0) {
                params.situacao = filtros.situacao.map((value) => {
                    return value.id;
                });
            }

            if (filtros.itemAgendamentoCer.length > 0) {
                params.itemAgendamentoCer = filtros.itemAgendamentoCer.map((value) => {
                    return value.ID;
                });
            }

            if (filtros.projeto.length == "" || filtros.projeto.length > 0) {
                params.projeto = filtros.projeto.map((value) => {
                    return value.id;
                });
            }

            if (filtros.setor.length == "" || filtros.setor.length > 0) {
                params.setor = filtros.setor.map((value) => {
                    return value.id;
                });
            }

            if (filtros.tipoPaciente.length == "" || filtros.tipoPaciente.length > 0) {
                params.tipoPaciente = filtros.tipoPaciente.map((value) => {
                    return value.id;
                });
            }

            setLoaded(true);

            let result = await axios.get("http://192.168.4.28:5000/api/fila_espera/listar/", {
                params: params,
            });

            if (result.status === 200) {

                const results = result.data.map(item => ({
                    key: item.id_paciente,
                    Posicao: item.posicao,
                    Nome: item.nome_paciente,
                    Nascimento: item.nascimento_paciente,
                    Idade: item.idade_paciente,
                    Cns: item.cns_paciente,
                    Cidade: item.cidade_paciente,
                    Telefones: item.fone_paciente,
                    Sexo: item.sexo_paciente

                }))
                setData(results);

            } else {
                setData([]);
            }
        } else {
            alert("Preencha as datas ou o prontuário para realizar a pesquisa!");
            setData([]);
        }
        setLoading(false);
    };

    const loadDetails = async (idPaciente) => {

        try {
            setLoadTable(true);
            setDetalhePaciente([])
            let stateAtual = detalhePaciente;

            if (!([idPaciente] in stateAtual)) {
                stateAtual[idPaciente] = [];
            }

            if (stateAtual[idPaciente].length === 0) {
                let result = await axios.get(
                    `http://192.168.4.28:5000/api/fila_espera/listar/detalhesCer/?id_paciente=${idPaciente}`
                );

                if (result.status === 200) {

                    stateAtual[idPaciente] = result.data;

                    const rows = stateAtual[idPaciente].map((item, index) => ({
                        key: index,
                        Posicao: item.posicao,
                        Atendimento: item.id_atendimento,
                        Data: item.data_entrada,
                        Item: item.item_agendamento,
                        Prioridade: item.prioridade,
                        TotalSessoes: item.total_sessoes,
                        Observacao: item.observacao,
                        Situacao: item.situacao,
                        DtAgendamento: item.data_agendamento,
                        DtRealizacao: item.data_realizacao,
                        DtRetorno: item.data_retorno
                    }))

                    result.status === 200 ? setExpandTables({ ...expandTables, [idPaciente]: rows }) : setDetalhePaciente([]);
                    console.log("rowDetails")
                    console.log(expandTables)
                    setLoadTable(false);
                }

                if (result.status === 204) {
                    setLoadTable(false)
                }
            }
        } catch (error) {
            setLoadTable(false)
            console.log("error", + error);
        } finally {
            return true;
        }
    };

    const loadExcel = async () => {
        var selectedRowsss = []
        //setSelectedRowss([]);

        if ((dataInicio !== "" && dataFim !== "") || prontuario !== "") {

            const params = {
                dataInicio: dataInicio,
                dataFim: dataFim,
                prontuario: prontuario
            };

            if (filtros.situacao.length > 0) {
                params.situacao = filtros.situacao.map((value) => {
                    return value.id;
                });
            }

            if (filtros.itemAgendamentoCer.length > 0) {
                params.itemAgendamentoCer = filtros.itemAgendamentoCer.map((value) => {
                    return value.ID;
                });
            }

            if (filtros.projeto.length == "" || filtros.projeto.length > 0) {
                params.projeto = filtros.projeto.map((value) => {
                    return value.id;
                });
            }

            if (filtros.setor.length == "" || filtros.setor.length > 0) {
                params.setor = filtros.setor.map((value) => {
                    return value.id;
                });
            }

            if (filtros.tipoPaciente.length == "" || filtros.tipoPaciente.length > 0) {
                params.tipoPaciente = filtros.tipoPaciente.map((value) => {
                    return value.id;
                });
            }

            let result = await axios.get("http://192.168.4.28:5000/api/fila_espera/listar/excel/", { params: params });

            if (result.status === 200) {

                const results = result.data.map(item => ({
                    key: item.id_paciente,
                    Posicao: item.posicao,
                    Nome: item.nome_paciente,
                    Nascimento: item.nascimento_paciente,
                    Idade: item.idade_paciente,
                    Cns: item.cns_paciente,
                    Cidade: item.cidade_paciente,
                    Telefones: item.fone_paciente,
                    Sexo: item.sexo_paciente,
                    Atendimento: item.atendimento,
                    DtSolic: item.data_solic,
                    ItemAgend: item.item_agendamento,
                    TtSessoes: item.total_sessoes,
                    Observ: item.observacao,
                    Situacao: item.situacao,
                    DtAgend: item.data_agendamento,

                }))
                selectedRowsss = results //: setData([]);

            } else {
                //setSelectedRowss([]);
            }
            if (result.status === 200 || result.status === 204) {
                const excel = new Excel();
                excel
                    .addSheet('Fila')
                    .setTHeadStyle({
                        background: 'FF3f51b5',
                        color: 'FFffffff',
                        fontSize: '11',
                        fontName: 'Calibri'
                    })
                    .setTBodyStyle({
                        fontName: 'Calibri',
                        fontSize: '11'
                    })
                    .addColumns(columnsExcel)
                    .addDataSource(//selectedRowsss.length == 0 ? data : 
                        selectedRowsss.flat())
                    .saveAs('FilaEsperaCer.xlsx');
            }


        } else {
            alert("Preencha as datas ou o prontuário para realizar a exportação!");
            //setSelectedRowss([]);
        }


    };

    const expandedRowRender = (row) => {

        const columnsExpanded = [
            //{ title: "Posição", dataIndex: "Posicao", key: "Posicao" },
            { title: "ID", dataIndex: "key", key: "key" },
            { title: "Atendimento", dataIndex: "Atendimento", key: "Atendimento" },
            { title: "Data", dataIndex: "Data", key: "Data" },
            { title: "Item", dataIndex: "Item", key: "Item" },
            { title: "Prioridade", dataIndex: "Prioridade", key: "Prioridade" },
            { title: "TotalSessoes", dataIndex: "TotalSessoes", key: "TotalSessoes" },
            { title: "Observacao", dataIndex: "Observacao", key: "Observacao" },
            {
                title: "Situação", dataIndex: "Situacao", key: "Situacao",
                render: (Situacao) => {
                    let color = '';

                    switch (Situacao) {
                        case "Agendado":
                            color = orange[800];
                            break;
                        case "Atendido":
                            color = green[600];
                            break;
                        case "Cancelado":
                            color = red[500];
                            break;
                        default:
                            color = blue[500];
                    }
                    return (
                        <Tag color={color} key={Situacao}>
                            {Situacao}
                        </Tag>
                    );
                }
            },
            { title: "Dt. Agendamento", dataIndex: "DtAgendamento", key: "DtAgendamento" },
            { title: "Dt. Realização", dataIndex: "DtRealizacao", key: "DtRealizacao" },
            { title: "Dt. Retorno", dataIndex: "DtRetorno", key: "DtRetorno" }
        ];
        return (
            <Spin tip="Aguarde..." spinning={loadTable} delay={500} size="large">
                <Table columns={columnsExpanded} dataSource={expandTables[row.key] || []} pagination={false} />
            </Spin>
        )
    };

    const onExpand = async (expanded, record) => {

        if (expanded) {
            await loadDetails(record.key);
        }
    }

    const getRegistroContato = async (idPaciente) => {

        try {
            let stateAtual = expandTablesContato;

            if (!([idPaciente] in stateAtual)) {
                stateAtual[idPaciente] = [];
            }

            if (stateAtual[idPaciente].length === 0) {
                let result = await axios.get(
                    `http://192.168.4.28:5000/api/fila_espera/listar/contato/?id_paciente=${idPaciente}`
                );

                if (result.status === 200) {

                    stateAtual[idPaciente] = result.data;

                    const rows = stateAtual[idPaciente].map((item, index) => ({
                        key: index,
                        paciente: item.CD_PACIENTE,
                        obs: item.DS_OBSERVACAO,
                        dtRegistro: moment(item.DT_REGISTRO).format('DD/MM/YYYY HH:mm:ss'),
                        situacao: item.TP_SITUACAO,
                        usuario: item.CD_USUARIO,
                        loc: item.LOC
                    }))
                    console.log(rows)
                    result.status === 200 ? setExpantTablesContato({ ...expandTablesContato, [idPaciente]: rows }) : setExpantTablesContato([]);
                }
            }
        } catch (error) {
            console.log("error", + error);
        } finally {
            return true;
        }
    }

    const handleClickOpen = () => {
        getRegistroContato(rowId);
        setOpen(true);
    };

    const handleContato = async (paciente, statusPac, user, obs, contato, loc) => {

        paciente = rowId;
        user = localStorage.getItem('user');
        console.log(paciente);

        await axios.post(`http://192.168.4.28:5000/api/contato/registrar`, { paciente, statusPac, user, obs, contato, loc, })
            .then((response) => {
                console.log(response.status);
                if (response.status === 200) {
                    alert("Cadastro Realizado com Sucesso");
                    handleClose(false);
                    setExpantTablesContato([]);
                    getRegistroContato(paciente);
                }
            })
            .catch((error) => {
                const { data } = error.response;
                alert(data.error);
                console.log(data.error);
            });
    }

    const handleOnchageSituacao = (value) => {
        switch (value) {
            case "1":
                value = 'TELEFONE FORA DE ÁREA OU DESLIGADO'
                setContato({ ...contato, statusPac: value })
                break;
            case "2":
                value = 'MARCAÇÃO REALIZADA'
                setContato({ ...contato, statusPac: value })
                break;
            case "3":
                value = '3 TENTATIVAS EXCEDIDAS'
                setContato({ ...contato, statusPac: value })
                break;
            case "4":
                value = 'PACIENTE HOSPITALIZADO OU DOENTE'
                setContato({ ...contato, statusPac: value })
                break
            case "5":
                value = 'TELEFONE NÃO EXISTE OU NÃO É DO PACIENTE'
                setContato({ ...contato, statusPac: value })
                break;
            case "6":
                value = 'TRATAMENTO EM OUTRO HOSPITAL'
                setContato({ ...contato, statusPac: value })
                break;
            case "7":
                value = 'NÃO ATENDEU A LIGAÇÃO'
                setContato({ ...contato, statusPac: value })
                break;
            case "8":
                value = 'PACIENTE NÃO DESEJA ATENDIMENTO'
                setContato({ ...contato, statusPac: value })
                break;
            case "9":
                value = 'PACIENTE FALECEU'
                setContato({ ...contato, statusPac: value })
                break;
            case "10":
                value = 'NÃO POSSUI REGISTRO DE CONTATO'
                setContato({ ...contato, statusPac: value })
                break;
        }

    }

    const handleOnchageContato = (value) => {
        switch (value) {
            case "1":
                value = 'Paciente'
                setContato({ ...contato, contato: value })
                break;
            case "2":
                value = 'Parente'
                setContato({ ...contato, contato: value })
                break;
            case "3":
                value = 'Vizinho'
                setContato({ ...contato, contato: value })
                break;
            case "4":
                value = 'Niguem'
                setContato({ ...contato, contato: value })
                break;
            case "5":
                value = 'Outros'
                setContato({ ...contato, contato: value })
                break;
        }
    }

    const handleOnchageLoc = (value) => {
        switch (value) {
            case "1":
                value = 'EXAMES'
                setContato({ ...contato, loc: value })
                break;
            case "2":
                value = "AMBULATORIO"
                setContato({ ...contato, loc: value })
                break;
            case "3":
                value = "CIRURGIAS"
                setContato({ ...contato, loc: value })
                break;
        }

    }
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Grid container spacing={3}>

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

                    <Grid item lg={2} md={3} sm={12}>
                        <LabelInput title={"Idade Início"} />
                        <Input
                            id="idadeInicio"
                            value={idadeInicio}
                            onChange={(event) => handleIdadeInicio(event.target.value)}
                            mask="99999999"
                        />
                    </Grid>

                    <Grid item lg={2} md={3} sm={12}>
                        <LabelInput title={"Idade Fim"} />
                        <Input
                            id="idadeFim"
                            value={idadeFim}
                            onChange={(event) => handleIdadeFim(event.target.value)}
                            mask="99999999"
                        />
                    </Grid>

                    <Grid item lg={2} md={3} sm={12}>
                        <LabelInput title={"Dt. Agendamento Início"} />
                        <Input
                            id="dataAgendamentoInicio"
                            value={dataAgendamentoInicio}
                            onChange={(event) => handleChangeDataAgendamentoInicio(event.target.value)}
                            mask="99/99/9999"
                        />
                    </Grid>

                    <Grid item lg={2} md={3} sm={12}>
                        <LabelInput title={"Dt. Agendamento Fim"} />
                        <Input
                            id="dataAgendamentoFim"
                            value={dataAgendamentoFim}
                            onChange={(event) => handleChangeDataAgendamentoFim(event.target.value)}
                            mask="99/99/9999"
                        />
                    </Grid>
                </Grid>

                <Grid container item spacing={3}>

                    <Grid item lg={2} md={3} sm={12}>
                        <LabelInput title={"Prontuário"} />
                        <Input
                            id="prontuario"
                            value={prontuario}
                            onChange={(event) => handleProntuario(event.target.value)}
                            mask="99999999"
                        />
                    </Grid>

                    <Grid item lg={2} md={3} sm={12}>
                        <LabelInput title={"Situação"} />
                        <Selected
                            id="filtroSituacao"
                            multiple
                            onChange={(event, value) => loadGetFiltros("situacao", value)}
                            options={situacao}
                            label={"situacao"}
                            title="Escolha"
                        />
                    </Grid>

                    <Grid item lg={6} md={3} sm={9}>
                        <LabelInput title={"Item Marcação"} />
                        <Selected
                            id="filtroItensCer"
                            multiple
                            onOpen={() => loadItensCer()}
                            onChange={(event, value) => loadGetFiltros("itemAgendamentoCer", value)}
                            options={listItensCer}
                            label={["ID", "ITEM"]}
                            title="Escolha"
                        />
                    </Grid>

                    <Grid item lg={2} md={3} sm={12}>
                        <LabelInput title={"Setor"} />
                        <Selected
                            id="filtroSetor"
                            multiple
                            onChange={(event, value) => loadGetFiltros("setor", value)}
                            options={setor}
                            label={"setor"}
                            title="Escolha"
                        />
                    </Grid>
                </Grid>
                {/* Projeto */}
                <Grid container item spacing={3}>
                    <Grid item lg={2} md={3} sm={12}>
                        <LabelInput title={"Projeto"} />
                        <Selected
                            id="projeto"
                            multiple
                            onChange={(event, value) => loadGetFiltros("projeto", value)}
                            options={projeto}
                            label={"projeto"}
                            title="Escolha"
                        />
                    </Grid>

                    {/* Tipo Paciente */}
                    <Grid item lg={2} md={3} sm={12}>
                        <LabelInput title={"Tipo Paciente"} />
                        <Selected
                            id="tipoPaciente"
                            multiple
                            onChange={(event, value) => loadGetFiltros("tipoPaciente", value)}
                            options={tipoPaciente}
                            label={"tipo"}
                            title="Escolha"
                        />
                    </Grid>

                    {/* Prioridade */}
                    <Grid item lg={2} md={3} sm={12} alignContent="center" >
                        <Checkbox 
                        onChange={(event) => handleChangePrioridadeCer(event.target.checked)}
                        >Prioridade CER</Checkbox>
                    </Grid>

                    <Grid item lg={2} md={3} sm={12}>
                        <LabelInput title={"Dt.Retorno Início"} />
                        <Input
                            id="dataInicioRetorno"
                            value={dataRetornoInicio}
                            onChange={(event) => handleChangeDataRetornoInicio(event.target.value)}
                            mask="99/99/9999"
                        />
                    </Grid>
                    <Grid item lg={2} md={3} sm={12}>
                        <LabelInput title={"Dt.Retorno Fim"} />
                        <Input
                            id="dataInicioFim"
                            value={dataRetornoFim}
                            onChange={(event) => handleChangeDataRetornoFim(event.target.value)}
                            mask="99/99/9999"
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

            {
                loaded ? (
                    loading ? (
                        <Spin spinning={loaded} size="large" />
                    ) : (
                        <React.Fragment>
                            <Table
                                className="components-table-demo-nested"
                                size="small"
                                columns={columns}
                                expandable={{ expandedRowRender, onExpand }}
                                dataSource={data}
                                //rowSelection={{ ...rowSelection }}
                                pagination={true}
                              onRow={(record) => ({
                                onClick: () => {
                                  setRowId(record.key);
                                  getRegistroContato(record.key);
                                  console.log(record);
                                  handleClickOpen();
                                },
                              })}
                            />
                            <Grid container item justify="flex-end" spacing={3}>
                                <Grid item lg={2}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => {
                                            loadExcel()
                                        }}
                                        fullWidth
                                    >
                                        Exportar Excel
                                    </Button>
                                </Grid>
                            </Grid>
                        </React.Fragment>
                    )
                ) : (
                    <React.Fragment></React.Fragment>
                )}

            <div>
                {/* FORM REGISTRO CONTATO E TALBE */}
                <Form>
                    <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="form-dialog-title"
                        maxWidth={'md'}
                    >
                        <DialogTitle id="form-dialog-title">Registro Contato</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Registro de contato de Pacientes
                            </DialogContentText>

                            <Table columns={columnsContato} dataSource={expandTablesContato[rowId] || []} pagination={{ pageSize: 50 }} scroll={{ y: 240 }} width={300} height={300} size="middle" />

                            <div style={{ margin: 20 }}>
                                <TextField
                                    label="Prontuário"
                                    id="prontuario"
                                    defaultValue={rowId}
                                    margin="dense"
                                    disabled={true}
                                    onChange={e => setContato({ ...contato, paciente: e.target.value })}
                                />
                            </div>

                            <div style={{ margin: 20 }}>
                                <Select
                                    placeholder="Situação"
                                    id="situacao"
                                    style={{ width: 300, zIndex: 5 }}
                                    optionFilterProp="children"
                                    dropdownStyle={{ zIndex: 2000 }}
                                    onChange={handleOnchageSituacao}
                                >
                                    <Option value="1">TELEFONE FORA DE ÁREA OU DESLIGADO</Option>
                                    <Option value="2">MARCAÇÃO REALIZADA</Option>
                                    <Option value="3">3 TENTATIVAS EXCEDIDAS</Option>
                                    <Option value="4">PACIENTE HOSPITALIZADO OU DOENTE</Option>
                                    <Option value="5">TELEFONE NÃO EXISTE OU NÃO É DO PACIENTE</Option>
                                    <Option value="6">TRATAMENTO EM OUTRO HOSPITAL</Option>
                                    <Option value="7">NÃO ATENDEU A LIGAÇÃO</Option>
                                    <Option value="8">PACIENTE NÃO DESEJA ATENDIMENTO</Option>
                                    <Option value="9">PACIENTE FALECEU</Option>
                                    <Option value="10">NÃO POSSUI REGISTRO DE CONTATO</Option>
                                </Select>
                            </div>


                            <div style={{ margin: 20 }}>
                                <Select
                                    placeholder="Contato"
                                    id="contato"
                                    style={{ width: 200, zIndex: 5 }}
                                    optionFilterProp="children"
                                    dropdownStyle={{ zIndex: 2000 }}
                                    onChange={handleOnchageContato}>

                                    <Option value="1">Paciente</Option>
                                    <Option value="2">Parente</Option>
                                    <Option value="3">Vizinho</Option>
                                    <Option value="4">Niguem</Option>
                                    <Option value="5">Outros</Option>
                                </Select>
                            </div>

                            <div style={{ margin: 20, width: 300 }}>
                                <TextField
                                    fullWidth
                                    required={true}
                                    label="Observação"
                                    id="obs"
                                    margin="dense"
                                    onChange={e => setContato({ ...contato, obs: e.target.value })}
                                />
                            </div>

                            <div style={{ margin: 20 }}>
                                <Select
                                    placeholder="Referente"
                                    style={{ width: 200, zIndex: 5 }}
                                    optionFilterProp="children"
                                    dropdownStyle={{ zIndex: 2000 }}
                                    onChange={handleOnchageLoc}>

                                    <Option value="1">EXAMES</Option>
                                    <Option value="2">AMBULATORIO</Option>
                                    <Option value="3">CIRURGIAS</Option>
                                </Select>
                            </div>


                        </DialogContent>
                        <DialogActions>
                            <Button type="submit" onClick={() => {
                                handleContato(contato.paciente, contato.statusPac, contato.user, contato.obs, contato.contato, contato.loc)
                            }}
                                style={{ color: title, background: success }}
                            >
                                Salvar
                            </Button>
                            <Button onClick={handleClose} style={{ color: title, background: cancel }} >
                                Cancelar
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Form>
            </div>
        </div >
    )

}

export default connect((store) => ({
    list: store.listReducer,
}))(FilaEsperaCer);

const situacao = [
    { id: "S", situacao: "Solicitado" },
    { id: "G", situacao: "Agendado" },
];

const setor = [
    { id: 252, setor: "252" },
    { id: 253, setor: "253" }
];

const projeto = [
    { id: 1, projeto: "Além do Olhar" },
    { id: 2, projeto: "Microcefalia" },
    { id: 3, projeto: "Nenhum"}
];

const tipoPaciente = [
    { id: 1, tipo: "Terapia Iniciada" },
    { id: 2, tipo: "Sem Terapia Iniciada" }
];