import React, {Component} from 'react';
import  Validator from 'validator';
import { Upload, Icon, Modal, Collapse, Form, Tabs, Layout, Menu, Input, Row, Col, Button, DatePicker, Radio, Card} from 'antd';
import "antd/dist/antd.css";
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import { visaForm } from '../../actions';
import moment from 'moment';

const Panel = Collapse.Panel;

const { Header, Sider, Content } = Layout;
const TabPane = Tabs.TabPane;
const SubMenu = Menu.SubMenu;

const options = [
    { label: 'yes', value: 'true' },
    { label: 'no', value: 'false' },
  ];

const h1applicationType = [
    { label: 'H1b', value: 'H1b' },
    { label: 'OPT', value: 'OPT' },
    { label: 'H1bExt', value: 'H1bExt' }
  ];

const letterStatus = [
    { label: 'approved', value: 'approved' },
    { label: 'waiting', value: 'waiting' },
    { label: 'notApplied', value: 'notApplied' },
  ];

const taskPrioity = [
    { label: 'very high', value: '1' },
    { label: 'high', value: '2' },
    { label: 'medium', value: '3' },
    { label: 'low', value: '4' },
];
const RadioGroup = Radio.Group;
const { TextArea } = Input;

class H1bForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            employeeDetails:{
                typeOfApplication: '',
                premiumProcessInfo: '',
                firstName: 'asdfg',
                middleName: 'asdfg',
                lastName: 'asdfg',
                resume: '',
                bachelorDegree: '',
                mastersTranscripts: '',
                payStubs: '',
                passportPage: '',
                i94: '',
                evidence: '',
                addressDetails:{
                  address1:'ghvvhvh',
                  address2:'ebvhjvf',
                  city:'fwgvkvhb',
                  state:'bhkqh',
                  zipCode:'666644'
                },
                previousAddressDetails:{
                    previousAddress1:'ghvvhvh',
                    previousAddress2:'ebvhjvf',
                    city:'fwgvkvhb',
                    state:'bhkqh',
                    zipCode:'666644'
                },
                contactDetails:{
                    homeNumber:'ghvvhvh',
                    workNumber:'ebvhjvf',
                    mobileNumber:'fwgvkvhb',
                    email:'abc@xyz.com'
                },
                passportDetails: {
                    birthCountry: 'India',
                    dateOfBirth: '01/01/2001',
                    countryPassport: 'India',
                    passportNumber: '9876543210',
                    issueDate: '01/01/2012',
                    expirationDate: '01/01/2022',
                    countryOfCitizenship: 'India',
                    socialSecurityNumber: '0123456789',
                    alienNumber: '0123456789'
                },
                immigirationDetails: {
                    currentStatus: 'asdfg',
                    currentStatusOtherName: 'asdfg',
                    USVisaIssued: 'asdfg',
                    when: 'asdfg',
                    validUntil: 'asdfg',
                    category: 'asdfg',
                    otherName2: 'asdfg',
                    admissionNumber: 'asdfg',
                    entryValidTill: 'asdfg',
                    lastEntryUS: 'asdfg',
                    portOfEntry: 'asdfg',
                    visaStamping: 'asdfg',
                    visaConsulate: 'asdfg',
                    USConsulateOther: 'asdfg'
                },
                travelDetails: {
                    startDate: '',
                    endDate: '',
                    daysCount: ''
                },
                travelHistory: {
                    departureDate: '',
                    arrivalDate: '',
                    daysSpent: ''
                },
                H4CheckListDetails: {
                    H4Passport: '',
                    H4i94: '',
                    H4Approval: '',
                    H4Marraige: '',
                    H4ChildrenCertificate: ''
                },
                workDetails:{
                    clientName: 'asdfg',
                    clientAddress: 'asdfg',
                    clientAddress2: 'asdfg',
                    clientCity: 'asdfg',
                    clientState: 'asdfg',
                    clientZipCode: 'asdfg',
                    vendorName: 'asdfg',
                    vendorInfo: 'asdfg',
                    contactInformation: 'asdfg',
                    projectStartDate: 'asdfg'
                },
                I140Detials: {
                    I140Approval: '',
                    I140Date: '',
                    I140ReceiptDate: ''
                },
                spouseDetails: {
                    maritalStatus: '',
                    spouseH4: '',
                    dependenceRelationship: ''
                },
                H4Details: {
                    spouseFullName: '',
                    spouseBirthDate: '',
                    spouseCountry: '',
                    spouseCountryOfCitizen: '',
                    marraigeDate: '',
                    countryOfMarraige: '',
                    spouseImmigrationStatus: '',
                    spouseSoicalSecurityNumber: '',
                    spouseCurrentAddress: '',
                    spouseCity: '',
                    spouseState: '',
                    spouseZipcode: ''
                },
                kidsDetails: {
                    dependenceRelationship2: '',
                    kidFullName: '',
                    kidGender: '',
                    kidMaritalStatus: '',
                    kidBirthDate: '',
                    kidCountry: '',
                    kidCountryOfCitizen: '',
                    kidImmigrationStatus: '',
                    kidSocialSecurityNumber: '',
                    kidCurrentAddress: ''
                }
            },
            isServerRespondedSuccess: false,
            errors: {},
            previewVisible: false,
            previewImage: '',
            fileList: [],
        }
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    handleCancel = () => this.setState({ previewVisible: false })

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }
    
    handleChange = ({ fileList }) => {
        console.log(fileList);
        this.setState({ fileList });
        this.props.dispatch(visaForm(fileList));
    }

    onChange = e => this.setState({
        employeeDetails: { ...this.state.employeeDetails, [e.target.name]: e.target.value}
    });

    componentDidMount(props) {
        
    }

    onSubmit = (e) => {
        e.preventDefault();
        // console.log(this.state.employeeDetails);
        const errors = this.validate(this.state.employeeDetails);
        console.log(errors);
        this.setState({errors: errors});
        if(Object.keys(errors).length === 0) {
            this.props.dispatch(visaForm(this.state.employeeDetails));
        }
    };

    validate = employeeDetails => {
        // console.log(employeeDetails);
        const errors = {};

        if(!employeeDetails.typeOfApplication) errors.typeOfApplication = "Can't be empty";
        if(!employeeDetails.premiumProcessInfo) errors.premiumProcessInfo = "Can't be empty";

        if(!employeeDetails.firstName) errors.firstName = "Can't be empty";
        if(!employeeDetails.middleName) errors.middleName = "Can't be empty";
        if(!employeeDetails.lastName) errors.lastName = "Can't be empty";
        
        if(!employeeDetails.resume) errors.resume = "Can't be empty";
        if(!employeeDetails.bachelorDegree) errors.bachelorDegree = "Can't be empty";
        if(!employeeDetails.mastersTranscripts) errors.mastersTranscripts = "Can't be empty";
        if(!employeeDetails.payStubs) errors.payStubs = "Can't be empty";
        if(!employeeDetails.passportPage) errors.passportPage = "Can't be empty";
        if(!employeeDetails.i94) errors.i94 = "Can't be empty";
        if(!employeeDetails.evidence) errors.evidence = "Can't be empty";
        
        //Address Details
        if(!employeeDetails.addressDetails.address1) errors.address1 = "Can't be empty";
        if(!employeeDetails.addressDetails.address2) errors.address2 = "Can't be empty";
        if(!employeeDetails.addressDetails.city) errors.city = "Can't be empty";
        if(!employeeDetails.addressDetails.state) errors.state = "Can't be empty";
        if(!Validator.isNumeric(employeeDetails.addressDetails.zipCode)) errors.zipCode = "Enter Zipcode";

        //Previous Address Details
        if(!employeeDetails.previousAddressDetails.previousAddress1) errors.previousAddress1 = "Can't be empty";
        if(!employeeDetails.previousAddressDetails.previousAddress2) errors.previousAddress2 = "Can't be empty";
        if(!employeeDetails.previousAddressDetails.city) errors.city = "Can't be empty";
        if(!employeeDetails.previousAddressDetails.state) errors.state = "Can't be empty";
        if(!Validator.isNumeric(employeeDetails.previousAddressDetails.zipCode)) errors.zipCode = "Enter Zipcode";
        
        //Contact Details
        if(!Validator.isNumeric(employeeDetails.contactDetails.homeNumber)) errors.homeNumber = "Enter Home Number";
        if(!Validator.isNumeric(employeeDetails.contactDetails.workNumber)) errors.workNumber = "Enter Work Number";
        if(!Validator.isNumeric(employeeDetails.contactDetails.mobileNumber)) errors.mobileNumber = "Enter Mobile Number";
        if(!Validator.isEmail(employeeDetails.contactDetails.email)) errors.email = "Invalid Email";

        //Passport Details
        if(!employeeDetails.passportDetails.passportNumber) errors.passportNumber = "Cant't be empty";
        if(!employeeDetails.passportDetails.birthCountry) errors.birthCountry = "Cant't be empty";
        if(!employeeDetails.passportDetails.dateOfBirth) errors.dateOfBirth = "Cant't be empty";
        if(!employeeDetails.passportDetails.issueDate) errors.issueDate = "Cant't be empty";
        if(!employeeDetails.passportDetails.expirationDate) errors.expirationDate = "Cant't be empty";
        if(!employeeDetails.passportDetails.countryPassport) errors.countryPassport = "Cant't be empty";
        if(!employeeDetails.passportDetails.countryOfCitizenship) errors.countryOfCitizenship = "Cant't be empty";
        if(!employeeDetails.passportDetails.socialSecurityNumber) errors.socialSecurityNumber = "Cant't be empty";
        if(!employeeDetails.passportDetails.alienNumber) errors.alienNumber = "Cant't be empty";

        //Immigration Details
        if(!employeeDetails.immigirationDetails.currentStatus) errors.currentStatus = "Cant't be empty";
        if(!employeeDetails.immigirationDetails.currentStatusOtherName) errors.currentStatusOtherName = "Cant't be empty";
        if(!employeeDetails.immigirationDetails.USVisaIssued) errors.USVisaIssued = "Cant't be empty";
        if(!employeeDetails.immigirationDetails.when) errors.when = "Cant't be empty";
        if(!employeeDetails.immigirationDetails.validUntil) errors.validUntil = "Cant't be empty";
        if(!employeeDetails.immigirationDetails.category) errors.category = "Cant't be empty";
        if(!employeeDetails.immigirationDetails.otherName2) errors.otherName2 = "Cant't be empty";
        if(!employeeDetails.immigirationDetails.admissionNumber) errors.admissionNumber = "Cant't be empty";
        if(!employeeDetails.immigirationDetails.entryValidTill) errors.entryValidTill = "Cant't be empty";
        if(!employeeDetails.immigirationDetails.lastEntryUS) errors.lastEntryUS = "Cant't be empty";
        if(!employeeDetails.immigirationDetails.portOfEntry) errors.portOfEntry = "Cant't be empty";
        if(!employeeDetails.immigirationDetails.visaStamping) errors.visaStamping = "Cant't be empty";
        if(!employeeDetails.immigirationDetails.visaConsulate) errors.visaConsulate = "Cant't be empty";
        if(!employeeDetails.immigirationDetails.USConsulateOther) errors.USConsulateOther = "Cant't be empty";

        //Travel Details
        if(!employeeDetails.travelDetails.startDate) errors.startDate = "Can't be empty";
        if(!employeeDetails.travelDetails.endDate) errors.endDate = "Can't be empty";
        if(!employeeDetails.travelDetails.daysCount) errors.daysCount = "Can't be empty";

        //Travel History
        if(!employeeDetails.travelHistory.departureDate) errors.departureDate = "Can't be empty";
        if(!employeeDetails.travelHistory.arrivalDate) errors.arrivalDate = "Can't be empty";
        if(!employeeDetails.travelHistory.daysSpent) errors.daysSpent = "Can't be empty";

        //Checklist H4
        if(!employeeDetails.H4Details.H4Passport) errors.H4Passport = "Can't be empty";
        if(!employeeDetails.H4Details.H4i94) errors.H4i94 = "Can't be empty";
        if(!employeeDetails.H4Details.H4Approval) errors.H4Approval = "Can't be empty";
        if(!employeeDetails.H4Details.H4Marraige) errors.H4Marraige = "Can't be empty";
        if(!employeeDetails.H4Details.H4ChildrenCertificate) errors.H4ChildrenCertificate = "Enter Zipcode";
        
        //Work Details
        if(!employeeDetails.workDetails.className) errors.className = "Can't be empty";
        if(!employeeDetails.workDetails.clientAddress) errors.clientAddress = "Can't be empty";
        if(!employeeDetails.workDetails.clientAddress2) errors.clientAddress2 = "Can't be empty";
        if(!employeeDetails.workDetails.clientCity) errors.clientCity = "Can't be empty";
        if(!employeeDetails.workDetails.clientState) errors.clientState = "Can't be empty";
        if(!employeeDetails.workDetails.clientZipCode) errors.clientZipCode = "Can't be empty";
        if(!employeeDetails.workDetails.vendorName) errors.vendorName = "Can't be empty";
        if(!employeeDetails.workDetails.contactInformation) errors.contactInformation = "Can't be empty";
        if(!employeeDetails.workDetails.projectStartDate) errors.projectStartDate = "Can't be empty";
        if(!employeeDetails.workDetails.vendorInfo) errors.vendorInfo = "Can't be empty";

        //I-140 Details
        if(!employeeDetails.I140Detials.I140Approval) errors.I140Approval = "Can't be empty";
        if(!employeeDetails.I140Detials.I140Date) errors.I140Date = "Can't be empty";
        if(!employeeDetails.I140Detials.I140ReceiptDate) errors.I140ReceiptDate = "Can't be empty";

        //Spouse Details
        if(!employeeDetails.spouseDetails.maritalStatus) errors.maritalStatus = "Can't be empty";
        if(!employeeDetails.spouseDetails.spouseH4) errors.spouseH4 = "Can't be empty";
        if(!employeeDetails.spouseDetails.dependenceRelationship) errors.dependenceRelationship = "Can't be empty";

        //H4 Details
        if(!employeeDetails.H4Details.spouseFullName) errors.spouseFullName = "Can't be empty";
        if(!employeeDetails.H4Details.spouseBirthDate) errors.spouseBirthDate = "Can't be empty";
        if(!employeeDetails.H4Details.spouseCountry) errors.spouseCountry = "Can't be empty";
        if(!employeeDetails.H4Details.spouseCountryOfCitizen) errors.spouseCountryOfCitizen = "Can't be empty";
        if(!employeeDetails.H4Details.marraigeDate) errors.marraigeDate = "Can't be empty";
        if(!employeeDetails.H4Details.countryOfMarraige) errors.countryOfMarraige = "Can't be empty";
        if(!employeeDetails.H4Details.spouseImmigrationStatus) errors.spouseImmigrationStatus = "Can't be empty";
        if(!employeeDetails.H4Details.spouseSoicalSecurityNumber) errors.spouseSoicalSecurityNumber = "Can't be empty";
        if(!employeeDetails.H4Details.spouseCurrentAddress) errors.spouseCurrentAddress = "Can't be empty";
        if(!employeeDetails.H4Details.spouseCity) errors.spouseCity = "Can't be empty";
        if(!employeeDetails.H4Details.spouseState) errors.spouseState = "Can't be empty";
        if(!employeeDetails.H4Details.spouseZipcode) errors.spouseZipcode = "Can't be empty";

        //Kids Details
        if(!employeeDetails.kidsDetails.dependenceRelationship2) errors.dependenceRelationship2 = "Can't be empty";
        if(!employeeDetails.kidsDetails.kidFullName) errors.kidFullName = "Can't be empty";
        if(!employeeDetails.kidsDetails.kidGender) errors.kidGender = "Can't be empty";
        if(!employeeDetails.kidsDetails.kidMaritalStatus) errors.kidMaritalStatus = "Can't be empty";
        if(!employeeDetails.kidsDetails.kidBirthDate) errors.kidBirthDate = "Can't be empty";
        if(!employeeDetails.kidsDetails.kidCountry) errors.kidCountry = "Can't be empty";
        if(!employeeDetails.kidsDetails.kidCountryOfCitizen) errors.kidCountryOfCitizen = "Can't be empty";
        if(!employeeDetails.kidsDetails.kidImmigrationStatus) errors.kidImmigrationStatus = "Can't be empty";
        if(!employeeDetails.kidsDetails.kidSocialSecurityNumber) errors.kidSocialSecurityNumber = "Can't be empty";
        if(!employeeDetails.kidsDetails.kidCurrentAddress) errors.kidCurrentAddress = "Can't be empty";

        //Errors
        return errors;
    };

    render() { 
        const { employeeDetails, errors } = this.state;

        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        
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
                        <Menu.Item key="1">Immigration Form</Menu.Item>
                        <Menu.Item key="2" style={{ float: 'right'}}><Link to="/logout">Logout</Link></Menu.Item>
                        </Menu>
                    </Header>  
                    <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>                                    
                        <div>
                            {/* Employee Registration */}
                            <div header="H1B Form" key="1">
                                <Form>
                                    <Row>
                                        <Form.Item>
                                            {/* <label><h2>H1B Form</h2></label> */}
                                        </Form.Item>
                                    </Row>
                                    <Row>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <Card title="Application Information">
                                                <Form.Item error={!!errors.typeOfApplication}  label="Type of Application" className= "typeOfApplication">
                                                    <Input id="typeOfApplication" type="text" name="typeOfApplication" value= {employeeDetails.typeOfApplication} onChange={this.onChange} placeholder="Type of Application" />
                                                        {errors.typeOfApplication}
                                                </Form.Item>
                                            </Card>
                                        </Col>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <Card title="Premium Process Information">
                                                <Form.Item error={!!errors.premiumProcessInfo}  label="Premium Process" className= "premiumProcessInfo">
                                                    <Input id="premiumProcessInfo" type="text" name="premiumProcessInfo" value= {employeeDetails.premiumProcessInfo} onChange={this.onChange} placeholder="Premium Process" />
                                                        {errors.premiumProcessInfo}
                                                </Form.Item>
                                            </Card>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <Card title="Applicant Information">
                                            <Form.Item error={!!errors.firstName}  label="First Name">
                                                <Input id="firstName" type="text" name="firstName" value= {employeeDetails.firstName} onChange={this.onChange} placeholder="First Name" />
                                                    {errors.firstName}
                                            </Form.Item>

                                            <Form.Item error={!!errors.middleName} label="Middle Name">
                                                <Input id="middleName" type="text" name="middleName" value= {employeeDetails.middleName} onChange={this.onChange} placeholder="Middle Name" />
                                                {errors.middleName}
                                            </Form.Item>

                                            <Form.Item error={!!errors.lastName} label="Last Name">
                                                <Input id="lastName" type="text" name="lastName" value= {employeeDetails.lastName} onChange={this.onChange} placeholder="Last Name" />
                                                {errors.lastName}
                                            </Form.Item>

                                            </Card>
                                        </Col>
                                        
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <Card title="Contact Information">
                                                
                                                <Form.Item error={!!errors.homeNumber}  label="Home Number">
                                                        <Input id="homeNumber" type="number" max={10} name="homeNumber" value= {employeeDetails.contactDetails.homeNumber} onChange={this.onContactChange} placeholder="(000) 000-0000" />
                                                        {errors.homeNumber}
                                                </Form.Item>

                                                <Form.Item error={!!errors.workNumber}  label="Work Number">
                                                    <Input id="workNumber" type="number" max={10} name="workNumber" value= {employeeDetails.contactDetails.workNumber} onChange={this.onContactChange} placeholder="(000) 000-0000" />
                                                    {errors.workNumber}
                                                </Form.Item>

                                                <Form.Item error={!!errors.mobileNumber}  label="Mobile Number">
                                                    <Input id="mobileNumber" type="number" max={10} name="mobileNumber" value= {employeeDetails.contactDetails.mobileNumber} onChange={this.onContactChange}placeholder="(000) 000-0000" />
                                                    {errors.mobileNumber}
                                                </Form.Item>

                                                <Form.Item error={!!errors.email}  label="Email">
                                                        <Input id="email" type="email" name="email"  value= {employeeDetails.contactDetails.email} onChange={this.onContactChange} placeholder="Email" />
                                                        {errors.email}
                                                </Form.Item>

                                            </Card>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <Card title="Previous Address Information">
                                                
                                                <Form.Item error={!!errors.previousAddress1}  label="Previous Address 1">
                                                        <Input id="previousAddress1" type="previousAddress1" name="previousAddress1" value= {employeeDetails.previousAddressDetails.previousAddress1} onChange={this.onContactChange} placeholder="Previous Address 1" />
                                                        {errors.previousAddress1}
                                                </Form.Item>

                                                <Form.Item error={!!errors.previousAddress2}  label="Previous Address 2">
                                                    <Input id="previousAddress2" type="previousAddress2" name="previousAddress2" value= {employeeDetails.previousAddressDetails.previousAddress2} onChange={this.onContactChange} placeholder="Previous Address 2" />
                                                    {errors.previousAddress2}
                                                </Form.Item>

                                                <Form.Item error={!!errors.city}  label="City">
                                                    <Input id="city" type="city" name="city"value= {employeeDetails.previousAddressDetails.city} onChange={this.onContactChange}placeholder="City" />
                                                    {errors.city}
                                                </Form.Item>

                                                <Form.Item error={!!errors.state}  label="State">
                                                        <Input id="state" type="state" name="state"  value= {employeeDetails.previousAddressDetails.state} onChange={this.onContactChange} placeholder="State" />
                                                        {errors.state}
                                                </Form.Item>

                                                <Form.Item error={!!errors.zipCode}  label="Zip Code">
                                                        <Input  id="zipCode" type="zipCode" name="zipCode" value={employeeDetails.previousAddressDetails.zipCode}onChange={this.onContactChange} placeholder= "Enter Your Zipcode"/>
                                                        {errors.zipCode}
                                                </Form.Item>

                                                <Form.Item error={!!errors.country}  label="Country">
                                                        <Input id="country" type="country" name="country"  value= {employeeDetails.previousAddressDetails.country} onChange={this.onContactChange} placeholder="Country" />
                                                        {errors.country}
                                                </Form.Item>

                                            </Card>
                                        </Col>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <Card title="Present Address Information">
                                                
                                                <Form.Item error={!!errors.address1}  label="Current Address 1">
                                                        <Input id="address1" type="address1" name="address1"value= {employeeDetails.addressDetails.address1} onChange={this.onContactChange} placeholder="Current Address 1" />
                                                        {errors.address1}
                                                </Form.Item>

                                                <Form.Item error={!!errors.address2}  label="Current Address 2">
                                                    <Input id="address2" type="address2" name="address2"value= {employeeDetails.addressDetails.address2} onChange={this.onContactChange} placeholder="Current Address 2" />
                                                    {errors.address2}
                                                </Form.Item>

                                                <Form.Item error={!!errors.city}  label="City">
                                                    <Input id="city" type="city" name="city"value= {employeeDetails.addressDetails.city} onChange={this.onContactChange}placeholder="City" />
                                                    {errors.city}
                                                </Form.Item>

                                                <Form.Item error={!!errors.state}  label="State">
                                                        <Input id="state" type="state" name="state"  value= {employeeDetails.addressDetails.state} onChange={this.onContactChange} placeholder="State" />
                                                        {errors.state}
                                                </Form.Item>

                                                <Form.Item error={!!errors.zipCode}  label="Zip Code">
                                                        <Input  id="zipCode" type="zipCode" name="zipCode" value={employeeDetails.addressDetails.zipCode}onChange={this.onContactChange} placeholder= "Enter Your Zipcode"/>
                                                        {errors.zipCode}
                                                </Form.Item>

                                                <Form.Item error={!!errors.country}  label="Country">
                                                        <Input id="country" type="country" name="country"  value= {employeeDetails.addressDetails.country} onChange={this.onContactChange} placeholder="Country" />
                                                        {errors.country}
                                                </Form.Item>

                                            </Card>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <Card title="Passpport Information">
                                                <Form.Item error={!!errors.birthCountry}  label="Birth Country">
                                                        <Input id="birthCountry" type="text" name="birthCountry"  value= {employeeDetails.passportDetails.birthCountry} onChange={this.onContactChange} placeholder="Birth Country" />
                                                        {errors.birthCountry}
                                                </Form.Item>
                                                <Form.Item error={!!errors.dateOfBirth}  label="Date of Birth">
                                                        <Input id="dateOfBirth" type="text" name="dateOfBirth"  value= {employeeDetails.passportDetails.dateOfBirth} onChange={this.onContactChange} placeholder="Date of Birth" />
                                                        {errors.dateOfBirth}
                                                </Form.Item>
                                                <Form.Item error={!!errors.countryPassport}  label="Country">
                                                        <Input id="countryPassport" type="text" name="countryPassport"  value= {employeeDetails.passportDetails.countryPassport} onChange={this.onContactChange} placeholder="Country" />
                                                        {errors.countryPassport}
                                                </Form.Item>
                                                <Form.Item error={!!errors.passportNumber}  label="Passport Number">
                                                        <Input id="passportNumber" type="text" name="passportNumber"  value= {employeeDetails.passportDetails.passportNumber} onChange={this.onContactChange} placeholder="Passport Number" />
                                                        {errors.passportNumber}
                                                </Form.Item>
                                                <Form.Item error={!!errors.issueDate}  label="Issue Date">
                                                        <Input id="issueDate" type="text" name="issueDate"  value= {employeeDetails.passportDetails.issueDate} onChange={this.onContactChange} placeholder="Issue Date" />
                                                        {errors.issueDate}
                                                </Form.Item>
                                                <Form.Item error={!!errors.expirationDate}  label="Expiration Date">
                                                        <Input id="expirationDate" type="text" name="expirationDate"  value= {employeeDetails.passportDetails.expirationDate} onChange={this.onContactChange} placeholder="Expiration Date" />
                                                        {errors.expirationDate}
                                                </Form.Item>
                                                <Form.Item error={!!errors.countryOfCitizenship}  label="Country Of Citizenship">
                                                        <Input id="countryOfCitizenship" type="text" name="countryOfCitizenship"  value= {employeeDetails.passportDetails.countryOfCitizenship} onChange={this.onContactChange} placeholder="Country Of Citizenship" />
                                                        {errors.countryOfCitizenship}
                                                </Form.Item>
                                                <Form.Item error={!!errors.socialSecurityNumber}  label="Social Security Number">
                                                        <Input id="socialSecurityNumber" type="text" name="socialSecurityNumber"  value= {employeeDetails.passportDetails.socialSecurityNumber} onChange={this.onContactChange} placeholder="Social Security Number" />
                                                        {errors.socialSecurityNumber}
                                                </Form.Item>
                                                <Form.Item error={!!errors.alienNumber}  label="Alien Number">
                                                        <Input id="alienNumber" type="text" name="alienNumber"  value= {employeeDetails.passportDetails.alienNumber} onChange={this.onContactChange} placeholder="Alien Number" />
                                                        {errors.alienNumber}
                                                </Form.Item>
                                            </Card>
                                        </Col>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <Card title="Immigration Information">
                                                <Form.Item error={!!errors.currentStatus}  label="Current Status">
                                                        <Input id="currentStatus" type="text" name="currentStatus"  value= {employeeDetails.immigirationDetails.currentStatus} onChange={this.onContactChange} placeholder="Current Status" />
                                                        {errors.currentStatus}
                                                </Form.Item>
                                                <Form.Item error={!!errors.currentStatusOtherName}  label="Current Status Other Name">
                                                        <Input id="currentStatusOtherName" type="text" name="currentStatusOtherName"  value= {employeeDetails.immigirationDetails.currentStatusOtherName} onChange={this.onContactChange} placeholder="Current Status Other Name" />
                                                        {errors.currentStatusOtherName}
                                                </Form.Item>
                                                <Form.Item error={!!errors.USVisaIssued}  label="US Visa Issued">
                                                        <Input id="USVisaIssued" type="text" name="USVisaIssued"  value= {employeeDetails.immigirationDetails.USVisaIssued} onChange={this.onContactChange} placeholder="US Visa Issued" />
                                                        {errors.USVisaIssued}
                                                </Form.Item>
                                                <Form.Item error={!!errors.when}  label="When">
                                                        <Input id="when" type="text" name="when"  value= {employeeDetails.immigirationDetails.when} onChange={this.onContactChange} placeholder="When" />
                                                        {errors.when}
                                                </Form.Item>
                                                <Form.Item error={!!errors.validUntil}  label="Valid Until">
                                                        <Input id="validUntil" type="text" name="validUntil"  value= {employeeDetails.immigirationDetails.validUntil} onChange={this.onContactChange} placeholder="Valid Until" />
                                                        {errors.validUntil}
                                                </Form.Item>
                                                <Form.Item error={!!errors.category}  label="Category">
                                                        <Input id="category" type="text" name="category"  value= {employeeDetails.immigirationDetails.category} onChange={this.onContactChange} placeholder="Category" />
                                                        {errors.category}
                                                </Form.Item>
                                                <Form.Item error={!!errors.otherName2}  label="Other Name 2">
                                                        <Input id="otherName2" type="text" name="otherName2"  value= {employeeDetails.immigirationDetails.otherName2} onChange={this.onContactChange} placeholder="Other Name 2" />
                                                        {errors.otherName2}
                                                </Form.Item>
                                                <Form.Item error={!!errors.admissionNumber}  label="Admission Number">
                                                        <Input id="admissionNumber" type="text" name="admissionNumber"  value= {employeeDetails.immigirationDetails.admissionNumber} onChange={this.onContactChange} placeholder="Admission Number" />
                                                        {errors.admissionNumber}
                                                </Form.Item>
                                                <Form.Item error={!!errors.entryValidTill}  label="Entry Valid Till">
                                                        <Input id="entryValidTill" type="text" name="entryValidTill"  value= {employeeDetails.immigirationDetails.entryValidTill} onChange={this.onContactChange} placeholder="Entry Valid Till" />
                                                        {errors.entryValidTill}
                                                </Form.Item>
                                                <Form.Item error={!!errors.lastEntryUS}  label="Last Entry US">
                                                        <Input id="lastEntryUS" type="text" name="lastEntryUS"  value= {employeeDetails.immigirationDetails.lastEntryUS} onChange={this.onContactChange} placeholder="Last Entry US" />
                                                        {errors.lastEntryUS}
                                                </Form.Item>
                                                <Form.Item error={!!errors.portOfEntry}  label="Port Of Entry">
                                                        <Input id="portOfEntry" type="text" name="portOfEntry"  value= {employeeDetails.immigirationDetails.portOfEntry} onChange={this.onContactChange} placeholder="Port Of Entry" />
                                                        {errors.portOfEntry}
                                                </Form.Item>
                                                <Form.Item error={!!errors.visaStamping}  label="Visa Stamping">
                                                        <Input id="visaStamping" type="text" name="visaStamping"  value= {employeeDetails.immigirationDetails.visaStamping} onChange={this.onContactChange} placeholder="Visa Stamping" />
                                                        {errors.visaStamping}
                                                </Form.Item>
                                                <Form.Item error={!!errors.visaConsulate}  label="Visa Consulate">
                                                        <Input id="visaConsulate" type="text" name="visaConsulate"  value= {employeeDetails.immigirationDetails.visaConsulate} onChange={this.onContactChange} placeholder="Visa Consulate" />
                                                        {errors.visaConsulate}
                                                </Form.Item>
                                                <Form.Item error={!!errors.USConsulateOther}  label="US Consulate Other">
                                                        <Input id="USConsulateOther" type="text" name="USConsulateOther"  value= {employeeDetails.immigirationDetails.USConsulateOther} onChange={this.onContactChange} placeholder="US Consulate Other" />
                                                        {errors.USConsulateOther}
                                                </Form.Item>
                                            </Card>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <Card title="Travel Information">
                                                <Form.Item error={!!errors.startDate}  label="Start Date">
                                                        <Input id="startDate" type="text" name="startDate"  value= {employeeDetails.travelDetails.startDate} onChange={this.onContactChange} placeholder="Start Date" />
                                                        {errors.startDate}
                                                </Form.Item>
                                                <Form.Item error={!!errors.endDate}  label="End Date">
                                                        <Input id="endDate" type="text" name="endDate"  value= {employeeDetails.travelDetails.endDate} onChange={this.onContactChange} placeholder="End Date" />
                                                        {errors.endDate}
                                                </Form.Item>
                                                <Form.Item error={!!errors.daysCount}  label="Days Count">
                                                        <Input id="daysCount" type="text" name="daysCount"  value= {employeeDetails.travelDetails.daysCount} onChange={this.onContactChange} placeholder="Days Count" />
                                                        {errors.daysCount}
                                                </Form.Item>
                                            </Card>
                                        </Col>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <Card title="Travel History">
                                                <Form.Item error={!!errors.departureDate}  label="Departure Date">
                                                        <Input id="departureDate" type="text" name="departureDate"  value= {employeeDetails.travelHistory.departureDate} onChange={this.onContactChange} placeholder="Departure Date" />
                                                        {errors.departureDate}
                                                </Form.Item>
                                                <Form.Item error={!!errors.arrivalDate}  label="Arrival Date">
                                                        <Input id="arrivalDate" type="text" name="arrivalDate"  value= {employeeDetails.travelHistory.arrivalDate} onChange={this.onContactChange} placeholder="Arrival Date" />
                                                        {errors.arrivalDate}
                                                </Form.Item>
                                                <Form.Item error={!!errors.daysSpent}  label="Days Count">
                                                        <Input id="daysSpent" type="text" name="daysSpent"  value= {employeeDetails.travelHistory.daysSpent} onChange={this.onContactChange} placeholder="Days Count" />
                                                        {errors.daysSpent}
                                                </Form.Item>
                                            </Card>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <Card title="Check List Information for H4B">
                                                <Form.Item error={!!errors.H4Passport}  label="H4 Passport">
                                                        <Input id="H4Passport" type="text" name="H4Passport"  value= {employeeDetails.H4CheckListDetails.H4Passport} onChange={this.onContactChange} placeholder="H4 Passport" />
                                                        {errors.H4Passport}
                                                </Form.Item>
                                                <Form.Item error={!!errors.H4i94}  label="H4 i94">
                                                        <Input id="H4i94" type="text" name="H4i94"  value= {employeeDetails.H4CheckListDetails.H4i94} onChange={this.onContactChange} placeholder="H4 i94" />
                                                        {errors.H4i94}
                                                </Form.Item>
                                                <Form.Item error={!!errors.H4Approval}  label="H4 Approval">
                                                        <Input id="H4Approval" type="text" name="H4Approval"  value= {employeeDetails.H4CheckListDetails.H4Approval} onChange={this.onContactChange} placeholder="H4 Approval" />
                                                        {errors.H4Approval}
                                                </Form.Item>
                                                <Form.Item error={!!errors.H4Marraige}  label="H4 Marraige">
                                                        <Input id="H4Marraige" type="text" name="H4Marraige"  value= {employeeDetails.H4CheckListDetails.H4Marraige} onChange={this.onContactChange} placeholder="H4 Marraige" />
                                                        {errors.H4Marraige}
                                                </Form.Item>
                                                <Form.Item error={!!errors.H4ChildrenCertificate}  label="H4 Children Certificate">
                                                        <Input id="H4ChildrenCertificate" type="text" name="H4ChildrenCertificate"  value= {employeeDetails.H4CheckListDetails.H4ChildrenCertificate} onChange={this.onContactChange} placeholder="H4 Children Certificate" />
                                                        {errors.H4ChildrenCertificate}
                                                </Form.Item>
                                            </Card>
                                        </Col>
                                        <Col>
                                            <Row>
                                                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                                    <Card title="I-140 Approval">
                                                        <Form.Item error={!!errors.I140Approval}  label="I-140 Approval">
                                                                <Input id="I140Approval" type="text" name="I140Approval"  value= {employeeDetails.I140Detials.I140Approval} onChange={this.onContactChange} placeholder="I-140 Approval" />
                                                                {errors.I140Approval}
                                                        </Form.Item>
                                                        <Form.Item error={!!errors.I140Date}  label="I-140 Date">
                                                                <Input id="I140Date" type="text" name="I140Date"  value= {employeeDetails.I140Detials.I140Date} onChange={this.onContactChange} placeholder="I-140 Date" />
                                                                {errors.I140Date}
                                                        </Form.Item>
                                                        <Form.Item error={!!errors.I140ReceiptDate}  label="I-140 Receipt Date">
                                                                <Input id="I140ReceiptDate" type="text" name="I140ReceiptDate"  value= {employeeDetails.I140Detials.I140ReceiptDate} onChange={this.onContactChange} placeholder="I-140 Receipt Date" />
                                                                {errors.I140ReceiptDate}
                                                        </Form.Item>
                                                    </Card>
                                                </Col>
                                                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                                    <Card title="Spouse Information">
                                                        <Form.Item error={!!errors.maritalStatus}  label="Marital Status">
                                                                <Input id="maritalStatus" type="text" name="maritalStatus"  value= {employeeDetails.spouseDetails.maritalStatus} onChange={this.onContactChange} placeholder="Marital Status" />
                                                                {errors.maritalStatus}
                                                        </Form.Item>
                                                        <Form.Item error={!!errors.spouseH4}  label="Spouse H4">
                                                                <Input id="spouseH4" type="text" name="spouseH4"  value= {employeeDetails.spouseDetails.spouseH4} onChange={this.onContactChange} placeholder="Spouse H4" />
                                                                {errors.spouseH4}
                                                        </Form.Item>
                                                        <Form.Item error={!!errors.dependenceRelationship}  label="Dependence Relationship">
                                                                <Input id="dependenceRelationship" type="text" name="dependenceRelationship"  value= {employeeDetails.spouseDetails.dependenceRelationship} onChange={this.onContactChange} placeholder="Dependence Relationship" />
                                                                {errors.dependenceRelationship}
                                                        </Form.Item>
                                                    </Card>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <Card title="Kids Information">
                                                <Form.Item error={!!errors.kidFullName}  label="Full Name">
                                                    <Input id="kidFullName" type="text" name="kidFullName"  value= {employeeDetails.kidsDetails.kidFullName} onChange={this.onContactChange} placeholder="kid Full Name" />
                                                    {errors.kidFullName}
                                                </Form.Item>
                                                <Form.Item error={!!errors.kidGender}  label="Gender">
                                                    <Input id="kidGender" type="text" name="kidGender"  value= {employeeDetails.kidsDetails.kidGender} onChange={this.onContactChange} placeholder="Gender" />
                                                    {errors.kidGender}
                                                </Form.Item>
                                                <Form.Item error={!!errors.kidMaritalStatus}  label="Marital Status">
                                                    <Input id="kidMaritalStatus" type="text" name="kidMaritalStatus"  value= {employeeDetails.kidsDetails.kidMaritalStatus} onChange={this.onContactChange} placeholder="Marital Status" />
                                                    {errors.kidMaritalStatus}
                                                </Form.Item>
                                                <Form.Item error={!!errors.kidBirthDate}  label="Birth Date">
                                                    <Input id="kidBirthDate" type="text" name="kidBirthDate"  value= {employeeDetails.kidsDetails.kidBirthDate} onChange={this.onContactChange} placeholder="Birth Date" />
                                                    {errors.kidBirthDate}
                                                </Form.Item>
                                                <Form.Item error={!!errors.kidCountry}  label="Country">
                                                    <Input id="kidCountry" type="text" name="kidCountry"  value= {employeeDetails.kidsDetails.kidCountry} onChange={this.onContactChange} placeholder="Country" />
                                                    {errors.kidCountry}
                                                </Form.Item>
                                                <Form.Item error={!!errors.kidCountryOfCitizen}  label="Country Of Citizen">
                                                    <Input id="kidCountryOfCitizen" type="text" name="kidCountryOfCitizen"  value= {employeeDetails.kidsDetails.kidCountryOfCitizen} onChange={this.onContactChange} placeholder="Country Of Citizen" />
                                                    {errors.kidCountryOfCitizen}
                                                </Form.Item>
                                                <Form.Item error={!!errors.kidImmigrationStatus}  label="Immigration Status">
                                                    <Input id="kidImmigrationStatus" type="text" name="kidImmigrationStatus"  value= {employeeDetails.kidsDetails.kidImmigrationStatus} onChange={this.onContactChange} placeholder="Immigration Status" />
                                                    {errors.kidImmigrationStatus}
                                                </Form.Item>
                                                <Form.Item error={!!errors.kidSocialSecurityNumber}  label="Social Security Number">
                                                    <Input id="kidSocialSecurityNumber" type="text" name="kidSocialSecurityNumber"  value= {employeeDetails.kidsDetails.kidSocialSecurityNumber} onChange={this.onContactChange} placeholder="Social Security Number" />
                                                    {errors.kidSocialSecurityNumber}
                                                </Form.Item>
                                                <Form.Item error={!!errors.kidCurrentAddress}  label="Current Address">
                                                    <Input id="kidCurrentAddress" type="text" name="kidCurrentAddress"  value= {employeeDetails.kidsDetails.kidCurrentAddress} onChange={this.onContactChange} placeholder="Current Address" />
                                                    {errors.kidCurrentAddress}
                                                </Form.Item>
                                            </Card>
                                        </Col>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <Card title="H4 Information">
                                                <Form.Item error={!!errors.spouseFullName}  label="Spouse Full Name">
                                                    <Input id="spouseFullName" type="text" name="spouseFullName"  value= {employeeDetails.H4Details.spouseFullName} onChange={this.onContactChange} placeholder="Spouse Full Name" />
                                                    {errors.spouseFullName}
                                                </Form.Item>
                                                <Form.Item error={!!errors.spouseBirthDate}  label="Spouse Birth Date">
                                                    <Input id="spouseBirthDate" type="text" name="spouseBirthDate"  value= {employeeDetails.H4Details.spouseBirthDate} onChange={this.onContactChange} placeholder="Spouse Birth Date" />
                                                    {errors.spouseBirthDate}
                                                </Form.Item>
                                                <Form.Item error={!!errors.spouseCountry}  label="Spouse Country">
                                                    <Input id="spouseCountry" type="text" name="spouseCountry"  value= {employeeDetails.H4Details.spouseCountry} onChange={this.onContactChange} placeholder="Spouse Country" />
                                                    {errors.spouseCountry}
                                                </Form.Item>
                                                <Form.Item error={!!errors.spouseCountryOfCitizen}  label="Spouse Country Of Citizen">
                                                    <Input id="spouseCountryOfCitizen" type="text" name="spouseCountryOfCitizen"  value= {employeeDetails.H4Details.spouseCountryOfCitizen} onChange={this.onContactChange} placeholder="Spouse Country Of Citizen" />
                                                    {errors.spouseCountryOfCitizen}
                                                </Form.Item>
                                                <Form.Item error={!!errors.marraigeDate}  label="Marraige Date">
                                                    <Input id="marraigeDate" type="text" name="marraigeDate"  value= {employeeDetails.H4Details.marraigeDate} onChange={this.onContactChange} placeholder="Marraige Date" />
                                                    {errors.marraigeDate}
                                                </Form.Item>
                                                <Form.Item error={!!errors.countryOfMarraige}  label="Country Of Marraige">
                                                    <Input id="countryOfMarraige" type="text" name="countryOfMarraige"  value= {employeeDetails.H4Details.countryOfMarraige} onChange={this.onContactChange} placeholder="Country Of Marraige" />
                                                    {errors.countryOfMarraige}
                                                </Form.Item>
                                                <Form.Item error={!!errors.spouseImmigrationStatus}  label="Spouse Immigration Status">
                                                    <Input id="spouseImmigrationStatus" type="text" name="spouseImmigrationStatus"  value= {employeeDetails.H4Details.spouseImmigrationStatus} onChange={this.onContactChange} placeholder="Spouse Immigration Status" />
                                                    {errors.spouseImmigrationStatus}
                                                </Form.Item>
                                                <Form.Item error={!!errors.spouseSoicalSecurityNumber}  label="Spouse Soical Security Number">
                                                    <Input id="spouseSoicalSecurityNumber" type="text" name="spouseSoicalSecurityNumber"  value= {employeeDetails.H4Details.spouseSoicalSecurityNumber} onChange={this.onContactChange} placeholder="Spouse Soical Security Number" />
                                                    {errors.spouseSoicalSecurityNumber}
                                                </Form.Item>
                                                <Form.Item error={!!errors.spouseCurrentAddress}  label="Spouse Current Address">
                                                    <Input id="spouseCurrentAddress" type="text" name="spouseCurrentAddress"  value= {employeeDetails.H4Details.spouseCurrentAddress} onChange={this.onContactChange} placeholder="Spouse Current Address" />
                                                    {errors.spouseCurrentAddress}
                                                </Form.Item>
                                                <Form.Item error={!!errors.spouseCity}  label="Spouse City">
                                                    <Input id="spouseCity" type="text" name="spouseCity"  value= {employeeDetails.H4Details.spouseCity} onChange={this.onContactChange} placeholder="Spouse City" />
                                                    {errors.spouseCity}
                                                </Form.Item>
                                                <Form.Item error={!!errors.spouseState}  label="Spouse State">
                                                    <Input id="spouseState" type="text" name="spouseState"  value= {employeeDetails.H4Details.spouseState} onChange={this.onContactChange} placeholder="Spouse State" />
                                                    {errors.spouseState}
                                                </Form.Item>
                                                <Form.Item error={!!errors.spouseZipcode}  label="Spouse Zipcode">
                                                    <Input id="spouseZipcode" type="text" name="spouseZipcode"  value= {employeeDetails.H4Details.spouseZipcode} onChange={this.onContactChange} placeholder="Spouse Zipcode" />
                                                    {errors.spouseZipcode}
                                                </Form.Item>
                                            </Card>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <Card title="Work Information">
                                                <Form.Item error={!!errors.clientName}  label="Client Name">
                                                    <Input id="clientName" type="text" name="clientName"  value= {employeeDetails.workDetails.clientName} onChange={this.onContactChange} placeholder="Client Name" />
                                                    {errors.clientName}
                                                </Form.Item>
                                                <Form.Item error={!!errors.clientAddress}  label="Address">
                                                    <Input id="clientAddress" type="text" name="clientAddress"  value= {employeeDetails.workDetails.clientAddress} onChange={this.onContactChange} placeholder="Address" />
                                                    {errors.clientAddress}
                                                </Form.Item>
                                                <Form.Item error={!!errors.clientAddress2}  label="Address 2">
                                                    <Input id="clientAddress2" type="text" name="clientAddress2"  value= {employeeDetails.workDetails.clientAddress2} onChange={this.onContactChange} placeholder="Address 2" />
                                                    {errors.clientAddress2}
                                                </Form.Item>
                                                <Form.Item error={!!errors.clientCity}  label="City">
                                                    <Input id="clientCity" type="text" name="clientCity"  value= {employeeDetails.workDetails.clientCity} onChange={this.onContactChange} placeholder="City" />
                                                    {errors.clientCity}
                                                </Form.Item>
                                                <Form.Item error={!!errors.clientState}  label="State">
                                                    <Input id="clientState" type="text" name="clientState"  value= {employeeDetails.workDetails.clientState} onChange={this.onContactChange} placeholder="State" />
                                                    {errors.clientState}
                                                </Form.Item>
                                                <Form.Item error={!!errors.clientZipCode}  label="ZipCode">
                                                    <Input id="clientZipCode" type="text" name="clientZipCode"  value= {employeeDetails.workDetails.clientZipCode} onChange={this.onContactChange} placeholder="ZipCode" />
                                                    {errors.clientZipCode}
                                                </Form.Item>
                                                <Form.Item error={!!errors.vendorName}  label="Vendor Name">
                                                    <Input id="vendorName" type="text" name="vendorName"  value= {employeeDetails.workDetails.vendorName} onChange={this.onContactChange} placeholder="Vendor Name" />
                                                    {errors.vendorName}
                                                </Form.Item>
                                                <Form.Item error={!!errors.contactInformation}  label="Contact Information">
                                                    <Input id="contactInformation" type="text" name="contactInformation"  value= {employeeDetails.workDetails.contactInformation} onChange={this.onContactChange} placeholder="Contact Information" />
                                                    {errors.contactInformation}
                                                </Form.Item>
                                                <Form.Item error={!!errors.projectStartDate}  label="Project Start Date">
                                                    <Input id="projectStartDate" type="text" name="projectStartDate"  value= {employeeDetails.workDetails.projectStartDate} onChange={this.onContactChange} placeholder="Project Start Date" />
                                                    {errors.projectStartDate}
                                                </Form.Item>
                                                <Form.Item error={!!errors.vendorInfo}  label="Vendor Info">
                                                    <Input id="vendorInfo" type="text" name="vendorInfo"  value= {employeeDetails.workDetails.vendorInfo} onChange={this.onContactChange} placeholder="Vendor Info" />
                                                    {errors.vendorInfo}
                                                </Form.Item>
                                            </Card>
                                        </Col>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <Card>
                                                <Form.Item error={!!errors.resume}  label="Resume">
                                                    <Input id="resume" type="text" name="resume"  value= {employeeDetails.resume} onChange={this.onContactChange} placeholder="Resume" />
                                                    {errors.resume}
                                                </Form.Item>
                                                <Form.Item error={!!errors.bachelorDegree}  label="Bachelor Degree">
                                                    <Input id="bachelorDegree" type="text" name="bachelorDegree"  value= {employeeDetails.bachelorDegree} onChange={this.onContactChange} placeholder="Bachelor Degree" />
                                                    {errors.bachelorDegree}
                                                </Form.Item>
                                                <Form.Item error={!!errors.mastersTranscripts}  label="Masters Transcripts">
                                                    <Input id="mastersTranscripts" type="text" name="mastersTranscripts"  value= {employeeDetails.mastersTranscripts} onChange={this.onContactChange} placeholder="Masters Transcripts" />
                                                    {errors.mastersTranscripts}
                                                </Form.Item>
                                                <Form.Item error={!!errors.payStubs}  label="Pay Stubs">
                                                    <Input id="payStubs" type="text" name="payStubs"  value= {employeeDetails.payStubs} onChange={this.onContactChange} placeholder="Pay Stubs" />
                                                    {errors.payStubs}
                                                </Form.Item>
                                                <Form.Item error={!!errors.passportPage}  label="Passport Page">
                                                    {/* <Input id="passportPage" type="text" name="passportPage"  value= {employeeDetails.passportPage} onChange={this.onContactChange} placeholder="Passport Page" />
                                                    {errors.passportPage} */}

                                                    <div className="clearfix">
                                                        <Upload
                                                            action="//jsonplaceholder.typicode.com/posts/"
                                                            listType="picture-card"
                                                            fileList={fileList}
                                                            onPreview={this.handlePreview}
                                                            onChange={this.handleChange}
                                                            >
                                                            {fileList.length >= 3 ? null : uploadButton}
                                                        </Upload>
                                                        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                                            <img alt="example" style={{ width: '100%' }} src={previewImage} />
                                                        </Modal>
                                                    </div>

                                                </Form.Item>
                                                <Form.Item error={!!errors.i94}  label="I-94">
                                                    <Input id="i94" type="text" name="i94"  value= {employeeDetails.i94} onChange={this.onContactChange} placeholder="I-94" />
                                                    {errors.i94}
                                                </Form.Item>
                                                <Form.Item error={!!errors.evidence}  label="Evidence">
                                                    <Input id="evidence" type="text" name="evidence"  value= {employeeDetails.evidence} onChange={this.onContactChange} placeholder="Evidence" />
                                                    {errors.evidence}
                                                </Form.Item>
                                            </Card>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Form.Item>
                                            <Button type="primary" onClick={this.onSubmit}>Submit</Button>
                                        </Form.Item>
                                    </Row>
                                </Form>
                            </div>
                        </div>
                    </Content>
                </Layout> 
            </div>
         );
    }
}

H1bForm.protoTypes = {

};

const mapStateToProps = ({

});

export default connect(null)(H1bForm);