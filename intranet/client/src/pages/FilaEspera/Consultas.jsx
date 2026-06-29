import React, { useState, useEffect } from "react";
import Helmet from "react-helmet";
import Grid from "@material-ui/core/Grid";
import axios from "axios";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import green from "@material-ui/core/colors/green";
import orange from "@material-ui/core/colors/orange";
import red from "@material-ui/core/colors/red";
import blue from "@material-ui/core/colors/blue";
import grey from '@material-ui/core/colors/grey';
import Input from "../../components/input/Input";
import Selected from "../../components/input/Select";
import Title from "../../components/layout/Title";
import { connect } from "react-redux";
import {
  getListEmpresa,
  getListItemAgendamento,
  getListItemRetorno,
  getListCidade,
  getListOrigem,
  getListPrestador
} from "../../redux/actions/listActions";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import "antd/dist/antd.css";
import { Table, Tag, Spin, Select, Form, Tooltip } from "antd";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import moment from 'moment';
import LabelInput from '../../components/label/label-text/labelText';
import {verificaAcessoFilaEspera} from '../../middleware/verificarAcesso/acessoFilaEspera';
import { Excel } from "antd-table-saveas-excel";


const FilaEsperaConsultas = (props) => {

  const { list, dispatch } = props;
  const [open, setOpen] = useState(false);
  const [loadTable, setLoadTable] = useState(false);
  const [data, setData] = useState([]);
  const [contagem, setContagem] = useState(0);
  const [detalhePaciente, setDetalhePaciente] = useState([]);
  const [expandTables, setExpandTables] = useState({});
  const [expandTablesContato, setExpantTablesContato] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(true);
  const [dataInicio, setDataInicio] = useState("");
  const [dataRetornoInicio, setDataRetornoInicio] = useState("");
  const [dataRetornoFim, setDataRetornoFim] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [prontuario, setProntuario] = useState("");
  const [listaEmpresa, setListaEmpresa] = useState(list.empresa);
  const [listaItemAgendamento, setListaItemAgendamento] = useState(list.itemAgendamento);
  const [listaPrestador,setListaPrestador] = useState(list.prestador);
  const [listaItemRetorno, setListaItemRetorno] = useState(list.itemRetorno);
  const [listaCidade, setListaCidade] = useState(list.cidade);
  const [contato, setContato] = useState({ paciente: "", statusPac: "", contato: "", date: "", obs: "", und: "", user: "", loc: "", atendente: "" });
  const [rowId, setRowId] = useState([]);
  const [idadeInicio, setIdadeInicio] = useState("");
  const [idadeFim, setIdadeFim] = useState("");
  const [filtros, setFiltros] = useState({
    situacao: [],
    empresa: [],
    itemMarcacao: [],
    tipoItemAgendamento: "",
    itemAgendamento: [],
    tipoItemRetorno: "",
    itemRetorno: [],
    uf: [],
    cidade: [],
    registro:[],
    origem: [],
    prestador: []
  });

  //FILTRO ORIGEM ATENDIMENTO
  const [listOrigem, setListOrigem] = useState(list.origem);
  const [selectedRowsKeyss, setSelectedRowsKeyss] = useState([]);

  useEffect(() => {
    verificaAcessoFilaEspera();
  },[]);

  useEffect(()=> {
    getRegistroContato(rowId);
  }, [expandTablesContato])


  const handleClickFilters = () => {
    setIsFiltersExpanded(!isFiltersExpanded);
  };

  const handleChangeDataInicio = (value) => {
    setDataInicio(value);
  };

  const handleChangeDataFim = (value) => {
    setDataFim(value);
  };
  const handleIdadeInicio = (value) => {
    setIdadeInicio(value);
}

  const handleIdadeFim = (value) => {
      setIdadeFim(value);
  }

  const handleChangeDataRetornoInicio = (value) => {
    setDataRetornoInicio(value);
  }
  const handleChangeDataRetornoFim = (value) => {
    setDataRetornoFim(value)
  }

  const handleChangeProntuario = (value) => {
    setProntuario(value);
  };

  const loadOrigem = ()=> {
    if(listOrigem.length === 0){
      dispatch(getListOrigem());
    }
  }

  useEffect(()=>{
    setListOrigem(list.origem);
  }, [list.origem])


  const loadListaEmpresa = () => {
    if (listaEmpresa.length === 0) {
      dispatch(getListEmpresa());
    }
  };

  useEffect(() => {
    setListaEmpresa(list.empresa);
  }, [list.empresa]);

  const loadListaItemAgendamento = () => {
    if (listaItemAgendamento.length === 0) {
      dispatch(getListItemAgendamento());
    }
  };

  useEffect(() => {
    setListaItemAgendamento(list.itemAgendamento);
  }, [list.itemAgendamento]);

  const loadListaPrestador = () => {
    if (listaPrestador.length === 0) {
      dispatch(getListPrestador());
    }
  };

  useEffect(() => {
    setListaPrestador(list.prestador);
  }, [list.prestador]);

  const loadListaItemRetorno = () => {
    if (listaItemRetorno.length === 0) {
      dispatch(getListItemRetorno());
    }
  };

  useEffect(() => {
    setListaItemRetorno(list.itemRetorno);
  }, [list.itemRetorno]);

  const loadListaCidade = () => {
    if (listaCidade.length === 0) {
      dispatch(getListCidade());
      setListaCidade(list.cidade);
    }
  };

  useEffect(() => {
    setListaCidade(list.cidade);
  }, [list.cidade]);

  const loadFiltros = (filtroName, value) => {
    setFiltros({ ...filtros, [filtroName]: value });
  };

  const loadData = async () => {

    setData([]);

    if ((dataInicio !== "" && dataFim !== "") || (dataRetornoInicio !== "" && dataRetornoFim !== "") || prontuario !== "") {
      setLoading(true);
      const params = {
        dataInicio: dataInicio,
        dataFim: dataFim,
        idadeInicio: idadeInicio,
        idadeFim: idadeFim,
        prontuario: prontuario,
        dataRetornoInicio: dataRetornoInicio,
        dataRetornoFim: dataRetornoFim
      };

      if (filtros.situacao.length > 0) {
        params.situacao = filtros.situacao.map((value) => {
          return value.id;
        });
      }

      if (filtros.empresa.length > 0) {
        params.empresa = filtros.empresa.map((value) => {
          return value.id;
        });
      }

      if (filtros.itemMarcacao.length > 0) {
        params.itemMarcacao = filtros.itemMarcacao.map((value) => {
          return value.id;
        });
      }

      if (filtros.tipoItemAgendamento !== "") {
        params.tipoItemAgendamento =
          filtros.tipoItemAgendamento === "Ambulatório" ? "A" : ["I", "L"];
      }

      if (filtros.itemAgendamento.length > 0) {
        params.itemAgendamento = filtros.itemAgendamento.map((value) => {
          return value.id;
        });
      }

      if (filtros.prestador.length > 0) {
        params.prestador = filtros.prestador.map((value) => {
          return value.id;
        });
      }

      if (filtros.tipoItemRetorno !== "" && filtros.itemRetorno.length > 0) {
        params.tipoItemRetorno = filtros.tipoItemRetorno === "Possui" ? 1 : 0;

        params.itemRetorno = filtros.itemRetorno.map((value) => {
          return value.id;
        });
      }

      if (filtros.uf.length > 0) {
        params.uf = filtros.uf.map((value) => {
          return value.uf;
        });
      }

      if (filtros.cidade.length > 0) {
        params.cidade = filtros.cidade.map((value) => {
          return value.id;
        });
      }

      
      if (filtros.registro.length > 0) {
        console.log(filtros.registro)
        params.registro = filtros.registro.map((value) => {
          return value.registro;
        });
      }

      if(filtros.origem.length !== "" || filtros.origem.length > 0){
        params.origem = filtros.origem.map((value)=>{
          return value.ID;
        })
      } 

      setLoaded(true);

      let result = await axios.get("http://192.168.4.28:5000/api/fila_espera/listar/", {
        params: params,
      });

      if (result.status === 200) {

        //count.status === 200 && 
       // setContagem(count.data[0].contagem);

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
        setData(results) //: setData([]);

      } else {
        setContagem(0);
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
          `http://192.168.4.28:5000/api/fila_espera/listar/detalhes/?id_paciente=${idPaciente}`
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
            Situacao: item.situacao,
            DtAgendamento: item.data_agendamento,
            DtRealizacao: item.data_realizacao,
            DtRetorno: item.data_retorno
          }))

          result.status === 200 ? setExpandTables({ ...expandTables, [idPaciente]: rows }) : setDetalhePaciente([]);
          console.log("rowDatails")
          console.log(expandTables)
          setLoadTable(false);

        }

       
      }
    } catch (error) {
      setLoadTable(false)
      console.log("error", + error);
    } finally {
      return true;
    }

  };

  const loadBitrix = async () => {
    var selectedRowsss = []

    if ((dataInicio !== "" && dataFim !== "") || (dataRetornoInicio !== "" && dataRetornoFim !== "") || prontuario !== "") {
      
      const params = {
        dataInicio: dataInicio,
        dataFim: dataFim,
        prontuario: prontuario,
        dataRetornoInicio: dataRetornoInicio,
        dataRetornoFim: dataRetornoFim,
        listProntuarios: selectedRowsKeyss
      };

      if (filtros.situacao.length > 0) {
        params.situacao = filtros.situacao.map((value) => {
          return value.id;
        });
      }

      if (filtros.empresa.length > 0) {
        params.empresa = filtros.empresa.map((value) => {
          return value.id;
        });
      }

      if (filtros.itemMarcacao.length > 0) {
        params.itemMarcacao = filtros.itemMarcacao.map((value) => {
          return value.id;
        });
      }

      if (filtros.tipoItemAgendamento !== "") {
        params.tipoItemAgendamento =
          filtros.tipoItemAgendamento === "Ambulatório" ? "A" : ["I", "L"];
      }

      if (filtros.itemAgendamento.length > 0) {
        params.itemAgendamento = filtros.itemAgendamento.map((value) => {
          return value.id;
        });
      }

      if (filtros.prestador.length > 0) {
        params.prestador = filtros.prestador.map((value) => {
          return value.id;
        });
      }

      if (filtros.tipoItemRetorno !== "" && filtros.itemRetorno.length > 0) {
        params.tipoItemRetorno = filtros.tipoItemRetorno === "Possui" ? 1 : 0;

        params.itemRetorno = filtros.itemRetorno.map((value) => {
          return value.id;
        });
      }

      if (filtros.uf.length > 0) {
        params.uf = filtros.uf.map((value) => {
          return value.uf;
        });
      }

      if (filtros.cidade.length > 0) {
        params.cidade = filtros.cidade.map((value) => {
          return value.id;
        });
      }
      
      if (filtros.registro.length > 0) {
        console.log(filtros.registro)
        params.registro = filtros.registro.map((value) => {
          return value.registro;
        });
      }

      if(filtros.origem.length !== "" || filtros.origem.length > 0){
        params.origem = filtros.origem.map((value)=>{
          return value.ID;
        })
      } 

      let result = await axios.get("http://192.168.4.28:5000/api/fila_espera/listar/excel/",{params: params});

      if (result.status === 200) {

        const results = result.data.map(item => ({
          key: item.id_paciente,
          Atendimento: item.atendimento,
          DtAtendimento: item.dt_atend,
          Nome: item.nome_paciente,
          Nascimento: item.nascimento_paciente,
          Idade: item.idade_paciente,
          Telefone1: item.fone1_paciente,
          Telefone2: item.fone2_paciente,
          Cns: item.cns_paciente,
          ItAgend: item.it_agendamento,
          ItemAgend: item.item_agend,
          Empresa: item.empresa,
          Cidade: item.cidade_paciente

        }))
        selectedRowsss = results 
  
      }
      if (result.status === 200 || result.status === 204) {
        const excel = new Excel(); 
        excel
          .addSheet('Selecionados Fila')
          .setTHeadStyle({background : 'FF3f51b5',
                          color : 'FFffffff',
                          fontSize : '11',
                          fontName : 'Calibri'})
          .setTBodyStyle({fontName : 'Calibri',
                          fontSize : '11'})
          .addColumns(columnsSelect)
          .addDataSource(selectedRowsss.flat() )
          .saveAs('FilaDeEspera.xlsx');
      }
      

    } else {
      alert("Preencha as datas ou o prontuário para realizar a exportação!");
      
    }

    
  };

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
          result.status === 200 ? setExpantTablesContato({ ...expandTablesContato, [idPaciente]: rows }): setExpantTablesContato([]);
        }
      }
    } catch (error) {
      console.log("error", + error);
    }finally{
      return true;
    }
  }

  const handleClickOpen = () => {
    getRegistroContato(rowId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const expandedRowRender = (row) => {

    const columnsExpanded = [
      { title: "Posição", dataIndex: "Posicao", key: "Posicao" },
      { title: "ID", dataIndex: "key", key: "key" },
      { title: "Atendimento", dataIndex: "Atendimento", key: "Atendimento" },
      { title: "Data", dataIndex: "Data", key: "Data" },
      { title: "Item", dataIndex: "Item", key: "Item" },
      { title: "Prioridade", dataIndex: "Prioridade", key: "Prioridade" },
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
  }

  const rowSelection = {
    onChange: (selectedRowKeys,selectedRows,info) => {
       setSelectedRowsKeyss(selectedRowKeys);
    }
    ,
    onSelect: (record) => {
      console.log(record);
      getRegistroContato(record.key);
    },
  };

  const columnsContato = [

    { title: 'Prontuário', dataIndex: 'paciente', key: 'paciente', render: text => <a>{text}</a> },
    { title: 'Obs.', dataIndex: 'obs', key: 'obs' },
    { title: 'Dt.Registro', dataIndex: 'dtRegistro', key: 'dtRegistro' },
    { title: 'Situação', dataIndex: 'situacao', key: 'situacao' },
    { title: 'Usuário', dataIndex: 'usuario', key: 'usuario' },
    { title: 'Ref.', dataIndex: 'loc', key: 'loc' },
  ];

  const columnsSelect = [
    { title: "DT_ATENDIMENTO", dataIndex: "DtAtendimento", key: "DtAtendimento" },
    { title: "ATENDIMENTO", dataIndex: "Atendimento", key: "Atendimento" },
    { title: "PRONTUARIO", dataIndex: "key", key: "key" },
    { title: "PACIENTE", dataIndex: "Nome", key: "Nome" },
    { title: "DATA_NASCIMENTO", dataIndex: "Nascimento", key: "Nascimento"/*, __numFmt__ : 'mm/dd/yyyy'*/, __cellType__ : 'TypeNumeric'},
    { title: "IDADE", dataIndex: "Idade", key: "Idade" },
    { title: "TELEFONE_1", dataIndex: "Telefone1", key: "Telefone1", __numFmt__ : '0', __cellType__ : 'TypeNumeric'},
    { title: "TELEFONE_2", dataIndex: "Telefone2", key: "Telefone2", __numFmt__ : '0', __cellType__ : 'TypeNumeric'},
    { title: "NR_CNS", dataIndex: "Cns", key: "Cns", __numFmt__ : '0', __cellType__ : 'TypeNumeric' },
    { title: "IT", dataIndex: "ItAgend", key: "ItAgend" },
    { title: "ITEM", dataIndex: "ItemAgend", key: "ItemAgend" },
    { title: "EMP", dataIndex: "Empresa", key: "Empresa" },
    { title: "CIDADE", dataIndex: "Cidade", key: "Cidade" },
    { title: "DATA_MARCACAO", dataIndex: "", key: "" },
    { title: "HORA_MARCACAO", dataIndex: "", key: "" },
    { title: "NOME_MEDICO", dataIndex: "", key: "" },
    { title: "LOCAL", dataIndex: "Local", key: "Local" },
    { title: "SETOR", dataIndex: "Setor", key: "Setor" },
    { title: "PROCEDIMENTO", dataIndex: "Procedimento", key: "Procedimento" },
  ];

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

  const success = green['A400'];
  const cancel = red[500];
  const title = grey[700];

  const onExpand = async (expanded, record) => {

    if (expanded) {
      await loadDetails(record.key);
    }
  }

  const { Option } = Select;

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

  const handleOnChangePaciente = (value) => {
    value = rowId;
    setContato({ ...contato, paciente: value })
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

  return (
    <div>
      <Helmet title="Fila de Espera" />
      <Title
        title="Consultas e Exames"
        root="Fila de Espera"
        isFiltersExpanded={isFiltersExpanded}
        handleClickFilters={handleClickFilters}
      >
        <Grid container spacing={3}>
          
          <Grid container item spacing={3}>
            
          <Tooltip title="Data Início da Solicitação">
            <Grid item lg={2} md={3} sm={12}>
              <LabelInput title={"Dt.Início"}/>
              <Input
                id="dataInicio"
                value={dataInicio}
                onChange={(event) => handleChangeDataInicio(event.target.value)}
                mask="99/99/9999"
              />
            </Grid>
          </Tooltip>

          <Tooltip title="Data Final da Solicitação">   
            <Grid item lg={2} md={3} sm={12}>
              <LabelInput title={"Dt.Fim"}/>
              <Input
                id="dataFim"
                value={dataFim}
                onChange={(event) => handleChangeDataFim(event.target.value)}
                mask="99/99/9999"
              />
            </Grid>
          </Tooltip>

          <Tooltip title="Data Retorno Inicial">
            <Grid item lg={2} md={3} sm={12}>
            <LabelInput title={"Dt.Retorno Início"}/>
              <Input
                id="dataInicioRetorno"
                value={dataRetornoInicio}
                onChange={(event) => handleChangeDataRetornoInicio(event.target.value)}
                mask="99/99/9999"
              />
            </Grid>
            </Tooltip>
          
          <Tooltip title="Data Retorno Final">
            <Grid item lg={2} md={3} sm={12}>
            <LabelInput title={"Dt.Retorno Fim"}/>
              <Input
                id="dataInicioFim"
                value={dataRetornoFim}
                onChange={(event) => handleChangeDataRetornoFim(event.target.value)}
                mask="99/99/9999"
              />
            </Grid>
          </Tooltip>

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
          </Grid>        
          
          <Grid container item spacing={3}>
            <Tooltip title="Prontuário Paciente">
              <Grid item lg={2} md={3} sm={12}>
              <LabelInput title={"Prontuário"}/>
                <Input
                  id="prontuario"
                  value={prontuario}
                  onChange={(event) => handleChangeProntuario(event.target.value)}
                  mask="99999999"
                />
              </Grid>
          </Tooltip>
            
          <Tooltip title="Tipo do Status (Solicitado, Agendado...)">
            <Grid item lg={2} md={3} sm={12}>
            <LabelInput title={"Situação"}/>
              <Selected
                id="filtroSituacao"
                multiple
                onChange={(event, value) => loadFiltros("situacao", value)}
                options={situacao}
                label={"situacao"}
                title="Escolha"
              />
            </Grid>
            </Tooltip>

            <Tooltip title="Escolher Empresa">
          <Grid item lg={4} md={3} sm={8}>
            <LabelInput title={"Empresa"}/>
              <Selected
                id="filtroEmpresas"
                multiple
                onOpen={() => loadListaEmpresa()}
                onChange={(event, value) => loadFiltros("empresa", value)}
                options={listaEmpresa}
                label={"empresa"}
                title="Escolha"
              />
          </Grid>
          </Tooltip>

          <Tooltip title="Escolher Prestador">
            <Grid item lg={4} md={3} sm={12}>
            <LabelInput title={"Prestador"}/>
              <Selected
                id="filtroPrestador"
                multiple
                onOpen={() => loadListaPrestador()}
                onChange={(event, value) => loadFiltros("prestador", value)}
                options={listaPrestador}
                label={["id","nome_prestador"]}
                title="Escolha"
              />
          </Grid>
          </Tooltip> 

          </Grid>
          
      <Grid container item spacing={3}>

        <Tooltip title="Item de Marcação">
          <Grid item lg={6} md={3} sm={9}>
            <LabelInput title={"Item de Marcação"}/>
              <Selected
                id="filtroItemMarcacao"
                multiple
                onChange={(event, value) => loadFiltros("itemMarcacao", value)}
                options={itemMarcacao}
                label={["id", "itemMarcacao"]}
                title="Esolha"
              />
            </Grid>
        </Tooltip>

        <Tooltip title="Origem Atendimento">
          <Grid item lg={6} md={3} sm={9}>
            <LabelInput title={"Origem Atendimento"}/>
              <Selected
                 id="filtroOrigens"
                 multiple
                 onOpen={() => loadOrigem()}
                 onChange={(event, value) => loadFiltros("origem", value)}
                 options={listOrigem}
                 label={["ID", "ORI"]}
                 title="Escolha"
              />
            </Grid>
        </Tooltip>
          </Grid>

        <Grid container item spacing={3}>
        <Tooltip title="Tipo (Ambulatório, Exame)">
          <Grid item md={2}>
            <LabelInput title={"Tipo"}/>
              <Selected
                id="filtoTipoItemAgendamento"
                onChange={(event, value) =>
                  loadFiltros("tipoItemAgendamento", value.tipoItem)
                }
                options={tipoItemAgendamento}
                label={"tipoItem"}
                title={"Escolha"}
              />
            </Grid>
        </Tooltip>

        <Tooltip title="Item de Agendamento">
          <Grid item md={10}>
            <LabelInput title={"Item de Agendamento"}/>
              <Selected
                id="filtroItemAgendamento"
                multiple
                onOpen={() => loadListaItemAgendamento()}
                onChange={(event, value) =>
                  loadFiltros("itemAgendamento", value)
                }
                options={listaItemAgendamento}
                label={["id", "item_agendamento"]}
                title="Escolha"
              />
            </Grid>
        </Tooltip>


          <Tooltip title="Possui ou Não possui Retorno">
            <Grid item md={2}>
              <LabelInput title={"Possui/Não Possui"}/>
              <Selected
                id="filtoTipoItemRetorno"
                onChange={(event, value) =>
                  loadFiltros("tipoItemRetorno", value.tipoRetorno)
                }
                options={tipoItemRetorno}
                label={"tipoRetorno"}
                title={"Escolha"}
              />
            </Grid>
          </Tooltip>

          <Tooltip title="Escolher Item de Retorno">
            <Grid item md={10}>
            <LabelInput title={"Item de Retorno"}/>
              <Selected
                id="filtroItemRetorno"
                multiple
                onOpen={() => loadListaItemRetorno()}
                onChange={(event, value) => loadFiltros("itemRetorno", value)}
                options={listaItemRetorno}
                label={["id", "item_agendamento"]}
                title="Escolha"
              />
            </Grid>
          </Tooltip>

        <Tooltip title="Escolher Estado">
            <Grid item md={2}>
              <LabelInput title={"UF"}/>
              <Selected
                id="filtroUF"
                multiple
                onChange={(event, value) => loadFiltros("uf", value)}
                options={uf}
                label={"uf"}
                title={"Escolha"}
              />
            </Grid>
          </Tooltip>  

          <Tooltip title="Escolher Cidade">      
            <Grid item md={10}>
              <LabelInput title={"Cidade"}/>
              <Selected
                id="filtroCidade"
                multiple
                onOpen={() => loadListaCidade()}
                onChange={(event, value) => loadFiltros("cidade", value)}
                options={listaCidade}
                label={["id", "cidade"]}
                title="Escolha"
              />
            </Grid>
          </Tooltip>
            
        <Tooltip title="Filtrar Registro de Contato">  
            <Grid item md={10}>
              <LabelInput title={"Registro Contato"}/>
              <Selected
                id="filtroRegistroContato"
                multiple
                //onOpen={() => loadRegistroContato()}
                onChange={(event, value) => loadFiltros("registro", value)}
                options={registro}
                label={"registro"}
                title="Escolha"
              />
            </Grid>
          </Tooltip>

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
              {/* <CardContent>
                <div>Total de Procedimentos: {contagem}</div>
              </CardContent> */}
            </Card>

            <Table
              className="components-table-demo-nested"
              size="small"
              columns={columns}
              expandable={{ expandedRowRender, onExpand }}
              dataSource={data}
              rowSelection={{ ...rowSelection }}
              pagination={true} 
              onRow={(record) => ({
                onClick: () => {
                  setRowId(record.key); 
                  getRegistroContato(record.key);
                  console.log(record);
                  handleClickOpen();
                }, 
              })}/>
            
            <Grid container item justify="flex-end" spacing={3}>
            <Grid item lg={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  loadBitrix()
                }}
                fullWidth
              >
                Exportar Selecionados
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

              <Table columns={columnsContato} dataSource={expandTablesContato[rowId] || []} pagination={{ pageSize: 50 }} scroll={{ y: 240 }} width={300} height={300} size="middle"/>

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
              <Button  type="submit" onClick={() => {
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
    </div>
  );
};


export default connect((store) => ({
  list: store.listReducer,
}))(FilaEsperaConsultas);

const uf = [
  { uf: "AL" },
  { uf: "AM" },
  { uf: "AP" },
  { uf: "BA" },
  { uf: "CE" },
  { uf: "DF" },
  { uf: "ES" },
  { uf: "GO" },
  { uf: "MA" },
  { uf: "MG" },
  { uf: "MS" },
  { uf: "MT" },
  { uf: "PA" },
  { uf: "PB" },
  { uf: "PE" },
  { uf: "PI" },
  { uf: "PR" },
  { uf: "RJ" },
  { uf: "RN" },
  { uf: "RO" },
  { uf: "RR" },
  { uf: "RS" },
  { uf: "SC" },
  { uf: "SE" },
  { uf: "SP" },
  { uf: "TO" },
];

const tipoItemAgendamento = [
  { tipoItem: "Ambulatório" },
  { tipoItem: "Exame" },
];

const tipoItemRetorno = [
  { tipoRetorno: "Possui" },
  { tipoRetorno: "Não Possui" },
];

const situacao = [
  { id: "S", situacao: "Solicitado" },
  { id: "G", situacao: "Agendado" },
];

const itemMarcacao = [
  { id: 62, itemMarcacao: "Angiofrafia" },
  { id: 74, itemMarcacao: "Retinografia" },
  { id: 4802, itemMarcacao: "Autofluorescência" },
  { id: 2742, itemMarcacao: "Retcam" },
  { id: 1623, itemMarcacao: "Eletroretinografia" },
  { id: 78, itemMarcacao: "OCT" },
  { id: 76, itemMarcacao: "Ultrassonografia" },
  { id: 1482, itemMarcacao: "USG - Simples (Cat/Cornea)" },
  { id: 4983, itemMarcacao: "USG UBM" },
  { id: 61, itemMarcacao: "PAM" },
  { id: 63, itemMarcacao: "Biometria" },
  { id: 71, itemMarcacao: "Microscopia Especular" },
  { id: 75, itemMarcacao: "Topografia Corneana" },
  { id: 73, itemMarcacao: "Paquimetria" },
  { id: 65, itemMarcacao: "Campimetria" },
  { id: 570, itemMarcacao: "Mapeamento de Retina" },
  { id: 72, itemMarcacao: "Panfoto" },
  { id: 5022, itemMarcacao: "Complemento de Panfoto" },
  { id: 4384, itemMarcacao: "Periferia" },
  { id: 4383, itemMarcacao: "Setorial" },
  { id: 5023, itemMarcacao: "Laser Focal" },
  { id: 68, itemMarcacao: "Iridotomia Periferica" },
  { id: 66, itemMarcacao: "Capsulotomia Posterior" },
  { id: 79, itemMarcacao: "Trabeculoplastia Seletiva" },
  { id: 125, itemMarcacao: "Glicemia de Jejum" },
  { id: 82, itemMarcacao: "Parecer Cardiológico c/Risco Cirúrgico" },
  { id: 4942, itemMarcacao: "RT-PCR" },
  { id: 302, itemMarcacao: "Catarata (Polo)" },
  { id: 242, itemMarcacao: "Catarata (Mostra Exames)" },
  { id: 13, itemMarcacao: "Catarata Complicada" },
  { id: 16, itemMarcacao: "Amb. de Catarata Congênita" },
  { id: 54, itemMarcacao: "CER - Avaliação Psicosocial" },
  { id: 50, itemMarcacao: "CER - Estimulação Visual" },
  { id: 10, itemMarcacao: "CER - Estrabismo" },
  { id: 57, itemMarcacao: "CER - Neuropediatria" },
  { id: 11, itemMarcacao: "CER - Oftalmopediatria" },
  { id: 12, itemMarcacao: "CER - Baixa Visão" },
  { id: 4, itemMarcacao: "Córnea" },
  { id: 703, itemMarcacao: "Córnea Pós-Transplante" },
  { id: 1502, itemMarcacao: "Glaucoma Clínico" },
  { id: 2982, itemMarcacao: "Inclusão Projeto Glaucoma" },
  { id: 3, itemMarcacao: "Glaucoma Cirúrgico" },
  { id: 17, itemMarcacao: "Neuroftalmo" },
  { id: 5, itemMarcacao: "Plástica Ocular" },
  { id: 6, itemMarcacao: "Refração" },
  { id: 3862, itemMarcacao: "Amb. Pterigio (Jaboatão)" },
  { id: 2, itemMarcacao: "Retina Cirúrgica" },
  { id: 2302, itemMarcacao: "Retina Clínica" },
  { id: 1682, itemMarcacao: "Retina Oclusões Vasculares" },
  { id: 4962, itemMarcacao: "Retina Pediátrica" },
  { id: 4922, itemMarcacao: "Distrofias Retinianas" },
  { id: 27, itemMarcacao: "DPO Antiogiogênico" },
  { id: 2526, itemMarcacao: "Retinoblastoma" },
  { id: 2524, itemMarcacao: "Tumor Anterior" },
  { id: 2525, itemMarcacao: "Tumor Posterior" },
  { id: 8, itemMarcacao: "Uveíte" },
  { id: 2925, itemMarcacao: "Troca de Lente Terapeutica" },
  { id: 7, itemMarcacao: "Lente de Contato" },
];

const registro = [
    {registro: "TELEFONE FORA DE ÁREA OU DESLIGADO"},
    {registro: "MARCAÇÃO REALIZADA"},
    {registro: "TENTATIVAS EXCEDIDAS"},
    {registro: "PACIENTE HOSPITALIZADO OU DOENTE"},
    {registro: "TELEFONE NÃO EXISTE OU NÃO É DO PACIENTE"},
    {registro: "TRATAMENTO EM OUTRO HOSPITAL"},
    {registro: "NÃO ATENDEU A LIGAÇÃO"},
    {registro: "PACIENTE NÃO DESEJA ATENDIMENTO"},
    {registro: "PACIENTE FALECEU"},
    {registro: "NÃO POSSUI REGISTRO DE CONTATO"},
];

/*
const origem = [

{  id:2 , ori:"CENTRO DE DIAGNOSTICO"},
{  id:3 , ori:"MOSTRA DE EXAMES CATARATA"}
  {id:4 , ori:"PROJETOS DIVERSOS"}
  {id:5 , ori:INTERNAMENTO INT IPT 1º AND}
  {id:6 , ori:PROJETO OLHAR RECIFE}
  {id:7 , ori:TRIAGEM MEDICA CATARATA}
  {id:8 , ori:INTERNAMENTO AMB IPT 1º AND}
  {id:9 , ori:PROJETO OLHAR RECIFE ESCOLA}
  id:10, ori:PROJETO ONE SIGHT
  id:11 , ori:FATURAMENTO (INJECAO LUCENTES)
  id:12 , ori:RECEP EXAMES (CFAV)
  id:13 , ori:ASSISTENTE POLO RETINA (NÃO US
  id:14 , ori:REAVALIACAO POLO DE CATARATA
  id:15 , ori:SIGHT FIRST
  id:16 , ori:CENTRO DE DIAGori: CARDIO RETORNO
  id:17 , ori:RECEPCAO REGULACAO
  id:18 , ori:CIRURGIAS SUSP BLOCO (MATRIZ)
  id:19 , ori:EMERGENCIA
  id:20 , ori:POLO CERIV 2º ANDAR
  id:21 , ori:FAV 2
  id:22 , ori:EXAMES BOA VISTA
  id:23 , ori:POLO RETINA 4º ANDAR
  id:24 , ori:AMB/DPO SETOR EXAMES
  id:25 , ori:POLO DE GLAUCOMA 4º ANDAR
  id:26 , ori:AMBULATORIO SERRA TALHADA
  id:27 , ori:BLOCO CIRURGICO MTZ/SALG
  id:28 , ori:RECEPCAO FAV EXAMES IPUTINGA
  id:29 , ori:PROJETOS EXTERNOS
  id:30 , ori:PROJETO INTERNOS
  id:31 , ori:ATENDIMENTOS DIV SEM USO
  id:32 , ori:EXAMES SERRA TALHADA
  id:33 , ori:CIRURGIA BPA/APAC RECEPCAO
  id:34 , ori:ATENDIMENTOS DIVERSOS CER4 2ºA
  id:35 , ori:CENTRO MULTIPLAS DEFICIENCIAS
  id:36 , ori:CENTRO REAB OFTALMOLOGICA
  id:37 , ori:RECEP AMBULATORIAL (CFAV)
  id:38 , ori:CENTRO REAB OFTALMO 5
  id:39 , ori:TELEMEDICINA
  id:40 , ori:AMBULATORIO ARCOVERDE
  id:41 , ori:RECEPCAO EXAMES,CER4
  id:42 , ori:RECEPCAO SALGUEIRO
  id:43 , ori:EXAMES JABOATAO
  id:44 , ori:RECEPCAO JABOATAO
  id:45 , ori:CAIXA RECEBori: ANTECIPADO
  id:46 , ori:FAV II 2º ANDAR
  id:47 , ori:CIRURGIA SERRA TALHADA
  id:48 , ori:ATENDIMENTOS DIVERSOS BV
  id:49 , ori:VAN INTERIOR TRIAG CAT
  id:50 , ori:CIRURGIAS JABOATAO / MATRIZ
  id:51 , ori:EXAMES SALGUEIRO
  id:52 , ori:EXAMES
  id:53 , ori:RECEP OFTALMOLOGICA RECIFE
  id:54 , ori:ARQUIVO (SAME)
  id:55 , ori:CFAV , 3º PISO
  id:56 , ori:UNIDADE MOVEL 02
  id:57 , ori:VAN RMR
  id:58 , ori:RECEPCAO CENTRO AUTISMO
  id:59 , ori:CIRURGIA INTERNACAO RECEPCAO
  id:60 , ori:INTERNAMENTO (PARA AMB) BV
  id:61 , ori:BANCO DE OLHOS
  id:62 , ori:INTERNAMENTO ( PARI , INT) BV
  id:63 , ori:CENTRO MULTIP DEFICI MUNICIP
  id:64 , ori:RECEPCAO AMB GERAL Bori:VISTA
  id:65 , ori:FAV / FAT SUS P LANC RETROAT
  id:66 , ori:URGENCIA SALGUEIRO
  id:67 , ori:URGENCIA ARCOVERDE
  id:68 , ori:ONIBUS CIRURGICO
  id:69 , ori:URGENCIA SERRA TALHADA
  id:70 , ori:ATENDIMENTOS DIVERS AMBori: GERAL
  id:71 , ori:AMBori: POS,OPERATORIO IPUTINGA
  id:72 , ori:AMBULATORIO DE POS,OPERATORIO
  id:73 , ori:PROJETOS EXTERNOS
  id:74 , ori:PROJETOS EXTERNOS
  id:75 , ori:FAV / FAT ARCOVERDE
  id:76 , ori:EMERGENCIA (INTERNACAO)
  id:77 , ori:EXAMES SALGUEIRO 2
  id:78 , ori:URGENCIA SALGUEIRO 2
  id:79 , ori:RECEPCAO JABOATAO 2
  id:80 , ori:CFAV,BLOCO CIRURGICO(PARA,AMB)
  id:81 , ori:CFAV,BLOCO CIRURGICO(PARI INT)
  id:82 , ori:ATENDIMENTOS DIVERSOS IPT 4ºAori:
  id:83 , ori:RECEPCAO MULTIPLAS CER4
  id:84 , ori:RECEPCAO MEDICA CER4
  id:85 , ori:RECEPCAO OUVIDORIA
  id:86 , ori:TRIAGEM DE CATARATA
  id:87 , ori:15 DPO
  id:88 , ori:EXAMES DIVERSOS 4º ANDAR
  id:89 , ori:PROJETOS EXTERNOS SALGUEIRO 2
  id:90 , ori:INTERNAMENTO (PARA URG) BV
  id:91 , ori:INTERNAMENTO (PARI INT URG)BV
  id:92 , ori:ASSISTENTE EMERGENCIA
  id:93 , ori:JABOATAO CATARATA
  id:94 , ori:3 PISO FAV BOA VISAO
  id:95 , ori:RECEPCAO ALEM DO OLHAR CER IV
  id:96 , ori:CENTRO DE DIAG LABORATORIO
  id:97 , ori:CENTRO DE DIAG CARDIO
  id:98 , ori:FAV 3
  id:99 , ori:JABOATAO MATRIZ}

]
*/


{/* <DataGrid
              columns={columns}
              rows={data}
              options={options}
              details={details}>
            </DataGrid> */}

// const columns = [
  //   { 
  //     field: "",
  //     headerName: "Pos",
  //     name: "posicao", 
  //     // title: "Pos", 
  //     width: "5%" 
  //   },
  //   { 
  //     field: "",
  //     headerName: "Prontuário",
  //     name: "id_paciente", 
  //     // title: "Prontuário", 
  //     width: "10%" 
  //   },
  //   {
  //     field: "",
  //     headerName: "Nome",
  //     name: "nome_paciente",
  //     // title: "Nome",
  //     width: "20%",
  //   },
  //   {
  //     field: "",
  //     headerName: "Nascimento",
  //     name: "nascimento_paciente",
  //     // title: "Nascimento",
  //     width: "10%",
  //   },
  //   {
  //     field: "",
  //     headerName: "Idade",
  //     name: "idade_paciente",
  //     // title: "Idade",
  //     width: "5%",
  //   },
  //   {
  //     field: "",
  //     headerName: "CNS",
  //     name: "cns_paciente",
  //     // title: "CNS",
  //     width: "10%",
  //   },
  //   {
  //     field: "",
  //     headerName: "Cidade",
  //     name: "cidade_paciente",
  //     // title: "Cidade",
  //     width: "20%",
  //   },
  //   {

  //     headerName: "Telefones",
  //     name: "fone_paciente",
  //     // title: "Telefones",
  //     width: "20%",
  //   },
  //   {
  //     field: "",
  //     headerName: "Opções",
  //     name: "sexo_paciente",
  //     title: "Opções",
  //     width: "50%",

  //   }

  // ];


  // const options = {
  //   sorting: true,
  //   defaultSorting: { column: "posicao", direction: "asc" },
  //   filtering: true,
  //   grouping: true,
  //   paging: true,
  // };


  // const details = ({ row }) => {
  //   const idPaciente = row.id_paciente;
  //   loadDetails(idPaciente);

  //   const res = detalhePaciente[idPaciente];
  //   console.log("Res:", res);

  //   const rows = res.map((value, index) => {
  //     let color = "";
  //     switch (value.situacao) {
  //       case "Agendado":
  //         color = orange[100];
  //         break;
  //       case "Atendido":
  //         color = green[100];
  //         break;
  //       case "Cancelado":
  //         color = red[100];
  //         break;
  //       default:
  //         color = "FFF";
  //     }
  //     return (
  //       <TableRow key={idPaciente + index} style={{ backgroundColor: color }}>
  //         <TableCell style={{ fontSize: "0.7rem" }}>{value.posicao}</TableCell>
  //         <TableCell style={{ fontSize: "0.7rem" }}>{value.id_atendimento}</TableCell>
  //         <TableCell style={{ fontSize: "0.7rem" }}>{value.data_entrada}</TableCell>
  //         <TableCell style={{ fontSize: "0.7rem" }}>{value.item_agendamento}</TableCell>
  //         <TableCell style={{ fontSize: "0.7rem" }}>{value.prioridade}</TableCell>
  //         <TableCell style={{ fontSize: "0.7rem" }}>{value.situacao}</TableCell>
  //         <TableCell style={{ fontSize: "0.7rem" }}>{value.data_agendamento}</TableCell>
  //         <TableCell style={{ fontSize: "0.7rem" }}>{value.data_realizacao}</TableCell>
  //       </TableRow>
  //     );
  //   });

  //   return res.length > 0 ? (
  //     <TableContainer component={Paper}>
  //       <Table size="small">
  //         <TableHead>
  //           <TableRow>
  //             <TableCell style={{ fontSize: "0.7rem" }}>Posição</TableCell>
  //             <TableCell style={{ fontSize: "0.7rem" }}>Atendimento</TableCell>
  //             <TableCell style={{ fontSize: "0.7rem" }}>Data</TableCell>
  //             <TableCell style={{ fontSize: "0.7rem" }}>Item</TableCell>
  //             <TableCell style={{ fontSize: "0.7rem" }}>Prioridade</TableCell>
  //             <TableCell style={{ fontSize: "0.7rem" }}>Situação</TableCell>
  //             <TableCell style={{ fontSize: "0.7rem" }}>Dt. Agendamento</TableCell>
  //             <TableCell style={{ fontSize: "0.7rem" }}>Dt. Realização</TableCell>
  //           </TableRow>
  //         </TableHead>
  //         <TableBody>{rows}</TableBody>
  //       </Table>
  //     </TableContainer>
  //   ) : (
  //     <LinearProgress />
  //   );
  // };

  // const situacaoContato = [
  //   {situacao: "3 TENTATIVAS EXCEDIDAS"},
  //   {situacao: "TELEFONE FORA DE ÁREA OU DESLIGADO"},
  //   {situacao: "TRATAMENTO EM OUTRO HOSPITAL"},
  //   {situacao: "TELEFONE NÃO EXISTE OU NÃO É DO PACIENTE"},
  //   {situacao: "PACIENTE NÃO DESEJA SER ATENDIDO NESSE MOMENTO"},
  //   {situacao: "PACIENTE FALECEU"},
  //   {situacao: "MARCAÇÃO REALIZADA"},
  //   {situacao: "TELEFONE DESLIGADO OU OCUPADO"},
  //   {situacao: "PACIENTE HOSPITALIZADO OU DOENTE"},
  //   {situacao: "NÃO ATENDEU A LIGAÇÃO"},
  // ]
  
