import firebase from 'firebase';

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

export default firebase;