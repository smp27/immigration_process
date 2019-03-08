import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Menu, Icon, Layout, Row, Col, Form, Card, Input } from 'antd'
import { adminUploads } from '../../actions';
import "antd/dist/antd.css";
import { DROPBOX_ACCESS_TOKEN_KEY } from '../../stores/config';

//To access data from the web
const xhr = new XMLHttpRequest();
// import file saver to download the file's
const FileSaver = require('file-saver');

//Access token to acces dropbox account
const dropboxToken = DROPBOX_ACCESS_TOKEN_KEY;

const { Header, Content } = Layout;

const menu = (
  <Menu>
      <Menu.Item><Link style={{ float: 'right'}} to="/employeelist">Employee List</Link></Menu.Item>
      <Menu.Item><Link style={{ float: 'right'}} to="/admin">Admin Panel</Link></Menu.Item>
      <Menu.Item><Link style={{ float: 'right'}} to="/logout">Logout</Link></Menu.Item>
  </Menu>
);

class Admin extends Component {
  constructor(props) {
    super(props);
    // defining the state to the component
    this.state = {
      clientLetterTemplateProgress: 0,
      clientLetterTemplate: '',
      clientLetterTemplatePathLower: '',
      vendorLetterTemplateProgress: 0,
      vendorLetterTemplate: '',
      vendorLetterTemplatePathLower: '',
      errors: {}
    }
    
  }

  static getDerivedStateFromProps(nextProps, state){
    console.log(nextProps);
    return null;
  }

  //Upload file to the dropbox
  uploadFile = (e, fN) => {
    // this keyword is not working inside the xhr functions, th is declared as proxy to this keyword
    const th = this;
    // let errorDetails = Object.assign({}, this.state.errors);
    let errorDetails = new Map();

    const file = e.target.files[0];
    const filename = e.target.name;

    if(e.target.files[0].type === "application/pdf") {
                
      xhr.upload.onprogress = function(evt) {
          const percentComplete = parseInt(100.0 * evt.loaded / evt.total);
          th.setState({[filename+"Progress"] :percentComplete});
          // Upload in progress. Do something here with the percent complete.
      };
      
      xhr.onload = function() {
        if (xhr.status === 200) {
            const fileInfo = JSON.parse(xhr.response);
            // console.log(fileInfo);
            errorDetails.clientLetterTemplate = '';
            th.setState({[filename]:fileInfo.name});
            th.setState({[filename+"PathLower"]:fileInfo.path_lower});
            th.props.dispatch(adminUploads({[filename]:fileInfo.name, [filename+"PathLower"]:fileInfo.path_lower}));
            // Upload succeeded. Do something here with the file info.
        }
        else {
            const errorMessage = xhr.response || 'Unable to upload file';
            console.log(errorMessage);
            // Upload failed. Do something here with the error.
        }
      };
      
      xhr.open('POST', 'https://content.dropboxapi.com/2/files/upload');
      xhr.setRequestHeader('Authorization', 'Bearer ' + dropboxToken);
      xhr.setRequestHeader('Content-Type', 'application/octet-stream');
      xhr.setRequestHeader('Dropbox-API-Arg', JSON.stringify({
      path: '/'+ 'Talent team Team Folder' +'/'+'Admin/' +  file.name,
      mode: 'add',
      autorename: true,
      mute: false
      }));
      
      xhr.send(file);
  } else {
      errorDetails.clientLetterTemplate = 'Please upload Only PDF files';
  }
    this.setState({errors: errorDetails});
};

  render() {
    const { errors } = this.state;
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
                    <Form layout="inline">
                      <Row>
                        <Card title="Letter Template">
                          <Form.Item error={!!errors.clientLetterTemplate} style={{ color: 'red' }} label="Client Letter Template">
                            <Input id="clientLetterTemplate" type="file" name="clientLetterTemplate" onChange={(e) => this.uploadFile(e, "Client")} placeholder="Client Letter Template" />
                            {errors.clientLetterTemplate}
                            <progress value={this.state.clientLetterTemplateProgress} max="100"/>
                          </Form.Item>
                          <Form.Item error={!!errors.vendorLetterTemplate} style={{ color: 'red' }} label="Vendor Letter Template">
                            <Input id="vendorLetterTemplate" type="file" name="vendorLetterTemplate" onChange={(e) => this.uploadFile(e, "Client")} placeholder="Vendor Letter Template" />
                            {errors.vendorLetterTemplate}
                            <progress value={this.state.vendorLetterTemplateProgress} max="100"/>
                          </Form.Item>
                        </Card>
                      </Row>
                    </Form>
                  </Content>
              </Layout>
          </div>
      );
  }
}

Admin.propTypes = {
  
};

const mapStateToProps = state => ({
  loginStatus: state.loginStatus
});

export default connect(mapStateToProps)(Admin);
