import React from 'react';
import { Route, Switch } from 'react-router-dom';
import CollectionForm from '../components/CollectionForm';
import FAQ from '../components/FAQ';
import Login from '../components/Login';
import ProtectedRoute from './ProtectedRoute';

const ReactRouter = () => {
  return (
    <React.Fragment key="reactrouter">
      <Switch>
        <ProtectedRoute exact path="/" component={CollectionForm} />
        <ProtectedRoute exact path="/faq" component={FAQ} />
        <Route exact path="/login" component={Login} />
      </Switch>
    </React.Fragment>
  );
};

export default ReactRouter;
