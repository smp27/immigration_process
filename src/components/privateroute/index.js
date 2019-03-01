import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from "react-router-dom";


class PrivateRoute extends Component {
    render() {
      const { component: Component, loginStatus, ...props } = this.props
  
      return (
        <Route 
          {...props} 
          render={props => (
            loginStatus ?
              <Component {...props} /> :
              <Redirect to='/' />
          )} 
        />
      )
    }
  }


const mapStateToProps = state => {
    return {
     loginStatus: state.loginStatus    
  }};

  export default connect(mapStateToProps)(PrivateRoute);