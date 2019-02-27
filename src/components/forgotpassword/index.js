import React, { Component } from 'react';
import  Validator from 'validator';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { forgotPassword } from '../../actions';
import { Form, Input, Button, Card } from 'antd';
import "antd/dist/antd.css";

class ForgotPassword extends Component {

    constructor(props) {
        super(props);
        // defining the state to the component
        this.state = {
            data:{
                email: ''
            },
            errors: {}
        }
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
        // const errors = this.validate(this.state.data);
        // if(nextProps.error) {
        //     errors.email = nextProps.error;
        // } else {
        //   errors.email = '';
        //   this.props.history.push("/h1bform");
        // }
        // this.setState({errors});
    }

    onChange = e => this.setState({
        data: { ...this.state.data, [e.target.name]: e.target.value}
    });

    onSubmit = () => {
      console.log(this.state.data);
      const errors = this.validate(this.state.data);
      this.setState({errors});
      if(Object.keys(errors).length===0){
          this.props.dispatch(forgotPassword(this.state.data.email));
      }
    };

    validate = data => {
        const errors = {};
        if(!Validator.isEmail(data.email)) errors.email = "Invalid Email";
        return errors;
    }

    render() {
        const { data, errors } = this.state;
        return (
            <div>
                <Card title="Forgot Password">
                    <Form>
                        <Form.Item style={{color: 'red'}} error={!!errors.email}>
                            <Input id="email" type="text" name="email" value= {data.email} onChange={this.onChange} placeholder="example@example.com" />
                            {errors.email}
                        </Form.Item>
                        <Button type="primary" onClick={this.onSubmit}>Submit</Button>
                        <Form.Item>
                            <Link style={{float: 'left'}} to="/">Login</Link>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        );
    }
}

ForgotPassword.protoTypes = {

};

const mapStateToProps = state => ({
    // error: state.error
});

export default connect(mapStateToProps)(ForgotPassword);
