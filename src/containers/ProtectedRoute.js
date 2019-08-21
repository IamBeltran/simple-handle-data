import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { AuthConsumer } from '../context/AuthContext';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  return (
    <AuthConsumer>
      {({ user }) => (
        <Route
          {...rest}
          render={props =>
            user ? <Component {...props} /> : <Redirect to={{ pathname: '/signinform' }} />
          }
        />
      )}
    </AuthConsumer>
  );
};

ProtectedRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
};

export default ProtectedRoute;
