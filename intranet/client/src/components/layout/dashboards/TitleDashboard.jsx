import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { NavLink as RouterNavLink } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import Tooltip from "@material-ui/core/Tooltip";
// import Menu from "@material-ui/core/Menu";
// import MenuItem from "@material-ui/core/MenuItem";

import { Breadcrumbs as MuiBreadcrumbs } from "@material-ui/core";
import { Divider as MuiDivider } from "@material-ui/core";
import { Button as MuiButton } from "@material-ui/core";
import { spacing } from "@material-ui/system";

// import DashboardProvider from "../../contexts/DashboardContext";
import { useDashboard } from "../../../contexts/DashboardContext";

// import {
//   addDays,
//   addMonths,
//   convertDate,
//   getWeek,
//   getMonth,
// } from "../../../utils/dates";

import FilterListOutlinedIcon from "@material-ui/icons/FilterListOutlined";
// import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";

const NavLink = React.forwardRef((props, ref) => (
  <RouterNavLink innerRef={ref} {...props} />
));

const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const Button = styled(MuiButton)(spacing);
const SmallButton = styled(Button)`
  padding: 4px;
  min-width: 0;

  svg {
    width: 0.9em;
    height: 0.9em;
  }
`;

const PageTitle = (props) => {
  const {
    title,
    // expandInfo,
    // setExpandInfo,
    // expandFiltros,
    // setExpandFiltros,
    // periodoPesquisa,
    // setPeriodoPesquisa,
    // reload,
  } = props;

  const { isFiltrosExpanded, handleFiltrosExpanded } = useDashboard();

  // const getData = () => {
  //   switch (periodoPesquisa.periodo) {
  //     default:
  //       return new Date();
  //   }
  // };

  // const data = getData();
  // const data = new Date();

  // const [anchorEl, setAnchorEl] = useState(null);
  // const [dataLabel, setDataLabel] = useState(`Hoje`);
  // `Hoje: ${convertDate(dataInicio, "d M")}`;

  // const handleMenu = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };

  // const handleClose = () => {
  //   setAnchorEl(null);
  // };

  // const changePeriodoPesquisa = async (value) => {
  //   let novaDataInicio = "";
  //   let fim = "";
  //   let semana = "";
  //   let mes = "";
  //   let label = "";

  //   switch (value) {
  //     case "ontem":
  //       // novaDataInicio = addDays(dataInicio, -1);
  //       // fim = novaDataInicio;
  //       // label = `Ontem: ${convertDate(novaDataInicio, "d M")}`;
  //       // changeDataInicio(convertDate(inicio));
  //       // changeDataFim(inicio);
  //       break;
  //     // case "semana":
  //     //   semana = getWeek(data);
  //     //   inicio = semana.inicio;
  //     //   fim = semana.fim;
  //     //   label = `Semana: ${convertDate(inicio, "d/m")} - ${convertDate(
  //     //     fim,
  //     //     "d/m"
  //     //   )}`;
  //     //   break;
  //     // case "mes":
  //     //   mes = getMonth(data);
  //     //   inicio = mes.inicio;
  //     //   fim = mes.fim;
  //     //   label = `Mês: ${convertDate(inicio, "M Y")}`;
  //     //   break;
  //     // case "mes_anterior":
  //     //   console.log(addMonths(data, 1));
  //     //   mes = getMonth(addMonths(data, -1));
  //     //   inicio = mes.inicio;
  //     //   fim = mes.fim;
  //     //   label = `Mês: ${convertDate(inicio, "M Y")}`;
  //     //   break;
  //     // default:
  //     //   inicio = data;
  //     //   fim = inicio;
  //     //   label = `Hoje: ${convertDate(inicio, "d M")}`;
  //     //   break;
  //   }

  //   // changeDataInicio(inicio);
  //   // changeDataFim(convertDate(fim));

  //   // if (convertDate(dataInicio) !== convertDate(novaDataInicio)) {
  //   //   changeDataInicio(novaDataInicio);
  //   //   setDataLabel(label);
  //   // }

  //   // if (
  //   //   convertDate(inicio) !== periodoPesquisa.inicio ||
  //   //   convertDate(fim) !== periodoPesquisa.fim
  //   // ) {
  //   //   await setPeriodoPesquisa({
  //   //     ...periodoPesquisa,
  //   //     inicio: "00/00/0000",
  //   //     fim: "00/00/0000",
  //   //   });
  //   //   await setPeriodoPesquisa({
  //   //     ...periodoPesquisa,
  //   //     inicio: convertDate(inicio),
  //   //     fim: convertDate(fim),
  //   //   });
  //   //   setDataLabel(label);
  //   //   // await reload(true);
  //   //   // reload(false);
  //   // }

  //   handleClose();
  // };

  return (
    <React.Fragment>
      <Typography variant="h3" gutterBottom display="inline">
        {title}
      </Typography>

      <Grid justify="space-between" container spacing={6}>
        <Grid item>
          <Breadcrumbs aria-label="Breadcrumb" mt={2}>
            <Link component={NavLink} exact to="/">
              Início
            </Link>
            <Typography>Dashboards</Typography>
          </Breadcrumbs>
        </Grid>
        {/* <div>{convertDate(dataInicio)}</div> */}

        <Grid item>
          {/* <Tooltip title="Informações" aria-label="Informações">
            <SmallButton size="small" mr={2}>
              <InfoOutlinedIcon
                onClick={setExpandInfo}
                aria-expanded={expandInfo}
              />
            </SmallButton>
          </Tooltip> */}

          <Tooltip title="Filtros" aria-label="Mostrar Filtros">
            <SmallButton size="small" mr={2}>
              <FilterListOutlinedIcon
                onClick={handleFiltrosExpanded}
                aria-expanded={isFiltrosExpanded}
              />
            </SmallButton>
          </Tooltip>

          {/* <Button
            variant="contained"
            size="small"
            color="secondary"
            onClick={handleMenu}
            aria-haspopup="true"
            aria-owns={anchorEl ? "menu-periodo-pesquisa" : undefined}
          >
            {dataLabel}
          </Button>
          <Menu
            id="menu-periodo-pesquisa"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={() => changePeriodoPesquisa("hoje")}>
              Hoje
            </MenuItem>
            <MenuItem onClick={() => changePeriodoPesquisa("ontem")}>
              Ontem
            </MenuItem>
            <MenuItem onClick={() => changePeriodoPesquisa("semana")}>
              Semana
            </MenuItem>
            <MenuItem onClick={() => changePeriodoPesquisa("mes")}>
              Mês
            </MenuItem>
            <MenuItem onClick={() => changePeriodoPesquisa("mes_anterior")}>
              Mês Passado
            </MenuItem>
          </Menu> */}
        </Grid>
      </Grid>

      <Divider my={6} mb={0} />
    </React.Fragment>
  );
};

PageTitle.propTypes = {
  title: PropTypes.string.isRequired,
  // expandInfo: PropTypes.bool.isRequired,
  // setExpandInfo: PropTypes.func.isRequired,
  // expandFiltros: PropTypes.bool.isRequired,
  // setExpandFiltros: PropTypes.func.isRequired,
  // periodoPesquisa: PropTypes.object.isRequired,
  // setPeriodoPesquisa: PropTypes.func.isRequired,
  // reload: PropTypes.func.isRequired,
};

export default PageTitle;
