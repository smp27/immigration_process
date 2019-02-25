import firebase from './firebase';

// Sign Up
export const doCreateUserWithEmailAndPassword = (email, password) =>
    firebase.auth.createUserWithEmailAndPassword(email, password);

// Sign In
export const doSignInWithEmailAndPassword = (email, password) =>
    firebase.auth.signInWithEmailAndPassword(email, password);

// Sign out
export const doSignOut = () =>
    firebase.auth.signOut();
  
// Password Reset
export const doPasswordReset = (email) =>
    firebase.auth.sendPasswordResetEmail(email);

// Password Change
export const doPasswordUpdate = (password) =>
    firebase.auth.currentUser.updatePassword(password);
