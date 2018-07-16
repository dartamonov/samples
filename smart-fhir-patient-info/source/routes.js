import React from 'react';
import { Route, Switch } from 'react-router';

import HomePage from './containers/HomePage.jsx';
import PatientPage from './containers/PatientPage.jsx';

export default (
  <Switch>
    <Route path="/patient/:id" component={PatientPage} />
    <Route path="/patient" component={PatientPage} />
    <Route path="/" component={HomePage} />
  </Switch>
);
