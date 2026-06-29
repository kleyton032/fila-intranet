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
import DashboardProvider, {
  useDashboard,
  useDashboardBlocoCirurgico,
} from "../../contexts/DashboardContext";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";

const RelatorioCirurgiasRealizadas = () => {
  const { isFiltrosExpanded, listas, getListas } = useDashboard();
  const {
    data,
    loadDataCirurgiasRealizadas,
    loading,
    filtros,
    setFiltros,
  } = useDashboardBlocoCirurgico();

  useEffect(() => {
    if (data.length <= 0) {
      loadDataCirurgiasRealizadas();
    }
    // eslint-disable-next-line
  }, []);

  const columns = [
    { name: "id", title: "Cód", width: "10%" },
    { name: "cirurgia", title: "Cirurgia", width: "40%" },
    { name: "tipo_cirurgia", title: "Tipo Cirurgia", width: "20%" },
    {
      name: "count_pacientes",
      title: "Qtd Paciente",
      width: "15%",
      align: "right",
      filtering: false,
      summary: "sum",
    },
    {
      name: "sum_olhos",
      title: "Qtd Olhos",
      width: "15%",
      align: "right",
      filtering: false,
      summary: "sum",
    },
  ];

  const options = {
    sorting: true,
    defaultSorting: { column: "sum_olhos", direction: "desc" },
    filtering: true,
    grouping: true,
    paging: true,
    summary: true,
  };

  // const info = {
  //   responsavel: "Kátia Liu",
  //   conceito: "Cirurgias realizadas por Quantidade de paciente e olhos",
  //   ultimaAlteracao: "10/08/2020 - Liberado para teste",
  // };

  return (
    <React.Fragment>
      <Filtros isExpanded={isFiltrosExpanded} spacing={3}>
        <Grid container spacing={3}>
          <Grid container item spacing={3}>
            <Grid item lg={2} md={3} sm={12}>
              <Input
                id="dataInicio"
                label="Data da Cirurgia Início"
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
                label="Data da Cirurgia Fim"
                value={filtros.dataFim}
                onChange={(event) => setFiltros("dataFim", event.target.value)}
                mask="99/99/9999"
              />
            </Grid>

            <Grid item xs={12}>
              <Select
                id="filtroCirurgias"
                multiple
                onOpen={() => getListas("cirurgia")}
                onChange={(event, value) => setFiltros("cirurgia", value)}
                options={listas.cirurgia}
                label={["id", "cirurgia"]}
                title="Cirurgias"
              />
            </Grid>
          </Grid>

          <Grid container item justify="flex-end">
            <Grid item lg={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={loadDataCirurgiasRealizadas}
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
              <DataGrid columns={columns} rows={data} options={options} />
            </React.Fragment>
          )}
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

function BlocoCirurgicoDashboard() {
  const tabContent = [
    {
      label: (
        <React.Fragment>
          <TableChartOutlinedIcon />
          <div>Cirurgias Realizadas</div>
        </React.Fragment>
      ),
      component: <RelatorioCirurgiasRealizadas />,
    },
  ];

  return (
    <DashboardProvider>
      <div>
        <Helmet title="Bloco Cirúrgico" />

        <Title title="Bloco Cirúrgico" />

        <TabPanel
          id="bloco-cirurgico"
          tabs={tabContent}
          selected={0}
        ></TabPanel>
      </div>
    </DashboardProvider>
  );
}

export default BlocoCirurgicoDashboard;
