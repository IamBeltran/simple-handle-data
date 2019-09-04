import React, { useReducer, useContext } from 'react';
import PropTypes from 'prop-types';

const AuthContext = React.createContext({ user: null });

function authReducer(state, action) {
  switch (action.type) {
    case 'SIGN_IN':
      return {
        ...state,
        user: action.payload,
      };
    case 'SIGN_OUT':
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
}

const AuthProvider = props => {
  const initialState = useContext(AuthContext);
  const [state, dispatch] = useReducer(authReducer, initialState);
  const { user } = state;
  const { children } = props;

  return (
    <AuthContext.Provider
      value={{
        state,
        user,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element]),
};

AuthProvider.defaultProps = {
  children: PropTypes.element,
};

const AuthConsumer = AuthContext.Consumer;

const withAuth = Component => props => (
  <AuthContext.Consumer>{state => <Component {...props} context={state} />}</AuthContext.Consumer>
);

export { AuthContext, AuthProvider, AuthConsumer, withAuth };
