import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { useAuthConsumer } from '../context/AuthContext';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { user } = useAuthConsumer();
  return (
    <React.Fragment key="ProtectedRoute">
      <Route
        {...rest}
        render={props =>
          user ? <Component {...props} /> : <Redirect to={{ pathname: '/login' }} />
        }
      />
    </React.Fragment>
  );
};

ProtectedRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
};

export default ProtectedRoute;
