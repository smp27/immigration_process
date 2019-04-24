import React, {Component} from 'react';
import  Validator from 'validator';
import { Menu, Collapse, Popover, Icon, Form, Radio, Checkbox , DatePicker, Layout, Input, Row, Col, Button, Card} from 'antd';
import "antd/dist/antd.css";
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import { visaForm, fileUpload, submitImmiFormAction, getListOfEmployees } from '../../actions';
import moment from 'moment';
import { storage } from '../../firebase';
import { DROPBOX_ACCESS_TOKEN_KEY } from '../../stores/config';

// import html2canvas and jspdf to export webpage to pdf and download
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
const pdf = new jsPDF();

//To access data from the web
const xhr = new XMLHttpRequest();
// import file saver to download the file's
const FileSaver = require('file-saver');

//Access token to acces dropbox account
const dropboxToken = DROPBOX_ACCESS_TOKEN_KEY;

const { Header, Content, Footer } = Layout;
const RadioGroup = Radio.Group;
const Panel = Collapse.Panel;

class H1bForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            progress:0,
            passportPageProgress :0,
            i94Progress:0,
            evidenceProgress:0,
            payStubsProgress:0,
            clientLetterProgress: 0,
            vendorLetterProgress: 0,
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
            lcaProgress: 0,
            attorneyDocument1Progress: 0,
            attorneyDocument2Progress: 0,
            attorneyDocument3Progress: 0,
            attorneyDocument4Progress: 0,
            employeeDetails:{
                employeeID: '',
                typeOfApplication: 'CAP H1B',
                premiumProcessInfo: '',
                firstName: '',
                middleName: '',
                lastName: '',
                resume: '',
                resumePathLower: '',
                bachelorDegree: '',
                bachelorDegreePathLower: '',
                mastersTranscripts: '',
                mastersTranscriptsPathLower: '',
                payStubs: '',
                payStubsPathLower: '',
                clientLetter: '',
                clientLetterPathLower: '',
                vendorLetter: '',
                vendorLetterPathLower: '',
                passportPage: '',
                passportPagePathLower: '',
                i94: '',
                i94PathLower: '',
                evidence: '',
                evidencePathLower: '',
                ssnCopy: '',
                ssnCopyPathLower: '',
                universityDocs: '',
                universityDocsPathLower: '',
                clientLetter: '',
                clientLetterPathLower: '',
                vendorLetter: '',
                vendorLetterPathLower: '',
                addressDetails:{
                  address1:'',
                  address2:'',
                  city:'',
                  state:'',
                  zipCode:'',
                  country: ''
                },
                overseasAddressDetails:{
                    overseasAddress1:'',
                    overseasAddress2:'',
                    overseasCity:'',
                    overseasState:'',
                    overseasZipCode:'',
                    overseasCountry: ''
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
                // travelDetails: {
                //     startDate: '',
                //     endDate: '',
                //     daysCount: ''
                // },
                travelHistory: [],
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
                kidsDetails: []
            },
            reliableDocuments: {
                layer1: '',
                layer1Documents: '',
                layer1DocumentsURL: '',
                layer2: '',
                layer2Documents: '',
                layer2DocumentsURL: '',
                lca: '',
                lcaURL: '',
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
            shouldDisable: false,
            isH4DependentAvailable: false
        }
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.exportToPdf = this.exportToPdf.bind(this);
    }

    componentDidMount() {
        this.props.dispatch(getListOfEmployees());
    }
    
    static getDerivedStateFromProps(nextProps, state){
        if(nextProps.sucessFormSubmission) {
            // nextProps.dispatch(getListOfEmployees());
            alert("Sucessfully Submitted the Form.")
        }
        if(Object.keys(nextProps.employeeData).length != 0) {
            state.employeeDetails = nextProps.employeeData;
            state.shouldDisable = true;
        }
        state.employeeDetails.employeeID = nextProps.loggedInUser.email;
        const previousFormData = nextProps.getEmployeesList.filter(function(item) { return item.employeeID === nextProps.loggedInUser.email});
        if(previousFormData.length > 0) {
            state.employeeDetails = previousFormData[0];
        }
    }

    //-------------------------------------------------------------------------------------------------------
    // Dynamically adding form fields

    addTravelHistory = () => {
        let employeeDetails = Object.assign({}, this.state.employeeDetails);
        let travelHistory = {};
        travelHistory.departureDate = moment().valueOf();
        travelHistory.arrivalDate = '';
        travelHistory.daysSpent = '';
        employeeDetails.travelHistory.push(travelHistory);
        return this.setState({employeeDetails});
    }

    // handleTravelHistoryChange = (e) => {
    //     if (["name", "id"].includes(e.target.className) ) {
    //       let travelHistory = [...this.state.employeeDetails.travelHistory]
    //       travelHistory[e.target.id.split("-")[1]][e.target.className] = e.target.value.toUpperCase()
    //       this.setState({ travelHistory }, () => console.log(this.state.employeeDetails.travelHistory))
    //     } else {
    //       this.setState({ [e.target.name]: e.target.value.toUpperCase() })
    //     }
    // }

    addKidsDetails = () => {
        let employeeDetails = Object.assign({}, this.state.employeeDetails);
        let kidsDetails = {};
        kidsDetails.dependenceRelationship2 = '';
        kidsDetails.kidFullName = '';
        kidsDetails.kidGender = '';
        kidsDetails.kidMaritalStatus = '';
        kidsDetails.kidBirthDate = '';
        kidsDetails.kidCountry = '';
        kidsDetails.kidCountryOfCitizen = '';
        kidsDetails.kidImmigrationStatus = '';
        kidsDetails.kidSocialSecurityNumber = '';
        kidsDetails.kidCurrentAddress = '';
        employeeDetails.kidsDetails.push(kidsDetails);
        return this.setState({employeeDetails});
    }

    //--------------------------------------------------------------------------------------------------------
    //Date functions

    onBirthDateChange = (e, date) => {
        let employeeDetails = Object.assign({}, this.state.employeeDetails);
        employeeDetails.passportDetails["dateOfBirth"] = moment(date).valueOf();
        return this.setState({employeeDetails});
    };

    onPassportIssueDateChange = (e, date) => {
        let employeeDetails = Object.assign({}, this.state.employeeDetails);
        employeeDetails.passportDetails["issueDate"] = moment(date).valueOf();
        return this.setState({employeeDetails});
    };

    onPassportExpirationDateChange = (e, date) => {
        let employeeDetails = Object.assign({}, this.state.employeeDetails);
        employeeDetails.passportDetails["expirationDate"] = moment(date).valueOf();
        return this.setState({employeeDetails});
    };

    onImmigrationUSVisaIssuedDateChange = (e, date) => {
        let employeeDetails = Object.assign({}, this.state.employeeDetails);
        employeeDetails.immigirationDetails["USVisaIssued"] = moment(date).valueOf();
        return this.setState({employeeDetails});
    };
    
    onImmigrationWhenDateChange = (e, date) => {
        let employeeDetails = Object.assign({}, this.state.employeeDetails);
        employeeDetails.immigirationDetails["when"] = moment(date).valueOf();
        return this.setState({employeeDetails});
    };

    onImmigrationvisaExpireDateDateChange = (e, date) => {
        let employeeDetails = Object.assign({}, this.state.employeeDetails);
        employeeDetails.immigirationDetails["visaExpireDate"] = moment(date).valueOf();
        return this.setState({employeeDetails});
    };

    onImmigrationEntryValidTillDateChange = (e, date) => {
        let employeeDetails = Object.assign({}, this.state.employeeDetails);
        employeeDetails.immigirationDetails["entryValidTill"] = moment(date).valueOf();
        return this.setState({employeeDetails});
    };

    onImmigrationLastEntryUSDateChange = (e, date) => {
        let employeeDetails = Object.assign({}, this.state.employeeDetails);
        employeeDetails.immigirationDetails["lastEntryUS"] = moment(date).valueOf();
        return this.setState({employeeDetails});
    };

    onPortOfEntryDateChange = (e, date) => {
        let employeeDetails = Object.assign({}, this.state.employeeDetails);
        employeeDetails.immigirationDetails["portOfEntry"] = moment(date).valueOf();
        return this.setState({employeeDetails});
    };

    onVisaStampingDateChange = (e, date) => {
        let employeeDetails = Object.assign({}, this.state.employeeDetails);
        employeeDetails.immigirationDetails["visaStamping"] = moment(date).valueOf();
        return this.setState({employeeDetails});
    };

    onTravelInfoStartDateChange = (e, date) => {
        let employeeDetails = Object.assign({}, this.state.employeeDetails);
        employeeDetails.travelDetails["startDate"] = moment(date).valueOf();
        return this.setState({employeeDetails});
    };

    onTravelInfoEndDateChange = (e, date) => {
        let employeeDetails = Object.assign({}, this.state.employeeDetails);
        employeeDetails.travelDetails["endDate"] = moment(date).valueOf();
        return this.setState({employeeDetails});
    };

    onTravelHistoryDepartureDateChange = idx => (e, date) => {
        // console.log(idx);
        const travelHistory = this.state.employeeDetails.travelHistory.map((travel, sidx) => {
            if (idx !== sidx) return travel;
            return { ...travel, departureDate: moment(date).valueOf() };
        });
        let employeeDetails = Object.assign({}, this.state.employeeDetails);
        employeeDetails.travelHistory = travelHistory;
        return this.setState({employeeDetails});
    };

    onTravelHistoryArrivalDateChange = idx => (e, date) => {
        // console.log(idx);
        const travelHistory = this.state.employeeDetails.travelHistory.map((travel, sidx) => {
            if (idx !== sidx) return travel;
            return { ...travel, arrivalDate: moment(date).valueOf() };
        });
        let employeeDetails = Object.assign({}, this.state.employeeDetails);
        employeeDetails.travelHistory = travelHistory;
        return this.setState({employeeDetails});
    };

    onI140ReceiptDateChange = (e, date) => {
        let employeeDetails = Object.assign({}, this.state.employeeDetails);
        employeeDetails.I140Detials["I140Receipt"] = moment(date).valueOf();
        return this.setState({employeeDetails});
    };

    onI140DateChange = (e, date) => {
        let employeeDetails = Object.assign({}, this.state.employeeDetails);
        employeeDetails.I140Detials["I140Approval"] = moment(date).valueOf();
        return this.setState({employeeDetails});
    };

    onKidBirthDateChange = (e, date) => {
        let employeeDetails = Object.assign({}, this.state.employeeDetails);
        employeeDetails.kidsDetails["kidBirthDate"] = moment(date).valueOf();
        return this.setState({employeeDetails});
    };

    onSpouseBirthDateChange = (e, date) => {
        let employeeDetails = Object.assign({}, this.state.employeeDetails);
        employeeDetails.H4Details["spouseBirthDate"] = moment(date).valueOf();
        return this.setState({employeeDetails});
    };

    onMarraigeDateChange = (e, date) => {
        let employeeDetails = Object.assign({}, this.state.employeeDetails);
        employeeDetails.H4Details["marraigeDate"] = moment(date).valueOf();
        return this.setState({employeeDetails});
    };

    onProjectStartDateChange = (e, date) => {
        let employeeDetails = Object.assign({}, this.state.employeeDetails);
        employeeDetails.workDetails["projectStartDate"] = moment(date).valueOf();
        return this.setState({employeeDetails});
    };

    //------------------------------------------------------------------------------------------------

    //Change Functions
    
    onChange = e => this.setState({
        employeeDetails: { ...this.state.employeeDetails, [e.target.name]: e.target.value}
    });

    onContactChange = e => {
        let employeeDetails = Object.assign({}, this.state.employeeDetails);
        employeeDetails.contactDetails[e.target.name] = e.target.value;
        return this.setState({employeeDetails});
    };

    onAddressChange = e => {
        let employeeDetails = Object.assign({}, this.state.employeeDetails);
        employeeDetails.addressDetails[e.target.name] = e.target.value;
        return this.setState({employeeDetails});
    };

    onOverseasAddressChange = e => {
        let employeeDetails = Object.assign({}, this.state.employeeDetails);
        employeeDetails.overseasAddressDetails[e.target.name] = e.target.value;
        return this.setState({employeeDetails});
    };

    onPassportDetailsChange = e => {
        let employeeDetails = Object.assign({}, this.state.employeeDetails);
        employeeDetails.passportDetails[e.target.name] = e.target.value;
        return this.setState({employeeDetails});
    };

    onImmigirationDetailsChange = e => {
        let employeeDetails = Object.assign({}, this.state.employeeDetails);
        employeeDetails.immigirationDetails[e.target.name] = e.target.value;
        console.log(employeeDetails);
        return this.setState({employeeDetails});
    };

    onTravelDetailsChange = e => {
        let employeeDetails = Object.assign({}, this.state.employeeDetails);
        employeeDetails.travelDetails[e.target.name] = e.target.value;
        return this.setState({employeeDetails});
    };

    onTravelHistoryChange = idx => e => {
        // console.log(idx);
        const travelHistory = this.state.employeeDetails.travelHistory.map((travel, sidx) => {
            if (idx !== sidx) return travel;
            return { ...travel, daysSpent: e.target.value };
        });
        let employeeDetails = Object.assign({}, this.state.employeeDetails);
        employeeDetails.travelHistory = travelHistory;
        return this.setState({employeeDetails});
    };

    onH4CheckListDetailsChange = e => {
        let employeeDetails = Object.assign({}, this.state.employeeDetails);
        employeeDetails.H4CheckListDetails[e.target.name] = e.target.value;
        return this.setState({employeeDetails});
    };

    onI140DetailsChange = e => {
        let employeeDetails = Object.assign({}, this.state.employeeDetails);
        employeeDetails.I140Detials[e.target.name] = e.target.value;
        return this.setState({employeeDetails});
    };

    onSpouseDetailsChange = e => {
        let employeeDetails = Object.assign({}, this.state.employeeDetails);
        employeeDetails.spouseDetails[e.target.name] = e.target.value;
        return this.setState({employeeDetails});
    };

    onKidsDetailsChange = idx => e => {
        // console.log(idx);
        const kidsDetails = this.state.employeeDetails.kidsDetails.map((kid, sidx) => {
            if (idx !== sidx) return kid;
            return { ...kid, [e.target.name]: e.target.value };
        });
        let employeeDetails = Object.assign({}, this.state.employeeDetails);
        employeeDetails.kidsDetails = kidsDetails;
        return this.setState({employeeDetails});
    };

    onH4DetailsChange = e => {
        let employeeDetails = Object.assign({}, this.state.employeeDetails);
        employeeDetails.H4Details[e.target.name] = e.target.value;
        return this.setState({employeeDetails});
    };

    onWorkDetailsChange = e => {
        let employeeDetails = Object.assign({}, this.state.employeeDetails);
        employeeDetails.workDetails[e.target.name] = e.target.value;
        return this.setState({employeeDetails});
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

    //Upload file to the dropbox
    uploadFile = (e, fN) => {
        // this keyword is not working inside the xhr functions, th is declared as proxy to this keyword
        const th = this;
        // let errorDetails = Object.assign({}, this.state.errors);
        let errorDetails = new Map();

        const file = e.target.files[0];
        const filename = e.target.name;

        if(this.state.employeeDetails.firstName !== "" && this.state.employeeDetails.lastName !== ""){
            const {firstName, lastName} =  this.state.employeeDetails;
            const { employeeDetails } = this.state;
        
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
                        errorDetails[filename] = '';
                        employeeDetails[filename] = fileInfo.name;
                        employeeDetails[filename+"PathLower"] = fileInfo.path_lower;
                        th.setState({employeeDetails: employeeDetails});
                        // console.log(th.state);
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
                path: '/' + 'Talent team Team Folder' +'/'+ firstName +' ' +lastName+ '/'+ fN + '/'+file.name,
                mode: 'add',
                autorename: true,
                mute: false
                }));
                
                xhr.send(file);

                // let fileData = {
                //     firstName: firstName,
                //     lastName: lastName,
                //     folderFileName: firstName+ " " +lastName + "/"+fN+"/"+e.target.name+"/",
                //     inputFileName:e.target.name,
                //     file: e.target.files[0]
                // };
                // this.handleUpload(fileData);
                //this.props.dispatch(fileUpload(fileData));
            } else {
                errorDetails[filename] = 'Please upload Only PDF files';
            } 
        } else {
            errorDetails[filename] = 'Enter the Name of the Employee';
        }
        this.setState({errors: errorDetails});
    };

    //Download file from the dropbox
    downloadFile = ( evt, fileName, filePathLower) => {
        evt.preventDefault();
        // xhr.responseType = 'arraybuffer';
        
        xhr.onload = function() {
            if (xhr.status === 200) {
                const blob = new Blob([xhr.response], {type: 'application/octet-stream'});
                FileSaver.saveAs(blob, fileName, true);
                // Download succeeded. Do something here with the file info.
            }
            else {
                const errorMessage = xhr.response || 'Unable to download file';
                console.log(errorMessage);
                // Download failed. Do something here with the error.
            }
        };
        
        xhr.open('POST', 'https://content.dropboxapi.com/2/files/download');
        xhr.setRequestHeader('Authorization', 'Bearer ' + dropboxToken);
        xhr.setRequestHeader('Dropbox-API-Arg', JSON.stringify({
            path: filePathLower
        }));
        xhr.send();
    }

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
              console.log(this.state);
          })
      });
    }

    //Submit Function

    onSubmit = (e) => {
        e.preventDefault();
        const errors = this.validate(this.state.employeeDetails);
        this.setState({errors: errors});
        if(Object.keys(errors).length === 0) {
            this.props.dispatch(submitImmiFormAction(this.state.employeeDetails));
        }
    };

    exportToPdf = () => {
        //get data from react render and assign to variable 
        // const formData = document.getElementById('mainDiv');
        const formData = document.getElementById('personalInformationForm');
        html2canvas(formData)
            .then((canvas) => {
                // make a screenshot of the webpage
                const screenshot = canvas.toDataURL('image/png');
                //convert screenshot to the pdf
                pdf.addImage(screenshot, 'JPEG', 15, 40, 180, 160);
                //download pdf
                pdf.save("download.pdf");
            });
    }

    //Validation Function

    validate = employeeDetails => {
        console.log(employeeDetails);
        const errors = {};

        if(!employeeDetails.typeOfApplication)
            errors.typeOfApplication = "Can't be empty";
        else 
            delete errors.typeOfApplication;
        // if(!employeeDetails.premiumProcessInfo) errors.premiumProcessInfo = "Can't be empty";

        if(!employeeDetails.firstName)
            errors.firstName = "Can't be empty";
        else
            delete errors.firstName;
        // if(!employeeDetails.middleName) errors.middleName = "Can't be empty";
        if(!employeeDetails.lastName)
            errors.lastName = "Can't be empty";
        else
            delete errors.lastName;
        
        // if(!employeeDetails.resume) errors.resume = "Can't be empty";
        // if(!employeeDetails.bachelorDegree) errors.bachelorDegree = "Can't be empty";
        // if(!employeeDetails.mastersTranscripts) errors.mastersTranscripts = "Can't be empty";
        // if(!employeeDetails.payStubs) errors.payStubs = "Can't be empty";
        // if(!employeeDetails.passportPage) errors.passportPage = "Can't be empty";
        // if(!employeeDetails.i94) errors.i94 = "Can't be empty";
        // if(!employeeDetails.universityDocs) errors.universityDocs = "Can't be empty";
        // if(!employeeDetails.ssnCopy) errors.ssnCopy = "Can't be empty";
        // if(!employeeDetails.evidence) errors.evidence = "Can't be empty";
        
        //Address Details
        if(!employeeDetails.addressDetails.address1)
            errors.address1 = "Can't be empty";
        else
            delete errors.address1;
            
        // if(!employeeDetails.addressDetails.address2)
        //     errors.address2 = "Can't be empty";
        // else
        //     delete errors.address2;
        
        if(!employeeDetails.addressDetails.city)
            errors.city = "Can't be empty";
        else
            delete errors.city;
    
        if(!employeeDetails.addressDetails.state)
            errors.state = "Can't be empty";
        else
            delete errors.state;
    
        if(!employeeDetails.addressDetails.country) 
            errors.country = "Can't be empty";
        else
            delete errors.country;
    
        if(!Validator.isNumeric(employeeDetails.addressDetails.zipCode) && employeeDetails.addressDetails.zipCode.length === 5)
            errors.zipCode = "Can't be empty";
        else
            delete errors.zipCode;
    

        //Previous Address Details
        if(!employeeDetails.overseasAddressDetails.overseasAddress1)
            errors.overseasAddress1 = "Can't be empty";
        else
            delete errors.overseasAddress1;
    
        // if(!employeeDetails.overseasAddressDetails.overseasAddress2) 
        //     errors.overseasAddress2 = "Can't be empty";
        // else
        //     delete errors.overseasAddress2;
    
        if(!employeeDetails.overseasAddressDetails.overseasCity) 
            errors.overseasCity = "Can't be empty";
        else
            delete errors.overseasCity;
    
        if(!employeeDetails.overseasAddressDetails.overseasState)
            errors.overseasState = "Can't be empty";
        else
            delete errors.overseasState;
    
        if(!Validator.isNumeric(employeeDetails.overseasAddressDetails.overseasZipCode)  && employeeDetails.overseasAddressDetails.overseasZipCode.length === 5)
            errors.overseasZipCode = "Can't be empty";
        else
            delete errors.overseasZipCode;
    
        if(!employeeDetails.overseasAddressDetails.overseasCountry)
            errors.overseasCountry = "Can't be empty";
        else
            delete errors.overseasCountry;
        
        //Contact Details
        // if(!Validator.isNumeric(employeeDetails.contactDetails.homeNumber)) errors.homeNumber = "Enter Home Number";
        // if(!Validator.isNumeric(employeeDetails.contactDetails.workNumber)) errors.workNumber = "Enter Work Number";
        if(!Validator.isNumeric(employeeDetails.contactDetails.mobileNumber) || employeeDetails.contactDetails.mobileNumber.length === 10)
            errors.mobileNumber = "Can't be empty";
        else
            delete errors.mobileNumber;
    
        if(!Validator.isEmail(employeeDetails.contactDetails.email)) 
            errors.email = "Can't be empty";
        else
            delete errors.email;

        //Passport Details
        if(!employeeDetails.passportDetails.passportNumber) 
            errors.passportNumber = "Can't be empty";
        else
            delete errors.passportNumber;
    
        // if(!employeeDetails.passportDetails.birthCountry) errors.birthCountry = "Cant't be empty";
        if(!employeeDetails.passportDetails.dateOfBirth) 
            errors.dateOfBirth = "Can't be empty";
        else
            delete errors.dateOfBirth ;
    
        if(!employeeDetails.passportDetails.issueDate) 
            errors.issueDate = "Can't be empty";
        else
            delete errors.issueDate ;
    
        if(!employeeDetails.passportDetails.expirationDate) 
            errors.expirationDate = "Can't be empty";
        else
            delete errors.expirationDate ;
    
        // if(!employeeDetails.passportDetails.countryPassport) errors.countryPassport = "Cant't be empty";
        if(!employeeDetails.passportDetails.countryOfCitizenship) 
            errors.countryOfCitizenship = "Can't be empty";
        else
            delete errors.countryOfCitizenship;
    
        if(!Validator.isNumeric(employeeDetails.passportDetails.socialSecurityNumber) || employeeDetails.passportDetails.socialSecurityNumber.length === 9) 
            errors.socialSecurityNumber = "Can't be empty";
        else
            delete errors.socialSecurityNumber ;
    
        // if(!employeeDetails.passportDetails.alienNumber) errors.alienNumber = "Cant't be empty";

        //Immigration Details
        if(!employeeDetails.immigirationDetails.currentStatus)
            errors.currentStatus = "Can't be empty";
        else
            delete errors.currentStatus ;
    
        // if(!employeeDetails.immigirationDetails.currentStatusOtherName) errors.currentStatusOtherName = "Cant't be empty";
        if(!employeeDetails.immigirationDetails.USVisaIssued)
            errors.USVisaIssued = "Can't be empty";
        else
            delete errors.lastNaUSVisaIssuedme ;
    
        // if(!employeeDetails.immigirationDetails.when) errors.when = "Cant't be empty";
        if(!employeeDetails.immigirationDetails.visaExpireDate) 
            errors.visaExpireDate = "Can't be empty";
        else
            delete errors.visaExpireDate ;
    
        if(!employeeDetails.immigirationDetails.immigrationConsule) 
            errors.immigrationConsule = "Can't be empty";
        else
            delete errors.immigrationConsule ;
    
        if(!employeeDetails.immigirationDetails.consulateCity) 
            errors.consulateCity = "Can't be empty";
        else
            delete errors.consulateCity;
    
        if(!employeeDetails.immigirationDetails.consulateCountry) 
            errors.consulateCountry = "Can't be empty";
        else
            delete errors.consulateCountry ;
    
        // if(!employeeDetails.immigirationDetails.otherName2) errors.otherName2 = "Cant't be empty";
        if(!Validator.isNumeric(employeeDetails.immigirationDetails.i94Number) && employeeDetails.immigirationDetails.i94Number.length === 11)
            errors.i94Number = "Can't be empty";
        else
            delete errors.i94Number ;
    
       // if(!employeeDetails.immigirationDetails.entryValidTill) errors.entryValidTill = "Cant't be empty";
        if(!employeeDetails.immigirationDetails.lastEntryUS) 
            errors.lastEntryUS = "Can't be empty";
        else
            delete errors.lastEntryUS ;
    
        if(!employeeDetails.immigirationDetails.portOfEntry)
            errors.portOfEntry = "Can't be empty";
        else
            delete errors.portOfEntry;
    
        // if(!employeeDetails.immigirationDetails.visaStamping) errors.visaStamping = "Cant't be empty";
        // if(!employeeDetails.immigirationDetails.visaConsulate) errors.visaConsulate = "Cant't be empty";
        // if(!employeeDetails.immigirationDetails.USConsulateOther) errors.USConsulateOther = "Cant't be empty";

        //Travel Details
        // if(!employeeDetails.travelDetails.startDate) errors.startDate = "Can't be empty";
        // if(!employeeDetails.travelDetails.endDate) errors.endDate = "Can't be empty";
        // if(!employeeDetails.travelDetails.daysCount) errors.daysCount = "Can't be empty";

        //Travel History
        if(!employeeDetails.travelHistory.departureDate)
            errors.departureDate = "Can't be empty";
        else
            delete errors.departureDate ;
    
        if(!employeeDetails.travelHistory.arrivalDate) 
            errors.arrivalDate = "Can't be empty";
        else
            delete errors.arrivalDate ;
    
        if(!employeeDetails.travelHistory.daysSpent)
            errors.daysSpent = "Can't be empty";
        else
            delete errors.daysSpent ;

        //Checklist H4
        if(!employeeDetails.H4CheckListDetails.H4Passport) errors.H4Passport = "Can't be empty";
        if(!employeeDetails.H4CheckListDetails.H4i94) errors.H4i94 = "Can't be empty";
        if(!employeeDetails.H4CheckListDetails.H4Approval) errors.H4Approval = "Can't be empty";
        if(!employeeDetails.H4CheckListDetails.H4Marraige) errors.H4Marraige = "Can't be empty";
        if(!employeeDetails.H4CheckListDetails.H4ChildrenCertificate) errors.H4ChildrenCertificate = "Enter Zipcode";
        
        //Work Details
        // if(!employeeDetails.workDetails.className) 
        //     errors.className = "Can't be empty";
        // else
        //     delete errors.className ;
    
        if(!employeeDetails.workDetails.clientAddress) 
            errors.clientAddress = "Can't be empty";
        else
            delete errors.clientAddress ;
    
        // if(!employeeDetails.workDetails.clientAddress2) 
        //     errors.clientAddress2 = "Can't be empty";
        // else
        //     delete errors.clientAddress2 ;
    
        if(!employeeDetails.workDetails.clientCity) 
            errors.clientCity = "Can't be empty";
        else
            delete errors.clientCity ;
    
        if(!employeeDetails.workDetails.clientState) 
            errors.clientState = "Can't be empty";
        else
            delete errors.clientState ;
    
        if(!Validator.isNumeric(employeeDetails.workDetails.clientZipCode) && employeeDetails.workDetails.clientZipCode.length === 5) 
            errors.clientZipCode = "Can't be empty";
        else
            delete errors.clientZipCode ;
    
        if(!employeeDetails.workDetails.vendorName) 
            errors.vendorName = "Can't be empty";
        else
            delete errors.vendorName ;
    
        if(!Validator.isEmail(employeeDetails.workDetails.vendorEmail)) 
            errors.vendorEmail = "Can't be empty";
        else
            delete errors.vendorEmail;
    
        // if(!employeeDetails.workDetails.contactInformation) 
        //     errors.contactInformation = "Can't be empty";
        // else
        //     delete errors.contactInformation ;
    
        if(!employeeDetails.workDetails.projectStartDate) 
            errors.projectStartDate = "Can't be empty";
        else
            delete errors.projectStartDate ;
    
        // if(!employeeDetails.workDetails.vendorInfo) errors.vendorInfo = "Can't be empty";

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
        // if(!employeeDetails.kidsDetails.dependenceRelationship2) errors.dependenceRelationship2 = "Can't be empty";
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

    onH4Select = (e) => {
        console.log('Checked', e.target.checked);
        this.setState({
            isH4DependentAvailable: e.target.checked
        });
    }

    render() { 
        const { employeeDetails, reliableDocuments, errors } = this.state;
        const { travelHistory, kidsDetails } = this.state.employeeDetails;
        const isAdmin = this.props.isAdmin;
        const employeeData = this.props.employeeData;
        const isDisabledTrue = this.state.shouldDisable;
        let downloadButton;
        let submitButton;
        let employeeListPageLink;
        let adminPageLink;

        if(isAdmin && Object.keys(employeeData).length != 0) {
            downloadButton = <Form.Item>
                <Button type="primary" onClick={this.exportToPdf}>Download Form</Button>
            </Form.Item>
        } else {
            submitButton = <Form.Item>
                <Button type="primary" onClick={this.onSubmit}>Submit</Button>
            </Form.Item>
        }
        if(isAdmin) {
            employeeListPageLink = <Menu.Item><Link to="/employeelist">Employee List</Link></Menu.Item>
            adminPageLink = <Menu.Item><Link to="/admin">Admin Panel</Link></Menu.Item>
        }

        return ( 
            <div id="mainDiv">
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
                                        {employeeListPageLink}
                                        <Menu.Divider />
                                        {adminPageLink}
                                        <Menu.Divider />
                                        <Menu.Item><Link to="/logout">Logout</Link></Menu.Item>
                                    </Menu.SubMenu>
                                </Menu>
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
                        <Panel className="boldClass"  header="Personal Information" key="1">
                            {/* Employee Registration */}
                                <Form id="personalInformationForm" layout="inline">
                                    
                                    <Row>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <Card title="Applicant Information">
                                            <Form.Item error={!!errors.firstName} style={{ color: 'red' }} label="First Name">
                                                <Popover content="Enter first name">
                                                    <Input disabled={isDisabledTrue} id="firstName" type="text" name="firstName" value= {employeeDetails.firstName} onChange={this.onChange} placeholder="First Name" />
                                                        {errors.firstName}
                                                    <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                </Popover>
                                            </Form.Item>

                                            <Form.Item error={!!errors.middleName} style={{ color: 'red' }} label="Middle Name">
                                                <Popover content="Enter middle name">
                                                    <Input disabled={isDisabledTrue} id="middleName" type="text" name="middleName" value= {employeeDetails.middleName} onChange={this.onChange} placeholder="Middle Name" />
                                                    {/* {errors.middleName} */}
                                                    <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                </Popover>
                                            </Form.Item>

                                            <Form.Item error={!!errors.lastName} style={{ color: 'red' }} label="Last Name">
                                                <Popover content="Enter last name">
                                                    <Input disabled={isDisabledTrue} id="lastName" type="text" name="lastName" value= {employeeDetails.lastName} onChange={this.onChange} placeholder="Last Name" />
                                                    {errors.lastName}
                                                    <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                </Popover>
                                            </Form.Item>

                                            </Card>
                                        </Col>
                                        
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <Card title="Contact Information">
                                                
                                                <Form.Item error={!!errors.homeNumber} style={{ color: 'red' }} label="Home Number(Optional)">
                                                    <Popover content="Home Number">
                                                        <Input disabled={isDisabledTrue} id="homeNumber" type="number" max={10} name="homeNumber" value= {employeeDetails.contactDetails.homeNumber} onChange={this.onContactChange} placeholder="(000) 000-0000" />
                                                            {errors.homeNumber}
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>
                                                </Form.Item>

                                                <Form.Item error={!!errors.workNumber} style={{ color: 'red' }} label="Work Number">
                                                    <Popover content="Work number">
                                                        <Input disabled={isDisabledTrue} id="workNumber" type="number" max={10} name="workNumber" value= {employeeDetails.contactDetails.workNumber} onChange={this.onContactChange} placeholder="(000) 000-0000" />
                                                        {/* {errors.workNumber} */}
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>
                                                </Form.Item>

                                                <Form.Item error={!!errors.mobileNumber} style={{ color: 'red' }} label="Mobile Number">
                                                    <Popover content="Mobile number">
                                                        <Input disabled={isDisabledTrue} id="mobileNumber" type="number" max={10} name="mobileNumber" value= {employeeDetails.contactDetails.mobileNumber} onChange={this.onContactChange} placeholder="(000) 000-0000" />
                                                        {errors.mobileNumber}
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>
                                                </Form.Item>

                                                <Form.Item error={!!errors.email} style={{ color: 'red' }} label="Email">
                                                    <Popover content="Email">
                                                        <Input disabled={isDisabledTrue} id="email" type="email" name="email"  value= {employeeDetails.contactDetails.email} onChange={this.onContactChange} placeholder="Email" />
                                                            {errors.email}
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>
                                                </Form.Item>

                                            </Card>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <Card title="Present Address Information(U.S)">
                                                
                                                <Form.Item error={!!errors.address1} style={{ color: 'red' }} label="Present Address 1">
                                                    <Popover content="Address 1">
                                                        <Input disabled={isDisabledTrue} id="address1" type="address1" name="address1"value= {employeeDetails.addressDetails.address1} onChange={this.onAddressChange} placeholder="Present Address 1" />
                                                            {errors.address1}
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>
                                                </Form.Item>

                                                <Form.Item error={!!errors.address2} style={{ color: 'red' }} label="Present Address 2">
                                                    <Popover content="Address 2">
                                                        <Input disabled={isDisabledTrue} id="address2" type="address2" name="address2"value= {employeeDetails.addressDetails.address2} onChange={this.onAddressChange} placeholder="Present Address 2" />
                                                        {errors.address2}
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>
                                                </Form.Item>

                                                <Form.Item error={!!errors.city} style={{ color: 'red' }} label="City">
                                                    <Popover content="City">
                                                        <Input disabled={isDisabledTrue} id="city" type="city" name="city"value= {employeeDetails.addressDetails.city} onChange={this.onAddressChange} placeholder="City" />
                                                        {errors.city}
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>
                                                </Form.Item>

                                                <Form.Item error={!!errors.state}  label="State">
                                                    <Popover content="State">
                                                        <Input disabled={isDisabledTrue} id="state" type="state" name="state"  value= {employeeDetails.addressDetails.state} onChange={this.onAddressChange} placeholder="State" />
                                                            {errors.state}
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>
                                                </Form.Item>

                                                <Form.Item error={!!errors.zipCode} style={{ color: 'red' }} label="Zip Code">
                                                    <Popover content="Zipcode">
                                                        <Input disabled={isDisabledTrue} id="zipCode" type="number" name="zipCode" value={employeeDetails.addressDetails.zipCode}onChange={this.onAddressChange} placeholder= "Enter Your Zipcode"/>
                                                            {errors.zipCode}
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>
                                                </Form.Item>

                                                <Form.Item error={!!errors.country} style={{ color: 'red' }} label="Country">
                                                    <Popover content="Country">
                                                        <Input disabled={isDisabledTrue} id="country" type="country" name="country"  value= {employeeDetails.addressDetails.country} onChange={this.onAddressChange} placeholder="Country" />
                                                            {errors.country}
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>
                                                </Form.Item>

                                            </Card>
                                        </Col>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <Card title="Overseas Address Information">
                                                
                                                <Form.Item error={!!errors.overseasAddress1} style={{ color: 'red' }} label="Overseas Address 1">
                                                    <Popover content="Address 1">
                                                        <Input disabled={isDisabledTrue} id="overseasAddress1" type="overseasAddress1" name="overseasAddress1" value= {employeeDetails.overseasAddressDetails.overseasAddress1} onChange={this.onOverseasAddressChange} placeholder="Overseas Address 1" />
                                                            {errors.overseasAddress1}
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>
                                                </Form.Item>

                                                <Form.Item error={!!errors.overseasAddress2} style={{ color: 'red' }} label="Overseas Address 2">
                                                    <Popover content="Address 2">
                                                        <Input disabled={isDisabledTrue} id="overseasAddress2" type="overseasAddress2" name="overseasAddress2" value= {employeeDetails.overseasAddressDetails.overseasAddress2} onChange={this.onOverseasAddressChange} placeholder="Overseas Address 2" />
                                                        {errors.overseasAddress2}
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>
                                                </Form.Item>

                                                <Form.Item error={!!errors.overseasCity} style={{ color: 'red' }} label="City">
                                                    <Popover content="City">
                                                        <Input disabled={isDisabledTrue} id="overseasCity" type="city" name="overseasCity" value= {employeeDetails.overseasAddressDetails.overseasCity} onChange={this.onOverseasAddressChange} placeholder="City" />
                                                        {errors.overseasCity}
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>
                                                </Form.Item>

                                                <Form.Item error={!!errors.overseasState} style={{ color: 'red' }} label="State">
                                                    <Popover content="State">
                                                        <Input disabled={isDisabledTrue} id="overseasState" type="state" name="overseasState"  value= {employeeDetails.overseasAddressDetails.overseasState} onChange={this.onOverseasAddressChange} placeholder="State" />
                                                            {errors.overseasState}
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>
                                                </Form.Item>

                                                <Form.Item error={!!errors.overseasZipCode} style={{ color: 'red' }} label="Zip Code">
                                                    <Popover content="Zipcode">
                                                        <Input disabled={isDisabledTrue} id="overseasZipCode" type="number" name="overseasZipCode" value={employeeDetails.overseasAddressDetails.overseasZipCode}onChange={this.onOverseasAddressChange} placeholder= "Enter Your Zipcode"/>
                                                            {errors.overseasZipCode}
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>
                                                </Form.Item>

                                                <Form.Item error={!!errors.overseasCountry} style={{ color: 'red' }} label="Country">
                                                    <Popover content="Country">
                                                        <Input disabled={isDisabledTrue} id="overseasCountry" type="country" name="overseasCountry"  value= {employeeDetails.overseasAddressDetails.overseasCountry} onChange={this.onOverseasAddressChange} placeholder="Country" />
                                                            {errors.overseasCountry}
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>
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
                                                    <Popover content="Date of Birth">
                                                        <DatePicker disabled={isDisabledTrue} onChange={this.onBirthDateChange} format="MM/DD/YYYY" placeholder= "Birth Date" defaultValue= {moment()} />
                                                        {errors.dateOfBirth}
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>
                                                </Form.Item>
                                                    
                                                {/* <Form.Item error={!!errors.countryPassport} style={{ color: 'red' }} label="Country">
                                                        <Input id="countryPassport" type="text" name="countryPassport"  value= {employeeDetails.passportDetails.countryPassport} onChange={this.onPassportDetailsChange} placeholder="Country" />
                                                        {errors.countryPassport}
                                                </Form.Item> */}
                                                <Form.Item error={!!errors.passportNumber} style={{ color: 'red' }} label="Passport Number">
                                                    <Popover content="Passport number">
                                                        <Input disabled={isDisabledTrue} id="passportNumber" type="text" name="passportNumber"  value= {employeeDetails.passportDetails.passportNumber} onChange={this.onPassportDetailsChange} placeholder="Passport Number" />
                                                        {errors.passportNumber}
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>
                                                </Form.Item>

                                                <Form.Item error={!!errors.issueDate} style={{ color: 'red' }} label="Issue Date">
                                                    <Popover content="Passport issue date">
                                                        <DatePicker disabled={isDisabledTrue} onChange={this.onPassportIssueDateChange} format="MM/DD/YYYY" placeholder= "Issue Date" defaultValue= {moment()} />
                                                            {errors.issueDate}
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>
                                                </Form.Item>

                                                <Form.Item error={!!errors.expirationDate} style={{ color: 'red' }} label="Expiration Date">
                                                    <Popover content="Passport expiration date">
                                                        <DatePicker disabled={isDisabledTrue} onChange={this.onPassportExpirationDateChange} format="MM/DD/YYYY" placeholder= "Expiration Date" defaultValue= {moment()} />
                                                            {errors.expirationDate}
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>
                                                </Form.Item>

                                                <Form.Item error={!!errors.countryOfCitizenship} style={{ color: 'red' }} label="Country Of Citizenship">
                                                    <Popover content="Country of citizenship">
                                                        <Input disabled={isDisabledTrue} id="countryOfCitizenship" type="text" name="countryOfCitizenship"  value= {employeeDetails.passportDetails.countryOfCitizenship} onChange={this.onPassportDetailsChange} placeholder="Country Of Citizenship" />
                                                            {errors.countryOfCitizenship}
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>
                                                </Form.Item>

                                                <Form.Item error={!!errors.socialSecurityNumber} style={{ color: 'red' }} label="Social Security Number">
                                                    <Popover content="Social security number">
                                                        <Input disabled={isDisabledTrue} id="socialSecurityNumber" type="number" name="socialSecurityNumber"  value= {employeeDetails.passportDetails.socialSecurityNumber} onChange={this.onPassportDetailsChange} placeholder="Social Security Number" />
                                                            {errors.socialSecurityNumber}
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>
                                                </Form.Item>

                                                <Form.Item error={!!errors.alienNumber} style={{ color: 'red' }} label="Alien Number">
                                                    <Popover content="Alien number">
                                                        <Input disabled={isDisabledTrue} id="alienNumber" type="number" name="alienNumber"  value= {employeeDetails.passportDetails.alienNumber} onChange={this.onPassportDetailsChange} placeholder="Alien Number" />
                                                            {errors.alienNumber}
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>
                                                </Form.Item>

                                            </Card>
                                        </Col>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <Card title="Immigration Information">
                                                <Form.Item error={!!errors.currentStatus} style={{ color: 'red' }} label="Current Status">
                                                    <Popover content="Current status">
                                                        <RadioGroup disabled={isDisabledTrue} name="currentStatus" value= {employeeDetails.immigirationDetails.currentStatus} onChange={this.onImmigirationDetailsChange} >                                                            
                                                            <Radio value={'F1'}>F1</Radio>
                                                            <Radio value={'H1B'}>H1B</Radio>
                                                            <Radio value={'H4'}>H4</Radio>
                                                            <Radio value={'B1/B2'}>B1/B2</Radio>
                                                            <Radio value={'L1/L2'}>L1/L2</Radio>
                                                            <Radio>
                                                                Others<Input style={{ width: 100, marginLeft: 10 }} name="currentStatus" onChange={this.onImmigirationDetailsChange} />
                                                            </Radio>
                                                        </RadioGroup>
                                                        {errors.currentStatus}
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>
                                                </Form.Item>
                                                {/* <Form.Item error={!!errors.currentStatusOtherName} style={{ color: 'red' }} label="Current Status Other Name">
                                                        <Input id="currentStatusOtherName" type="text" name="currentStatusOtherName"  value= {employeeDetails.immigirationDetails.currentStatusOtherName} onChange={this.onImmigirationDetailsChange} placeholder="Current Status Other Name" />
                                                        {errors.currentStatusOtherName}
                                                </Form.Item> */}
                                                <Form.Item error={!!errors.USVisaIssued} style={{ color: 'red' }} label="Visa Start Date">
                                                    <Popover content="US visa issued date">
                                                        <DatePicker disabled={isDisabledTrue} onChange={this.onImmigrationUSVisaIssuedDateChange} format="MM/DD/YYYY" placeholder= "Visa Start Date" defaultValue= {moment()} />
                                                        {errors.USVisaIssued}
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>
                                                </Form.Item>
                                                {/* <Form.Item error={!!errors.when} style={{ color: 'red' }} label="When">
                                                        <Input id="when" type="text" name="when"  value= {employeeDetails.immigirationDetails.when} onChange={this.onChange} placeholder="When" />
                                                        <DatePicker onChange={this.onImmigrationWhenDateChange} format="MM/DD/YYYY" placeholder= "When" defaultValue= {moment()} />
                                                        {errors.when}
                                                </Form.Item> */}
                                                <Form.Item error={!!errors.visaExpireDate} style={{ color: 'red' }} label="Visa Expire Date">
                                                    <Popover content="Visa expired date">
                                                        <DatePicker disabled={isDisabledTrue} onChange={this.onImmigrationvisaExpireDateDateChange} format="MM/DD/YYYY" placeholder= "Visa Expire Date" defaultValue= {moment()} />
                                                            {errors.visaExpireDate}
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>
                                                </Form.Item>

                                                <Form.Item error={!!errors.immigrationConsule} style={{ color: 'red' }} label="Consulate Name">
                                                    <Popover content="Immigration consule">
                                                        <Input disabled={isDisabledTrue} id="immigrationConsule" type="text" name="immigrationConsule"  value= {employeeDetails.immigirationDetails.immigrationConsule} onChange={this.onImmigirationDetailsChange} placeholder="Consulate" />
                                                        {errors.immigrationConsule}
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>
                                                </Form.Item>

                                                <Form.Item error={!!errors.consulateCity} style={{ color: 'red' }} label="City">
                                                    <Popover content="Consulate city">
                                                        <Input disabled={isDisabledTrue} id="consulateCity" type="text" name="consulateCity"  value= {employeeDetails.immigirationDetails.consulateCity} onChange={this.onImmigirationDetailsChange} placeholder="Consulate-City" />
                                                        {errors.consulateCity}
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>
                                                </Form.Item>

                                                <Form.Item error={!!errors.consulateCountry} style={{ color: 'red' }} label="Country">
                                                    <Popover content="Cosukate country">
                                                        <Input disabled={isDisabledTrue} id="consulateCountry" type="text" name="consulateCountry"  value= {employeeDetails.immigirationDetails.consulateCountry} onChange={this.onImmigirationDetailsChange} placeholder="Consulate-Country" />
                                                        {errors.consulateCountry}
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>
                                                </Form.Item>

                                                {/* <Form.Item error={!!errors.otherName2} style={{ color: 'red' }} label="Other Name 2">
                                                        <Input id="otherName2" type="text" name="otherName2"  value= {employeeDetails.immigirationDetails.otherName2} onChange={this.onImmigirationDetailsChange} placeholder="Other Name 2" />
                                                        {errors.otherName2}
                                                </Form.Item> */}
                                                <Form.Item error={!!errors.i94Number} style={{ color: 'red' }} label="I-94">
                                                    <Popover content="I-94 number">
                                                        <Input disabled={isDisabledTrue} id="i94Number" type="number" name="i94Number"  value= {employeeDetails.immigirationDetails.i94Number} onChange={this.onImmigirationDetailsChange} placeholder="I-94" />
                                                        {errors.i94Number}
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>
                                                </Form.Item>
                                                
                                                {/* <Form.Item error={!!errors.entryValidTill} style={{ color: 'red' }} label="Expiration Date">
                                                        <Input id="entryValidTill" type="text" name="entryValidTill"  value= {employeeDetails.immigirationDetails.entryValidTill} onChange={this.onChange} placeholder="Entry Valid Till" /> 
                                                        <DatePicker onChange={this.onImmigrationEntryValidTillDateChange} format="MM/DD/YYYY" placeholder= "Entry Valid Till" defaultValue= {moment()} />
                                                        {errors.entryValidTill}
                                                </Form.Item>*/}
                                                <Form.Item error={!!errors.lastEntryUS} style={{ color: 'red' }} label="Last Entry US">
                                                    <Popover content="Last entry US">
                                                        <DatePicker disabled={isDisabledTrue} onChange={this.onImmigrationLastEntryUSDateChange} format="MM/DD/YYYY" placeholder= "Last Entry US" defaultValue= {moment()} />
                                                        {errors.lastEntryUS}
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>
                                                </Form.Item>

                                                <Form.Item error={!!errors.portOfEntry} style={{ color: 'red' }} label="Port Of Entry (City, State)">
                                                    <Popover content="Port of entry">
                                                        <Input disabled={isDisabledTrue} id="portOfEntry" type="text" name="portOfEntry"  value= {employeeDetails.immigirationDetails.portOfEntry} onChange={this.onImmigirationDetailsChange} placeholder="Example: Chicago, IL" />
                                                        {/* <DatePicker onChange={this.onPortOfEntryDateChange} format="MM/DD/YYYY" placeholder= "Port of ENtry" defaultValue= {moment()} /> */}
                                                        {errors.portOfEntry}
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>
                                                </Form.Item>
                                                {/* <Form.Item error={!!errors.visaStamping} style={{ color: 'red' }} label="Visa Stamping">
                                                        <Input id="visaStamping" type="text" name="visaStamping"  value= {employeeDetails.immigirationDetails.visaStamping} onChange={this.onImmigirationDetailsChange} placeholder="Visa Stamping" />
                                                        <DatePicker onChange={this.onVisaStampingDateChange} format="MM/DD/YYYY" placeholder= "Visa Stamping" defaultValue= {moment()} />
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
                                                        <DatePicker onChange={this.onTravelInfoStartDateChange} format="MM/DD/YYYY" placeholder= "Start Date" defaultValue= {moment()} />
                                                        {errors.startDate}
                                                </Form.Item>
                                                <Form.Item error={!!errors.endDate} style={{ color: 'red' }} label="End Date">
                                                        <Input id="endDate" type="text" name="endDate"  value= {employeeDetails.travelDetails.endDate} onChange={this.onChange} placeholder="End Date" />
                                                        <DatePicker onChange={this.onTravelInfoEndDateChange} format="MM/DD/YYYY" placeholder= "End Date" defaultValue= {moment()} />
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
                                                <button onClick={this.addTravelHistory}>Add Travel history</button>
                                                {
                                                    travelHistory.map((val, idx)=> {
                                                        let departureId = `departureDate-${idx}`, depId = `id-${idx}`
                                                        let arrivalId = `arrivalDate-${idx}`, arrId = `id-${idx}`
                                                        let travelId = `daysSpent-${idx}`, idId = `id-${idx}`
                                                        return(
                                                            <div key={idx}>
                                                                <Form.Item error={!!errors.departureDate} style={{ color: 'red' }} label="Departure Date">
                                                                    <Popover content="Departure date">
                                                                        <DatePicker disabled={isDisabledTrue} onChange={this.onTravelHistoryDepartureDateChange(idx)} format="MM/DD/YYYY" placeholder= "Departure Date" defaultValue= {moment()} />
                                                                            {errors.departureDate}
                                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                                    </Popover>
                                                                </Form.Item>
                                                                <Form.Item error={!!errors.arrivalDate} style={{ color: 'red' }} label="Arrival Date">
                                                                    <Popover content="Arrival date">
                                                                        <DatePicker disabled={isDisabledTrue} onChange={this.onTravelHistoryArrivalDateChange(idx)} format="MM/DD/YYYY" placeholder= "Arrival Date" defaultValue= {moment()} />
                                                                            {errors.arrivalDate}
                                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                                    </Popover>
                                                                </Form.Item>
                                                                <Form.Item error={!!errors.daysSpent} style={{ color: 'red' }} label="Days Count">
                                                                    <Popover content="Days spent">
                                                                        <Input disabled={isDisabledTrue} type="number" onChange={this.onTravelHistoryChange(idx)} placeholder="Days Count" />
                                                                            {errors.daysSpent}
                                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                                    </Popover>
                                                                </Form.Item>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </Card>
                                        </Col>
                                    </Row>
                                    </Form>
                                    </Panel>
                                    <Panel className="boldClass" header="H4 Dependent Information" key="4">
                                        <Form layout="inline">
                                        <Row>
                                       <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <Card title="Check List Information for H4B">
                                                <Form.Item error={!!errors.H4Passport} style={{ color: 'red' }} label="H4 Passport">
                                                    <Popover content="H4 Passport">
                                                        <Input id="H4Passport" type="number" name="H4Passport"  value= {employeeDetails.H4CheckListDetails.H4Passport} onChange={this.onH4CheckListDetailsChange} placeholder="H4 Passport" />
                                                        {errors.H4Passport}
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>
                                                </Form.Item>
                                                <Form.Item error={!!errors.H4i94} style={{ color: 'red' }} label="H4 i94">
                                                    <Popover content="H4 I-94">
                                                        <Input id="H4i94" type="number" name="H4i94"  value= {employeeDetails.H4CheckListDetails.H4i94} onChange={this.onH4CheckListDetailsChange} placeholder="H4 i94" />
                                                        {errors.H4i94}
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>
                                                </Form.Item>
                                                <Form.Item error={!!errors.H4Approval} style={{ color: 'red' }} label="H4 Approval">
                                                    <Popover content="H4 Approval">
                                                        <Input id="H4Approval" type="text" name="H4Approval"  value= {employeeDetails.H4CheckListDetails.H4Approval} onChange={this.onH4CheckListDetailsChange} placeholder="H4 Approval" />
                                                        {errors.H4Approval}
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>
                                                </Form.Item>
                                                <Form.Item error={!!errors.H4Marraige} style={{ color: 'red' }} label="H4 Marraige">
                                                    <Popover content="H4 Marraige">
                                                        <Input id="H4Marraige" type="text" name="H4Marraige"  value= {employeeDetails.H4CheckListDetails.H4Marraige} onChange={this.onH4CheckListDetailsChange} placeholder="H4 Marraige" />
                                                        {errors.H4Marraige}
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>
                                                </Form.Item>
                                                <Form.Item error={!!errors.H4ChildrenCertificate} style={{ color: 'red' }} label="H4 Children Certificate">
                                                    <Popover content="H4 Children certificate">
                                                        <Input id="H4ChildrenCertificate" type="text" name="H4ChildrenCertificate"  value= {employeeDetails.H4CheckListDetails.H4ChildrenCertificate} onChange={this.onH4CheckListDetailsChange} placeholder="H4 Children Certificate" />
                                                        {errors.H4ChildrenCertificate}
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>
                                                </Form.Item>
                                            </Card>
                                        </Col>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <Card title="I-140 Approval">
                                                <Form.Item error={!!errors.I140Approval} style={{ color: 'red' }} label="I-140 Approval Start Date">
                                                    <Popover content="I-140 Approval Start date">
                                                        <Input id="I140Approval" type="text" name="I140Approval"  value= {employeeDetails.I140Detials.I140Approval} onChange={this.onI140DetailsChange} placeholder="I-140 Approval start date" />
                                                        {errors.I140Approval}
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>
                                                </Form.Item>
                                                <Form.Item error={!!errors.I140Approval} style={{ color: 'red' }} label="I-140 Approval">
                                                    <Popover content="I-140 Approval">
                                                        <DatePicker disabled={isDisabledTrue} onChange={this.onI140DateChange} format="MM/DD/YYYY" placeholder= "I-140 Approval" defaultValue= {moment()} />
                                                        {errors.I140Approval}
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>
                                                </Form.Item>
                                                <Form.Item error={!!errors.I140Receipt} style={{ color: 'red' }} label="I-140 Receipt">
                                                    <Popover content="I-140 Receipt">
                                                        <DatePicker disabled={isDisabledTrue} onChange={this.onI140ReceiptDateChange} format="MM/DD/YYYY" placeholder= "I-140 Receipt" defaultValue= {moment()} />
                                                        {errors.I140Receipt}
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>
                                                </Form.Item>
                                                <Form.Item error={!!errors.I140Documents} style={{ color: 'red' }} label="I-140 Documents">
                                                    <Popover content="I-140 Documents">
                                                        <Input id="I140Documents" type="file" name="I140Documents" onChange={(e) => this.uploadFile(e, "Employee")} placeholder="I-140 Documents" />
                                                        {errors.I140Documents}
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>
                                                    <progress value={this.state.I140DocumentsProgress} max="100"/>
                                                </Form.Item>
                                            </Card>
                                        </Col> 
                                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <Card title="Spouse Information">
                                                <Form.Item error={!!errors.maritalStatus} style={{ color: 'red' }} label="Marital Status">
                                                    <Popover content="Marital Status">
                                                        <Input id="maritalStatus" type="text" name="maritalStatus"  value= {employeeDetails.spouseDetails.maritalStatus} onChange={this.onSpouseDetailsChange} placeholder="Marital Status" />
                                                        {errors.maritalStatus}
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>
                                                </Form.Item>
                                                <Form.Item error={!!errors.spouseH4} style={{ color: 'red' }} label="Spouse H4">
                                                    <Popover content="Spouse H4">
                                                        <Input id="spouseH4" type="number" name="spouseH4"  value= {employeeDetails.spouseDetails.spouseH4} onChange={this.onSpouseDetailsChange} placeholder="Spouse H4" />
                                                        {errors.spouseH4}
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>
                                                </Form.Item>
                                                <Form.Item error={!!errors.dependenceRelationship} style={{ color: 'red' }} label="Dependence Relationship">
                                                    <Popover content="Dependecy Relationship">
                                                        <Input id="dependenceRelationship" type="text" name="dependenceRelationship"  value= {employeeDetails.spouseDetails.dependenceRelationship} onChange={this.onSpouseDetailsChange} placeholder="Dependence Relationship" />
                                                        {errors.dependenceRelationship}
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>
                                                </Form.Item>
                                            </Card>
                                        </Col>
                                    </Row>
                                    </Form>
                                    </Panel>
                                    <Panel className="boldClass" header="H4 Dependent Documents" key="5">
                                        <Form layout="inline">
                                            <Row>
                                                <Checkbox onChange={this.onH4Select} value={this.state.isH4DependentAvailable}>Is H4 dependents are available ?</Checkbox>
                                            </Row>
                                            <Row> 
                                                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                                    <Card title="Kids Information">
                                                        <button onClick={this.addKidsDetails}>Add Kids</button>
                                                        {
                                                            kidsDetails.map((val, idx)=> {
                                                                return(
                                                                    <Card title={`Kid ${idx+1}`}>
                                                                        <div key={idx}>
                                                                            <Form.Item error={!!errors.kidFullName} style={{ color: 'red' }} label="Full Name">
                                                                                <Popover content="Kid Full Name">
                                                                                    <Input id="kidFullName" type="text" name="kidFullName" onChange={this.onKidsDetailsChange(idx)} placeholder="kid Full Name" />
                                                                                    {errors.kidFullName}
                                                                                    <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                                                </Popover>
                                                                            </Form.Item>
                                                                            <Form.Item error={!!errors.kidGender} style={{ color: 'red' }} label="Gender">
                                                                                <Popover content="Kid Gender">
                                                                                    <Input id="kidGender" type="text" name="kidGender" onChange={this.onKidsDetailsChange(idx)} placeholder="Gender" />
                                                                                    {errors.kidGender}
                                                                                    <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                                                </Popover>
                                                                            </Form.Item>
                                                                            <Form.Item error={!!errors.kidMaritalStatus} style={{ color: 'red' }} label="Marital Status">
                                                                                <Popover content="Kid Marital Status">
                                                                                    <Input id="kidMaritalStatus" type="text" name="kidMaritalStatus" onChange={this.onKidsDetailsChange(idx)} placeholder="Marital Status" />
                                                                                    {errors.kidMaritalStatus}
                                                                                    <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                                                </Popover>
                                                                            </Form.Item>
                                                                            <Form.Item error={!!errors.kidBirthDate} style={{ color: 'red' }} label="Birth Date">
                                                                                <Popover content="Kid Birth Date">
                                                                                    <DatePicker disabled={isDisabledTrue} onChange={this.onKidBirthDateChange} format="MM/DD/YYYY" placeholder= "Birth Date" defaultValue= {moment()} />
                                                                                    {errors.kidBirthDate}
                                                                                    <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                                                </Popover>
                                                                            </Form.Item>
                                                                            <Form.Item error={!!errors.kidCountry} style={{ color: 'red' }} label="Country">
                                                                                <Popover content="Kid Country">
                                                                                    <Input id="kidCountry" type="text" name="kidCountry" onChange={this.onKidsDetailsChange(idx)} placeholder="Country" />
                                                                                    {errors.kidCountry}
                                                                                    <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                                                </Popover>
                                                                            </Form.Item>
                                                                            <Form.Item error={!!errors.kidCountryOfCitizen} style={{ color: 'red' }} label="Country Of Citizen">
                                                                                <Popover content="Kid Country of Citizen">
                                                                                    <Input id="kidCountryOfCitizen" type="text" name="kidCountryOfCitizen" onChange={this.onKidsDetailsChange(idx)} placeholder="Country Of Citizen" />
                                                                                    {errors.kidCountryOfCitizen}
                                                                                    <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                                                </Popover>
                                                                            </Form.Item>
                                                                            <Form.Item error={!!errors.kidImmigrationStatus} style={{ color: 'red' }} label="Immigration Status">
                                                                                <Popover content="Kid Immigration Status">
                                                                                    <Input id="kidImmigrationStatus" type="text" name="kidImmigrationStatus" onChange={this.onKidsDetailsChange(idx)} placeholder="Immigration Status" />
                                                                                    {errors.kidImmigrationStatus}
                                                                                    <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                                                </Popover>
                                                                            </Form.Item>
                                                                            <Form.Item error={!!errors.kidSocialSecurityNumber} style={{ color: 'red' }} label="Social Security Number">
                                                                                <Popover content="Kid Social Security Number">
                                                                                    <Input id="kidSocialSecurityNumber" type="number" name="kidSocialSecurityNumber" onChange={this.onKidsDetailsChange(idx)} placeholder="Social Security Number" />
                                                                                    {errors.kidSocialSecurityNumber}
                                                                                    <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                                                </Popover>
                                                                            </Form.Item>
                                                                            <Form.Item error={!!errors.kidCurrentAddress} style={{ color: 'red' }} label="Current Address">
                                                                                <Popover content="Kid Current Address">
                                                                                    <Input id="kidCurrentAddress" type="text" name="kidCurrentAddress" onChange={this.onKidsDetailsChange(idx)} placeholder="Current Address" />
                                                                                    {errors.kidCurrentAddress}
                                                                                    <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                                                </Popover>
                                                                            </Form.Item>
                                                                        </div>
                                                                    </Card>
                                                                )
                                                            })
                                                        }
                                                    </Card>
                                                </Col>
                                                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                                    <Card title="H4 Information">
                                                        <Form.Item error={!!errors.spouseFullName} style={{ color: 'red' }} label="Spouse Full Name">
                                                            <Popover content="Spouse Full Name">
                                                                <Input id="spouseFullName" type="text" name="spouseFullName"  value= {employeeDetails.H4Details.spouseFullName} onChange={this.onH4DetailsChange} placeholder="Spouse Full Name" />
                                                                {errors.spouseFullName}
                                                                <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                            </Popover>
                                                        </Form.Item>
                                                        <Form.Item error={!!errors.spouseBirthDate} style={{ color: 'red' }} label="Spouse Birth Date">
                                                            <Popover content="Spouse Birth Date">
                                                                <DatePicker disabled={isDisabledTrue} onChange={this.onSpouseBirthDateChange} format="MM/DD/YYYY" placeholder= "Birth Date" defaultValue= {moment()} />
                                                                {errors.spouseBirthDate}
                                                                <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                            </Popover>
                                                        </Form.Item>
                                                        <Form.Item error={!!errors.spouseCountry} style={{ color: 'red' }} label="Spouse Country">
                                                            <Popover content="Spouse Country">
                                                                <Input id="spouseCountry" type="text" name="spouseCountry"  value= {employeeDetails.H4Details.spouseCountry} onChange={this.onH4DetailsChange} placeholder="Spouse Country" />
                                                                {errors.spouseCountry}
                                                                <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                            </Popover>
                                                        </Form.Item>
                                                        <Form.Item error={!!errors.spouseCountryOfCitizen} style={{ color: 'red' }} label="Spouse Country Of Citizen">
                                                            <Popover content="Spouse country of citizenship">
                                                                <Input id="spouseCountryOfCitizen" type="text" name="spouseCountryOfCitizen"  value= {employeeDetails.H4Details.spouseCountryOfCitizen} onChange={this.onH4DetailsChange} placeholder="Spouse Country Of Citizen" />
                                                                {errors.spouseCountryOfCitizen}
                                                                <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                            </Popover>
                                                        </Form.Item>
                                                        <Form.Item error={!!errors.marraigeDate} style={{ color: 'red' }} label="Marraige Date">
                                                            <Popover content="Marraige date">
                                                                <DatePicker disabled={isDisabledTrue} onChange={this.onMarraigeDateChange} format="MM/DD/YYYY" placeholder= "Marraige Date" defaultValue= {moment()} />
                                                                {errors.marraigeDate}
                                                                <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                            </Popover>
                                                        </Form.Item>
                                                        <Form.Item error={!!errors.countryOfMarraige} style={{ color: 'red' }} label="Country Of Marraige">
                                                            <Popover content="Country of marraige">
                                                                <Input id="countryOfMarraige" type="text" name="countryOfMarraige"  value= {employeeDetails.H4Details.countryOfMarraige} onChange={this.onH4DetailsChange} placeholder="Country Of Marraige" />
                                                                {errors.countryOfMarraige}
                                                                <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                            </Popover>
                                                        </Form.Item>
                                                        <Form.Item error={!!errors.spouseImmigrationStatus} style={{ color: 'red' }} label="Spouse Immigration Status">
                                                            <Popover content="Spouse immigration status">
                                                                <Input id="spouseImmigrationStatus" type="text" name="spouseImmigrationStatus"  value= {employeeDetails.H4Details.spouseImmigrationStatus} onChange={this.onH4DetailsChange} placeholder="Spouse Immigration Status" />
                                                                {errors.spouseImmigrationStatus}
                                                                <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                            </Popover>
                                                        </Form.Item>
                                                        <Form.Item error={!!errors.spouseSoicalSecurityNumber} style={{ color: 'red' }} label="Spouse Soical Security Number">
                                                            <Popover content="Spouse social security number">
                                                                <Input id="spouseSoicalSecurityNumber" type="number" name="spouseSoicalSecurityNumber"  value= {employeeDetails.H4Details.spouseSoicalSecurityNumber} onChange={this.onH4DetailsChange} placeholder="Spouse Soical Security Number" />
                                                                {errors.spouseSoicalSecurityNumber}
                                                                <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                            </Popover>
                                                        </Form.Item>
                                                        <Form.Item error={!!errors.dependenceRelationship} style={{ color: 'red' }} label="Dependence Relationship">
                                                            <Popover content="Dependency relationship">
                                                                <Input id="dependenceRelationship" type="text" name="dependenceRelationship"  value= {employeeDetails.H4Details.dependenceRelationship} onChange={this.onH4DetailsChange} placeholder="Dependence Relationship" />
                                                                {errors.dependenceRelationship}
                                                                <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                            </Popover>
                                                        </Form.Item>
                                                        <Form.Item error={!!errors.spouseCurrentAddress} style={{ color: 'red' }} label="Spouse Current Address">
                                                            <Popover content="Spouse current address">
                                                                <Input id="spouseCurrentAddress" type="text" name="spouseCurrentAddress"  value= {employeeDetails.H4Details.spouseCurrentAddress} onChange={this.onH4DetailsChange} placeholder="Spouse Current Address" />
                                                                {errors.spouseCurrentAddress}
                                                                <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                            </Popover>
                                                        </Form.Item>
                                                        <Form.Item error={!!errors.spouseCity} style={{ color: 'red' }} label="Spouse City">
                                                            <Popover content="Spouse city">
                                                                <Input id="spouseCity" type="text" name="spouseCity"  value= {employeeDetails.H4Details.spouseCity} onChange={this.onH4DetailsChange} placeholder="Spouse City" />
                                                                {errors.spouseCity}
                                                                <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                            </Popover>
                                                        </Form.Item>
                                                        <Form.Item error={!!errors.spouseState} style={{ color: 'red' }} label="Spouse State">
                                                            <Popover content="Spouse state">
                                                                <Input id="spouseState" type="text" name="spouseState"  value= {employeeDetails.H4Details.spouseState} onChange={this.onH4DetailsChange} placeholder="Spouse State" />
                                                                {errors.spouseState}
                                                                <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                            </Popover>
                                                        </Form.Item>
                                                        <Form.Item error={!!errors.spouseZipcode} style={{ color: 'red' }} label="Spouse Zipcode">
                                                            <Popover content="Spouse zipcode">
                                                                <Input id="spouseZipcode" type="number" name="spouseZipcode"  value= {employeeDetails.H4Details.spouseZipcode} onChange={this.onH4DetailsChange} placeholder="Spouse Zipcode" />
                                                                {errors.spouseZipcode}
                                                                <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                            </Popover>
                                                        </Form.Item>
                                                    </Card>
                                                </Col> 
                                            </Row>
                                        </Form>
                                    </Panel>
                                    <Panel className="boldClass" header="Project Information" key="6">
                                    <Form layout="inline">
                                    <Row>
                                        <Col >
                                            <Card title="Work Information(Client Name and Address must be accurate)">
                                                <Form.Item error={!!errors.clientName} style={{ color: 'red' }} label="Client Name">
                                                    <Popover content="Client name">
                                                        <Input disabled={isDisabledTrue} id="clientName" type="text" name="clientName"  value= {employeeDetails.workDetails.clientName} onChange={this.onWorkDetailsChange} placeholder="Client Name" />
                                                        {errors.clientName}
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>
                                                </Form.Item>
                                                <Form.Item error={!!errors.clientAddress} style={{ color: 'red' }} label="Address">
                                                    <Popover content="Client Address 1">
                                                        <Input disabled={isDisabledTrue} id="clientAddress" type="text" name="clientAddress"  value= {employeeDetails.workDetails.clientAddress} onChange={this.onWorkDetailsChange} placeholder="Address" />
                                                        {errors.clientAddress}
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>
                                                </Form.Item>
                                                <Form.Item error={!!errors.clientAddress2} style={{ color: 'red' }} label="Address 2">
                                                    <Popover content="Client Address 2">
                                                        <Input disabled={isDisabledTrue} id="clientAddress2" type="text" name="clientAddress2"  value= {employeeDetails.workDetails.clientAddress2} onChange={this.onWorkDetailsChange} placeholder="Address 2" />
                                                        {errors.clientAddress2}
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>
                                                </Form.Item>
                                                <Form.Item error={!!errors.clientCity} style={{ color: 'red' }} label="City">
                                                    <Popover content="Client city">
                                                        <Input disabled={isDisabledTrue} id="clientCity" type="text" name="clientCity"  value= {employeeDetails.workDetails.clientCity} onChange={this.onWorkDetailsChange} placeholder="City" />
                                                        {errors.clientCity}
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>
                                                </Form.Item>
                                                <Form.Item error={!!errors.clientState} style={{ color: 'red' }} label="State">
                                                    <Popover content="Client state">
                                                        <Input disabled={isDisabledTrue} id="clientState" type="text" name="clientState"  value= {employeeDetails.workDetails.clientState} onChange={this.onWorkDetailsChange} placeholder="State" />
                                                        {errors.clientState}
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>
                                                </Form.Item>
                                                <Form.Item error={!!errors.clientZipCode} style={{ color: 'red' }} label="ZipCode">
                                                    <Popover content="Zipcode">
                                                        <Input disabled={isDisabledTrue} id="clientZipCode" type="number" name="clientZipCode"  value= {employeeDetails.workDetails.clientZipCode} onChange={this.onWorkDetailsChange} placeholder="ZipCode" />
                                                        {errors.clientZipCode}
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>
                                                </Form.Item>
                                                <Form.Item error={!!errors.vendorName} style={{ color: 'red' }} label="Vendor Name">
                                                    <Popover content="Vendor name">
                                                        <Input disabled={isDisabledTrue} id="vendorName" type="text" name="vendorName"  value= {employeeDetails.workDetails.vendorName} onChange={this.onWorkDetailsChange} placeholder="Vendor Name" />
                                                        {errors.vendorName}
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>
                                                </Form.Item>
                                                <Form.Item error={!!errors.vendorEmail} style={{ color: 'red' }} label="Vendor Email">
                                                    <Popover content="Vendor email">
                                                        <Input disabled={isDisabledTrue} id="vendorEmail" type="text" name="vendorEmail"  value= {employeeDetails.workDetails.vendorEmail} onChange={this.onWorkDetailsChange} placeholder="Vendor Email" />
                                                        {errors.vendorEmail}
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>
                                                </Form.Item>
                                                <Form.Item error={!!errors.contactNumber} style={{ color: 'red' }} label="Contact Number">
                                                    <Popover content="Contact number">
                                                        <Input disabled={isDisabledTrue} id="contactNumber" type="number" name="contactNumber"  value= {employeeDetails.workDetails.contactNumber} onChange={this.onWorkDetailsChange} placeholder="Contact Number" />
                                                        {errors.contactNumber}
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>
                                                </Form.Item>
                                                <Form.Item error={!!errors.projectStartDate} style={{ color: 'red' }} label="Project Start Date">
                                                    <Popover content="Project state date">
                                                        <DatePicker disabled={isDisabledTrue} onChange={this.onProjectStartDateChange} format="MM/DD/YYYY" placeholder= "Project Start Date" defaultValue= {moment()} />
                                                        {errors.projectStartDate}
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>
                                                </Form.Item>
                                            </Card>
                                        </Col>
                                        </Row>
                                        </Form>
                                        </Panel>
                                        <Panel className="boldClass" header="Documents From Employee" key="7">
                                        <Form layout="inline">
                                        <Row>
                                        <Col >
                                            <Card title="Documents From Employee">
                                                <div>
                                                <Form.Item>
                                                    <span style={{marginRight: '10px'}}>
                                                        { this.props.adminUploads.clientLetterTemplate && this.props.adminUploads.clientLetterTemplatePathLower !== '' ?
                                                            (
                                                            <span>
                                                                <a href="#" onClick={ (e) => {this.downloadFile(e, this.props.adminUploads.clientLetterTemplate, this.props.adminUploads.clientLetterTemplatePathLower) } }>
                                                                    Download Client Letter Template
                                                                </a>
                                                            </span>
                                                            )
                                                            : (<span></span>)
                                                        }
                                                    </span>
                                                    <span style={{marginLeft: '10px'}}>
                                                        { this.props.adminUploads.vendorLetterTemplate && this.props.adminUploads.vendorLetterTemplatePathLower !== '' ?
                                                            (
                                                            <span>
                                                                <a href="#" onClick={ (e) => {this.downloadFile(e, this.props.adminUploads.vendorLetterTemplate, this.props.adminUploads.vendorLetterTemplatePathLower) } }>
                                                                    Download Vendor Letter Template
                                                                </a>
                                                            </span>
                                                            )
                                                            : (<span></span>)
                                                        }
                                                    </span>
                                                </Form.Item>
                                                </div>
                                                <Form.Item error={!!errors.passportPage} style={{ color: 'red' }} label="Passport Page">
                                                    <Popover content="1st, last and visa pages">
                                                        <Input id="passportPage" type="file" name="passportPage" onChange={(e) => this.uploadFile(e, "Employee")} placeholder="Passport Page" />
                                                        {errors.passportPage}
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>
                                                    <progress value={this.state.passportPageProgress} max="100"/>
                                                    <span>
                                                        { this.state.employeeDetails.passportPagePathLower && this.state.employeeDetails.passportPagePathLower !== '' ?
                                                            (
                                                            <span>
                                                                <Popover content="Uploading new document will discard existing document">
                                                                    <span>Upload new Document</span>
                                                                </Popover>
                                                                <a href="#" onClick={ (e) => {this.downloadFile(e, this.state.employeeDetails.passportPage, this.state.employeeDetails.passportPagePathLower) } }>
                                                                    Download Recent document
                                                                </a>
                                                            </span>
                                                            )
                                                            : (<span></span>)
                                                        }
                                                    </span>
                                                </Form.Item>
                                                <Form.Item error={!!errors.i94} style={{ color: 'red' }} label="I-94">
                                                    <Popover content="I-94">
                                                        <Input id="i94" type="file" name="i94"  onChange={(e) => this.uploadFile(e, "Employee")} placeholder="I-94" />
                                                        {errors.i94}
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>
                                                    <progress value={this.state.i94Progress} max="100"/>
                                                    <span>
                                                        { this.state.employeeDetails.i94PathLower && this.state.employeeDetails.i94PathLower !== '' ?
                                                            (
                                                            <span>
                                                                <Popover content="Uploading new document will discard existing document">
                                                                    <span>Upload new Document</span>
                                                                </Popover>
                                                                <a href="#" onClick={ (e) => {this.downloadFile(e, this.state.employeeDetails.i94, this.state.employeeDetails.i94PathLower) } }>
                                                                    Download Recent document
                                                                </a>
                                                            </span>
                                                            )
                                                            : (<span></span>)
                                                        }
                                                    </span>
                                                </Form.Item>
                                                <Form.Item error={!!errors.bachelorDegree} style={{ color: 'red' }} label="Bachelor Degree">
                                                    <Popover content="Bachelors degree and transcripts text">
                                                        <Input id="bachelorDegree" type="file" name="bachelorDegree" onChange={(e) => this.uploadFile(e, "Employee")} placeholder="Bachelor Degree" />
                                                        {errors.bachelorDegree}  
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>                                                  
                                                    <progress value={this.state.bachelorDegreeProgress} max="100"/>
                                                    <span>
                                                        { this.state.employeeDetails.bachelorDegreePathLower && this.state.employeeDetails.bachelorDegreePathLower !== '' ?
                                                            (
                                                            <span>
                                                                <Popover content="Uploading new document will discard existing document">
                                                                    <span>Upload new Document</span>
                                                                </Popover>
                                                                <a href="#" onClick={ (e) => {this.downloadFile(e, this.state.employeeDetails.bachelorDegree, this.state.employeeDetails.bachelorDegreePathLower) } }>
                                                                    Download Recent document
                                                                </a>
                                                            </span>
                                                            )
                                                            : (<span></span>)
                                                        }
                                                    </span>
                                                </Form.Item>
                                                <Form.Item error={!!errors.mastersTranscripts} style={{ color: 'red' }} label="Masters Transcripts">
                                                    <Popover content="Masters degree and transcripts text">
                                                        <Input id="mastersTranscripts" type="file" name="mastersTranscripts" onChange={(e) => this.uploadFile(e, "Employee")} placeholder="Masters Transcripts" />
                                                        {errors.mastersTranscripts}     
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>                                               
                                                    <progress value={this.state.mastersTranscriptsProgress} max="100"/>
                                                    <span>
                                                        { this.state.employeeDetails.mastersTranscriptsPathLower && this.state.employeeDetails.mastersTranscriptsPathLower !== '' ?
                                                            (
                                                            <span>
                                                                <Popover content="Uploading new document will discard existing document">
                                                                    <span>Upload new Document</span>
                                                                </Popover>
                                                                <a href="#" onClick={ (e) => {this.downloadFile(e, this.state.employeeDetails.mastersTranscripts, this.state.employeeDetails.mastersTranscriptsPathLower) } }>
                                                                    Download Recent document
                                                                </a>
                                                            </span>
                                                            )
                                                            : (<span></span>)
                                                        }
                                                    </span>
                                                </Form.Item>
                                                <Form.Item error={!!errors.universityDocs} style={{ color: 'red' }} label="University Documents">
                                                    <Popover content="Upload I-20, EAD documents">
                                                        <Input id="universityDocs" type="file" name="universityDocs" onChange={(e) => this.uploadFile(e, "Employee")} placeholder="University Documents" />
                                                        {errors.universityDocs}
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>
                                                    <progress value={this.state.universityDocsProgress} max="100"/>
                                                    <span>
                                                        { this.state.employeeDetails.universityDocsPathLower && this.state.employeeDetails.universityDocsPathLower !== '' ?
                                                            (
                                                            <span>
                                                                <Popover content="Uploading new document will discard existing document">
                                                                    <span>Upload new Document</span>
                                                                </Popover>
                                                                <a href="#" onClick={ (e) => {this.downloadFile(e, this.state.employeeDetails.universityDocs, this.state.employeeDetails.universityDocsPathLower) } }>
                                                                    Download Recent document
                                                                </a>
                                                            </span>
                                                            )
                                                            : (<span></span>)
                                                        }
                                                    </span>
                                                </Form.Item>
                                                <Form.Item error={!!errors.resume} style={{ color: 'red' }} label="Resume">
                                                    <Popover content="Resume">
                                                        <Input id="resume" type="file" name="resume" onChange={(e) => this.uploadFile(e, "Employee")} placeholder="Resume" />
                                                        {errors.resume}
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>
                                                    <progress value={this.state.resumeProgress} max="100"/>
                                                    <span>
                                                        { this.state.employeeDetails.resumePathLower && this.state.employeeDetails.resumePathLower !== '' ?
                                                            (
                                                            <span>
                                                                <Popover content="Uploading new document will discard existing document">
                                                                    <span>Upload new Document</span>
                                                                </Popover>
                                                                <a href="#" onClick={ (e) => {this.downloadFile(e, this.state.employeeDetails.resume, this.state.employeeDetails.resumePathLower) } }>
                                                                    Download Recent document
                                                                </a>
                                                            </span>
                                                            )
                                                            : (<span></span>)
                                                        }
                                                    </span>
                                                </Form.Item>
                                                <Form.Item error={!!errors.ssnCopy} style={{ color: 'red' }} label="SSN">
                                                    <Popover content="SSN copy">
                                                        <Input id="ssnCopy" type="file" name="ssnCopy" onChange={(e) => this.uploadFile(e, "Employee")} placeholder="SSN" />
                                                        {errors.ssnCopy}
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>
                                                    <progress value={this.state.ssnCopyProgress} max="100"/>
                                                    <span>
                                                        { this.state.employeeDetails.ssnCopyPathLower && this.state.employeeDetails.ssnCopyPathLower !== '' ?
                                                            (
                                                            <span>
                                                                <Popover content="Uploading new document will discard existing document">
                                                                    <span>Upload new Document</span>
                                                                </Popover>
                                                                <a href="#" onClick={ (e) => {this.downloadFile(e, this.state.employeeDetails.ssnCopy, this.state.employeeDetails.ssnCopyPathLower) } }>
                                                                    Download Recent document
                                                                </a>
                                                            </span>
                                                            )
                                                            : (<span></span>)
                                                        }
                                                    </span>
                                                </Form.Item>
                                                <Form.Item error={!!errors.payStubs} style={{ color: 'red' }} label="Pay Stubs">
                                                    <Popover content="Most recent 3 pays">
                                                        <Input id="payStubs" type="file" name="payStubs" onChange={(e) => this.uploadFile(e, "Employee")} placeholder="Pay Stubs" />
                                                        {errors.payStubs}
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>
                                                    <progress value={this.state.payStubsProgress} max="100"/>
                                                    <span>
                                                        { this.state.employeeDetails.payStubsPathLower && this.state.employeeDetails.payStubsPathLower !== '' ?
                                                            (
                                                            <span>
                                                                <Popover content="Uploading new document will discard existing document">
                                                                    <span>Upload new Document</span>
                                                                </Popover>
                                                                <a href="#" onClick={ (e) => {this.downloadFile(e, this.state.employeeDetails.payStubs, this.state.employeeDetails.payStubsPathLower) } }>
                                                                    Download Recent document
                                                                </a>
                                                            </span>
                                                            )
                                                            : (<span></span>)
                                                        }
                                                    </span>
                                                </Form.Item>
                                                <Form.Item error={!!errors.clientLetter} style={{ color: 'red' }} label="Client Letter">
                                                    <Popover content="Client Letter">
                                                        <Input id="clientLetter" type="file" name="clientLetter" onChange={(e) => this.uploadFile(e, "Employee")} placeholder="Client Letter" />
                                                        {errors.clientLetter}
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>
                                                    <progress value={this.state.clientLetterProgress} max="100"/>
                                                    <span>
                                                        { this.state.employeeDetails.clientLetterPathLower && this.state.employeeDetails.clientLetterPathLower !== '' ?
                                                            (
                                                            <span>
                                                                <Popover content="Uploading new document will discard existing document">
                                                                    <span>Upload new Document</span>
                                                                </Popover>
                                                                <a href="#" onClick={ (e) => {this.downloadFile(e, this.state.employeeDetails.clientLetter, this.state.employeeDetails.clientLetterPathLower) } }>
                                                                    Download Recent document
                                                                </a>
                                                            </span>
                                                            )
                                                            : (<span></span>)
                                                        }
                                                    </span>
                                                </Form.Item>
                                                <Form.Item error={!!errors.vendorLetter} style={{ color: 'red' }} label="Vendor Letter">
                                                    <Popover content="Vendor Letter">
                                                        <Input id="vendorLetter" type="file" name="vendorLetter" onChange={(e) => this.uploadFile(e, "Employee")} placeholder="Vendor Letter" />
                                                        {errors.vendorLetter}
                                                        <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                    </Popover>
                                                    <progress value={this.state.vendorLetterProgress} max="100"/>
                                                    <span>
                                                        { this.state.employeeDetails.vendorLetterPathLower && this.state.employeeDetails.vendorLetterPathLower !== '' ?
                                                            (
                                                            <span>
                                                                <Popover content="Uploading new document will discard existing document">
                                                                    <span>Upload new Document</span>
                                                                </Popover>
                                                                <a href="#" onClick={ (e) => {this.downloadFile(e, this.state.employeeDetails.vendorLetter, this.state.employeeDetails.vendorLetterPathLower) } }>
                                                                    Download Recent document
                                                                </a>
                                                            </span>
                                                            )
                                                            : (<span></span>)
                                                        }
                                                    </span>
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
                                    <Panel className="boldClass" header="Documents From Reliable HR" key="8">
                                    <Form  layout="inline">
                                        <Row>
                                            <Col>
                                                <Card title="Documents From HR">
                                                    <Form.Item error={!!errors.employmentDocs} style={{ color: 'red' }} label="Employee Agreements">
                                                        <Popover content="Employee documents">
                                                            <Input id="employmentDocs" type="file" name="employmentDocs" onChange={(e) => this.uploadFile(e, "Reliable")} placeholder="Employee Agreements" />
                                                            {errors.employmentDocs}
                                                            <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                        </Popover>
                                                        <progress value={this.state.employmentDocsProgress} max="100"/>
                                                        <span>
                                                            { this.state.employmentDocsPathLower && this.state.employmentDocsPathLower !== '' ?
                                                                (
                                                                <span>
                                                                    <span>Upload new Document</span>
                                                                    <a href="#" onClick={ (e) => {this.downloadFile(e, this.state.employmentDocs, this.state.employmentDocsPathLower) } }>
                                                                        Download Recent document
                                                                    </a>
                                                                </span>
                                                                )
                                                                : (<span></span>)
                                                            }
                                                        </span>
                                                    </Form.Item>
                                                    <Form.Item error={!!errors.vendorDocs} style={{ color: 'red' }} label="Employee and Employer Relation">
                                                        <Popover content="Employer relation document">
                                                            <Input id="vendorDocs" type="file" name="vendorDocs" onChange={(e) => this.uploadFile(e, "Reliable")} placeholder="Employee and Employer relation" />
                                                            {errors.vendorDocs}
                                                            <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                        </Popover>
                                                        <progress value={this.state.vendorDocsProgress} max="100"/>
                                                        <span>
                                                            { this.state.vendorDocsPathLower && this.state.vendorDocsPathLower !== '' ?
                                                                (
                                                                <span>
                                                                    <span>Upload new Document</span>
                                                                    <a href="#" onClick={ (e) => {this.downloadFile(e, this.state.vendorDocs, this.state.vendorDocsPathLower) } }>
                                                                        Download Recent document
                                                                    </a>
                                                                </span>
                                                                )
                                                                : (<span></span>)
                                                            }
                                                        </span>
                                                    </Form.Item>
                                                    <Form.Item error={!!errors.layer1} style={{ color: 'red' }} label="Layer 1">
                                                        <Popover content="Layer 1">
                                                            <Input disabled={isDisabledTrue} id="layer1" type="text" name="layer1"  value= {reliableDocuments.layer1} onChange={this.onWorkDetailsChange} placeholder="Layer 1" />
                                                            {errors.layer1}
                                                            <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                        </Popover>
                                                    </Form.Item>
                                                    <Form.Item error={!!errors.layer1Documents} style={{ color: 'red' }} label="Layer 1 Documents">
                                                        <Popover content="Layer 1 document">
                                                            <Input id="layer1Documents" type="file" name="layer1Documents" onChange={(e) => this.uploadFile(e, "Reliable")} placeholder="Layer 1 Documents" />
                                                            {errors.layer1Documents}
                                                            <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                        </Popover>
                                                        <progress value={this.state.layer1DocumentsProgress} max="100"/>
                                                        <span>
                                                            { this.state.layer1DocumentsPathLower && this.state.layer1DocumentsPathLower !== '' ?
                                                                (
                                                                <span>
                                                                    <span>Upload new Document</span>
                                                                    <a href="#" onClick={ (e) => {this.downloadFile(e, this.state.layer1Documents, this.state.layer1DocumentsPathLower) } }>
                                                                        Download Recent document
                                                                    </a>
                                                                </span>
                                                                )
                                                                : (<span></span>)
                                                            }
                                                        </span>
                                                    </Form.Item>
                                                    <Form.Item error={!!errors.layer2} style={{ color: 'red' }} label="Layer 2">
                                                        <Popover content="layer 2">
                                                            <Input disabled={isDisabledTrue} id="layer2" type="text" name="layer2"  value= {reliableDocuments.layer2} onChange={this.onWorkDetailsChange} placeholder="Layer 2" />
                                                            {errors.layer2}
                                                            <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                        </Popover>
                                                    </Form.Item>
                                                    <Form.Item error={!!errors.layer2Documents} style={{ color: 'red' }} label="Layer 2 Documents">
                                                        <Popover content="layer 2 document">
                                                            <Input id="layer2Documents" type="file" name="layer2Documents" onChange={() => (e) => this.uploadFile(e, "Reliable")} placeholder="Layer 2 Documents" />
                                                            {errors.layer2Documents}
                                                            <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                        </Popover>
                                                        <progress value={this.state.layer2DocumentsProgress} max="100"/>
                                                        <span>
                                                            { this.state.layer2DocumentsPathLower && this.state.layer2DocumentsPathLower !== '' ?
                                                                (
                                                                <span>
                                                                    <span>Upload new Document</span>
                                                                    <a href="#" onClick={ (e) => {this.downloadFile(e, this.state.layer2Documents, this.state.layer2DocumentsPathLower) } }>
                                                                        Download Recent document
                                                                    </a>
                                                                </span>
                                                                )
                                                                : (<span></span>)
                                                            }
                                                        </span>
                                                    </Form.Item>
                                                    <Form.Item error={!!errors.lca} style={{ color: 'red' }} label="LCA">
                                                        <Popover content="LCA">
                                                            <Input id="lca" type="file" name="lca" onChange={() => (e) => this.uploadFile(e, "Reliable")} placeholder="LCA" />
                                                            {errors.lca}
                                                            <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                        </Popover>
                                                        <progress value={this.state.lcaProgress} max="100"/>
                                                        <span>
                                                            { this.state.lcaPathLower && this.state.lcaPathLower !== '' ?
                                                                (
                                                                <span>
                                                                    <span>Upload new Document</span>
                                                                    <a href="#" onClick={ (e) => {this.downloadFile(e, this.state.lca, this.state.lcaPathLower) } }>
                                                                        Download Recent document
                                                                    </a>
                                                                </span>
                                                                )
                                                                : (<span></span>)
                                                            }
                                                        </span>
                                                    </Form.Item>
                                                </Card>
                                            </Col>
                                            </Row>
                                            </Form>
                                            </Panel>
                                            <Panel className="boldClass" header="Documents From Attorney" key="9">
                                            <Form layout="inline">
                                            <Row>
                                            <Col >
                                                <Card title="Documents From Attorney">
                                                    <Form.Item error={!!errors.attorneyDocument1} style={{ color: 'red' }} label="Attorney Document 1">
                                                        <Popover content="Attorney document 1">
                                                            <Input id="attorneyDocument1" type="file" name="attorneyDocument1" onChange={(e) => this.uploadFile(e, "Attorney")} placeholder="Attorney Document 1" />
                                                            {errors.attorneyDocument1}
                                                            <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                        </Popover>
                                                        <progress value={this.state.attorneyDocument1Progress} max="100"/>
                                                        <span>
                                                            { this.state.attorneyDocument1PathLower && this.state.attorneyDocument1PathLower !== '' ?
                                                                (
                                                                <span>
                                                                    <span>Upload new Document</span>
                                                                    <a href="#" onClick={ (e) => {this.downloadFile(e, this.state.attorneyDocument1, this.state.attorneyDocument1PathLower) } }>
                                                                        Download Recent document
                                                                    </a>
                                                                </span>
                                                                )
                                                                : (<span></span>)
                                                            }
                                                        </span>
                                                    </Form.Item>
                                                    <Form.Item error={!!errors.attorneyDocument2} style={{ color: 'red' }} label="Attorney Document 2">
                                                        <Popover content="Attorney document 2">
                                                            <Input id="attorneyDocument2" type="file" name="attorneyDocument2" onChange={(e) => this.uploadFile(e, "Attorney")} placeholder="Attorney Document 2" />
                                                            {errors.attorneyDocument2}
                                                            <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                        </Popover>
                                                        <progress value={this.state.attorneyDocument2Progress} max="100"/>
                                                        <span>
                                                            { this.state.attorneyDocument2PathLower && this.state.attorneyDocument2PathLower !== '' ?
                                                                (
                                                                <span>
                                                                    <span>Upload new Document</span>
                                                                    <a href="#" onClick={ (e) => {this.downloadFile(e, this.state.attorneyDocument2, this.state.attorneyDocument2PathLower) } }>
                                                                        Download Recent document
                                                                    </a>
                                                                </span>
                                                                )
                                                                : (<span></span>)
                                                            }
                                                        </span>
                                                    </Form.Item>
                                                    <Form.Item error={!!errors.attorneyDocument3} style={{ color: 'red' }} label="Attorney Document 3">
                                                        <Popover content="Attorney document 3">
                                                            <Input id="attorneyDocument3" type="file" name="attorneyDocument3" onChange={(e) => this.uploadFile(e, "Attorney")} placeholder="Attorney Document 3" />
                                                            {errors.attorneyDocument3}
                                                            <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                        </Popover>
                                                        <progress value={this.state.attorneyDocument3Progress} max="100"/>
                                                        <span>
                                                            { this.state.attorneyDocument3PathLower && this.state.attorneyDocument3PathLower !== '' ?
                                                                (
                                                                <span>
                                                                    <span>Upload new Document</span>
                                                                    <a href="#" onClick={ (e) => {this.downloadFile(e, this.state.attorneyDocument3, this.state.attorneyDocument3PathLower) } }>
                                                                        Download Recent document
                                                                    </a>
                                                                </span>
                                                                )
                                                                : (<span></span>)
                                                            }
                                                        </span>
                                                    </Form.Item>
                                                    <Form.Item error={!!errors.attorneyDocument4} style={{ color: 'red' }} label="Attorney Document 4">
                                                        <Popover content="Attorney document 4">
                                                            <Input id="attorneyDocument4" type="file" name="attorneyDocument4" onChange={(e) => this.uploadFile(e, "Attorney")} placeholder="Attorney Document 4" />
                                                            {errors.attorneyDocument4}
                                                            <Icon type="info-circle" style={{ color: '#08c' }}/>
                                                        </Popover>
                                                        <progress value={this.state.attorneyDocument4Progress} max="100"/>
                                                        <span>
                                                            { this.state.attorneyDocument4PathLower && this.state.attorneyDocument4PathLower !== '' ?
                                                                (
                                                                <span>
                                                                    <span>Upload new Document</span>
                                                                    <a href="#" onClick={ (e) => {this.downloadFile(e, this.state.attorneyDocument4, this.state.attorneyDocument4PathLower) } }>
                                                                        Download Recent document
                                                                    </a>
                                                                </span>
                                                                )
                                                                : (<span></span>)
                                                            }
                                                        </span>
                                                    </Form.Item>
                                                </Card>
                                            </Col>
                                        </Row>
                                    </Form>
                                    </Panel>
                                    <Form>
                                        <Row>
                                            { submitButton }
                                            { downloadButton }
                                        </Row>
                                    </Form>
                        </Collapse>    
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        Reliable Immigration Form @ version: 1.0.0
                    </Footer>
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
        getEmployeesList:state.getEmployeesList,
        sucessFormSubmission: state.sucessFormSubmission,
        adminUploads: state.adminUploads,
        isAdmin: state.isAdmin,
        employeeData: state.employeeData
    }
};

export default connect(mapStateToProps)(H1bForm);