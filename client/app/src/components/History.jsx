/** @jsx React.DOM */
'use strict';

var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var Navigation = Router.Navigation;
var EventStore = require('../stores/event-store');
var _ = require('lodash');
var moment = require('moment-timezone');
var Swipeable = require('react-swipeable');

var FeedingCell = React.createClass({
  render: function () {
    var feeding = this.props.feeding;

    return (
      <div className="cell">
        <h5>{ moment(feeding.time).format('M/DD - h:mma') }</h5>
        <ul>
          <li>Drank { feeding.amount }oz.</li>
          <li>{ _.capitalize(feeding.diaper) } diaper</li>
          <li>{ _.capitalize(feeding.burp) } burp</li>
          <li>{ _.capitalize(feeding.medicine) }</li>
          <li>{ _.capitalize(feeding.spit) } spit-up</li>
        </ul>
      </div>
    );
  }
});

var FeedingCol = React.createClass({
  render: function () {
    var feedingData = this.props.feedings;
    var name = this.props.feedings[0].name;

    var feedings = feedingData.map(function (feeding) {
      return (<FeedingCell key={feeding._id} feeding={feeding} />);
    });

    return (
      <section className="column">
        <div className="cell cell-header">
          <h3>{ name }</h3>
        </div>
        {feedings}
      </section>
    );
  }
});

var History = React.createClass({
  mixins: [ Navigation ],

  _onChange: function () {
    this.setState({
      feedings: EventStore.getFeedings()
    });
  },

  _swipedRight: function () {
    this.transitionTo('/');
  },

  getInitialState: function () {
    return {
      feedings: EventStore.getFeedings()
    };
  },

  componentDidMount: function () {
    EventStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    EventStore.removeChangeListener(this._onChange);
  },

  render: function () {
    var feedingTable = _.map(this.state.feedings, function (feedingGroup) {
      return (<FeedingCol key={feedingGroup[0]._id} feedings={feedingGroup} />);
    });

    return (
      <section className="right-sheet" id="right-sheet">
        <Swipeable
          onSwipedRight={this._swipedRight}
          delta={1}
        >
          <h2>Feeding History</h2>
          <Link to="/" className="close-btn close-btn-fixed flex-center">
            <i className="fa fa-close"></i>
          </Link>
          <section id="feeding-list">
            <article className="table">
              {feedingTable}
            </article>
          </section>
        </Swipeable>
      </section>
    );
  }
});

module.exports = History;
