import React, { Component } from 'react';
import  Validator from 'validator';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { login } from '../../actions';
import { Form, Input, Button, Card } from 'antd';
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

    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
        if(nextProps.loginStatus) {
            this.props.history.push("/h1bform");
        }
    }

    onChange = e => this.setState({
        data: { ...this.state.data, [e.target.name]: e.target.value}
    });

    onSubmit = () => {
      console.log(this.state.data);
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
            <div>
                <Card title="Login">
                    <Form>
                        <Form.Item error={!!errors.email}>
                            <Input id="email" type="text" name="email" value= {data.email} onChange={this.onChange} placeholder="example@example.com" />
                            {errors.email}
                        </Form.Item>
                        <Form.Item error={!!errors.password}>
                                <Input id="password" type="password" name="password" value= {data.password} onChange={this.onChange} placeholder="Make it Secure" />
                            {errors.password}
                        </Form.Item>
                        <Button type="primary" onClick={this.onSubmit}>Submit</Button>
                    </Form>
                </Card>
            </div>
        );
    }
}

Login.protoTypes = {

};

const mapStateToProps = state => ({
    // console.log(state);
    loginStatus: state.loginStatus
});

export default connect(mapStateToProps)(Login);
