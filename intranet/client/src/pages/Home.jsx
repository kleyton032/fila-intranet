import React from "react";
import styled from "styled-components";
import Helmet from "react-helmet";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import {
  Card as MuiCard,
  Divider as MuiDivider,
  Chip as MuiChip,
} from "@material-ui/core";
import { spacing } from "@material-ui/system";

const Card = styled(MuiCard)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Chip = styled(MuiChip)`
  height: 20px;
  margin-top: -3px;
  font-weight: bold;
  font-size: 75%;
`;

const Milestones = () => {
  return (
    <Card mb={6}>
      <CardContent pb={0}>
        <Typography variant="h6" gutterBottom>
          Milestones
        </Typography>

        <Box mt={3}>
          <ul>
            <li>
              Módulo Dashboards{" "}
              {/* <Chip color="primary" label="Em andamento" variant="outlined" /> */}
            </li>
            <li>Módulo Fila de Espera</li>
            <li>Central de Usuários</li>
            <li>Módulo Helpdesk</li>
            <li>Chatbot</li>
            <li>Central de Notificações</li>
            <li>Módulo Census</li>
            <li>Módulo Portal do Colaborador</li>
          </ul>
        </Box>
      </CardContent>
    </Card>
  );
};

const Changelog = () => {
  return (
    <Card mb={6}>
      <CardContent pb={0}>
        <Typography variant="h6" gutterBottom>
          Log de Alterações
        </Typography>

        <Box mt={3}>
          <Chip color="secondary" label="v0.0.5" /> – 14 Dez, 2020
          <ul>
            <li>
              Adicionado no menu lateral, Acesso V.E.R.
            </li>
            <li>Criação e customização do component V.E.R.</li>
            <li>
              Criação do arquivo de estilização na aplicação.
            </li>
            <li>Tela V.E.R, liberada para testes.</li>
          </ul>
        </Box>

        <Box mt={3}>
          <Chip color="secondary" label="v0.0.4" /> – 10 Ago, 2020
          <ul>
            <li>
              Adicionado os campos Médico e Atendimento no Dashboard Covid-19
            </li>
            <li>Alteração no component InfoDashboard</li>
            <li>
              Informações adicionadas nos Dashboards Covid-19 e Bloco Cirúrgico
            </li>
            <li>Dashboards Covid-19 e Bloco Cirúrgico liberados para teste</li>
          </ul>
        </Box>

        <Box mt={3}>
          <Chip color="secondary" label="v0.0.3" /> – 08 Ago, 2020
          <ul>
            <li>Dashboard Covid 19</li>
            <li>
              Alteração nas colunas CID e Conduta do relatório de Casos
              Suspeitos de Covid19
            </li>
            <li>Inclusão do painel de detalhes no component DataGrid;</li>
            <li>Inclusão do painel de pesquisa no component DataGrid</li>
          </ul>
        </Box>

        <Box mt={3}>
          <Chip color="secondary" label="v0.0.2" /> – 07 Ago, 2020
          <ul>
            <li>Alteração no SQL do relatório de Cirurgias Realizadas</li>
            <li>Inclusão do component DataGrid</li>
            <li>Remoção do component EmergenciaDashboard</li>
            <li>Alteração no Sidebar, ocultando o Dashboard Covid-19</li>
            <li>Correção no filtro de Mês Anterior dos Dashboards</li>
          </ul>
        </Box>

        <Box mt={3}>
          <Chip color="secondary" label="v0.0.1" /> – 05 Ago, 2020
          <ul>
            <li>Ajustes no component Title</li>
            <li>Inclusão dos filtros de períodos padrões de pesquisa</li>
            <li>Inclusão do dashboard Covid 19</li>
            <li>Inclusão da API Atendimentos</li>
          </ul>
        </Box>
      </CardContent>
    </Card>
  );
};

const Home = () => {
  return (
    <React.Fragment>
      <Helmet title="Inicio" />
      <Typography variant="h3" gutterBottom display="inline">
        Bem vindo à Intranet
      </Typography>

      <Divider my={6} />

      <Grid container spacing={6}>
        <Grid item xs={12} md={8}>
          <Changelog />
        </Grid>

        <Grid item xs={12} md={4}>
          <Milestones />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Home;
