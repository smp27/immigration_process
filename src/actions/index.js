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