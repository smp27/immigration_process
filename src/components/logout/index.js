import React, { Component } from 'react';
import { connect } from 'react-redux';
import { logout } from '../../actions';

class Logout extends Component {

  componentDidMount(){
    this.props.dispatch(logout());
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    if(!nextProps.loginStatus) {
      this.props.history.push("/login");
    }
  }

  render() {
    return (
      <div>Logout</div>
    );
  }
}

Logout.propTypes = {
  // logout: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  loginStatus: state.loginStatus
});

export default connect(mapStateToProps)(Logout);
