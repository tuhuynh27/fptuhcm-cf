import * as firebase from 'firebase';

const config = {
  apiKey: "AIzaSyDP3ohWzIssHspnWcCvXdpUDsRzvjAcbAA",
  authDomain: "boiler-plate-1371f.firebaseapp.com",
  databaseURL: "https://boiler-plate-1371f.firebaseio.com",
  projectId: "boiler-plate-1371f",
  storageBucket: "boiler-plate-1371f.appspot.com",
  messagingSenderId: "292520951559"
};

firebase.initializeApp(config);

const database = firebase.database();
const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export { firebase, googleAuthProvider, database };
