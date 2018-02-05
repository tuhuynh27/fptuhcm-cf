import { firebase, googleAuthProvider } from '../firebase/firebase';

export const login = (uid) => ({
  type: 'LOGIN',
  uid
});

export const startGoogleLogin = () => {
  return () => {
    return firebase.auth().signInWithPopup(googleAuthProvider);
  }
};

export const startEmailLogin = (email, password, callback) => {
  firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
    callback(error);
  });
};

export const startEmailSignup = (email, password, callback) => {
  firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
    callback(error);
  });
};

export const logout = () => ({
  type: 'LOGOUT'
});

export const startLogout = () => {
  return () => {
    return firebase.auth().signOut();
  };
};
