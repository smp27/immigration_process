import React, {Component} from 'react';
import  Validator from 'validator';
import { Upload, Collapse, Icon, Modal, Form, Radio, DatePicker, Dropdown, Layout, Menu, Input, Row, Col, Button, Card} from 'antd';
import "antd/dist/antd.css";
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import { visaForm, fileUpload } from '../../actions';
import moment from 'moment';
import { storage } from '../../firebase';
import { getListOfEmployees } from '../../actions';

const { Header, Content } = Layout;
const RadioGroup = Radio.Group;
const Panel = Collapse.Panel;

const typeOfApplicationMenu = [
    { label: 'CAP H1B', value: 'CAP H1B' },
    { label: 'H1B Extension', value: 'H1B Extension' },
    { label: 'H1B RFE', value: 'H1B RFE'}
];

const premiumProcessMenu = [
    { label: 'yes', value: 'Yes' },
    { label: 'no', value: 'No' }
];

class H1bForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            progress:0,
            passportPageProgress :0,
            i94Progress:0,
            evidenceProgress:0,
            payStubsProgress:0,
            mastersTranscriptsProgress:0,
            bachelorDegreeProgress:0,
            resumeProgress:0,
            ssnCopyProgress:0,
            universityDocsProgress:0,
            I140DocumentsProgress:0,
            employmentDocsProgress:0,
            vendorDocsProgress:0,
            layer1DocumentsProgress: 0,
            layer2DocumentsProgress: 0,
            attorneyDocument1Progress: 0,
            attorneyDocument2Progress: 0,
            attorneyDocument3Progress: 0,
            attorneyDocument4Progress: 0,
            employeeDetails:{
                typeOfApplication: 'CAP H1B',
                premiumProcessInfo: '',
                firstName: '',
                middleName: '',
                lastName: '',
                resume: '',
                resumeURL: '',
                bachelorDegree: '',
                bachelorDegreeURL: '',
                mastersTranscripts: '',
                mastersTranscriptsURL: '',
                payStubs: '',
                payStubsURL: '',
                passportPage: '',
                passportPageURL: '',
                i94: '',
                i94URL: '',
                evidence: '',
                evidenceURL: '',
                ssnCopy: '',
                ssnCopyURL: '',
                universityDocs: '',
                universityDocsURL: '',
                addressDetails:{
                  address1:'',
                  address2:'',
                  city:'',
                  state:'',
                  zipCode:''
                },
                overseasAddressDetails:{
                    overseasAddress1:'',
                    overseasAddress2:'',
                    city:'',
                    state:'',
                    zipCode:''
                },
                contactDetails:{
                    homeNumber:'',
                    workNumber:'',
                    mobileNumber:'',
                    email:''
                },
                passportDetails: {
                    birthCountry: '',
                    dateOfBirth: '',
                    countryPassport: '',
                    passportNumber: '',
                    issueDate: '',
                    expirationDate: '',
                    countryOfCitizenship: '',
                    socialSecurityNumber: '',
                    alienNumber: ''
                },
                immigirationDetails: {
                    currentStatus: '',
                    currentStatusOtherName: '',
                    USVisaIssued: '',
                    when: '',
                    visaExpireDate: '',
                    immigrationConsule: '',
                    consulateCity: '',
                    consulateCountry: '',
                    otherName2: '',
                    i94Number: '',
                    entryValidTill: '',
                    lastEntryUS: '',
                    portOfEntry: '',
                    visaStamping: '',
                    visaConsulate: '',
                    USConsulateOther: ''
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
                    clientName: '',
                    clientAddress: '',
                    clientAddress2: '',
                    clientCity: '',
                    clientState: '',
                    clientZipCode: '',
                    vendorName: '',
                    vendorEmail: '',
                    contactNumber: '',
                    projectStartDate: ''
                },
                I140Detials: {
                    I140Approval: '',
                    I140Receipt: '',
                    I140Documents: '',
                    I140DocumentsURL: ''
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
                    dependenceRelationship: '',
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
            reliableDocuments: {
                layer1: '',
                layer1Documents: '',
                layer1DocumentsURL: '',
                layer2: '',
                layer2Documents: '',
                layer2DocumentsURL: '',
                employmentDocs: '',
                employmentDocsURL: '',
                vendorDocs: '',
                vendorDocsURL: ''
            },
            attorneyDocuments: {
                attorneyDocument1: '',
                attorneyDocument1URL: '',
                attorneyDocument2: '',
                attorneyDocument2URL: '',
                attorneyDocument3: '',
                attorneyDocument3URL: '',
                attorneyDocument4: '',
                attorneyDocument4URL: '',
            },
            errors: {},
            previewVisible: false,
            previewImage: '',
            fileList: [],
        }
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        this.props.dispatch(getListOfEmployees());
    }

    //--------------------------------------------------------------------------------------------------------
    //Date functions

    onBirthDateChange = (e, date) => {
        let empDetails = Object.assign({}, this.state.employeeDetails);
        empDetails.passportDetails["dateOfBirth"] = moment(date).valueOf();
        return this.setState({empDetails});
    };

    onPassportIssueDateChange = (e, date) => {
        let empDetails = Object.assign({}, this.state.employeeDetails);
        empDetails.passportDetails["issueDate"] = moment(date).valueOf();
        return this.setState({empDetails});
    };

    onPassportExpirationDateChange = (e, date) => {
        let empDetails = Object.assign({}, this.state.employeeDetails);
        empDetails.passportDetails["expirationDate"] = moment(date).valueOf();
        return this.setState({empDetails});
    };

    onImmigrationUSVisaIssuedDateChange = (e, date) => {
        let empDetails = Object.assign({}, this.state.employeeDetails);
        empDetails.immigirationDetails["USVisaIssued"] = moment(date).valueOf();
        return this.setState({empDetails});
    };
    
    onImmigrationWhenDateChange = (e, date) => {
        let empDetails = Object.assign({}, this.state.employeeDetails);
        empDetails.immigirationDetails["when"] = moment(date).valueOf();
        return this.setState({empDetails});
    };

    onImmigrationvisaExpireDateDateChange = (e, date) => {
        let empDetails = Object.assign({}, this.state.employeeDetails);
        empDetails.immigirationDetails["visaExpireDate"] = moment(date).valueOf();
        return this.setState({empDetails});
    };

    onImmigrationEntryValidTillDateChange = (e, date) => {
        let empDetails = Object.assign({}, this.state.employeeDetails);
        empDetails.immigirationDetails["entryValidTill"] = moment(date).valueOf();
        return this.setState({empDetails});
    };

    onImmigrationLastEntryUSDateChange = (e, date) => {
        let empDetails = Object.assign({}, this.state.employeeDetails);
        empDetails.immigirationDetails["lastEntryUS"] = moment(date).valueOf();
        return this.setState({empDetails});
    };

    onPortOfEntryDateChange = (e, date) => {
        let empDetails = Object.assign({}, this.state.employeeDetails);
        empDetails.immigirationDetails["portOfEntry"] = moment(date).valueOf();
        return this.setState({empDetails});
    };

    onVisaStampingDateChange = (e, date) => {
        let empDetails = Object.assign({}, this.state.employeeDetails);
        empDetails.immigirationDetails["visaStamping"] = moment(date).valueOf();
        return this.setState({empDetails});
    };

    onTravelInfoStartDateChange = (e, date) => {
        let empDetails = Object.assign({}, this.state.employeeDetails);
        empDetails.travelDetails["startDate"] = moment(date).valueOf();
        return this.setState({empDetails});
    };

    onTravelInfoEndDateChange = (e, date) => {
        let empDetails = Object.assign({}, this.state.employeeDetails);
        empDetails.travelDetails["endDate"] = moment(date).valueOf();
        return this.setState({empDetails});
    };

    onTravelHistoryDepartureDateChange = (e, date) => {
        let empDetails = Object.assign({}, this.state.employeeDetails);
        empDetails.travelHistory["departureDate"] = moment(date).valueOf();
        return this.setState({empDetails});
    };

    onTravelHistoryArrivalDateChange = (e, date) => {
        let empDetails = Object.assign({}, this.state.employeeDetails);
        empDetails.travelHistory["arrivalDate"] = moment(date).valueOf();
        return this.setState({empDetails});
    };

    onI140ReceiptDateChange = (e, date) => {
        let empDetails = Object.assign({}, this.state.employeeDetails);
        empDetails.I140Detials["I140ReceiptDate"] = moment(date).valueOf();
        return this.setState({empDetails});
    };

    onI140DateChange = (e, date) => {
        let empDetails = Object.assign({}, this.state.employeeDetails);
        empDetails.I140Detials["I140Date"] = moment(date).valueOf();
        return this.setState({empDetails});
    };

    onKidBirthDateChange = (e, date) => {
        let empDetails = Object.assign({}, this.state.employeeDetails);
        empDetails.kidsDetails["kidBirthDate"] = moment(date).valueOf();
        return this.setState({empDetails});
    };

    onSpouseBirthDateChange = (e, date) => {
        let empDetails = Object.assign({}, this.state.employeeDetails);
        empDetails.H4Details["spouseBirthDate"] = moment(date).valueOf();
        return this.setState({empDetails});
    };

    onMarraigeDateChange = (e, date) => {
        let empDetails = Object.assign({}, this.state.employeeDetails);
        empDetails.H4Details["marraigeDate"] = moment(date).valueOf();
        return this.setState({empDetails});
    };

    onProjectStartDateChange = (e, date) => {
        let empDetails = Object.assign({}, this.state.employeeDetails);
        empDetails.workDetails["projectStartDate"] = moment(date).valueOf();
        return this.setState({empDetails});
    };

    //------------------------------------------------------------------------------------------------

    //Change Functions
    
    onChange = e => this.setState({
        employeeDetails: { ...this.state.employeeDetails, [e.target.name]: e.target.value}
    });

    onContactChange = e => {
        let empDetails = Object.assign({}, this.state.employeeDetails);
        empDetails.contactDetails[e.target.name] = e.target.value;
        return this.setState({empDetails});
    };

    onAddressChange = e => {
        let empDetails = Object.assign({}, this.state.employeeDetails);
        empDetails.addressDetails[e.target.name] = e.target.value;
        return this.setState({empDetails});
    };

    onOverseasAddressChange = e => {
        let empDetails = Object.assign({}, this.state.employeeDetails);
        empDetails.overseasAddressDetails[e.target.name] = e.target.value;
        return this.setState({empDetails});
    };

    onPassportDetailsChange = e => {
        let empDetails = Object.assign({}, this.state.employeeDetails);
        empDetails.passportDetails[e.target.name] = e.target.value;
        return this.setState({empDetails});
    };

    onImmigirationDetailsChange = e => {
        let empDetails = Object.assign({}, this.state.employeeDetails);
        empDetails.immigirationDetails[e.target.name] = e.target.value;
        return this.setState({empDetails});
    };

    onTravelDetailsChange = e => {
        let empDetails = Object.assign({}, this.state.employeeDetails);
        empDetails.travelDetails[e.target.name] = e.target.value;
        return this.setState({empDetails});
    };

    onTravelHistoryChange = e => {
        let empDetails = Object.assign({}, this.state.employeeDetails);
        empDetails.travelHistory[e.target.name] = e.target.value;
        return this.setState({empDetails});
    };

    onH4CheckListDetailsChange = e => {
        let empDetails = Object.assign({}, this.state.employeeDetails);
        empDetails.H4CheckListDetails[e.target.name] = e.target.value;
        return this.setState({empDetails});
    };

    onI140DetailsChange = e => {
        let empDetails = Object.assign({}, this.state.employeeDetails);
        empDetails.I140Detials[e.target.name] = e.target.value;
        return this.setState({empDetails});
    };

    onSpouseDetailsChange = e => {
        let empDetails = Object.assign({}, this.state.employeeDetails);
        empDetails.spouseDetails[e.target.name] = e.target.value;
        return this.setState({empDetails});
    };

    onKidsDetailsChange = e => {
        let empDetails = Object.assign({}, this.state.employeeDetails);
        empDetails.kidsDetails[e.target.name] = e.target.value;
        return this.setState({empDetails});
    };

    onH4DetailsChange = e => {
        let empDetails = Object.assign({}, this.state.employeeDetails);
        empDetails.H4Details[e.target.name] = e.target.value;
        return this.setState({empDetails});
    };

    onWorkDetailsChange = e => {
        let empDetails = Object.assign({}, this.state.employeeDetails);
        empDetails.workDetails[e.target.name] = e.target.value;
        return this.setState({empDetails});
    };

    //------------------------------------------------------------------------------------------------------

    //File Upload functions

    handleCancel = () => this.setState({ previewVisible: false })

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }
    
    handleChange = ({ fileList }) => {
        
        this.setState({ fileList });
        this.props.dispatch(fileUpload(fileList));
    }

    uploadFile = (e, fN) => {
        
        if(this.state.employeeDetails.firstName !== "" && this.state.employeeDetails.lastName !== ""){
            const {firstName, lastName} =  this.state.employeeDetails;
        
            if(e.target.files[0].type === "application/pdf") {
                let fileData = {
                    firstName: firstName,
                    lastName: lastName,
                    folderFileName: firstName+ ' '+lastName + "/"+fN+"/"+e.target.name+"/",
                    inputFileName:e.target.name,
                    file: e.target.files[0]
                };
                this.handleUpload(fileData);
                //this.props.dispatch(fileUpload(fileData));
            } else {
                let errorDetails = Object.assign({}, this.state.errors);
                errorDetails.passportPage = 'Please upload Only PDF files';
                this.setState({errors: errorDetails});
            } 
        } else {
            let errorDetails = Object.assign({}, this.state.errors);
            // let errorName = Object.assign
            errorDetails.passportPage = 'Enter the Name of the Employee';
            this.setState({errors: errorDetails});
        }
    };

    // Upload Document to Employee folder
    handleUpload = (fileData) => {
        const uploadTask = storage.ref(fileData.folderFileName + fileData.file.name).put(fileData.file);
        uploadTask.on('state_changed',
        (snapshot) => {
          // progrss function ....
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          this.setState({[fileData.inputFileName+"Progress"] :progress});
        },
        (error) => {
             // error function ....
          console.log("file upload "+error);
        },
      () => {
          // complete function ....
          storage.ref(fileData.folderFileName).child(fileData.file.name).getDownloadURL().then(url => {              
              this.setState({[fileData.inputFileName+"URL"]:url});
          })
      });
    }

    //Submit Function

    onSubmit = (e) => {
        e.preventDefault();
        
       const errors = this.validate(this.state.employeeDetails);
       this.setState({errors: errors});
       if(Object.keys(errors).length === 0) {
            this.props.dispatch(visaForm(this.state.employeeDetails));
        }
    };

    //Validation Function

    validate = employeeDetails => {
        // console.log(employeeDetails);
        const errors = {};

        if(!employeeDetails.typeOfApplication) errors.typeOfApplication = "Can't be empty";
        // if(!employeeDetails.premiumProcessInfo) errors.premiumProcessInfo = "Can't be empty";

        if(!employeeDetails.firstName) errors.firstName = "Can't be empty";
        // if(!employeeDetails.middleName) errors.middleName = "Can't be empty";
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
        if(!employeeDetails.overseasAddressDetails.overseasAddress1) errors.overseasAddress1 = "Can't be empty";
        if(!employeeDetails.overseasAddressDetails.overseasAddress2) errors.overseasAddress2 = "Can't be empty";
        if(!employeeDetails.overseasAddressDetails.city) errors.city = "Can't be empty";
        if(!employeeDetails.overseasAddressDetails.state) errors.state = "Can't be empty";
        if(!Validator.isNumeric(employeeDetails.overseasAddressDetails.zipCode)) errors.zipCode = "Enter Zipcode";
        
        //Contact Details
        // if(!Validator.isNumeric(employeeDetails.contactDetails.homeNumber)) errors.homeNumber = "Enter Home Number";
        // if(!Validator.isNumeric(employeeDetails.contactDetails.workNumber)) errors.workNumber = "Enter Work Number";
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
        if(!employeeDetails.immigirationDetails.visaExpireDate) errors.visaExpireDate = "Cant't be empty";
        if(!employeeDetails.immigirationDetails.immigrationConsule) errors.immigrationConsule = "Cant't be empty";
        if(!employeeDetails.immigirationDetails.consulateCity) errors.consulateCity = "Cant't be empty";
        if(!employeeDetails.immigirationDetails.consulateCountry) errors.consulateCountry = "Cant't be empty";
        if(!employeeDetails.immigirationDetails.otherName2) errors.otherName2 = "Cant't be empty";
        if(!employeeDetails.immigirationDetails.i94Number) errors.i94Number = "Cant't be empty";
       // if(!employeeDetails.immigirationDetails.entryValidTill) errors.entryValidTill = "Cant't be empty";
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
        const { employeeDetails, reliableDocuments, attorneyDocuments, errors } = this.state;

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
                    <Header className="card" style={{ background: '#fff', padding: 0 }} >
                        <Row>
                            <Col span={4} style={{ alignContent: 'left', paddingLeft: 20 }}>
                                <img src="https://rsrit.com/wp-content/uploads/2017/12/logo_dark.png" alt="reliable" width="150px" height="50px"></img>
                            </Col>
                            <Col span={12} style={{ fontWeight: 'bold', color: '#0066c', textAlign: 'center', paddingLeft: 65 }}>
                                <h1 style={{ fontWeight: 'bold', color: '#0066c' }}>Reliable Immigration Form</h1>
                            </Col>
                             <Col span={8} style={{ float: 'right', fontWeight: 'bold', color: '#0066c', textAlign: 'left', paddingRight: 35 }}>
                                <Link style={{ float: 'right'}} to="/logout">Logout</Link>
                             </Col> 
                        </Row>
                    </Header>
                    <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}> 
                    <Collapse accordion>          
                        <Form>
                            <Row style={{ alignContent: 'center' }}>
                                {/* <Col xs={12} sm={12} md={12} lg={12} xl={12}> */}
                                    <Card title="Application Information">
                                        <Form.Item error={!!errors.typeOfApplication} style={{ color: 'red' }} label="Type of Application" className= "typeOfApplication">
                                            {/* <Input id="typeOfApplication" type="text" name="typeOfApplication" value= {employeeDetails.typeOfApplication} onChange={this.onChange} placeholder="Type of Application" /> */}
                                            {/* <RadioGroup name="typeOfApplication" options={typeOfApplicationMenu} value= {employeeDetails.typeOfApplication} onChange={this.onChange} /> */}
                                            <RadioGroup name="typeOfApplication" defaultValue={'CAP H1B'} value= {employeeDetails.typeOfApplication} onChange={this.onChange} >
                                                <Radio value={'CAP H1B'}>CAP H1B</Radio>
                                                <Radio value={'H1B Extension'}>H1B Extension</Radio>
                                                <Radio value={'H1B RFE'}>H1B RFE</Radio>
                                            </RadioGroup>
                                                {errors.typeOfApplication}
                                        </Form.Item>
                                    </Card>
                                {/* </Col> */}
                                
                                {/* <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <Card title="Premium Process Information">
                                        <Form.Item error={!!errors.premiumProcessInfo} style={{ color: 'red' }} label="Premium Process" className= "premiumProcessInfo">
                                            <Input id="premiumProcessInfo" type="text" name="premiumProcessInfo" value= {employeeDetails.premiumProcessInfo} onChange={this.onChange} placeholder="Premium Process" />
                                            <RadioGroup name="premiumProcessInfo" options={premiumProcessMenu} value= {employeeDetails.premiumProcessInfo} onChange={this.onChange} />
                                            {errors.premiumProcessInfo}
                                        </Form.Item>
                                    </Card>
                                </Col> */}
                                </Row>
                            </Form>                     
                        <Panel className="boldClass"  header="Personal Information"  key="1">
                            {/* Employee Registration */}
                                <Form layout="inline">
                                    
                                    <Row>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <Card title="Applicant Information">
                                            <Form.Item error={!!errors.firstName} style={{ color: 'red' }} label="First Name">
                                                <Input id="firstName" type="text" name="firstName" value= {employeeDetails.firstName} onChange={this.onChange} placeholder="First Name" />
                                                    {errors.firstName}
                                            </Form.Item>

                                            <Form.Item error={!!errors.middleName} style={{ color: 'red' }} label="Middle Name">
                                                <Input id="middleName" type="text" name="middleName" value= {employeeDetails.middleName} onChange={this.onChange} placeholder="Middle Name" />
                                                {/* {errors.middleName} */}
                                            </Form.Item>

                                            <Form.Item error={!!errors.lastName} style={{ color: 'red' }} label="Last Name">
                                                <Input id="lastName" type="text" name="lastName" value= {employeeDetails.lastName} onChange={this.onChange} placeholder="Last Name" />
                                                {errors.lastName}
                                            </Form.Item>

                                            </Card>
                                        </Col>
                                        
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <Card title="Contact Information">
                                                
                                                <Form.Item error={!!errors.homeNumber} style={{ color: 'red' }} label="Home Number(Optional)">
                                                        <Input id="homeNumber" type="number" max={10} name="homeNumber" value= {employeeDetails.contactDetails.homeNumber} onChange={this.onContactChange} placeholder="(000) 000-0000" />
                                                        {errors.homeNumber}
                                                </Form.Item>

                                                <Form.Item error={!!errors.workNumber} style={{ color: 'red' }} label="Work Number">
                                                    <Input id="workNumber" type="number" max={10} name="workNumber" value= {employeeDetails.contactDetails.workNumber} onChange={this.onContactChange} placeholder="(000) 000-0000" />
                                                    {/* {errors.workNumber} */}
                                                </Form.Item>

                                                <Form.Item error={!!errors.mobileNumber} style={{ color: 'red' }} label="Mobile Number">
                                                    <Input id="mobileNumber" type="number" max={10} name="mobileNumber" value= {employeeDetails.contactDetails.mobileNumber} onChange={this.onContactChange}placeholder="(000) 000-0000" />
                                                    {errors.mobileNumber}
                                                </Form.Item>

                                                <Form.Item error={!!errors.email} style={{ color: 'red' }} label="Email">
                                                        <Input id="email" type="email" name="email"  value= {employeeDetails.contactDetails.email} onChange={this.onContactChange} placeholder="Email" />
                                                        {errors.email}
                                                </Form.Item>

                                            </Card>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <Card title="Present Address Information(U.S)">
                                                
                                                <Form.Item error={!!errors.address1} style={{ color: 'red' }} label="Present Address 1">
                                                        <Input id="address1" type="address1" name="address1"value= {employeeDetails.addressDetails.address1} onChange={this.onAddressChange} placeholder="Present Address 1" />
                                                        {errors.address1}
                                                </Form.Item>

                                                <Form.Item error={!!errors.address2} style={{ color: 'red' }} label="Present Address 2">
                                                    <Input id="address2" type="address2" name="address2"value= {employeeDetails.addressDetails.address2} onChange={this.onAddressChange} placeholder="Present Address 2" />
                                                    {errors.address2}
                                                </Form.Item>

                                                <Form.Item error={!!errors.city} style={{ color: 'red' }} label="City">
                                                    <Input id="city" type="city" name="city"value= {employeeDetails.addressDetails.city} onChange={this.onAddressChange} placeholder="City" />
                                                    {errors.city}
                                                </Form.Item>

                                                <Form.Item error={!!errors.state}  label="State">
                                                        <Input id="state" type="state" name="state"  value= {employeeDetails.addressDetails.state} onChange={this.onAddressChange} placeholder="State" />
                                                        {errors.state}
                                                </Form.Item>

                                                <Form.Item error={!!errors.zipCode} style={{ color: 'red' }} label="Zip Code">
                                                        <Input  id="zipCode" type="number" name="zipCode" value={employeeDetails.addressDetails.zipCode}onChange={this.onAddressChange} placeholder= "Enter Your Zipcode"/>
                                                        {errors.zipCode}
                                                </Form.Item>

                                                <Form.Item error={!!errors.country} style={{ color: 'red' }} label="Country">
                                                        <Input id="country" type="country" name="country"  value= {employeeDetails.addressDetails.country} onChange={this.onAddressChange} placeholder="Country" />
                                                        {errors.country}
                                                </Form.Item>

                                            </Card>
                                        </Col>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <Card title="Overseas Address Information">
                                                
                                                <Form.Item error={!!errors.overseasAddress1} style={{ color: 'red' }} label="Overseas Address 1">
                                                        <Input id="overseasAddress1" type="overseasAddress1" name="overseasAddress1" value= {employeeDetails.overseasAddressDetails.overseasAddress1} onChange={this.onOverseasAddressChange} placeholder="Overseas Address 1" />
                                                        {errors.overseasAddress1}
                                                </Form.Item>

                                                <Form.Item error={!!errors.overseasAddress2} style={{ color: 'red' }} label="Overseas Address 2">
                                                    <Input id="overseasAddress2" type="overseasAddress2" name="overseasAddress2" value= {employeeDetails.overseasAddressDetails.overseasAddress2} onChange={this.onOverseasAddressChange} placeholder="Overseas Address 2" />
                                                    {errors.overseasAddress2}
                                                </Form.Item>

                                                <Form.Item error={!!errors.city} style={{ color: 'red' }} label="City">
                                                    <Input id="city" type="city" name="city"value= {employeeDetails.overseasAddressDetails.city} onChange={this.onOverseasAddressChange} placeholder="City" />
                                                    {errors.city}
                                                </Form.Item>

                                                <Form.Item error={!!errors.state} style={{ color: 'red' }} label="State">
                                                        <Input id="state" type="state" name="state"  value= {employeeDetails.overseasAddressDetails.state} onChange={this.onOverseasAddressChange} placeholder="State" />
                                                        {errors.state}
                                                </Form.Item>

                                                <Form.Item error={!!errors.zipCode} style={{ color: 'red' }} label="Zip Code">
                                                        <Input  id="zipCode" type="number" name="zipCode" value={employeeDetails.overseasAddressDetails.zipCode}onChange={this.onOverseasAddressChange} placeholder= "Enter Your Zipcode"/>
                                                        {errors.zipCode}
                                                </Form.Item>

                                                <Form.Item error={!!errors.country} style={{ color: 'red' }} label="Country">
                                                        <Input id="country" type="country" name="country"  value= {employeeDetails.overseasAddressDetails.country} onChange={this.onOverseasAddressChange} placeholder="Country" />
                                                        {errors.country}
                                                </Form.Item>

                                            </Card>
                                        </Col>
                                    </Row>
                                    </Form>
                                    </Panel>
                                    <Panel className="boldClass" header="Immigration Information" key="2">
                                    <Form layout="inline">
                                    <Row>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <Card title="Passport Information">
                                                {/* <Form.Item error={!!errors.birthCountry} style={{ color: 'red' }} label="Birth Country">
                                                        <Input id="birthCountry" type="text" name="birthCountry"  value= {employeeDetails.passportDetails.birthCountry} onChange={this.onPassportDetailsChange} placeholder="Birth Country" />
                                                        {errors.birthCountry}
                                                </Form.Item> */}
                                                <Form.Item error={!!errors.dateOfBirth} style={{ color: 'red' }} label="Date of Birth">
                                                        {/* <Input id="dateOfBirth" type="text" name="dateOfBirth"  value= {employeeDetails.passportDetails.dateOfBirth} onChange={this.onChange} placeholder="Date of Birth" /> */}
                                                        <DatePicker onChange={this.onBirthDateChange} dateFormat="yyyy/MM/dd" placeholder= "Birth Date" defaultValue= {moment()} />
                                                        {errors.dateOfBirth}
                                                </Form.Item>
                                                {/* <Form.Item error={!!errors.countryPassport} style={{ color: 'red' }} label="Country">
                                                        <Input id="countryPassport" type="text" name="countryPassport"  value= {employeeDetails.passportDetails.countryPassport} onChange={this.onPassportDetailsChange} placeholder="Country" />
                                                        {errors.countryPassport}
                                                </Form.Item> */}
                                                <Form.Item error={!!errors.passportNumber} style={{ color: 'red' }} label="Passport Number">
                                                        <Input id="passportNumber" type="text" name="passportNumber"  value= {employeeDetails.passportDetails.passportNumber} onChange={this.onPassportDetailsChange} placeholder="Passport Number" />
                                                        {errors.passportNumber}
                                                </Form.Item>
                                                <Form.Item error={!!errors.issueDate} style={{ color: 'red' }} label="Issue Date">
                                                        {/* <Input id="issueDate" type="date" name="issueDate"  value= {employeeDetails.passportDetails.issueDate} onChange={this.onChange} placeholder="Issue Date" /> */}
                                                        <DatePicker onChange={this.onPassportIssueDateChange} dateFormat="yyyy/MM/dd" placeholder= "Issue Date" defaultValue= {moment()} />
                                                        {errors.issueDate}
                                                </Form.Item>
                                                <Form.Item error={!!errors.expirationDate} style={{ color: 'red' }} label="Expiration Date">
                                                        {/* <Input id="expirationDate" type="text" name="expirationDate"  value= {employeeDetails.passportDetails.expirationDate} onChange={this.onChange} placeholder="Expiration Date" /> */}
                                                        <DatePicker onChange={this.onPassportExpirationDateChange} dateFormat="yyyy/MM/dd" placeholder= "Expiration Date" defaultValue= {moment()} />
                                                        {errors.expirationDate}
                                                </Form.Item>
                                                <Form.Item error={!!errors.countryOfCitizenship} style={{ color: 'red' }} label="Country Of Citizenship">
                                                        <Input id="countryOfCitizenship" type="text" name="countryOfCitizenship"  value= {employeeDetails.passportDetails.countryOfCitizenship} onChange={this.onPassportDetailsChange} placeholder="Country Of Citizenship" />
                                                        {errors.countryOfCitizenship}
                                                </Form.Item>
                                                <Form.Item error={!!errors.socialSecurityNumber} style={{ color: 'red' }} label="Social Security Number">
                                                        <Input id="socialSecurityNumber" type="number" name="socialSecurityNumber"  value= {employeeDetails.passportDetails.socialSecurityNumber} onChange={this.onPassportDetailsChange} placeholder="Social Security Number" />
                                                        {errors.socialSecurityNumber}
                                                </Form.Item>
                                                <Form.Item error={!!errors.alienNumber} style={{ color: 'red' }} label="Alien Number">
                                                        <Input id="alienNumber" type="number" name="alienNumber"  value= {employeeDetails.passportDetails.alienNumber} onChange={this.onPassportDetailsChange} placeholder="Alien Number" />
                                                        {errors.alienNumber}
                                                </Form.Item>
                                            </Card>
                                        </Col>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <Card title="Immigration Information">
                                                <Form.Item error={!!errors.currentStatus} style={{ color: 'red' }} label="Current Status">
                                                        {/* <Input id="currentStatus" type="text" name="currentStatus"  value= {employeeDetails.immigirationDetails.currentStatus} onChange={this.onImmigirationDetailsChange} placeholder="Current Status" /> */}
                                                        <RadioGroup name="currentStatus" value= {employeeDetails.immigirationDetails.currentStatus} onChange={this.onImmigirationDetailsChange} >                                                            
                                                            <Radio value={'F1'}>F1</Radio>
                                                            <Radio value={'H1B'}>H1B</Radio>
                                                            <Radio value={'H4'}>H4</Radio>
                                                            <Radio value={'B1/B2'}>B1/B2</Radio>
                                                            <Radio value={'L1/L2'}>L1/L2</Radio>
                                                            <Radio value={'other'}>Other</Radio>
                                                        </RadioGroup>
                                                        {errors.currentStatus}
                                                </Form.Item>
                                                {/* <Form.Item error={!!errors.currentStatusOtherName} style={{ color: 'red' }} label="Current Status Other Name">
                                                        <Input id="currentStatusOtherName" type="text" name="currentStatusOtherName"  value= {employeeDetails.immigirationDetails.currentStatusOtherName} onChange={this.onImmigirationDetailsChange} placeholder="Current Status Other Name" />
                                                        {errors.currentStatusOtherName}
                                                </Form.Item> */}
                                                <Form.Item error={!!errors.USVisaIssued} style={{ color: 'red' }} label="Visa Start Date">
                                                        {/* <Input id="USVisaIssued" type="text" name="USVisaIssued"  value= {employeeDetails.immigirationDetails.USVisaIssued} onChange={this.onChange} placeholder="US Visa Issued" /> */}
                                                        <DatePicker onChange={this.onImmigrationUSVisaIssuedDateChange} dateFormat="yyyy/MM/dd" placeholder= "Visa Start Date" defaultValue= {moment()} />
                                                        {errors.USVisaIssued}
                                                </Form.Item>
                                                {/* <Form.Item error={!!errors.when} style={{ color: 'red' }} label="When">
                                                        <Input id="when" type="text" name="when"  value= {employeeDetails.immigirationDetails.when} onChange={this.onChange} placeholder="When" />
                                                        <DatePicker onChange={this.onImmigrationWhenDateChange} dateFormat="yyyy/MM/dd" placeholder= "When" defaultValue= {moment()} />
                                                        {errors.when}
                                                </Form.Item> */}
                                                <Form.Item error={!!errors.visaExpireDate} style={{ color: 'red' }} label="Visa Expire Date">
                                                        {/* <Input id="visaExpireDate" type="text" name="visaExpireDate"  value= {employeeDetails.immigirationDetails.visaExpireDate} onChange={this.onChange} placeholder="Valid Until" /> */}
                                                        <DatePicker onChange={this.onImmigrationvisaExpireDateDateChange} dateFormat="yyyy/MM/dd" placeholder= "Visa Expire Date" defaultValue= {moment()} />
                                                        {errors.visaExpireDate}
                                                </Form.Item>
                                                <Form.Item error={!!errors.immigrationConsule} style={{ color: 'red' }} label="Consulate Name">
                                                        <Input id="immigrationConsule" type="text" name="immigrationConsule"  value= {employeeDetails.immigirationDetails.immigrationConsule} onChange={this.onImmigirationDetailsChange} placeholder="Consulate" />
                                                        {errors.immigrationConsule}
                                                </Form.Item>
                                                <Form.Item error={!!errors.consulateCity} style={{ color: 'red' }} label="City">
                                                        <Input id="consulateCity" type="text" name="consulateCity"  value= {employeeDetails.immigirationDetails.consulateCity} onChange={this.onImmigirationDetailsChange} placeholder="Consulate-City" />
                                                        {errors.consulateCity}
                                                </Form.Item>
                                                <Form.Item error={!!errors.consulateCountry} style={{ color: 'red' }} label="Country">
                                                        <Input id="consulateCountry" type="text" name="consulateCountry"  value= {employeeDetails.immigirationDetails.consulateCountry} onChange={this.onImmigirationDetailsChange} placeholder="Consulate-Country" />
                                                        {errors.consulateCountry}
                                                </Form.Item>
                                                {/* <Form.Item error={!!errors.otherName2} style={{ color: 'red' }} label="Other Name 2">
                                                        <Input id="otherName2" type="text" name="otherName2"  value= {employeeDetails.immigirationDetails.otherName2} onChange={this.onImmigirationDetailsChange} placeholder="Other Name 2" />
                                                        {errors.otherName2}
                                                </Form.Item> */}
                                                <Form.Item error={!!errors.i94Number} style={{ color: 'red' }} label="I-94">
                                                        <Input id="i94Number" type="text" name="i94Number"  value= {employeeDetails.immigirationDetails.i94Number} onChange={this.onImmigirationDetailsChange} placeholder="I-94" />
                                                        {errors.i94Number}
                                                </Form.Item>
                                                {/* <Form.Item error={!!errors.entryValidTill} style={{ color: 'red' }} label="Expiration Date">
                                                        <Input id="entryValidTill" type="text" name="entryValidTill"  value= {employeeDetails.immigirationDetails.entryValidTill} onChange={this.onChange} placeholder="Entry Valid Till" /> 
                                                        <DatePicker onChange={this.onImmigrationEntryValidTillDateChange} dateFormat="yyyy/MM/dd" placeholder= "Entry Valid Till" defaultValue= {moment()} />
                                                        {errors.entryValidTill}
                                                </Form.Item>*/}
                                                <Form.Item error={!!errors.lastEntryUS} style={{ color: 'red' }} label="Last Entry US">
                                                        {/* <Input id="lastEntryUS" type="text" name="lastEntryUS"  value= {employeeDetails.immigirationDetails.lastEntryUS} onChange={this.onChange} placeholder="Last Entry US" /> */}
                                                        <DatePicker onChange={this.onImmigrationLastEntryUSDateChange} dateFormat="yyyy/MM/dd" placeholder= "Last Entry US" defaultValue= {moment()} />
                                                        {errors.lastEntryUS}
                                                </Form.Item>
                                                <Form.Item error={!!errors.portOfEntry} style={{ color: 'red' }} label="Port Of Entry (City, State)">
                                                        <Input id="portOfEntry" type="text" name="portOfEntry"  value= {employeeDetails.immigirationDetails.portOfEntry} onChange={this.onImmigirationDetailsChange} placeholder="Example: Chicago, IL" />
                                                        {/* <DatePicker onChange={this.onPortOfEntryDateChange} dateFormat="yyyy/MM/dd" placeholder= "Port of ENtry" defaultValue= {moment()} /> */}
                                                        {errors.portOfEntry}
                                                </Form.Item>
                                                {/* <Form.Item error={!!errors.visaStamping} style={{ color: 'red' }} label="Visa Stamping">
                                                        <Input id="visaStamping" type="text" name="visaStamping"  value= {employeeDetails.immigirationDetails.visaStamping} onChange={this.onImmigirationDetailsChange} placeholder="Visa Stamping" />
                                                        <DatePicker onChange={this.onVisaStampingDateChange} dateFormat="yyyy/MM/dd" placeholder= "Visa Stamping" defaultValue= {moment()} />
                                                        {errors.visaStamping}
                                                </Form.Item> */}
                                                {/* <Form.Item error={!!errors.visaConsulate} style={{ color: 'red' }} label="Visa Consulate">
                                                        <Input id="visaConsulate" type="text" name="visaConsulate"  value= {employeeDetails.immigirationDetails.visaConsulate} onChange={this.onImmigirationDetailsChange} placeholder="Visa Consulate" />
                                                        {errors.visaConsulate}
                                                </Form.Item> */}
                                                {/* <Form.Item error={!!errors.USConsulateOther} style={{ color: 'red' }} label="US Consulate Other">
                                                        <Input id="USConsulateOther" type="text" name="USConsulateOther"  value= {employeeDetails.immigirationDetails.USConsulateOther} onChange={this.onImmigirationDetailsChange} placeholder="US Consulate Other" />
                                                        {errors.USConsulateOther}
                                                </Form.Item> */}
                                            </Card>
                                        </Col>
                                    </Row>
                                    </Form>
                                    </Panel>
                                    <Panel className="boldClass" header="Travel Information" key="3">
                                    <Form layout="inline">
                                    <Row>
                                        {/* <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <Card title="Travel Information">
                                                <Form.Item error={!!errors.startDate} style={{ color: 'red' }} label="Start Date">
                                                        <Input id="startDate" type="text" name="startDate"  value= {employeeDetails.travelDetails.startDate} onChange={this.onChange} placeholder="Start Date" />
                                                        <DatePicker onChange={this.onTravelInfoStartDateChange} dateFormat="yyyy/MM/dd" placeholder= "Start Date" defaultValue= {moment()} />
                                                        {errors.startDate}
                                                </Form.Item>
                                                <Form.Item error={!!errors.endDate} style={{ color: 'red' }} label="End Date">
                                                        <Input id="endDate" type="text" name="endDate"  value= {employeeDetails.travelDetails.endDate} onChange={this.onChange} placeholder="End Date" />
                                                        <DatePicker onChange={this.onTravelInfoEndDateChange} dateFormat="yyyy/MM/dd" placeholder= "End Date" defaultValue= {moment()} />
                                                        {errors.endDate}
                                                </Form.Item>
                                                <Form.Item error={!!errors.daysCount} style={{ color: 'red' }} label="Days Count">
                                                        <Input id="daysCount" type="number" name="daysCount"  value= {employeeDetails.travelDetails.daysCount} onChange={this.onTravelDetailsChange} placeholder="Days Count" />
                                                        {errors.daysCount}
                                                </Form.Item>
                                            </Card>
                                        </Col> */}
                                        <Col >
                                            <Card title="Overseas Travel History (If Applicable)">
                                                <Form.Item error={!!errors.departureDate} style={{ color: 'red' }} label="Departure Date">
                                                        {/* <Input id="departureDate" type="text" name="departureDate"  value= {employeeDetails.travelHistory.departureDate} onChange={this.onChange} placeholder="Departure Date" /> */}
                                                        <DatePicker onChange={this.onTravelHistoryDepartureDateChange} dateFormat="yyyy/MM/dd" placeholder= "Departure Date" defaultValue= {moment()} />
                                                        {errors.departureDate}
                                                </Form.Item>
                                                <Form.Item error={!!errors.arrivalDate} style={{ color: 'red' }} label="Arrival Date">
                                                        {/* <Input id="arrivalDate" type="text" name="arrivalDate"  value= {employeeDetails.travelHistory.arrivalDate} onChange={this.onChange} placeholder="Arrival Date" /> */}
                                                        <DatePicker onChange={this.onTravelHistoryArrivalDateChange} dateFormat="yyyy/MM/dd" placeholder= "Arrival Date" defaultValue= {moment()} />
                                                        {errors.arrivalDate}
                                                </Form.Item>
                                                <Form.Item error={!!errors.daysSpent} style={{ color: 'red' }} label="Days Count">
                                                        <Input id="daysSpent" type="number" name="daysSpent"  value= {employeeDetails.travelHistory.daysSpent} onChange={this.onTravelHistoryChange} placeholder="Days Count" />
                                                        {errors.daysSpent}
                                                </Form.Item>
                                            </Card>
                                        </Col>
                                    </Row>
                                    </Form>
                                    </Panel>
                                        {/* <Row> 
                                       <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <Card title="Check List Information for H4B">
                                                <Form.Item error={!!errors.H4Passport} style={{ color: 'red' }} label="H4 Passport">
                                                        <Input id="H4Passport" type="text" name="H4Passport"  value= {employeeDetails.H4CheckListDetails.H4Passport} onChange={this.onH4CheckListDetailsChange} placeholder="H4 Passport" />
                                                        {errors.H4Passport}
                                                </Form.Item>
                                                <Form.Item error={!!errors.H4i94} style={{ color: 'red' }} label="H4 i94">
                                                        <Input id="H4i94" type="text" name="H4i94"  value= {employeeDetails.H4CheckListDetails.H4i94} onChange={this.onH4CheckListDetailsChange} placeholder="H4 i94" />
                                                        {errors.H4i94}
                                                </Form.Item>
                                                <Form.Item error={!!errors.H4Approval} style={{ color: 'red' }} label="H4 Approval">
                                                        <Input id="H4Approval" type="text" name="H4Approval"  value= {employeeDetails.H4CheckListDetails.H4Approval} onChange={this.onH4CheckListDetailsChange} placeholder="H4 Approval" />
                                                        {errors.H4Approval}
                                                </Form.Item>
                                                <Form.Item error={!!errors.H4Marraige} style={{ color: 'red' }} label="H4 Marraige">
                                                        <Input id="H4Marraige" type="text" name="H4Marraige"  value= {employeeDetails.H4CheckListDetails.H4Marraige} onChange={this.onH4CheckListDetailsChange} placeholder="H4 Marraige" />
                                                        {errors.H4Marraige}
                                                </Form.Item>
                                                <Form.Item error={!!errors.H4ChildrenCertificate} style={{ color: 'red' }} label="H4 Children Certificate">
                                                        <Input id="H4ChildrenCertificate" type="text" name="H4ChildrenCertificate"  value= {employeeDetails.H4CheckListDetails.H4ChildrenCertificate} onChange={this.onH4CheckListDetailsChange} placeholder="H4 Children Certificate" />
                                                        {errors.H4ChildrenCertificate}
                                                </Form.Item>
                                            </Card>
                                        </Col> 
                                        <Col>
                                            <Row> 
                                                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                                    <Card title="I-140 Approval">
                                                        <Form.Item error={!!errors.I140Approval} style={{ color: 'red' }} label="I-140 Approval Start Date">
                                                                <Input id="I140Approval" type="text" name="I140Approval"  value= {employeeDetails.I140Detials.I140Approval} onChange={this.onI140DetailsChange} placeholder="I-140 Approval start date" />
                                                                {errors.I140Approval}
                                                        </Form.Item>
                                                        <Form.Item error={!!errors.I140Approval} style={{ color: 'red' }} label="I-140 Approval">
                                                                <Input id="I140Date" type="text" name="I140Date"  value= {employeeDetails.I140Detials.I140Date} onChange={this.onChange} placeholder="I-140 Date" />
                                                                <DatePicker onChange={this.onI140DateChange} dateFormat="yyyy/MM/dd" placeholder= "I-140 Approval" defaultValue= {moment()} />
                                                                {errors.I140Approval}
                                                        </Form.Item>
                                                        <Form.Item error={!!errors.I140Receipt} style={{ color: 'red' }} label="I-140 Receipt">
                                                                <Input id="I140ReceiptDate" type="text" name="I140ReceiptDate"  value= {employeeDetails.I140Detials.I140ReceiptDate} onChange={this.onChange} placeholder="I-140 Receipt Date" />
                                                                <DatePicker onChange={this.onI140ReceiptDateChange} dateFormat="yyyy/MM/dd" placeholder= "I-140 Receipt" defaultValue= {moment()} />
                                                                {errors.I140Receipt}
                                                        </Form.Item>
                                                        <Form.Item error={!!errors.I140Documents} style={{ color: 'red' }} label="I-140 Documents">
                                                            <Input id="I140Documents" type="file" name="I140Documents" onChange={(e) => this.uploadFile(e, "Employee")} placeholder="I-140 Documents" />
                                                            {errors.I140Documents}
                                                            <progress value={this.state.I140DocumentsProgress} max="100"/>
                                                        </Form.Item>
                                                    </Card>
                                                </Col> 
                                                 <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                                    <Card title="Spouse Information">
                                                        <Form.Item error={!!errors.maritalStatus} style={{ color: 'red' }} label="Marital Status">
                                                                <Input id="maritalStatus" type="text" name="maritalStatus"  value= {employeeDetails.spouseDetails.maritalStatus} onChange={this.onSpouseDetailsChange} placeholder="Marital Status" />
                                                                {errors.maritalStatus}
                                                        </Form.Item>
                                                        <Form.Item error={!!errors.spouseH4} style={{ color: 'red' }} label="Spouse H4">
                                                                <Input id="spouseH4" type="text" name="spouseH4"  value= {employeeDetails.spouseDetails.spouseH4} onChange={this.onSpouseDetailsChange} placeholder="Spouse H4" />
                                                                {errors.spouseH4}
                                                        </Form.Item>
                                                        <Form.Item error={!!errors.dependenceRelationship} style={{ color: 'red' }} label="Dependence Relationship">
                                                                <Input id="dependenceRelationship" type="text" name="dependenceRelationship"  value= {employeeDetails.spouseDetails.dependenceRelationship} onChange={this.onSpouseDetailsChange} placeholder="Dependence Relationship" />
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
                                                <Form.Item error={!!errors.kidFullName} style={{ color: 'red' }} label="Full Name">
                                                    <Input id="kidFullName" type="text" name="kidFullName"  value= {employeeDetails.kidsDetails.kidFullName} onChange={this.onKidsDetailsChange} placeholder="kid Full Name" />
                                                    {errors.kidFullName}
                                                </Form.Item>
                                                <Form.Item error={!!errors.kidGender} style={{ color: 'red' }} label="Gender">
                                                    <Input id="kidGender" type="text" name="kidGender"  value= {employeeDetails.kidsDetails.kidGender} onChange={this.onKidsDetailsChange} placeholder="Gender" />
                                                    {errors.kidGender}
                                                </Form.Item>
                                                <Form.Item error={!!errors.kidMaritalStatus} style={{ color: 'red' }} label="Marital Status">
                                                    <Input id="kidMaritalStatus" type="text" name="kidMaritalStatus"  value= {employeeDetails.kidsDetails.kidMaritalStatus} onChange={this.onKidsDetailsChange} placeholder="Marital Status" />
                                                    {errors.kidMaritalStatus}
                                                </Form.Item>
                                                <Form.Item error={!!errors.kidBirthDate} style={{ color: 'red' }} label="Birth Date">
                                                    <Input id="kidBirthDate" type="text" name="kidBirthDate"  value= {employeeDetails.kidsDetails.kidBirthDate} onChange={this.onChange} placeholder="Birth Date" />
                                                    <DatePicker onChange={this.onKidBirthDateChange} dateFormat="yyyy/MM/dd" placeholder= "Birth Date" defaultValue= {moment()} />
                                                    {errors.kidBirthDate}
                                                </Form.Item>
                                                <Form.Item error={!!errors.kidCountry} style={{ color: 'red' }} label="Country">
                                                    <Input id="kidCountry" type="text" name="kidCountry"  value= {employeeDetails.kidsDetails.kidCountry} onChange={this.onKidsDetailsChange} placeholder="Country" />
                                                    {errors.kidCountry}
                                                </Form.Item>
                                                <Form.Item error={!!errors.kidCountryOfCitizen} style={{ color: 'red' }} label="Country Of Citizen">
                                                    <Input id="kidCountryOfCitizen" type="text" name="kidCountryOfCitizen"  value= {employeeDetails.kidsDetails.kidCountryOfCitizen} onChange={this.onKidsDetailsChange} placeholder="Country Of Citizen" />
                                                    {errors.kidCountryOfCitizen}
                                                </Form.Item>
                                                <Form.Item error={!!errors.kidImmigrationStatus} style={{ color: 'red' }} label="Immigration Status">
                                                    <Input id="kidImmigrationStatus" type="text" name="kidImmigrationStatus"  value= {employeeDetails.kidsDetails.kidImmigrationStatus} onChange={this.onKidsDetailsChange} placeholder="Immigration Status" />
                                                    {errors.kidImmigrationStatus}
                                                </Form.Item>
                                                <Form.Item error={!!errors.kidSocialSecurityNumber} style={{ color: 'red' }} label="Social Security Number">
                                                    <Input id="kidSocialSecurityNumber" type="number" name="kidSocialSecurityNumber"  value= {employeeDetails.kidsDetails.kidSocialSecurityNumber} onChange={this.onKidsDetailsChange} placeholder="Social Security Number" />
                                                    {errors.kidSocialSecurityNumber}
                                                </Form.Item>
                                                <Form.Item error={!!errors.kidCurrentAddress} style={{ color: 'red' }} label="Current Address">
                                                    <Input id="kidCurrentAddress" type="text" name="kidCurrentAddress"  value= {employeeDetails.kidsDetails.kidCurrentAddress} onChange={this.onKidsDetailsChange} placeholder="Current Address" />
                                                    {errors.kidCurrentAddress}
                                                </Form.Item>
                                            </Card>
                                        </Col>
                                     <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <Card title="H4 Information">
                                                <Form.Item error={!!errors.spouseFullName} style={{ color: 'red' }} label="Spouse Full Name">
                                                    <Input id="spouseFullName" type="text" name="spouseFullName"  value= {employeeDetails.H4Details.spouseFullName} onChange={this.onH4DetailsChange} placeholder="Spouse Full Name" />
                                                    {errors.spouseFullName}
                                                </Form.Item>
                                                <Form.Item error={!!errors.spouseBirthDate} style={{ color: 'red' }} label="Spouse Birth Date">
                                                    <Input id="spouseBirthDate" type="text" name="spouseBirthDate"  value= {employeeDetails.H4Details.spouseBirthDate} onChange={this.onChange} placeholder="Spouse Birth Date" />
                                                    <DatePicker onChange={this.onSpouseBirthDateChange} dateFormat="yyyy/MM/dd" placeholder= "Birth Date" defaultValue= {moment()} />
                                                    {errors.spouseBirthDate}
                                                </Form.Item>
                                                <Form.Item error={!!errors.spouseCountry} style={{ color: 'red' }} label="Spouse Country">
                                                    <Input id="spouseCountry" type="text" name="spouseCountry"  value= {employeeDetails.H4Details.spouseCountry} onChange={this.onH4DetailsChange} placeholder="Spouse Country" />
                                                    {errors.spouseCountry}
                                                </Form.Item>
                                                <Form.Item error={!!errors.spouseCountryOfCitizen} style={{ color: 'red' }} label="Spouse Country Of Citizen">
                                                    <Input id="spouseCountryOfCitizen" type="text" name="spouseCountryOfCitizen"  value= {employeeDetails.H4Details.spouseCountryOfCitizen} onChange={this.onH4DetailsChange} placeholder="Spouse Country Of Citizen" />
                                                    {errors.spouseCountryOfCitizen}
                                                </Form.Item>
                                                <Form.Item error={!!errors.marraigeDate} style={{ color: 'red' }} label="Marraige Date">
                                                    <Input id="marraigeDate" type="text" name="marraigeDate"  value= {employeeDetails.H4Details.marraigeDate} onChange={this.onChange} placeholder="Marraige Date" />
                                                    <DatePicker onChange={this.onMarraigeDateChange} dateFormat="yyyy/MM/dd" placeholder= "Marraige Date" defaultValue= {moment()} />
                                                    {errors.marraigeDate}
                                                </Form.Item>
                                                <Form.Item error={!!errors.countryOfMarraige} style={{ color: 'red' }} label="Country Of Marraige">
                                                    <Input id="countryOfMarraige" type="text" name="countryOfMarraige"  value= {employeeDetails.H4Details.countryOfMarraige} onChange={this.onH4DetailsChange} placeholder="Country Of Marraige" />
                                                    {errors.countryOfMarraige}
                                                </Form.Item>
                                                <Form.Item error={!!errors.spouseImmigrationStatus} style={{ color: 'red' }} label="Spouse Immigration Status">
                                                    <Input id="spouseImmigrationStatus" type="text" name="spouseImmigrationStatus"  value= {employeeDetails.H4Details.spouseImmigrationStatus} onChange={this.onH4DetailsChange} placeholder="Spouse Immigration Status" />
                                                    {errors.spouseImmigrationStatus}
                                                </Form.Item>
                                                <Form.Item error={!!errors.spouseSoicalSecurityNumber} style={{ color: 'red' }} label="Spouse Soical Security Number">
                                                    <Input id="spouseSoicalSecurityNumber" type="number" name="spouseSoicalSecurityNumber"  value= {employeeDetails.H4Details.spouseSoicalSecurityNumber} onChange={this.onH4DetailsChange} placeholder="Spouse Soical Security Number" />
                                                    {errors.spouseSoicalSecurityNumber}
                                                </Form.Item>
                                                <Form.Item error={!!errors.dependenceRelationship} style={{ color: 'red' }} label="Dependence Relationship">
                                                        <Input id="dependenceRelationship" type="text" name="dependenceRelationship"  value= {employeeDetails.H4Details.dependenceRelationship} onChange={this.onH4DetailsChange} placeholder="Dependence Relationship" />
                                                        {errors.dependenceRelationship}
                                                </Form.Item>
                                                <Form.Item error={!!errors.spouseCurrentAddress} style={{ color: 'red' }} label="Spouse Current Address">
                                                    <Input id="spouseCurrentAddress" type="text" name="spouseCurrentAddress"  value= {employeeDetails.H4Details.spouseCurrentAddress} onChange={this.onH4DetailsChange} placeholder="Spouse Current Address" />
                                                    {errors.spouseCurrentAddress}
                                                </Form.Item>
                                                <Form.Item error={!!errors.spouseCity} style={{ color: 'red' }} label="Spouse City">
                                                    <Input id="spouseCity" type="text" name="spouseCity"  value= {employeeDetails.H4Details.spouseCity} onChange={this.onH4DetailsChange} placeholder="Spouse City" />
                                                    {errors.spouseCity}
                                                </Form.Item>
                                                <Form.Item error={!!errors.spouseState} style={{ color: 'red' }} label="Spouse State">
                                                    <Input id="spouseState" type="text" name="spouseState"  value= {employeeDetails.H4Details.spouseState} onChange={this.onH4DetailsChange} placeholder="Spouse State" />
                                                    {errors.spouseState}
                                                </Form.Item>
                                                <Form.Item error={!!errors.spouseZipcode} style={{ color: 'red' }} label="Spouse Zipcode">
                                                    <Input id="spouseZipcode" type="number" name="spouseZipcode"  value= {employeeDetails.H4Details.spouseZipcode} onChange={this.onH4DetailsChange} placeholder="Spouse Zipcode" />
                                                    {errors.spouseZipcode}
                                                </Form.Item>
                                            </Card>
                                        </Col> 
                                    </Row> */}
                                    <Panel className="boldClass" header="Work Information" key="4">
                                    <Form layout="inline">
                                    <Row>
                                        <Col >
                                            <Card title="Work Information(Client Name and Address must be accurate)">
                                                <Form.Item error={!!errors.clientName} style={{ color: 'red' }} label="Client Name">
                                                    <Input id="clientName" type="text" name="clientName"  value= {employeeDetails.workDetails.clientName} onChange={this.onWorkDetailsChange} placeholder="Client Name" />
                                                    {errors.clientName}
                                                </Form.Item>
                                                <Form.Item error={!!errors.clientAddress} style={{ color: 'red' }} label="Address">
                                                    <Input id="clientAddress" type="text" name="clientAddress"  value= {employeeDetails.workDetails.clientAddress} onChange={this.onWorkDetailsChange} placeholder="Address" />
                                                    {errors.clientAddress}
                                                </Form.Item>
                                                <Form.Item error={!!errors.clientAddress2} style={{ color: 'red' }} label="Address 2">
                                                    <Input id="clientAddress2" type="text" name="clientAddress2"  value= {employeeDetails.workDetails.clientAddress2} onChange={this.onWorkDetailsChange} placeholder="Address 2" />
                                                    {errors.clientAddress2}
                                                </Form.Item>
                                                <Form.Item error={!!errors.clientCity} style={{ color: 'red' }} label="City">
                                                    <Input id="clientCity" type="text" name="clientCity"  value= {employeeDetails.workDetails.clientCity} onChange={this.onWorkDetailsChange} placeholder="City" />
                                                    {errors.clientCity}
                                                </Form.Item>
                                                <Form.Item error={!!errors.clientState} style={{ color: 'red' }} label="State">
                                                    <Input id="clientState" type="text" name="clientState"  value= {employeeDetails.workDetails.clientState} onChange={this.onWorkDetailsChange} placeholder="State" />
                                                    {errors.clientState}
                                                </Form.Item>
                                                <Form.Item error={!!errors.clientZipCode} style={{ color: 'red' }} label="ZipCode">
                                                    <Input id="clientZipCode" type="number" name="clientZipCode"  value= {employeeDetails.workDetails.clientZipCode} onChange={this.onWorkDetailsChange} placeholder="ZipCode" />
                                                    {errors.clientZipCode}
                                                </Form.Item>
                                                <Form.Item error={!!errors.vendorName} style={{ color: 'red' }} label="Vendor Name">
                                                    <Input id="vendorName" type="text" name="vendorName"  value= {employeeDetails.workDetails.vendorName} onChange={this.onWorkDetailsChange} placeholder="Vendor Name" />
                                                    {errors.vendorName}
                                                </Form.Item>
                                                <Form.Item error={!!errors.vendorEmail} style={{ color: 'red' }} label="Vendor Email">
                                                    <Input id="vendorEmail" type="text" name="vendorEmail"  value= {employeeDetails.workDetails.vendorEmail} onChange={this.onWorkDetailsChange} placeholder="Vendor Email" />
                                                    {errors.vendorEmail}
                                                </Form.Item>
                                                <Form.Item error={!!errors.contactNumber} style={{ color: 'red' }} label="Contact Number">
                                                    <Input id="contactNumber" type="number" name="contactNumber"  value= {employeeDetails.workDetails.contactNumber} onChange={this.onWorkDetailsChange} placeholder="Contact Number" />
                                                    {errors.contactNumber}
                                                </Form.Item>
                                                <Form.Item error={!!errors.projectStartDate} style={{ color: 'red' }} label="Project Start Date">
                                                    {/* <Input id="projectStartDate" type="text" name="projectStartDate"  value= {employeeDetails.workDetails.projectStartDate} onChange={this.onChange} placeholder="Project Start Date" /> */}
                                                    <DatePicker onChange={this.onProjectStartDateChange} dateFormat="yyyy/MM/dd" placeholder= "Project Start Date" defaultValue= {moment()} />
                                                    {errors.projectStartDate}
                                                </Form.Item>
                                            </Card>
                                        </Col>
                                        </Row>
                                        </Form>
                                        </Panel>
                                        <Panel className="boldClass" header="Documents From Employee" key="5">
                                        <Form layout="inline">
                                        <Row>
                                        <Col >
                                            <Card title="Documents From Employee">
                                                <Form.Item error={!!errors.passportPage} style={{ color: 'red' }} label="Passport Page">
                                                    <Input id="passportPage" type="file" name="passportPage" onChange={(e) => this.uploadFile(e, "Employee")} placeholder="Passport Page" />
                                                    {errors.passportPage}
                                                    <progress value={this.state.passportPageProgress} max="100"/>
                                                </Form.Item>
                                                <Form.Item error={!!errors.i94} style={{ color: 'red' }} label="I-94">
                                                    <Input id="i94" type="file" name="i94"  onChange={(e) => this.uploadFile(e, "Employee")} placeholder="I-94" />
                                                    {errors.i94}
                                                    <progress value={this.state.i94Progress} max="100"/>
                                                </Form.Item>
                                                <Form.Item error={!!errors.bachelorDegree} style={{ color: 'red' }} label="Bachelor Degree">
                                                    <Input id="bachelorDegree" type="file" name="bachelorDegree" onChange={(e) => this.uploadFile(e, "Employee")} placeholder="Bachelor Degree" />
                                                    {errors.bachelorDegree}                                                    
                                                    <progress value={this.state.bachelorDegreeProgress} max="100"/>
                                                </Form.Item>
                                                <Form.Item error={!!errors.mastersTranscripts} style={{ color: 'red' }} label="Masters Transcripts">
                                                    <Input id="mastersTranscripts" type="file" name="mastersTranscripts" onChange={(e) => this.uploadFile(e, "Employee")} placeholder="Masters Transcripts" />
                                                    {errors.mastersTranscripts}                                                    
                                                    <progress value={this.state.mastersTranscriptsProgress} max="100"/>
                                                </Form.Item>
                                                <Form.Item error={!!errors.universityDocs} style={{ color: 'red' }} label="University Documents">
                                                    <Input id="universityDocs" type="file" name="universityDocs" onChange={(e) => this.uploadFile(e, "Employee")} placeholder="University Documents" />
                                                    {errors.universityDocs}
                                                    <progress value={this.state.universityDocsProgress} max="100"/>
                                                </Form.Item>
                                                <Form.Item error={!!errors.resume} style={{ color: 'red' }} label="Resume">
                                                    <Input id="resume" type="file" name="resume" onChange={(e) => this.uploadFile(e, "Employee")} placeholder="Resume" />
                                                    {errors.resume}
                                                    <progress value={this.state.resumeProgress} max="100"/>
                                                </Form.Item>
                                                <Form.Item error={!!errors.ssnCopy} style={{ color: 'red' }} label="SSN">
                                                    <Input id="ssnCopy" type="file" name="ssnCopy" onChange={(e) => this.uploadFile(e, "Employee")} placeholder="SSN" />
                                                    {errors.ssnCopy}
                                                    <progress value={this.state.ssnCopyProgress} max="100"/>
                                                </Form.Item>
                                                <Form.Item error={!!errors.payStubs} style={{ color: 'red' }} label="Pay Stubs">
                                                    <Input id="payStubs" type="file" name="payStubs" onChange={(e) => this.uploadFile(e, "Employee")} placeholder="Pay Stubs" />
                                                    {errors.payStubs}
                                                    <progress value={this.state.payStubsProgress} max="100"/>
                                                </Form.Item>
                                                {/* <Form.Item error={!!errors.evidence} style={{ color: 'red' }} label="Evidence">
                                                    <Input id="evidence" type="file" name="evidence" onChange={(e) => this.uploadFile(e, "Employee")} placeholder="Evidence" />
                                                    {errors.evidence}
                                                    <progress value={this.state.evidenceProgress} max="100"/>
                                                </Form.Item> */}
                                            </Card>
                                        </Col>
                                    </Row>
                                    </Form>
                                    </Panel>
                                    <Panel className="boldClass" header="Documents From Reliable HR" key="6">
                                    <Form  layout="inline">
                                        <Row>
                                            <Col>
                                                <Card title="Documents From HR">
                                                    <Form.Item error={!!errors.employmentDocs} style={{ color: 'red' }} label="Employee Agreements">
                                                        <Input id="employmentDocs" type="file" name="employmentDocs" onChange={(e) => this.uploadFile(e, "Reliable")} placeholder="Employee Agreements" />
                                                        {errors.employmentDocs}
                                                        <progress value={this.state.employmentDocsProgress} max="100"/>
                                                    </Form.Item>
                                                    <Form.Item error={!!errors.vendorDocs} style={{ color: 'red' }} label="Employee and Employer Relation">
                                                        <Input id="vendorDocs" type="file" name="vendorDocs" onChange={(e) => this.uploadFile(e, "Reliable")} placeholder="Employee and Employer relation" />
                                                        {errors.vendorDocs}
                                                        <progress value={this.state.vendorDocsProgress} max="100"/>
                                                    </Form.Item>
                                                    <Form.Item error={!!errors.layer1} style={{ color: 'red' }} label="Layer 1">
                                                        <Input id="layer1" type="text" name="layer1"  value= {reliableDocuments.layer1} onChange={this.onWorkDetailsChange} placeholder="Layer 1" />
                                                        {errors.layer1}
                                                    </Form.Item>
                                                    <Form.Item error={!!errors.layer1Documents} style={{ color: 'red' }} label="Layer 1 Documents">
                                                        <Input id="layer1Documents" type="file" name="layer1Documents" onChange={(e) => this.uploadFile(e, "Reliable")} placeholder="Layer 1 Documents" />
                                                        {errors.layer1Documents}
                                                        <progress value={this.state.layer1DocumentsProgress} max="100"/>
                                                    </Form.Item>
                                                    <Form.Item error={!!errors.layer2} style={{ color: 'red' }} label="Layer 2">
                                                        <Input id="layer2" type="text" name="layer2"  value= {reliableDocuments.layer2} onChange={this.onWorkDetailsChange} placeholder="Layer 2" />
                                                        {errors.layer2}
                                                    </Form.Item>
                                                    <Form.Item error={!!errors.layer2Documents} style={{ color: 'red' }} label="Layer 2 Documents">
                                                        <Input id="layer2Documents" type="file" name="layer2Documents" onChange={() => (e) => this.uploadFile(e, "Reliable")} placeholder="Layer 2 Documents" />
                                                        {errors.layer2Documents}
                                                        <progress value={this.state.layer2DocumentsProgress} max="100"/>
                                                    </Form.Item>
                                                </Card>
                                            </Col>
                                            </Row>
                                            </Form>
                                            </Panel>
                                            <Panel className="boldClass" header="Documents From Attorney" key="7">
                                            <Form layout="inline">
                                            <Row>
                                            <Col >
                                                <Card title="Documents From Attorney">
                                                    <Form.Item error={!!errors.attorneyDocument1} style={{ color: 'red' }} label="Attorney Document 1">
                                                        <Input id="attorneyDocument1" type="file" name="attorneyDocument1" onChange={(e) => this.uploadFile(e, "Attorney")} placeholder="Attorney Document 1" />
                                                        {errors.attorneyDocument1}
                                                        <progress value={this.state.attorneyDocument1Progress} max="100"/>
                                                    </Form.Item>
                                                    <Form.Item error={!!errors.attorneyDocument2} style={{ color: 'red' }} label="Attorney Document 2">
                                                        <Input id="attorneyDocument2" type="file" name="attorneyDocument2" onChange={(e) => this.uploadFile(e, "Attorney")} placeholder="Attorney Document 2" />
                                                        {errors.attorneyDocument2}
                                                        <progress value={this.state.attorneyDocument1Progress} max="100"/>
                                                    </Form.Item>
                                                    <Form.Item error={!!errors.attorneyDocument3} style={{ color: 'red' }} label="Attorney Document 3">
                                                        <Input id="attorneyDocument3" type="file" name="attorneyDocument3" onChange={(e) => this.uploadFile(e, "Attorney")} placeholder="Attorney Document 3" />
                                                        {errors.attorneyDocument3}
                                                        <progress value={this.state.attorneyDocument3Progress} max="100"/>
                                                    </Form.Item>
                                                    <Form.Item error={!!errors.attorneyDocument4} style={{ color: 'red' }} label="Attorney Document 4">
                                                        <Input id="attorneyDocument4" type="file" name="attorneyDocument4" onChange={(e) => this.uploadFile(e, "Attorney")} placeholder="Attorney Document 4" />
                                                        {errors.attorneyDocument4}
                                                        <progress value={this.state.attorneyDocument4Progress} max="100"/>
                                                    </Form.Item>
                                                </Card>
                                            </Col>
                                        </Row>
                                    </Form>
                                    </Panel>
                                    <Form>
                                        <Row>
                                            <Form.Item>
                                                <Button type="primary" onClick={this.onSubmit}>Submit</Button>
                                            </Form.Item>
                                        </Row>
                                    </Form>
                            
                        
                        </Collapse>    
                    </Content>
                </Layout> 
            </div>
         );
    }
}

H1bForm.protoTypes = {

};

const mapStateToProps = state => {
    return {
        loggedInUser: state.loggedInUser,
        getEmployeesList:state.getEmployeesList
    }
};

export default connect(mapStateToProps)(H1bForm);