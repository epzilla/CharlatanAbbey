/** @jsx React.DOM */
'use strict';

var React = require('react');
var _ = require('lodash');
var Actions = require('../actions/view-actions');
var FeedingInfo = require('./FeedingInfo.jsx');
var EventStore = require('../stores/event-store');
var TimeLogStore = require('../stores/time-log-store');
var ActionButtons = require('./ActionButtons.jsx');

var Home = React.createClass({
  getInitialState: function () {
    return {
      babyIDs: _.map(this.props.babies, '_id'),
      feedings: EventStore.getLatestFeedings(),
      timeLogs: TimeLogStore.getTimeLogs()
    };
  },

  _onChange: function () {
    this.setState({
      feedings: EventStore.getLatestFeedings(),
    });
  },

  componentDidMount: function () {
    EventStore.addChangeListener(this._onChange);
    Actions.getEvents(this.state.babyIDs);
    Actions.getTimeLogs(this.state.babyIDs);
  },

  componentWillUnmount: function () {
    EventStore.removeChangeListener(this._onChange);
  },

  render: function () {
    var feedings = _.map(this.state.feedings, function (feeding) {
      return <FeedingInfo key={feeding._id} feeding={feeding} />;
    });

    return (
      <article className='home-screen'>
        <section className="baby-info">
          { feedings }
        </section>
        <ActionButtons babies={this.props.babies}/>
      </article>
    );
  }
});

module.exports = Home;
