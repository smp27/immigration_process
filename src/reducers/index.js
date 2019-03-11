import * as Types from '../actions/types';

const initialState = {
    loggedInUser: {},
    visaFormData: {},
    loginStatus : false,
    signUpStatus: false,
    image: [],
    getEmployeesList:[],
    error: '',
    sucessFormSubmission:false,
    employeeData: {},
    adminUploads: {
        clientLetterTemplate: '',
        clientLetterTemplatePathLower: '',
        vendorLetterTemplate: '',
        vendorLetterTemplatePathLower: ''
    },
    adminsList: [
        'shaik.mehboob@rsrit.com',
        'abhinay.g@rsrit.com',
        'sandeep.perkari@rsrit.com',
        'sridhar.katukuri@rsrit.com',
        'venkat.gone@rsrit.com',
        'poornima.d@rsrit.com',
        'visha.felix@rsrit.com',
    ],
    isAdmin: false
};

export default function(state = initialState, action) {
    // console.log(action);
    switch(action.type) {

        case 'GET_EMPLOYEE_LIST' :
            return {...state};

        case Types.SUBMIT_IMMI_FORM :
            return {
                ...state,
                sucessFormSubmission:false
            };
        
        case Types.SUBMIT_IMMI_FORM_SUCCESS :
            return {
                ...state,
                sucessFormSubmission:true
            };

        // Below gets the list of Employees
        case 'GET_EMPLOYEE_LIST_SUCCESS':
            return {
                ...state,
                getEmployeesList:Object.assign([], Object.values(action.data))
            };

        // case 'VISA_FORM':
        //     return {...state};

        case 'SIGN_UP_ASYNC':
            return {
                ...state,
                signUpStatus: true,
                error: ''
            };

        case 'SIGN_UP_ERROR':
            return {
                ...state,
                error: action.payload.message
            }

        case 'FORGOT_PASSWORD_ASYNC':
            return {
                ...state
            };
            
        case 'LOGIN_ASYNC' : 
            if(state.adminsList.includes(action.payload.email)) {
                state.isAdmin = true;
            } else {
                state.isAdmin = false;
            }
            return {
                ...state,
                loggedInUser: action.payload,
                loginStatus: true,
                signUpStatus: false
            }

        case 'LOGIN_ERROR_ASYNC' : 
            return {
                ...state,
                error: action.payload.message,
                loginStatus: false
            }

        case 'VISA_FORM_ASYNC' : 
            return {
                ...state,
                visaFormData: action.payload
            }

        case 'LOGOUT_ASYNC' : 
            return {
                ...state,
                loginStatus: false
            }

        case 'ADMIN_UPLOADS_ASYNC' :
            return {
                ...state,
                adminUploads: Object.assign(state.adminUploads, action.payload)
            }

        case 'SET_EMPLOYEE_DATA_ASYNC' :
            return {
                ...state,
                employeeData: action.payload
            }

        default: 
            return state;
    }
}; 