import { takeLatest, put, call, take, fork, all } from 'redux-saga/effects';
import * as Types from '../actions/types';
import { eventChannel } from 'redux-saga';
import { auth, storage, db } from '../firebase';
import { doSignOut } from '../firebase/auth';

const database = db;

const loginUserServiceCall = (email, password) => {
    return auth.signInWithEmailAndPassword(email, password);
};

const LogoutUserServiceCall = () => {
    return doSignOut();
}

const fileUploadServiceCall = (firstName, lastName, file) => {
    // Uploading Files to Employee Folder
    storage.ref(firstName + ' ' + lastName + '/' + 'Employee' + '/' + file.name)
        .put(file)
            .then(function(snapshot) {
                console.log(snapshot);
            })
            .catch(function(err) {
                console.log(err);
            });

}

const signUpServiceCall = (email, password) => {
    return auth.createUserWithEmailAndPassword(email, password);
};

const forgotPasswordServiceCall = (email) => {
    return auth.sendPasswordResetEmail(email);
};

function* loginAsync(action) {
    try{
        console.log('login async saga');
        const response = yield call(loginUserServiceCall, action.payload.email, action.payload.password);
        console.log(response);
        if(response.user){
            yield put({
                type: 'LOGIN_ASYNC',
                payload: action.payload
            });
        }
    } catch(e) {
        // console.log(e);
        console.log('login error async saga');
        yield put({
            type: 'LOGIN_ERROR_ASYNC',
            payload: e
        });
    }
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
    const response = yield call(LogoutUserServiceCall);
    yield put({
        type: 'LOGOUT_ASYNC',
        payload: response
    });
}

function* fileUploadAsync(action) {
    console.log('File upload async saga');
    const response = yield call(fileUploadServiceCall, action.payload.firstName, action.payload.lastName, action.payload.file);
    console.log(response);
}

function insertNewEmployee(item) {
    const newItemRef = database.ref('employeesList').push();
    return newItemRef.set(item);
}

function* createEmpItemSaga() {
    console.log('createEmpItemSaga');
    const action = yield take(Types.VISA_FORM);
    try {
        const response = yield call(insertNewEmployee, action.payload);
        yield put({
            type: 'VISA_FORM_ASYNC',
            payload: response
        });
       // yield put(createTaskServerSuccess(response));
        //yield put({ type: Types.CREATE_TASK_SERVER_RESPONSE_SUCCESS, response });
    } catch (error) {
        console.log(error);
      //yield put(createTaskServerFailure(error));
        // do something with the error, such as dispatching an error action with yield put
    }
}

function createEventChannelToGetData(){

    database.ref('employeesList/').on('value', function(snapshot){
        snapshot.forEach(function(childSnapshot){
            console.log(childSnapshot.val());
        })
    });

    // const listener = eventChannel(
    //     emit => {
    //         database.ref('employeesList')
    //         .on('value', data => emit(data.val()));
    //             return () => database.ref('employeesList').off(listener);
    //     }
    // );
    // return listener;
}
  
// Get Incentive Transaction List
function* getEmployeesList(){
    console.log('Get employee list');
    const getDataChannel = yield call(createEventChannelToGetData());
    while(true) {
        const response = yield take(getDataChannel);
        console.log(response);
        if(response){
            yield put({type: Types.GET_EMPLOYEE_LIST_SUCCESS, response});    
        }   
    }
}

function* signUpAsync(action) {
    try{
        console.log('Sign up async saga');
        const response = yield call(signUpServiceCall, action.payload.email, action.payload.password);
        console.log(response);
        yield put({type: 'SIGN_UP_ASYNC', payload: action.payload});
    }
    catch(e) {
        console.log(e);
        yield put({type: 'SIGN_UP_ERROR', payload: e});
    }
}

function* forgotPasswordAsync(action) {
    console.log('Forgot password async saga');
    const response = yield call(forgotPasswordServiceCall, action.payload);
    console.log(response);
    // yield put({type: 'FORGOT_PASSWORD_ASYNC', payload: action.payload});
}

export function* rootSaga() {
    yield takeLatest(Types.LOGIN, loginAsync);
    // yield takeLatest(Types.VISA_FORM, visaFormAsync);
    yield takeLatest(Types.LOGOUT, logoutAsync);
    yield takeLatest(Types.FILE_UPLOAD, fileUploadAsync);
    yield takeLatest(Types.SIGN_UP, signUpAsync);
    yield takeLatest(Types.FORGOT_PASSWORD, forgotPasswordAsync);
    yield fork(createEmpItemSaga);
    yield all([takeLatest(Types.GET_EMPLOYEE_LIST, getEmployeesList)]);
}
