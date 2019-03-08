import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
// import { getListOfEmployees } from '../../actions';
import { Table, Menu, Icon, Layout, Row, Col } from 'antd'
import "antd/dist/antd.css";
import { setEmployeeData } from '../../actions';

const { Header, Content } = Layout;

const columns = [{
    title: 'First Name',
    dataIndex: 'firstName',
  }, {
    title: 'Last Name',
    dataIndex: 'lastName',
  }, {
    title: 'Email',
    dataIndex: 'contactDetails.email',
  }];
 
class EmployeeList extends Component {

    constructor(props) {
        super(props);
        // defining the state to the component
        this.state = {
            list: []
        }
        this.onClick = this.onClick.bind(this);
        this.onRowSelect = this.onRowSelect.bind(this);
    }

    static getDerivedStateFromProps(nextProps, state){
        state.list = nextProps.getEmployeesList;
        return null;
    }

    onClick(e, data) {
        e.preventDefault();
        console.log(data);
    }

    onRowSelect(data) {
        this.props.dispatch(setEmployeeData(data));
        this.props.history.push('/form');
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
                                <Menu style={{ float: 'right'}}>
                                    <Menu.SubMenu title={<span className="submenu-title-wrapper"><Icon type="down-circle" />Menu</span>}>
                                        <Menu.Item><Link to="/employeelist">Employee List</Link></Menu.Item>
                                        <Menu.Divider />
                                        <Menu.Item><Link to="/admin">Admin Panel</Link></Menu.Item>
                                        <Menu.Divider />
                                        <Menu.Item><Link to="/logout">Logout</Link></Menu.Item>
                                    </Menu.SubMenu>
                                </Menu>
                             </Col> 
                        </Row>
                    </Header>
                    <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
                        <Table 
                            onRow={(data) => ({
                                onClick: () => { this.onRowSelect(data) }
                            })}
                            columns={columns}
                            dataSource={data} 
                        />
                    </Content>
                </Layout>
            </div>
        );
    }
}

EmployeeList.protoTypes = {

};

const mapStateToProps = state => {
    return {
        getEmployeesList:state.getEmployeesList,
        employeeData: state.employeeData
    }
};

export default connect(mapStateToProps)(EmployeeList);
