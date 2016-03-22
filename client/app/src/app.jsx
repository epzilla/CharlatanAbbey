'use strict';

var React = require('react/addons');
var _ = require('lodash');
var Router = require('react-router');
var Route = Router.Route;
var Handler = Router.RouteHandler;
var GetStarted = require('./components/GetStarted.jsx');
var Home = require('./components/Home.jsx');
var History = require('./components/History.jsx');
var Log = require('./components/Log.jsx');
var Edit = require('./components/Edit.jsx');
var Timesheet = require('./components/Timesheet.jsx');
var API = require('./utils/api');
var ls = require('./utils/local-storage');
var CSSTransitionGroup = React.addons.CSSTransitionGroup;

var App = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },

  render: function () {
    var name = this.context.router.getCurrentPath();
    return (
      <CSSTransitionGroup transitionName="routechange" >
        <Handler key={name}/>
      </CSSTransitionGroup>
    );
  }
});

var routes = (
  <Route handler={App} location="history">
    <Route name="home" path="/" handler={Home}/>
    <Route name="get-started" path="/get-started" handler={GetStarted}/>
    <Route name="history" path="/history" handler={History}/>
    <Route name="log-event" path="/log-event/:id" handler={Log}/>
    <Route name="timesheet" path="/timesheet" handler={Timesheet}/>
    <Route name="edit" path="/edit/:logEvent" handler={Edit}/>
  </Route>
);

document.addEventListener('DOMContentLoaded', function () {
  var babies = ls.get('babies');
  if (!_.isEmpty(babies)) {
    var babyIDs = _.map(babies, '_id');
    API.getEvents(babyIDs);
    API.getTimeLogs(babyIDs);
  }
  Router.run(routes, Router.HistoryLocation, function (Handler) {
    React.render(<Handler/>, document.body);
  });
});
