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
    var feedingsInfo;

    if (_.isEmpty(this.state.feedings)) {
      feedingsInfo = (
        <div className="no-feedings">
          <h1>¯\_(ツ)_/¯</h1>
          <h3>
            Looks like you haven’t logged any feedings yet. When you do, the most
            recent ones will show up here on the home screen. Whenever you’re ready,
            go ahead and start logging down here!
          </h3>
          <div className="big-downward-arrow"></div>
        </div>
      );
    } else {
      feedingsInfo = _.map(this.state.feedings, function (feeding) {
        return <FeedingInfo key={feeding._id} feeding={feeding} />;
      });
    }

    return (
      <article className='home-screen'>
        <section className="baby-info">
          { feedingsInfo }
        </section>
        <ActionButtons babies={this.props.babies}/>
      </article>
    );
  }
});

module.exports = Home;
