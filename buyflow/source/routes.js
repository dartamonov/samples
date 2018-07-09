import React from 'react';
import { Route, Switch } from 'react-router';

import VideoPage from './containers/VideoPage.jsx';
import ReviewPage from './containers/ReviewPage.jsx';

export default (
  <Switch>
    <Route path="/video" component={VideoPage} />
    <Route path="/review" component={ReviewPage} />
    <Route component={VideoPage} />
  </Switch>
);
