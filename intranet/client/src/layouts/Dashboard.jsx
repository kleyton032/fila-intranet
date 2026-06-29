import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";

import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

import Hidden from "@material-ui/core/Hidden";
import CssBaseline from "@material-ui/core/CssBaseline";
import withWidth from "@material-ui/core/withWidth";
import { Paper as MuiPaper } from "@material-ui/core";
import { spacing } from "@material-ui/system";
import { isWidthUp } from "@material-ui/core/withWidth";

let drawerWidth = 70;

const GlobalStyle = createGlobalStyle`
  html,
  body,
  #root {
    height: 100%;
  }

  body {
    background: ${(props) => props.theme.body.background};
  }

  .MuiCardHeader-action .MuiIconButton-root {
    padding: 4px;
    width: 28px;
    height: 28px;
  }
`;

const Root = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Drawer = styled.div`
  ${(props) => props.theme.breakpoints.up("md")} {
    width: ${drawerWidth}px;
    flex-shrink: 0;
  }
`;

const AppContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Paper = styled(MuiPaper)(spacing);
{ /*${(props) => props.theme.body.background}*/}
const MainContent = styled(Paper)`
  flex: 1;
  background: #fff;
 

  @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
    flex: none;
  }

  .MuiPaper-root .MuiPaper-root {
    box-shadow: none;
  }
`;

const Dashboard = ({ children, routes, width }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerExpanded, setDrawerExpanded] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const expandDrawer = () => {
    setDrawerExpanded(true);
  };

  const collapseDrawer = () => {
    setDrawerExpanded(false);
  };

  return (
    <Root>
      <CssBaseline />
      <GlobalStyle />
      <Drawer onMouseEnter={expandDrawer} onMouseLeave={collapseDrawer}>
        <Hidden mdUp implementation="js">
          <Sidebar
            routes={routes}
            PaperProps={{
              style: {
                width: drawerExpanded ? 260 : 70,
                transition: "width 0.3s",
              },
            }}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            isExpanded={drawerExpanded}
          />
        </Hidden>
        <Hidden smDown implementation="css">
          <Sidebar
            routes={routes}
            PaperProps={{
              style: {
                width: drawerExpanded ? 260 : 70,
                transition: "width 0.3s",
              },
            }}
            isExpanded={drawerExpanded}
          />
        </Hidden>
      </Drawer>
      <AppContent style={{ width: "80vw" }}>
        <Header onDrawerToggle={handleDrawerToggle} />
        <MainContent p={isWidthUp("lg", width) ? 10 : 5}>
          {children}
        </MainContent>
        <Footer />
      </AppContent>
    </Root>
  );
};

export default withWidth()(Dashboard);
