import React from "react";
import styled, { withTheme } from "styled-components";
import { connect } from "react-redux";
import { darken } from "polished";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import Toolbar from "@material-ui/core/Toolbar";
import InputBase from "@material-ui/core/InputBase";
import {
  AppBar as MuiAppBar,
  IconButton as MuiIconButton,
} from "@material-ui/core";
import { Menu as MenuIcon } from "@material-ui/icons";

import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";

const AppBar = styled(MuiAppBar)`
  background: ${(props) => props.theme.header.background};
  color: ${(props) => props.theme.header.color};
  box-shadow: ${(props) => props.theme.shadows[1]};
`;

const IconButton = styled(MuiIconButton)`
  svg {
    width: 22px;
    height: 22px;
  }
`;

const Search = styled.div`
  border-radius: 2px;
  background-color: ${(props) => props.theme.header.background};
  display: none;
  position: relative;
  width: 100%;

  &:hover {
    background-color: ${(props) => darken(0.05, props.theme.header.background)};
  }

  ${(props) => props.theme.breakpoints.up("md")} {
    display: block;
  }
`;

const SearchIconWrapper = styled.div`
  width: 50px;
  height: 100%;
  position: absolute;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 22px;
    height: 22px;
  }
`;

const Input = styled(InputBase)`
  color: inherit;
  width: 100%;

  > input {
    color: ${(props) => props.theme.header.search.color};
    padding-top: ${(props) => props.theme.spacing(2.5)}px;
    padding-right: ${(props) => props.theme.spacing(2.5)}px;
    padding-bottom: ${(props) => props.theme.spacing(2.5)}px;
    padding-left: ${(props) => props.theme.spacing(12)}px;
    width: 160px;
  }
`;

const logout = () => {
  localStorage.clear();
  window.location.href = '/';
}


const Header = ({ onDrawerToggle }) => (
  <React.Fragment>
    <AppBar position="sticky" elevation={0}>
      <Toolbar>
        <Grid container alignItems="center">
          <Hidden mdUp>
            <Grid item>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={onDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
            </Grid>
          </Hidden>
          <Grid item>
            <Search>
              <SearchIconWrapper>
                <SearchOutlinedIcon />
              </SearchIconWrapper>
              <Input placeholder="Procurar" />
            </Search>
          </Grid>
          <Grid item xs />
          <Grid item>

            <Button
              color="primary"
              variant="contained"
              onClick={logout}>
              Sair</Button>

          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  </React.Fragment>
);

export default connect()(withTheme(Header));
