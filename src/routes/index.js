import React from "react";
import { Route, Switch, Redirect, BrowserRouter } from "react-router-dom";
import Login from "../components/login";
import H1bForm from '../components/h1bform/form';
import Logout from '../components/logout';
import ForgotPassword from '../components/forgotpassword';
import Signup from '../components/signup';
import EmployeeList from '../components/employeelist';
import PrivateRoute from '../components/privateroute';

const Routes = () => {
  return (
    <BrowserRouter>
        <Switch>
          <Route exact path="/" render={(props) => <Login {...props} />} />
          <Route exact path="/forgotpassword" render={(props) => <ForgotPassword {...props} />} />
          <Route exact path="/signup" render={(props) => <Signup {...props} />} />
          <PrivateRoute path="/employeelist" component={EmployeeList} />
          <PrivateRoute path="/h1bform" component={H1bForm} />
          <PrivateRoute path="/logout" component={Logout} />
          <Redirect to="/" />
        </Switch>
    </BrowserRouter>
  );
};

export default Routes;
