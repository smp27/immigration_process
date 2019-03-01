import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getListOfEmployees } from '../../actions';
import { Layout, Menu, List } from 'antd'
import "antd/dist/antd.css";

const { Header, Content } = Layout;

const data = [
    'Shaik Mehboob',
    'Abhinay Anand',
    'Sandeep perkari',
    'Poornima',
    'Iris',
  ];

class EmployeeList extends Component {

    constructor(props) {
        super(props);
        // defining the state to the component
        this.state = {
            list: []
        }
    }

    componentDidMount() {
       // this.props.dispatch(getListOfEmployees());
    }

    render() {
        return (
            <div>
                <Layout>
                <Header className="header" >
                        <div className="logo" />
                        <Menu
                        theme="dark"
                        mode="horizontal"
                        style={{ lineHeight: '64px'}}
                        >
                        <Menu.Item key="1"><Link to='h1bform'>Immigration Form</Link></Menu.Item>
                        <Menu.Item key="2" style={{ float: 'right'}}><Link to="/logout">Logout</Link></Menu.Item>
                        </Menu>
                    </Header>  
                    <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
                    <List
                        header={<div>Employee's List</div>}
                        bordered
                        dataSource={data}
                        renderItem={item => (<List.Item>{item}</List.Item>)}
                        />
                    </Content>
                </Layout>
            </div>
        );
    }
}

EmployeeList.protoTypes = {

};

const mapStateToProps = state => ({
    // error: state.error
});

export default connect(mapStateToProps)(EmployeeList);
