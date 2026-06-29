import React, { useEffect } from "react";
import Helmet from "react-helmet";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";
import TableChartOutlinedIcon from "@material-ui/icons/TableChartOutlined";
import Title from "../../components/layout/dashboards/TitleDashboard";
// import Info from "../../components/layout/dashboards/InfoDashboard";
import TabPanel from "../../components/navigation/TabPanel";
import Filtros from "../../components/layout/dashboards/FiltrosDashboard";
import Input from "../../components/input/Input";
import Select from "../../components/input/Select";
import DataGrid from "../../components/data/DataGrid";
import DashboardProvider from "../../contexts/DashboardContext";
import {
  useDashboard,
  useDashboardAtendimentos,
} from "../../contexts/DashboardContext";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";

const RelatorioAtendimentosPorHora = () => {
  const { isFiltrosExpanded, listas, getListas } = useDashboard();
  const {
    data,
    loadDataAtendimentosPorHora,
    loading,
    filtros,
    setFiltros,
  } = useDashboardAtendimentos();

  useEffect(() => {
    if (data.length <= 0) {
      loadDataAtendimentosPorHora();
    }
  }, []);

  const columns = [
    { name: "hora", title: "Hora", width: "12%" },
    { name: "turno", title: "Turno", width: "12%" },
    {
      name: "sum_agendados",
      title: "Agendados",
      width: "19%",
      align: "right",
    },
    {
      name: "sum_triados",
      title: "Triados",
      width: "19%",
      align: "right",
    },
    {
      name: "sum_recepcionados",
      title: "Recepcionados",
      width: "19%",
      align: "right",
    },
    {
      name: "sum_atendidos",
      title: "Atendidos",
      width: "19%",
      align: "right",
    },
  ];

  const options = {
    sorting: true,
    defaultSorting: { column: "hora", direction: "asc" },
    filtering: true,
    grouping: true,
    paging: true,
    summary: true,
  };

  const summaryItens = [
    { columnName: "sum_agendados", type: "avg" },
    { columnName: "sum_triados", type: "avg" },
    { columnName: "sum_recepcionados", type: "avg" },
    { columnName: "sum_atendidos", type: "avg" },
    { columnName: "sum_agendados", type: "sum" },
    { columnName: "sum_triados", type: "sum" },
    { columnName: "sum_recepcionados", type: "sum" },
    { columnName: "sum_atendidos", type: "sum" },
  ];

  const summaryItensGroup = [
    {
      columnName: "sum_agendados",
      type: "avg",
      showInGroupFooter: false,
      alignByColumn: true,
    },
    {
      columnName: "sum_triados",
      type: "avg",
      showInGroupFooter: false,
      alignByColumn: true,
    },
    {
      columnName: "sum_recepcionados",
      type: "avg",
      showInGroupFooter: false,
      alignByColumn: true,
    },
    {
      columnName: "sum_atendidos",
      type: "avg",
      showInGroupFooter: false,
      alignByColumn: true,
    },
    {
      columnName: "sum_agendados",
      type: "sum",
      showInGroupFooter: false,
      alignByColumn: true,
    },
    {
      columnName: "sum_triados",
      type: "sum",
      showInGroupFooter: false,
      alignByColumn: true,
    },
    {
      columnName: "sum_recepcionados",
      type: "sum",
      showInGroupFooter: false,
      alignByColumn: true,
    },
    {
      columnName: "sum_atendidos",
      type: "sum",
      showInGroupFooter: false,
      alignByColumn: true,
    },
  ];

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
                  setFiltros("dataInicio", event.target.value)
                }
                mask="99/99/9999"
              />
            </Grid>

            <Grid item lg={2} md={3} sm={12}>
              <Input
                id="dataFim"
                label="Data Fim"
                value={filtros.dataFim}
                onChange={(event) => setFiltros("dataFim", event.target.value)}
                mask="99/99/9999"
              />
            </Grid>

            <Grid item xs={12}>
              <Select
                id="filtroEmpresas"
                multiple
                onOpen={() => getListas("empresas")}
                onChange={(event, value) => setFiltros("empresas", value)}
                options={listas.empresas}
                label={"empresa"}
                title="Empresas"
              />
            </Grid>

            <Grid item xs={12}>
              <Select
                id="filtroSetores"
                multiple
                onOpen={() => getListas("setores")}
                onChange={(event, value) => setFiltros("setores", value)}
                options={listas.setores}
                label={["id", "setor"]}
                title="Setores"
              />
            </Grid>
          </Grid>

          <Grid container item justify="flex-end">
            <Grid item lg={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={loadDataAtendimentosPorHora}
                startIcon={<SearchOutlinedIcon />}
                fullWidth
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
                summaryItensGroup={summaryItensGroup}
              />
            </React.Fragment>
          )}
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

const AtendimentoDashboard = () => {
  const tabContent = [
    {
      label: (
        <React.Fragment>
          <TableChartOutlinedIcon />
          <div>Por Hora</div>
        </React.Fragment>
      ),
      component: <RelatorioAtendimentosPorHora />,
    },
  ];

  return (
    <DashboardProvider>
      <div>
        <Helmet title="Atendimento" />
        <Title title="Atendimento" />

        <TabPanel id="atendimento" tabs={tabContent} selected={0}></TabPanel>
      </div>
    </DashboardProvider>
  );
};

export default AtendimentoDashboard;
