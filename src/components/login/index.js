import React, { Component } from 'react';
import  Validator from 'validator';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { login } from '../../actions';
import { getListOfEmployees } from '../../actions';
import { Form, Input, Button, Card, Row, Col } from 'antd';
import "antd/dist/antd.css";

class Login extends Component {

    constructor(props) {
        super(props);
        // defining the state to the component
        this.state = {
            data:{
                email: '',
                password: ''
            },
            errors: {}
        }
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    static getDerivedStateFromProps(nextProps, state){
        if(nextProps.loginStatus) {
            //nextProps.dispatch(getListOfEmployees());
            nextProps.history.push("/h1bform");
        }
    }
    // static getDerivedStateFromProps(nextProps, prevState) {
    //     console.log(nextProps);
    //     if(nextProps.error !== "") {
    //         prevState.errors = {email: nextProps.error};
    //     }
    //     if(nextProps.loginStatus) {
    //         this.props.history.push("/h1bform");
    //     }
    //     return null;
    // }

    onChange = e => this.setState({
        data: { ...this.state.data, [e.target.name]: e.target.value}
    });

    onSubmit = () => {
        // console.log(this.state.data);
        const errors = this.validate(this.state.data);
        this.setState({errors});
        if(Object.keys(errors).length===0){
            this.props.dispatch(login(this.state.data));
        }
    };

    validate = data => {
        const errors = {};
        if(!Validator.isEmail(data.email)) errors.email = "Invalid Email";
        if(!data.password) errors.password = "Can't be empty";
        return errors;
    }

    render() {
        const { data, errors } = this.state;
        return (
            <div style={{ background: '#ECECEC', padding: '30px', height:'100%' }}>
                <Row gutter={16}>
                    <Col offset={8} span={8}>
                        <img src="https://rsrit.com/wp-content/uploads/2017/12/logo_dark.png" alt="reliable" width="150px" height="50px"></img>
                    </Col>
                    <Col offset={8} span={8}>
                        <Card title="Login">
                            <Form>
                                <Form.Item error={!!errors.email} style={{color: 'red'}}>
                                    <Input id="email" type="text" name="email" value= {data.email} onChange={this.onChange} placeholder="example@rsrit.com" />
                                    {errors.email}
                                </Form.Item>
                                <Form.Item error={!!errors.password} style={{color: 'red'}}>
                                        <Input id="password" type="password" name="password" value= {data.password} onChange={this.onChange} placeholder="Make it Secure" />
                                    {errors.password}
                                </Form.Item>
                                <Button type="primary" onClick={this.onSubmit}>Submit</Button>
                                <Form.Item>
                                    <Link style={{float: 'left'}} to="/signup"><a>First time user? Sign Up</a></Link>
                                    <Link style={{float: 'right'}} to="/forgotpassword">Forgot Password</Link>
                                </Form.Item>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

Login.protoTypes = {

};

const mapStateToProps = state => {
    return {
    loginStatus: state.loginStatus,
    error: state.error,
    getEmployeesList:state.getEmployeesList
    }
};

export default connect(mapStateToProps)(Login);
