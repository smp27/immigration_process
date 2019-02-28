import React from "react";
import { Route, Switch, Redirect, BrowserRouter } from "react-router-dom";
import Login from "../components/login";
import H1bForm from '../components/h1bform/form';
import Logout from '../components/logout';
import ForgotPassword from '../components/forgotpassword';
import Signup from '../components/signup';
import EmployeeList from '../components/employeelist';
import { connect } from 'react-redux';

const auth = {
  isLoggedIn: true
}

const PrivateRoute = ({ component: Component, ...rest}) => (
  <Route {...rest} render={(props) => (
    auth.isLoggedIn === true
      ? <Component {...props} />
      : <Redirect to="/" />
  )} />
)

const Routes = () => {
  return (
    <BrowserRouter>
        <Switch>
          <Route exact path="/" render={(props) => <Login {...props} />} />
          <Route exact path="/forgotpassword" render={(props) => <ForgotPassword {...props} />} />
          <Route exact path="/signup" render={(props) => <Signup {...props} />} />
          {/* <Route exact path="/h1bform" render={(props) => <H1bForm {...props} />} /> */}
          {/* <Route exact path="/logout" render={(props) => <Logout {...props} />} /> */}
          {/* <Route exact path="/employeelist" render={(props) => <EmployeeList {...props} />} /> */}
          <PrivateRoute path="/employeelist" component={EmployeeList} />
          <PrivateRoute path="/h1bform" component={H1bForm} />
          <PrivateRoute path="/logout" component={Logout} />
          <Redirect to="/" />
        </Switch>
    </BrowserRouter>
  );
};

const mapStateToProps = state => {
  // console.log(state);
  // auth.isLoggedIn = state.loginStatus;
  // loginStatus: state.loginStatus
};

export default connect(mapStateToProps)(Routes);
