import { takeLatest, put } from 'redux-saga/effects';
import * as Types from '../actions/types';

function* loginAsync(action) {
    console.log('login async saga');
    yield put({
        type: 'LOGIN_ASYNC',
        payload: action.payload
    });
}

function* visaFormAsync(action) {
    console.log('visa form async saga');
    yield put({
        type: 'VISA_FORM_ASYNC',
        payload: action.payload
    });
}

function* logoutAsync() {
    console.log('logout async saga');
    yield put({
        type: 'LOGOUT_ASYNC'
    });
}

export function* rootSaga() {
    yield takeLatest(Types.LOGIN, loginAsync);
    yield takeLatest(Types.VISA_FORM, visaFormAsync);
    yield takeLatest(Types.LOGOUT, logoutAsync);
}