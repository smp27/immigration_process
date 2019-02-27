import * as Types from './types';

export const login = (loginCredentials) => ({
    type: Types.LOGIN,
    payload: loginCredentials
});

export const visaForm = (formData) => ({
    type: Types.VISA_FORM,
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

export const getEmployeeList = () => ({
    type: Types.GET_EMPLOYEE_LIST
});