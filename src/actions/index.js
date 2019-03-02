import * as Types from './types';

export const login = (loginCredentials) => ({
    type: Types.LOGIN,
    payload: loginCredentials
});

export const visaForm = (formData) => ({
    type: Types.VISA_FORM,
    payload: formData
});

export const submitImmiFormAction = (formData) => ({
    type: Types.SUBMIT_IMMI_FORM,
    payload: formData
});

export const logout = () => ({
    type: Types.LOGOUT
});

export const fileUpload = (fileData) => ({
    type: Types.FILE_UPLOAD,
    payload: fileData
});

export const signUp = (signUpData) => ({
    type: Types.SIGN_UP,
    payload: signUpData
});

export const forgotPassword = (email) => ({
    type: Types.FORGOT_PASSWORD,
    payload: email
}); 

export const getListOfEmployees = () => ({
    type: Types.GET_EMPLOYEE_LIST
});

export const getListOfEmployeesSuccessResponse = (data) => ({
    type: Types.GET_EMPLOYEE_LIST_SUCCESS,
    data
});