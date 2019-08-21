import React from 'react';
import { Route, Switch } from 'react-router-dom';
import CollectionForm from '../components/CollectionForm';
import FAQ from '../components/FAQ';
import SignInForm from '../components/SignInForm';
import ProtectedRoute from './ProtectedRoute';

const ReactRouter = () => {
  return (
    <React.Fragment key="reactrouter">
      <Switch>
        <ProtectedRoute exact path="/" component={CollectionForm} />
        <ProtectedRoute exact path="/faq" component={FAQ} />
        <Route exact path="/signinform" component={SignInForm} />
      </Switch>
    </React.Fragment>
  );
};

export default ReactRouter;
