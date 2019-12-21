// ▶ Import react dependecies
import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';

import {
  doCreateUserWithEmailAndPassword,
  doSignInWithEmailAndPassword,
  doSignOut,
} from '../lib/Firebase';

// ▶ Create context
const AuthContext = React.createContext();

// ▶ Create provider
const AuthProvider = props => {
  const { children } = props;
  const [user, setUser] = useState(null);
  const [signupError, setSignupError] = useState(null);
  const [loginError, setLoginError] = useState(null);
  const [logoutError, setLogoutError] = useState(null);

  // NOTE: Regístratar usuario
  async function signup(email, password) {
    await doCreateUserWithEmailAndPassword(email, password)
      .then(result => {
        setUser(result);
      })
      .catch(error => {
        setSignupError(error);
      });
  }

  // NOTE: Iniciar sesión
  async function login(email, password) {
    await doSignInWithEmailAndPassword(email, password)
      .then(result => {
        setUser(result);
      })
      .catch(error => {
        setLoginError(error);
      });
  }

  // NOTE: Cerrar sesión
  async function logout() {
    await doSignOut()
      .then(() => {
        setUser(null);
      })
      .catch(error => {
        setLogoutError(error);
      });
  }

  async function clearLoginError() {
    setLoginError(null);
  }

  const value = useMemo(() => {
    return {
      user,
      signupError,
      loginError,
      logoutError,
      signup,
      login,
      logout,
      clearLoginError,
    };
  }, [user, signupError, loginError, logoutError]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element]),
};

AuthProvider.defaultProps = {
  children: PropTypes.element,
};

const useAuthConsumer = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthConsumer must be within the AuthContext provider');
  }
  return context;
};

export { AuthProvider, useAuthConsumer };
