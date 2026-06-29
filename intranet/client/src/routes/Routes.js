import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { dashboard as dashboardRoutes } from "./index";
import DashboardLayout from "../layouts/Dashboard";
import Page404 from "../pages/auth/Page404";
import Login from  "../pages/auth/SignIn";
 
const childRoutes = (Layout, routes) =>
  routes.map(({ children, path, component: Component }, index) =>
    children ? (
      children.map(({ path, component: Component }, index) => (
        <Route
          key={index}
          path={path}
          exact
          render={(props) => (
            <Layout>
              <Component {...props} />
            </Layout>
          )}
        />
      ))
    ) : (
      <Route
        key={index}
        path={path}
        exact
        render={(props) => (
          <Layout>
            <Component {...props} />
          </Layout>
        )}
      />
    )
  );

const Routes = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={Login}/>
     {childRoutes(DashboardLayout, dashboardRoutes)} 
      <Route
        render={() => (
           <Page404 />
        )}
      />
    </Switch>
  </Router>
);

export default Routes;
