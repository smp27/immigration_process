const initialState = {
    loggedInUser: {},
    visaFormData: {},
    loginStatus : false,
    image: []
};

export default function(state = initialState, action) {
    // console.log(action);
    switch(action.type) {
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