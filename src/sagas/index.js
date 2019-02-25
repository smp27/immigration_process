import { takeLatest, put, call } from 'redux-saga/effects';
import * as Types from '../actions/types';
import { auth } from '../firebase';
import { doSignOut } from '../firebase/auth';

const loginUserServiceCall = (email, password) => {
    return auth.signInWithEmailAndPassword(email, password);
};

const LogoutUserServiceCall = () => {
    return doSignOut();
}

function* loginAsync(action) {
    console.log('login async saga');
    const response = yield call(loginUserServiceCall, action.payload.email, action.payload.password);
    yield put({
        type: 'LOGIN_ASYNC',
        payload: response
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

export function* rootSaga() {
    yield takeLatest(Types.LOGIN, loginAsync);
    yield takeLatest(Types.VISA_FORM, visaFormAsync);
    yield takeLatest(Types.LOGOUT, logoutAsync);
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
