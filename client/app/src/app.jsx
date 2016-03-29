'use strict';

var React = require('react');
import { render } from 'react-dom';
var CSSTransitionGroup = require('react-addons-css-transition-group');
var _ = require('lodash');
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
var GetStarted = require('./components/GetStarted.jsx');
var Home = require('./components/Home.jsx');
var History = require('./components/History.jsx');
var Log = require('./components/Log.jsx');
var Edit = require('./components/Edit.jsx');
var Timesheet = require('./components/Timesheet.jsx');
import * as API from './utils/api';
import ls from './utils/local-storage';

var App = React.createClass({
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
  var babies = ls.get('babies');
  if (!_.isEmpty(babies)) {
    var babyIDs = _.map(babies, '_id');
    API.getEvents(babyIDs);
    API.getTimeLogs(babyIDs);
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
      </Route>
    </Router>
  ), document.getElementById('reaction'))
});
