import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { NavLink as RouterNavLink } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import Tooltip from "@material-ui/core/Tooltip";
import Collapse from "@material-ui/core/Collapse";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { Breadcrumbs as MuiBreadcrumbs } from "@material-ui/core";
import { Divider as MuiDivider } from "@material-ui/core";
import { Button as MuiButton } from "@material-ui/core";
import { spacing } from "@material-ui/system";
import FilterListOutlinedIcon from "@material-ui/icons/FilterListOutlined";

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

const Title = (props) => {
  const {
    title,
    root,
    children,
    isFiltersExpanded,
    handleClickFilters,
  } = props;


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
            <Typography>{root}</Typography>
          </Breadcrumbs>
        </Grid>

        <Grid item>
          <Tooltip title="Filtros" aria-label="Mostrar Filtros">
            <SmallButton size="small" mr={2}>
              <FilterListOutlinedIcon
                onClick={handleClickFilters}
                aria-expanded={isFiltersExpanded}
              />
            </SmallButton>
          </Tooltip>
        </Grid>
      </Grid>

      <Divider my={6} mb={0} />

      <Collapse in={isFiltersExpanded} timeout="auto">
        <Box mb={2}>
          <Card>
            <CardContent>{children}</CardContent>
          </Card>
        </Box>
      </Collapse>
    </React.Fragment>
  );
};

Title.propTypes = {
  title: PropTypes.string.isRequired,
  root: PropTypes.string.isRequired,
  isFilersExpanded: PropTypes.bool,
};

export default Title;
