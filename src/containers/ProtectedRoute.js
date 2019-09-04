import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { user } = useContext(AuthContext);
  return (
    <React.Fragment key="ProtectedRoute">
      <Route
        {...rest}
        render={props =>
          user ? <Component {...props} /> : <Redirect to={{ pathname: '/signinform' }} />
        }
      />
    </React.Fragment>
  );
};

ProtectedRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
};

export default ProtectedRoute;
