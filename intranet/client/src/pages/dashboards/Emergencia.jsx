import React, { useEffect } from "react";
import Helmet from "react-helmet";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";
import TableChartOutlinedIcon from "@material-ui/icons/TableChartOutlined";
import Title from "../../components/layout/dashboards/TitleDashboard";
import TabPanel from "../../components/navigation/TabPanel";
import Filtros from "../../components/layout/dashboards/FiltrosDashboard";
import Input from "../../components/input/Input";
import DataGrid from "../../components/data/DataGrid";
import DashboardProvider from "../../contexts/DashboardContext";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import {
  useDashboard,
  useDashboardEmergencia,
} from "../../contexts/DashboardContext";

const RelatorioAtendimentosPorClassificacao = () => {
  const { isFiltrosExpanded } = useDashboard();

  const {
    relatorioClassificacao,
    loadRelatorioClassificacao,
    // filtros,
    setFiltros,
  } = useDashboardEmergencia();

  const data = relatorioClassificacao.data;
  const loading = relatorioClassificacao.loading;
  const filtros = relatorioClassificacao.filtros;

  useEffect(() => {
    if (data.length <= 0) {
      loadRelatorioClassificacao();
    }
    // eslint-disable-next-line
  }, []);

  const columns = [
    { name: "data_recepcao", title: "Data", width: "10%" },
    { name: "dia_semana", title: "Dia", width: "10%" },
    {
      name: "sum_amarelo",
      title: (
        <React.Fragment>
          <span style={{ color: "rgb(255,255,0)" }}>&#11044;</span>
          <div>Amarelo</div>
        </React.Fragment>
      ),
      width: "10%",
      align: "right",
    },
    {
      name: "sum_azul",
      title: (
        <React.Fragment>
          <span style={{ color: "rgb(0,51,255)" }}>&#11044;</span>
          <div>Azul</div>
        </React.Fragment>
      ),
      width: "10%",
      align: "right",
    },
    {
      name: "sum_laranja",
      title: (
        <React.Fragment>
          <span style={{ color: "rgb(255,153,0)" }}>&#11044;</span>
          <div>Laranja</div>
        </React.Fragment>
      ),
      width: "10%",
      align: "right",
    },
    {
      name: "sum_verde",
      title: (
        <React.Fragment>
          <span style={{ color: "rgb(0,153,0)" }}>&#11044;</span>
          <div>Verde</div>
        </React.Fragment>
      ),
      width: "10%",
      align: "right",
    },
    {
      name: "sum_verde_ulcera_cornea",
      title: (
        <React.Fragment>
          <span style={{ color: "rgb(0,255,153)" }}>&#11044;</span>
          <div>Úlcera Corneana</div>
        </React.Fragment>
      ),
      width: "10%",
      align: "right",
    },
    {
      name: "sum_vermelho",
      title: (
        <React.Fragment>
          <span style={{ color: "rgb(255,0,0)" }}>&#11044;</span>
          <div>Vermelho</div>
        </React.Fragment>
      ),
      width: "10%",
      align: "right",
    },
    {
      name: "sum_vermelho_coronavirus",
      title: (
        <React.Fragment>
          <span style={{ color: "rgb(255,51,51)" }}>&#11044;</span>
          <div>Coronavírus</div>
        </React.Fragment>
      ),
      width: "10%",
      align: "right",
    },
    {
      name: "sum_vermelho_cirurgia",
      title: (
        <React.Fragment>
          <span style={{ color: "rgb(204,0,0)" }}>&#11044;</span>
          <div>Cirurgia</div>
        </React.Fragment>
      ),
      width: "10%",
      align: "right",
    },
  ];

  const options = {
    sorting: true,
    defaultSorting: { column: "data_recepcao", direction: "asc" },
    filtering: true,
    grouping: true,
    paging: true,
    summary: true,
  };

  const summaryItens =
    data.length > 1
      ? [
          { columnName: "sum_amarelo", type: "avg" },
          { columnName: "sum_azul", type: "avg" },
          { columnName: "sum_laranja", type: "avg" },
          { columnName: "sum_verde", type: "avg" },
          { columnName: "sum_verde_ulcera_cornea", type: "avg" },
          { columnName: "sum_vermelho", type: "avg" },
          { columnName: "sum_vermelho_coronavirus", type: "avg" },
          { columnName: "sum_vermelho_cirurgia", type: "avg" },
          { columnName: "sum_amarelo", type: "sum" },
          { columnName: "sum_azul", type: "sum" },
          { columnName: "sum_laranja", type: "sum" },
          { columnName: "sum_verde", type: "sum" },
          { columnName: "sum_verde_ulcera_cornea", type: "sum" },
          { columnName: "sum_vermelho", type: "sum" },
          { columnName: "sum_vermelho_coronavirus", type: "sum" },
          { columnName: "sum_vermelho_cirurgia", type: "sum" },
        ]
      : "";

  return (
    <React.Fragment>
      <Filtros isExpanded={isFiltrosExpanded} spacing={3}>
        <Grid container spacing={3}>
          <Grid container item spacing={3}>
            <Grid item lg={2} md={3} sm={12}>
              <Input
                id="dataInicio"
                label="Data Início"
                value={filtros.dataInicio}
                onChange={(event) =>
                  setFiltros(
                    "relatorioClassificacao",
                    "dataInicio",
                    event.target.value
                  )
                }
                mask="99/99/9999"
              />
            </Grid>

            <Grid item lg={2} md={3} sm={12}>
              <Input
                id="dataFim"
                label="Data Fim"
                value={filtros.dataFim}
                onChange={(event) =>
                  setFiltros(
                    "relatorioClassificacao",
                    "dataFim",
                    event.target.value
                  )
                }
                mask="99/99/9999"
              />
            </Grid>
          </Grid>

          <Grid container item justify="flex-end">
            <Grid item lg={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={loadRelatorioClassificacao}
                fullWidth
                startIcon={<SearchOutlinedIcon />}
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
                summaryItens={summaryItens}
              />
            </React.Fragment>
          )}
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

const RelatorioEvasoes = () => {
  const { isFiltrosExpanded } = useDashboard();

  const {
    // dataRelatorioEvasoes,
    // loadDataEvasoes,
    // loading,
    // filtros,
    relatorioEvasoes,
    loadRelatorioEvasoes,
    setFiltros,
  } = useDashboardEmergencia();

  const relatorioName = "relatorioEvasoes";
  const data = relatorioEvasoes.data;
  const loading = relatorioEvasoes.loading;
  const filtros = relatorioEvasoes.filtros;

  useEffect(() => {
    if (data.length <= 0) {
      loadRelatorioEvasoes();
    }
    // eslint-disable-next-line
  }, []);

  const columns = [
    { name: "data_recepcao", title: "Data", width: "10%" },
    { name: "dia_semana", title: "Dia", width: "10%" },
  ];

  const options = {
    sorting: true,
    defaultSorting: { column: "data_recepcao", direction: "asc" },
    filtering: true,
    grouping: true,
    paging: true,
    summary: true,
  };

  // const summaryItens =
  //   data.length > 1
  //     ? [
  //         { columnName: "sum_amarelo", type: "avg" },
  //         { columnName: "sum_azul", type: "avg" },
  //         { columnName: "sum_laranja", type: "avg" },
  //         { columnName: "sum_verde", type: "avg" },
  //         { columnName: "sum_verde_ulcera_cornea", type: "avg" },
  //         { columnName: "sum_vermelho", type: "avg" },
  //         { columnName: "sum_vermelho_coronavirus", type: "avg" },
  //         { columnName: "sum_vermelho_cirurgia", type: "avg" },
  //         { columnName: "sum_amarelo", type: "sum" },
  //         { columnName: "sum_azul", type: "sum" },
  //         { columnName: "sum_laranja", type: "sum" },
  //         { columnName: "sum_verde", type: "sum" },
  //         { columnName: "sum_verde_ulcera_cornea", type: "sum" },
  //         { columnName: "sum_vermelho", type: "sum" },
  //         { columnName: "sum_vermelho_coronavirus", type: "sum" },
  //         { columnName: "sum_vermelho_cirurgia", type: "sum" },
  //       ]
  //     : "";

  return (
    <React.Fragment>
      <Filtros isExpanded={isFiltrosExpanded} spacing={3}>
        <Grid container spacing={3}>
          <Grid container item spacing={3}>
            <Grid item lg={2} md={3} sm={12}>
              <Input
                id="dataInicio"
                label="Data Início"
                value={filtros.dataInicio}
                onChange={(event) =>
                  setFiltros(relatorioName, "dataInicio", event.target.value)
                }
                mask="99/99/9999"
              />
            </Grid>

            <Grid item lg={2} md={3} sm={12}>
              <Input
                id="dataFim"
                label="Data Fim"
                value={filtros.dataFim}
                onChange={(event) =>
                  setFiltros(relatorioName, "dataFim", event.target.value)
                }
                mask="99/99/9999"
              />
            </Grid>
          </Grid>

          <Grid container item justify="flex-end">
            <Grid item lg={2} sm={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={loadRelatorioEvasoes}
                fullWidth
                startIcon={<SearchOutlinedIcon />}
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
                // summaryItens={summaryItens}
              />
            </React.Fragment>
          )}
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

const EmergenciaDashboard = () => {
  const tabContent = [
    {
      label: (
        <React.Fragment>
          <TableChartOutlinedIcon />
          <div>Classificacão</div>
        </React.Fragment>
      ),
      component: <RelatorioAtendimentosPorClassificacao />,
    },
    {
      label: (
        <React.Fragment>
          <TableChartOutlinedIcon />
          <div>Evasão</div>
        </React.Fragment>
      ),
      component: <RelatorioEvasoes />,
    },
  ];

  return (
    <DashboardProvider>
      <div>
        <Helmet title="Emergência" />
        <Title title="Emergência" />

        <TabPanel id="emergencia" tabs={tabContent} selected={0}></TabPanel>
      </div>
    </DashboardProvider>
  );
};

export default EmergenciaDashboard;
