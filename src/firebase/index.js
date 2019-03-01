import * as firebase from 'firebase';

// Initialize Firebase

// Shaik FireBase
const config = {
    apiKey: "AIzaSyCkob_ADW5U86OBRoFu_7WmyYn8lmMuuY8",
    authDomain: "immigration-portal.firebaseapp.com",
    databaseURL: "https://immigration-portal.firebaseio.com",
    projectId: "immigration-portal",
    storageBucket: "immigration-portal.appspot.com",
    messagingSenderId: "893894800074"
};

// Sandeep Firebase
// var config = {
//     apiKey: "AIzaSyCrazwk02jnnmAVuG3hRrYxffHkZo8A8r8",
//     authDomain: "reliable-immigration-form.firebaseapp.com",
//     databaseURL: "https://reliable-immigration-form.firebaseio.com",
//     projectId: "reliable-immigration-form",
//     storageBucket: "reliable-immigration-form.appspot.com",
//     messagingSenderId: "935012316564"
// };

firebase.initializeApp(config);

const auth = firebase.auth();

const db = firebase.database();

const storage = firebase.storage();

export { 
    auth, 
    db, 
    storage 
};