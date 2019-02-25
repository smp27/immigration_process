import React from "react";
import { Route, Switch, Redirect, BrowserRouter } from "react-router-dom";
import Login from "../components/login";
import H1bForm from '../components/h1bform/form';
import Logout from '../components/logout';

export default () => {
  return (
    <BrowserRouter>
        <Switch>
          <Route exact path="/" render={(props) => <Login {...props} />} />
          <Route exact path="/h1bform" render={(props) => <H1bForm {...props} />} />
          <Route exact path="/logout" render={(props) => <Logout {...props} />} />
          <Redirect to="/" />
        </Switch>
    </BrowserRouter>
  );
};
