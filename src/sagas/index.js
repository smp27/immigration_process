import { takeLatest, put, call, take, fork, all } from 'redux-saga/effects';
import * as Types from '../actions/types';
import { eventChannel } from 'redux-saga';
import { auth, storage, db } from '../firebase';
import { doSignOut } from '../firebase/auth';
import {getListOfEmployeesSuccessResponse} from '../actions';

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

function insertNewImmiForm(item) {
    const newItemRef = database.ref('ImmigrationForm').push();
    return newItemRef.set(item);
}

function* createNewImmiFormItemSaga() {    
    const action = yield take(Types.SUBMIT_IMMI_FORM);
    try {
        const response = yield call(insertNewImmiForm, action.payload);
        
        
            yield put({
                type: Types.SUBMIT_IMMI_FORM_SUCCESS,
                payload: response
            });
        
       
    } catch (error) {
        console.log(error);
    }
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

    // database.ref('employeesList/').on('value', function(snapshot){
    //     snapshot.forEach(function(childSnapshot){
    //         console.log(childSnapshot.val());
    //     })
    // });

    const listener = new eventChannel(
        emit => {
            database.ref('ImmigrationForm')
            .on('value', (data) =>{ 
                console.log(data.val());
                emit(data.val())
            });
            return () => { return database.ref('ImmigrationForm').off(listener) };
        }
    );
    return listener;
}
  
// Get Incentive Transaction List
function* getEmployeesList(){    
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

function* startListener() {
    // #1: Creates an eventChannel and starts the listener;
    const channel = new eventChannel(emiter => {
      const listener = database.ref("ImmigrationForm").on("value", snapshot => {
          emiter({ response: snapshot.val() || {} });
        });
  
      // #2: Return the shutdown method;
      return () => {
        listener.off();
      };
    });
  
    // #3: Creates a loops to keep the execution in memory;
    while (true) {
      const { response } = yield take(channel);
      console.log(response);

      yield put(getListOfEmployeesSuccessResponse(response))
      // #4: Pause the task until the channel emits a signal and dispatch an action in the store;
      //yield put({type: Types.GET_EMPLOYEE_LIST_SUCCESS, data});// this is causing the error.
    }
  }

export function* rootSaga() {
    yield takeLatest(Types.LOGIN, loginAsync);
    // yield takeLatest(Types.VISA_FORM, visaFormAsync);
    yield takeLatest(Types.LOGOUT, logoutAsync);
    yield takeLatest(Types.FILE_UPLOAD, fileUploadAsync);
    yield takeLatest(Types.SIGN_UP, signUpAsync);
    yield takeLatest(Types.FORGOT_PASSWORD, forgotPasswordAsync);
    //yield all([takeLatest(Types.SUBMIT_IMMI_FORM, createNewImmiFormItemSaga)]);
   // yield fork(createEmpItemSaga);
    yield fork(createNewImmiFormItemSaga);
    //yield fork(startListener);    
    yield all([takeLatest(Types.GET_EMPLOYEE_LIST, startListener)]);
}
