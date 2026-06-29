import React, { useEffect } from "react";
import Helmet from "react-helmet";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";
import TableChartOutlinedIcon from "@material-ui/icons/TableChartOutlined";
import TextField from "@material-ui/core/TextField";
import Title from "../../components/layout/dashboards/TitleDashboard";
// import Info from "../../components/layout/dashboards/InfoDashboard";
import TabPanel from "../../components/navigation/TabPanel";
import Filtros from "../../components/layout/dashboards/FiltrosDashboard";
import Input from "../../components/input/Input";
import Select from "../../components/input/Select";
import DataGrid from "../../components/data/DataGrid";
import DashboardProvider, {
  useDashboard,
  useDashboardMarcacao,
} from "../../contexts/DashboardContext";

const RelatorioPreAgendamentoCirurgico = (props) => {
  const { isFiltrosExpanded, listas, getListas } = useDashboard();
  const {
    data,
    loadDataPreAgendamento,
    loading,
    filtros,
    setFiltros,
  } = useDashboardMarcacao();

  useEffect(() => {
    if (data.length <= 0) {
      loadDataPreAgendamento();
    }
    // eslint-disable-next-line
  }, []);

  const columns = [
    { name: "id_paciente", title: "Prontuário", width: "15%" },
    {
      name: "nome_paciente",
      title: "Paciente",
      width: "25%",
    },
    {
      name: "cirurgia",
      title: "Cirurgia",
      width: "25%",
    },
    {
      name: "status_cirurgia",
      title: "Status",
      width: "15%",
      summary: "count",
    },
    { name: "data_solicitacao", title: "Data Solic", width: "10%" },
    { name: "data_exame", title: "Data Exame", width: "10%" },
    { name: "empresa", title: "Empresa", width: "20%" },
    {
      name: "cns",
      title: "CNS",
      width: "20%",
    },
    {
      name: "idade_paciente",
      title: "Idade",
      width: "10%",
    },
    {
      name: "cidade_paciente",
      title: "Cidade",
      width: "20%",
    },
    { name: "uf_cidade_paciente", title: "UF", width: "10%" },
    {
      name: "medico_solicitante",
      title: "Médico Solicitante",
      width: "30%",
    },
    { name: "medico_cirurgia", title: "Médico Cirurgia", width: "30%" },
    { name: "lente", title: "Lente", width: "30%" },
    { name: "convenio", title: "Convênio", width: "20%" },
  ];

  const details = ({ row }) => (
    <React.Fragment>
      <div>
        <b>Empresa:</b> {row.empresa}
      </div>
      <div>
        <b>CNS:</b> {row.cns_paciente}
      </div>
      <div>
        <b>Telefones:</b> {row.fone_paciente}
      </div>
      <div>
        <b>Idade: </b>
        {row.idade_paciente}
      </div>
      <div>
        <b>Cidade: </b>
        {row.cidade_paciente}/{row.uf_cidade_paciente}
      </div>
      <div>
        <b>Médico Solicitante: </b>
        {row.medico_solicitante}
      </div>
      <div>
        <b>Médico Cirurgia: </b>
        {row.medico_cirurgia}
      </div>
      <div>
        <b>Lente: </b>
        {row.lente}
      </div>
      <div>
        <b>Convênio: </b>
        {row.convenio}
      </div>
      <div>
        <b>RET: </b>
        {row.ret}
      </div>
    </React.Fragment>
  );

  const options = {
    sorting: true,
    defaultSorting: { column: "nome_paciente", direction: "asc" },
    filtering: true,
    grouping: true,
    paging: true,
    summary: true,
    hiddenColumns: [
      "empresa",
      "cns",
      "idade_paciente",
      "cidade_paciente",
      "uf_cidade_paciente",
      "medico_solicitante",
      "medico_cirurgia",
      "lente",
      "convenio",
    ],
  };

  // const info = {
  //   responsavel: "",
  //   conceito: "",
  //   ultimaAlteracao: "",
  // };

  return (
    <React.Fragment>
      <Filtros isExpanded={isFiltrosExpanded} spacing={3}>
        <Grid container spacing={3}>
          <Grid container item spacing={3}>
            <Grid item lg={2} md={3} sm={12}>
              <Input
                id="dataInicio"
                label="Data Solicitação Início"
                value={filtros.dataInicio}
                onChange={(event) =>
                  setFiltros("dataInicio", event.target.value)
                }
                mask="99/99/9999"
              />
            </Grid>

            <Grid item lg={2} md={3} sm={12}>
              <Input
                id="dataFim"
                label="Data Solicitação Fim"
                value={filtros.dataFim}
                onChange={(event) => setFiltros("dataFim", event.target.value)}
                mask="99/99/9999"
              />
            </Grid>
          </Grid>

          <Grid container item spacing={3}>
            <Grid item lg={2} md={3} sm={12}>
              <Input
                id="dataExameInicio"
                label="Data Exame Início"
                value={filtros.dataExameInicio}
                onChange={(event) =>
                  setFiltros("dataExameInicio", event.target.value)
                }
                mask="99/99/9999"
              />
            </Grid>

            <Grid item lg={2} md={3} sm={12}>
              <Input
                id="dataExameFim"
                label="Data Exame Fim"
                value={filtros.dataExameFim}
                onChange={(event) =>
                  setFiltros("dataExameFim", event.target.value)
                }
                mask="99/99/9999"
              />
            </Grid>
          </Grid>

          <Grid container item spacing={3}>
            <Grid item lg={2} md={3} sm={12}>
              <Input
                id="idadeMin"
                label="Idade Mínima"
                value={filtros.idadeMin}
                onChange={(event) =>
                  setFiltros("idadeMin", +event.target.value)
                }
                mask="999"
              />
            </Grid>

            <Grid item lg={2} md={3} sm={12}>
              <Input
                id="idadeMax"
                label="Idade Máxima"
                value={filtros.idadeMax}
                onChange={(event) =>
                  setFiltros("idadeMax", +event.target.value)
                }
                mask="999"
              />
            </Grid>
          </Grid>

          <Grid container item spacing={3}>
            <Grid item xs={12}>
              <Select
                id="filtroMedicoSolicitante"
                multiple
                onOpen={() => getListas("prestador")}
                onChange={(event, value) =>
                  setFiltros("medicoSolicitante", value)
                }
                options={listas.prestador}
                label={["id", "nome_prestador"]}
                title="Médico Solicitante"
              />
            </Grid>
          </Grid>

          <Grid container item spacing={3}>
            <Grid item xs={12}>
              <Select
                id="filtroMedicoCirurgia"
                multiple
                onOpen={() => getListas("prestador")}
                onChange={(event, value) => setFiltros("medicoCirurgia", value)}
                options={listas.prestador}
                label={["id", "nome_prestador"]}
                title="Médico Cirurgia"
              />
            </Grid>
          </Grid>

          <Grid container item spacing={3}>
            <Grid item xs={12}>
              <Select
                id="filtroCirurgia"
                multiple
                onOpen={() => getListas("cirurgia")}
                onChange={(event, value) => setFiltros("cirurgia", value)}
                options={listas.cirurgia}
                label={["id", "cirurgia"]}
                title="Cirurgia"
              />
            </Grid>
          </Grid>

          <Grid container item spacing={3}>
            <Grid item xs={12}>
              <Select
                id="filtroCidade"
                multiple
                onOpen={() => getListas("cidade")}
                onChange={(event, value) => setFiltros("cidade", value)}
                options={listas.cidade}
                label={["id", "cidade"]}
                title="Cidade"
              />
            </Grid>
          </Grid>

          <Grid container item spacing={3}>
            <Grid item xs={12}>
              <Select
                id="filtroLente"
                multiple
                onOpen={() => getListas("lente")}
                onChange={(event, value) => setFiltros("lente", value)}
                options={listas.lente}
                label={["id", "lente"]}
                title="Lente"
              />
            </Grid>
          </Grid>

          <Grid container item spacing={3}>
            <Grid item xs={12}>
              <TextField
                id="ret"
                label="RET"
                variant="outlined"
                onChange={(event) => setFiltros("ret", event.target.value)}
                value={filtros.ret}
                fullWidth
              />
            </Grid>
          </Grid>

          <Grid container item justify="flex-end">
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={loadDataPreAgendamento}
              >
                Carregar
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Filtros>

      <Card>
        <CardContent>
          {loading ? (
            <LinearProgress color="secondary" />
          ) : (
            <React.Fragment>
              <DataGrid
                columns={columns}
                rows={data}
                options={options}
                details={details}
              />
            </React.Fragment>
          )}
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

const MarcacaoDashboard = () => {
  const tabContent = [
    {
      label: (
        <React.Fragment>
          <TableChartOutlinedIcon />
          <div>Pré-Agendamento Cirúrgico</div>
        </React.Fragment>
      ),
      component: <RelatorioPreAgendamentoCirurgico />,
    },
  ];

  return (
    <DashboardProvider>
      <div>
        <Helmet title="Marcação" />
        <Title title="Marcação" />

        <TabPanel id="marcacao" tabs={tabContent} selected={0}></TabPanel>
      </div>
    </DashboardProvider>
  );
};

export default MarcacaoDashboard;
