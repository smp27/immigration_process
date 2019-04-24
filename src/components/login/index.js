import React, { Component } from 'react';
import  Validator from 'validator';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { login } from '../../actions';
import { Form, Input, Button, Card, Row, Col, Icon } from 'antd';
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
            users: [{ id: '', name:''}],
            errors: {}
        }
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    static getDerivedStateFromProps(nextProps, state){
        if(nextProps.loginStatus) {
            nextProps.history.push("/h1bform");
        }
        if(nextProps.error !== "") {
            state.errors = {email: state.error};
        }
        return null;
    }

    onChange = e => this.setState({
        data: { ...this.state.data, [e.target.name]: e.target.value}
    });

    onSubmit = (e) => {
        e.preventDefault();
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
        if(!data.password) errors.password = "Please enter valid Password";
        return errors;
    }

    addCat = (e) => {
        this.setState((prevState) => ({
          users: [...prevState.users, {name:"", id:""}],
        }));
    }

    handleChange = (e) => {
        if (["name", "id"].includes(e.target.className) ) {
          let users = [...this.state.users]
          users[e.target.id.split("-")[1]][e.target.className] = e.target.value.toUpperCase()
          this.setState({ users }, () => console.log(this.state.users))
        } else {
          this.setState({ [e.target.name]: e.target.value.toUpperCase() })
        }
    }

    handleSubmit = (e) => { e.preventDefault(); console.log(this.state); }

    render() {
        const { data, errors, users } = this.state;
        
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
                                    <Link style={{float: 'left'}} to="/signup">First time user? Sign Up</Link>
                                    <Link style={{float: 'right'}} to="/forgotpassword">Forgot Password</Link>
                                </Form.Item>
                            </Form>

                            {/* <Form onSubmit={this.handleSubmit} onChange={this.handleChange}>
                                <button onClick={this.addCat}>Add new cat</button>
                                {
                                    users.map((val, idx)=> {
                                        let catId = `cat-${idx}`, idId = `id-${idx}`
                                        return (
                                            <div key={idx}>
                                                <Form.Item label="ID">
                                                    <Input id={idId} type="text" name={idId} className="id"/>
                                                </Form.Item>
                                                <Form.Item label="Name">
                                                    <Input id={catId} type="text" name={catId} className="name"/>
                                                </Form.Item>
                                                <label htmlFor={catId}>{`Cat #${idx + 1}`}</label>
                                                <input
                                                type="text"
                                                name={catId}
                                                id={catId}
                                                className="name"
                                                />
                                                <label htmlFor={idId}>id</label>
                                                <input
                                                type="text"
                                                name={idId}
                                                id={idId}
                                                className="id"
                                                />
                                            </div>
                                        )
                                    })
                                }
                                <input type="submit" value="Submit" />
                            </Form> */}

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
