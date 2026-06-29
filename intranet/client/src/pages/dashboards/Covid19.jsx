import React, { useEffect } from "react";
import styled from "styled-components";
import Helmet from "react-helmet";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";
import { Chip as MuiChip } from "@material-ui/core";
import TableChartOutlinedIcon from "@material-ui/icons/TableChartOutlined";
import Title from "../../components/layout/dashboards/TitleDashboard";
import TabPanel from "../../components/navigation/TabPanel";
import Filtros from "../../components/layout/dashboards/FiltrosDashboard";
import Input from "../../components/input/Input";
import DataGrid from "../../components/data/DataGrid";
import DashboardProvider, {
  useDashboard,
  useDashboardCovid19,
} from "../../contexts/DashboardContext";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";

import { red, green } from "@material-ui/core/colors";

const Chip = styled(MuiChip)`
  height: 20px;
  padding: 4px 0;
  font-size: 90%;
  background-color: ${(props) => props.rgbcolor};
  color: ${(props) => props.theme.palette.common.white};
`;

const RelatorioCasosSuspeitos = (props) => {
  const { isFiltrosExpanded } = useDashboard();
  const {
    data,
    loadDataCasosSuspeitos,
    loading,
    filtros,
    setFiltros,
  } = useDashboardCovid19();

  useEffect(() => {
    if (data.length <= 0) {
      loadDataCasosSuspeitos();
    }
    // eslint-disable-next-line
  }, []);

  const columns = [
    { name: "data_atendimento", title: "Data", width: "15%" },
    { name: "id_paciente", title: "Prontuário", width: "10%" },
    { name: "nome_paciente", title: "Nome", width: "40%" },
    { name: "idade", title: "Idade", width: "10%" },
    { name: "cidade", title: "Cidade", width: "25%", summary: "count" },
    { name: "atestado", title: "Atestado", width: "15%" },
    { name: "cid", title: "CID", width: "25%" },
    { name: "conduta", title: "Conduta", width: "50%" },
    { name: "id_atendimento", title: "Atendimento", width: "10%" },
    { name: "nome_prestador", title: "Médico", width: "30%" },
  ];

  const details = ({ row }) => (
    <React.Fragment>
      <div>
        <b>Atendimento:</b> {row.id_atendimento}
      </div>
      <div>
        <b>Médico:</b> {row.nome_prestador}
      </div>
      <div>
        <b>Conduta: </b>
        {row.conduta}
      </div>
      <div>
        <b>CID: </b>
        {row.cid}
      </div>
      <div>
        <b>Atestado: </b>
        {row.atestado === "Sim" ? (
          <Chip label={row.atestado} rgbcolor={green[500]} />
        ) : (
          <Chip label={row.atestado} rgbcolor={red[500]} />
        )}
      </div>
    </React.Fragment>
  );

  const options = {
    sorting: true,
    defaultSorting: { column: "data_atendimento", direction: "asc" },
    filtering: true,
    grouping: true,
    paging: true,
    summary: true,
    hiddenColumns: [
      "atestado",
      "cid",
      "conduta",
      "id_atendimento",
      "nome_prestador",
    ],
  };

  // const info = {
  //   responsavel: "Leilian Chaves",
  //   conceito: "Atendimentos classificados como Vermelho Coronavírus.",
  //   ultimaAlteracao:
  //     "10/08/2020 - Liberado para teste, adicionado colunas Atendimento e Médico",
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
          </Grid>

          <Grid container item justify="flex-end">
            <Grid item lg={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={loadDataCasosSuspeitos}
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
                details={details}
              />
            </React.Fragment>
          )}
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

const Covid19Dashboard = () => {
  const tabContent = [
    {
      label: (
        <React.Fragment>
          <TableChartOutlinedIcon />
          <div>Casos Suspeitos</div>
        </React.Fragment>
      ),
      component: <RelatorioCasosSuspeitos />,
    },
  ];

  return (
    <DashboardProvider>
      <div>
        <Helmet title="Covid 19" />
        <Title title="Covid 19" />

        <TabPanel id="covid-19" tabs={tabContent} selected={0}></TabPanel>
      </div>
    </DashboardProvider>
  );
};

export default Covid19Dashboard;
