import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
// import { getListOfEmployees } from '../../actions';
import { Menu, Dropdown, Icon, Layout, List, Row, Col } from 'antd'
import "antd/dist/antd.css";

const { Header, Content } = Layout;

const menu = (
    <Menu>
        <Menu.Item><Link style={{ float: 'right'}} to="/employeelist">Employee List</Link></Menu.Item>
        <Menu.Item><Link style={{ float: 'right'}} to="/admin">Admin Panel</Link></Menu.Item>
        <Menu.Item><Link style={{ float: 'right'}} to="/logout">Logout</Link></Menu.Item>
    </Menu>
);

class EmployeeList extends Component {

    constructor(props) {
        super(props);
        // defining the state to the component
        this.state = {
            list: []
        }
        this.onClick = this.onClick.bind(this);
    }

    static getDerivedStateFromProps(nextProps, state){
        state.list = nextProps.getEmployeesList;
        return null;
    }

    onClick(e, data) {
        e.preventDefault();
        console.log(data);
    }

    render() {
        const data = this.state.list;
        return (
            <div>
                <Layout>
                    <Header className="card" style={{ background: '#fff', padding: 0 }} >
                        <Row>
                            <Col span={4} style={{ alignContent: 'left', paddingLeft: 20 }}>
                                <img src="https://rsrit.com/wp-content/uploads/2017/12/logo_dark.png" alt="reliable" width="150px" height="50px"></img>
                            </Col>
                            <Col span={12} style={{ fontWeight: 'bold', color: '#0066c', textAlign: 'center', paddingLeft: 65 }}>
                                <h1 style={{ fontWeight: 'bold', color: '#0066c' }}><Link style={{ float: 'right'}} to="/h1bform">Reliable Immigration Form</Link></h1>
                            </Col>
                             <Col span={8} style={{ float: 'right' }}>
                                {/* <Link style={{ float: 'right'}} to="/logout">Logout</Link> */}
                                <Dropdown overlay={menu}>
                                    <a className="ant-dropdown-link" href="#">
                                        Menu <Icon type="down" />
                                    </a>
                                </Dropdown>
                             </Col> 
                        </Row>
                    </Header>
                    <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
                    <List
                        header={<div>Employee's List</div>}
                        bordered
                        dataSource={data}
                        renderItem={item => (<List.Item onClick={ (e) => {this.onClick(e, item) } }>{item.firstName} {item.lastName}</List.Item>)}
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
    getEmployeesList:state.getEmployeesList
});

export default connect(mapStateToProps)(EmployeeList);
