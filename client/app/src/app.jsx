'use strict';

import React from 'react';
import { render } from 'react-dom';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import _ from 'lodash';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import GetStarted from './components/GetStarted.jsx';
import Home from './components/Home.jsx';
import History from './components/History.jsx';
import Log from './components/Log.jsx';
import Edit from './components/Edit.jsx';
import Timesheet from './components/Timesheet.jsx';
import Settings from './components/Settings.jsx';
import SettingsTimesheet from './components/SettingsTimesheet.jsx';
import SettingsSolidFoods from './components/SettingsSolidFoods.jsx';
import SettingsCaretakers from './components/SettingsCaretakers.jsx';
import SettingsNames from './components/SettingsNames.jsx';
import SettingsFeeding from './components/SettingsFeeding.jsx';
import API from './utils/api';
import ls from './utils/local-storage';

const App = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  render: function () {
    return (
      <CSSTransitionGroup
        transitionName="routechange"
        transitionEnterTimeout={0}
        transitionLeaveTimeout={0}>
        {React.cloneElement(this.props.children, {
          key: this.props.location.pathname
        })}
      </CSSTransitionGroup>
    );
  }
});

document.addEventListener('DOMContentLoaded', function () {
  let babies = ls.get('babies');
  if (!_.isEmpty(babies)) {
    let babyIDs = _.map(babies, '_id');
    API.getEvents(babyIDs);
    API.getTimeLogs(babyIDs);
    API.getFoodTypes();
  }

  render((
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Home}/>
        <Route path="/get-started" component={GetStarted}/>
        <Route path="/history" component={History}/>
        <Route path="/log-event/:id" component={Log}/>
        <Route path="/timesheet" component={Timesheet}/>
        <Route path="/edit/:logEvent" component={Edit}/>
        <Route path="/settings" component={Settings}/>
        <Route path="/settings/timesheet" component={SettingsTimesheet}/>
        <Route path="/settings/solids" component={SettingsSolidFoods}/>
        <Route path="/settings/caretakers" component={SettingsCaretakers}/>
        <Route path="/settings/names" component={SettingsNames}/>
        <Route path="/settings/feedings" component={SettingsFeeding}/>
      </Route>
    </Router>
  ), document.getElementById('reaction'))
});
