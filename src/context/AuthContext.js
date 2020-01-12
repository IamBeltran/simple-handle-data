// ▶ Import react dependecies
import React, { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';

// ▶ Create context
const AuthContext = React.createContext();

// ▶ Import Electron
const { electron } = window;
const { ipcRenderer } = electron;

// ▶ Create provider
const AuthProvider = props => {
  const { children } = props;
  const [user, setUser] = useState(null);
  const [loginError, setLoginError] = useState(null);
  const [logoutError, setLogoutError] = useState(null);

  // NOTE: Regístratar usuario

  // NOTE: Iniciar sesión
  async function login(email, password) {
    ipcRenderer.send('login-send', { email, password });
  }

  useEffect(() => {
    ipcRenderer.on('login-reply-success', (event, listener) => setUser(listener));
    return () => ipcRenderer.removeAllListeners(['login-reply-success']);
  }, [user]);

  useEffect(() => {
    ipcRenderer.on('login-reply-error', (event, listener) => setLoginError(listener));
    return () => ipcRenderer.removeAllListeners(['login-reply-error']);
  }, [loginError]);

  // NOTE: Cerrar sesión
  async function logout() {
    ipcRenderer.send('logout-send', 'logout');
  }

  useEffect(() => {
    ipcRenderer.on('logout-reply-success', (event, listener) => setUser(listener));
    return () => ipcRenderer.removeAllListeners(['logout-reply-success']);
  }, [user]);

  useEffect(() => {
    ipcRenderer.on('logout-reply-error', (event, listener) => setLogoutError(listener));
    return () => ipcRenderer.removeAllListeners(['logout-reply-error']);
  }, [logoutError]);

  async function clearLoginError() {
    setLoginError(null);
  }

  async function clearLogoutError() {
    setLogoutError(null);
  }

  const value = useMemo(() => {
    return {
      user,
      loginError,
      logoutError,
      login,
      logout,
      clearLoginError,
      clearLogoutError,
    };
  }, [user, loginError, logoutError]);

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
