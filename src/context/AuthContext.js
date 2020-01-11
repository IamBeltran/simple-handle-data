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
    const handleListener = (event, listener) => setUser(listener);
    ipcRenderer.on('login-reply-success', handleListener);
    return () => {
      ipcRenderer.removeListener('login-reply-success', handleListener);
    };
  }, [user]);

  useEffect(() => {
    const handleListener = (event, listener) => setUser(listener);
    ipcRenderer.on('login-reply-error', handleListener);
    return () => {
      ipcRenderer.removeListener('login-reply-error', handleListener);
    };
  }, [loginError]);

  // NOTE: Cerrar sesión
  async function logout() {
    ipcRenderer.send('logout-send', 'logout');
  }

  useEffect(() => {
    const handleListener = (event, listener) => setUser(listener);
    ipcRenderer.on('logout-reply-success', handleListener);
    return () => {
      ipcRenderer.removeListener('logout-reply-success', handleListener);
    };
  }, [user]);

  useEffect(() => {
    const handleListener = (event, listener) => setLogoutError(listener);
    ipcRenderer.on('logout-reply-error', handleListener);
    return () => {
      ipcRenderer.removeListener('logout-reply-error', handleListener);
    };
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
