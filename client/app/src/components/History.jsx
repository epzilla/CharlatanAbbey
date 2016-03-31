'use strict';

import React from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import moment from 'moment-timezone';
import Swipeable from 'react-swipeable';
import EventStore from '../stores/event-store';
import { EventTypes } from '../constants/constants';

const FeedingCell = React.createClass({

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  _edit: function () {
    this.context.router.push('/edit/' + this.props.feeding._id);
  },

  render: function () {
    let feeding = this.props.feeding;
    let amount, diaper, burp, meds, spit, nap;

    if (feeding.diaper) {
      diaper = <li>{ _.capitalize(feeding.diaper) } diaper</li>;
    }

    if (feeding.burp) {
      burp = <li>{ _.capitalize(feeding.burp) } burp</li>;
    }

    if (feeding.medicine) {
      meds = <li>{ _.capitalize(feeding.medicine) }</li>;
    }

    if (feeding.spit) {
      spit = <li>{ _.capitalize(feeding.spit) } spit</li>;
    }

    if (feeding.amount) {
      amount = <li>Drank { feeding.amount }oz.</li>;
    }

    if (feeding.eventType === EventTypes.NAP) {
      let napStart = feeding.startTime ? moment(feeding.startTime).format('h:mma') : null;
      let napEnd = feeding.startTime ? moment(feeding.endTime).format('h:mma') : null;
      let duration = feeding.duration || napEnd.diff(napStart, 'minutes');
      let formattedDuration = moment.duration(duration, 'minutes').asHours().toFixed(2) + ' hr.';
      nap = (
        <li>Napped from {napStart} to {napEnd} (<em>{formattedDuration}</em>)</li>
      );
    }

    return (
      <div className="cell">
        <h5>{ moment(feeding.time).format('M/DD - h:mma') }</h5>
        <ul>
          {amount}
          {diaper}
          {meds}
          {burp}
          {spit}
          {nap}
        </ul>
        <button className="btn btn-edit-cell" onClick={this._edit}>
          <i className="fa fa-edit"></i> Edit
        </button>
      </div>
    );
  }
});

const FeedingCol = React.createClass({
  render: function () {
    let feedingData = this.props.feedings;
    let name = this.props.feedings[0].name;

    let feedings = feedingData.map(function (feeding) {
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

const History = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  _onChange: function () {
    this.setState({
      events: EventStore.getEverything()
    });
  },

  _swipedRight: function () {
    this.context.router.push('/');
  },

  _setTimeFilter: function (e) {
    this.setState({
      timeFilter: e.target.value
    }, function () {
    });
  },

  _setTypeFilter: function (e) {
    this.setState({
      typeFilter: e.target.value
    }, function () {
    });
  },

  getInitialState: function () {
    return {
      events: EventStore.getEverything(),
      timeFilter: 'lastDay',
      typeFilter: 'feedings'
    };
  },

  componentDidMount: function () {
    EventStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    EventStore.removeChangeListener(this._onChange);
  },

  render: function () {
    let timeFilter = this.state.timeFilter;
    let typeFilter = this.state.typeFilter;
    let feedingTable = _.map(this.state.events[timeFilter][typeFilter], function (feedingGroup) {
      return (<FeedingCol key={feedingGroup[0]._id} feedings={feedingGroup} />);
    });

    return (
      <section className="right-sheet" id="right-sheet">
        <Swipeable
          onSwipedRight={this._swipedRight}
          delta={100}
        >
          <h2>Event History</h2>
          <Link to="/" className="close-btn flex-center">
            <i className="fa fa-close"></i>
          </Link>
          <h4>Show Me:</h4>
          <section className="type-filter filter-btns">
            <span className='switch'>
              <input type='radio' name='typeFilter' onChange={this._setTypeFilter} defaultChecked={typeFilter === 'feedings'} value='feedings'/>
              <label>Feedings</label>
            </span>
            <span className='switch'>
              <input type='radio' name='typeFilter' onChange={this._setTypeFilter} defaultChecked={typeFilter === 'poops'} value='poops'/>
              <label>Poops</label>
            </span>
            <span className='switch'>
              <input type='radio' name='typeFilter' onChange={this._setTypeFilter} defaultChecked={typeFilter === 'meds'} value='meds'/>
              <label>Medicine</label>
            </span>
            <span className='switch'>
              <input type='radio' name='typeFilter' onChange={this._setTypeFilter} defaultChecked={typeFilter === 'events'} value='events'/>
              <label>All</label>
            </span>
          </section>
          <h4>From:</h4>
          <section className="time-filter filter-btns">
            <span className='switch'>
              <input type='radio' name='timeFilter' onChange={this._setTimeFilter} defaultChecked={timeFilter === 'lastDay'} value='lastDay'/>
              <label>Past Day</label>
            </span>
            <span className='switch'>
              <input type='radio' name='timeFilter' onChange={this._setTimeFilter} defaultChecked={timeFilter === 'lastWeek'} value='lastWeek'/>
              <label>Past Week</label>
            </span>
            <span className='switch'>
              <input type='radio' name='timeFilter' onChange={this._setTimeFilter} defaultChecked={timeFilter === 'all'} value='all'/>
              <label>All</label>
            </span>
          </section>
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

export default History;
