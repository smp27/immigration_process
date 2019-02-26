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

function* loginAsync(action) {
    console.log('login async saga');
    const response = yield call(loginUserServiceCall, action.payload.email, action.payload.password);
    console.log(response);
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
    const listener = eventChannel(
        emit => {
            database.ref('employeesList')
            .on('value', data => emit(data.val()));
                return () => database.ref('employeesList').off(listener);
        }
    );
    return listener;
  }
  
  // Get Incentive Transaction List
  function* getEmployeesList(){
    const getDataChannel = createEventChannelToGetData();
    while(true) {
        const response = yield take(getDataChannel); 
        if(response){
            yield put({type: Types.GET_EMPLOYEE_LIST_SUCCESS, response});    
        }
        
    }
  }

export function* rootSaga() {
    yield takeLatest(Types.LOGIN, loginAsync);
    //yield takeLatest(Types.VISA_FORM, visaFormAsync);
    yield takeLatest(Types.LOGOUT, logoutAsync);
    yield takeLatest(Types.FILE_UPLOAD, fileUploadAsync);
    yield fork(createEmpItemSaga);
    yield all([takeLatest(Types.GET_EMPLOYEE_LIST, getEmployeesList)]);
}


// firebase.auth()
//     .signInWithEmailAndPassword(action.payload.email, action.payload.password)
//         .then(function(response){
//             // Sign-in successful.
//             console.log(response);
//             return {
//                 ...state,
//                 loggedInUser: action.payload,
//                 loggedInUser: true
//             }
//         })
//         .catch(function(error) {
//             // An error happened.
//             console.log(error);
//             return {
//                 ...state,
//                 loggedInUser: false
//             }
//         });
// break;


// var file = action.payload;
// storageRef.put(file).then(function(snapshot) {
//     console.log('Uploaded a blob or file!');
// });
// storageRef.child('user_images').put(action.payload)
//     .then(function(response){
//         console.log(response);
//     })
//     .catch(function(error){
//         console.log(error);
//     });


// firebase.auth()
//     .signOut()
//         .then(function() {
//             // Sign-out successful.
//             return { 
//                 ...state,
//                 loginStatus: false
//              };
//         }).catch(function(error) {
//             // An error happened.
//             return { 
//                 ...state
//              };
//         });
// break;


//write data
// db.collection("users").add({
//     username: "Ada",
//     email: "Lovelace@gmail.com"
// })
// .then(function(docRef) {
//     console.log("Document written with ID: ", docRef.id);
// })
// .catch(function(error) {
//     console.error("Error adding document: ", error);
// });

//read data
// db.collection("users").get().then((querySnapshot) => {
//     querySnapshot.forEach((doc) => {
//         console.log(doc.id);
//         console.log(doc.data());
//     });
// });

