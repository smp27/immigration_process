import * as firebase from 'firebase';

// Initialize Firebase
const config = {
    apiKey: "AIzaSyCkob_ADW5U86OBRoFu_7WmyYn8lmMuuY8",
    authDomain: "immigration-portal.firebaseapp.com",
    databaseURL: "https://immigration-portal.firebaseio.com",
    projectId: "immigration-portal",
    storageBucket: "immigration-portal.appspot.com",
    messagingSenderId: "893894800074"
};
firebase.initializeApp(config);

const db = firebase.firestore();
const storage = firebase.storage().ref();
const storageRef = storage.child('user_images');

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
        case 'VISA_FORM_ASYNC' : 
            console.log('Visa form async reducer');
            console.log(action.payload);
            var file = action.payload;
            storageRef.put(file).then(function(snapshot) {
                console.log('Uploaded a blob or file!');
            });
            // storageRef.child('user_images').put(action.payload)
            //     .then(function(response){
            //         console.log(response);
            //     })
            //     .catch(function(error){
            //         console.log(error);
            //     });
            break;
        case 'LOGOUT_ASYNC' : 
            console.log('logout async reducer');
            return {
                ...state,
                loginStatus: false
            }
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
        default: 
            console.log('default reducer');

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


            return state;
    }
}; 