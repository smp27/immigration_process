import React, { Component } from 'react';
import  Validator from 'validator';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { signUp } from '../../actions';
import { Form, Input, Button, Card, Row, Col } from 'antd';
import "antd/dist/antd.css";

class Signup extends Component {

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
        if(nextProps.signUpStatus) {
            alert('Account created successfully');
            nextProps.history.push("/");
        }
        if(nextProps.error !== "") {
            state.errors = {email: nextProps.error};
        }
        return null;
    }

    onChange = e => this.setState({
        data: { ...this.state.data, [e.target.name]: e.target.value}
    });

    onSubmit = () => {
      console.log(this.state.data);
        const errors = this.validate(this.state.data);
        this.setState({errors});
        if(Object.keys(errors).length===0){
            this.props.dispatch(signUp(this.state.data));
        }
    };

    validate = data => {
        const errors = {};
        if(!Validator.isEmail(data.email)) errors.email = "Invalid Email";
        if(!data.password) errors.password = "Please enter valid Password";
        if(data.password.length < 6) errors.password = "Password must be minimum 6 characters";
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
                        <Card title="Sign Up">
                            <Form>
                                <Form.Item style={{color: 'red'}} error={!!errors.email}>
                                    <Input id="email" type="text" name="email" value= {data.email} onChange={this.onChange} placeholder="example@example.com" />
                                    {errors.email}
                                </Form.Item>
                                <Form.Item style={{color: 'red'}} error={!!errors.password}>
                                        <Input id="password" type="password" name="password" value= {data.password} onChange={this.onChange} placeholder="Make it Secure" />
                                    {errors.password}
                                </Form.Item>
                                <Button type="primary" onClick={this.onSubmit}>Submit</Button>
                                <Form.Item>
                                    <Link style={{float: 'right'}} to="/">Login</Link>
                                </Form.Item>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

Signup.protoTypes = {

};

const mapStateToProps = state => {
    return {
        error: state.error,
        signUpStatus: state.signUpStatus
    }
};

export default connect(mapStateToProps)(Signup);
