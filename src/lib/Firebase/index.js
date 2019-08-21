/* eslint-disable no-async-promise-executor */
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyDvdE4D32fdjx6zIvRbo_rgNWLWKhn82rs',
  authDomain: 'bd-ift.firebase.com',
  databaseURL: 'https://bd-ift.firebaseio.com',
  projectId: 'bd-ift',
  storageBucket: 'bd-ift.appspot.com',
  messagingSenderId: '101900884488',
  appId: '1:101900884488:web:f28282aec5a1cf17',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const getErrorMessage = error => {
  const { code } = error;
  let message;
  switch (code) {
    case 'auth/email-already-in-use':
      message = 'Ya existe una cuenta con ese correo, intente ingresar otro';
      break;
    case 'auth/invalid-email':
      message = 'El formato de correo es incorrecto';
      break;
    case 'auth/operation-not-allowed':
      message = 'No se tiene habilitado el registro por email';
      break;
    case 'auth/weak-password':
      message = 'La contraseña ingresada es muy débil, intente con otra';
      break;
    case 'auth/user-disabled':
      message = 'Usuario desactivado';
      break;
    case 'auth/user-not-found':
      message = 'El correo o contraseña son incorrectos, vuelva a intentar';
      break;
    case 'auth/wrong-password':
      message = 'El correo o contraseña son incorrectos, vuelva a intentar';
      break;
    default:
      message = 'Algo salió mal en la autentificación, vuelva a intentar';
      break;
  }
  return message;
};

const getUser = async user => {
  const userToken = user ? await user.getIdToken() : null;
  return {
    name: user.displayName,
    email: user.email,
    emailVerified: user.emailVerified,
    phoneNumber: user.phoneNumber,
    token: userToken,
  };
};

const doCreateUserWithEmailAndPassword = (email, password) => {
  return new Promise(async (resolve, reject) => {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(async () => {
        const currentUser = await firebase.auth().currentUser;
        const user = await getUser(currentUser);
        return resolve(user);
      })
      .catch(error => {
        const message = getErrorMessage(error);
        return reject(message);
      });
  });
};

const doSignInWithEmailAndPassword = (email, password) => {
  return new Promise(async (resolve, reject) => {
    return firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(async () => {
        const currentUser = await firebase.auth().currentUser;
        const user = await getUser(currentUser);
        return resolve(user);
      })
      .catch(error => {
        const message = getErrorMessage(error);
        return reject(message);
      });
  });
};

const doSignOut = () => {
  return new Promise(async (resolve, reject) => {
    return firebase
      .auth()
      .signOut()
      .then(async () => {
        return resolve(true);
      })
      .catch(error => {
        return reject(error);
      });
  });
};

export { doCreateUserWithEmailAndPassword, doSignInWithEmailAndPassword, doSignOut };
