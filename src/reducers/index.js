const initialState = {
    loggedInUser: {},
    visaFormData: {},
    loginStatus : false,
    image: [],
    getEmployeesList:[]
};

export default function(state = initialState, action) {
    // console.log(action);
    switch(action.type) {
        case 'GET_EMPLOYEE_LIST' :
        return {...state};
        // Below gets the list of Employees
        case 'GET_EMPLOYEE_LIST_SUCCESS':
        return {...state,
            getEmployeesList:Object.assign([], Object.values(action.response))
        };
        case 'VISA_FORM':
            return {...state};
        case 'LOGIN_ASYNC' : 
            console.log('Login async reducer');
            return {
                ...state,
                loggedInUser: action.payload,
                loginStatus: true
            }
        case 'VISA_FORM_ASYNC' : 
            console.log('Visa form async reducer');
            return {
                ...state,
                visaFormData: action.payload
            }
        case 'LOGOUT_ASYNC' : 
            console.log('logout async reducer');
            return {
                ...state,
                loginStatus: false
            }
        default: 
            console.log('default reducer');
            return state;
    }
}; 