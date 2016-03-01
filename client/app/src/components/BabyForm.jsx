/** @jsx React.DOM */
'use strict';

var React = require('react');
var FeedingInfo = require('./FeedingInfo.jsx');
var EventStore = require('../stores/event-store');
var BabyStore = require('../stores/baby-store');
var TimeLogStore = require('../stores/time-log-store');
var ActionButtons = require('./ActionButtons.jsx');

var Home = React.createClass({
  getInitialState: function () {
    return {
      feedings: EventStore.getLatestFeedings(),
      babies: BabyStore.getBabies(),
      timeLogs: TimeLogStore.getTimeLogs()
    };
  },

  _onChange: function () {
    this.setState({
      feedings: EventStore.getLatestFeedings(),
      babies: BabyStore.getBabies()
    });
  },

  componentDidMount: function () {
    EventStore.addChangeListener(this._onChange);
    BabyStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    EventStore.removeChangeListener(this._onChange);
    BabyStore.removeChangeListener(this._onChange);
  },

  render: function () {
    var feedings = [];
    this.state.feedings.forEach(function (feeding) {
      feedings.push( <FeedingInfo key={feeding._id} feeding={feeding} /> );
    });

    return (
      <article className='home-screen'>
        <section className="baby-info">
          { feedings }
        </section>
        <ActionButtons babies={this.state.babies}/>
      </article>
    );
  }
});

module.exports = Home;
