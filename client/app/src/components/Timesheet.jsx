/** @jsx React.DOM */
'use strict';

var React = require('react');
var Router = require('react-router');
var Navigation = Router.Navigation;
var Link = Router.Link;
var _ = require('lodash');
var moment = require('moment-timezone');
var cx = require('classnames');
var Table = require('reactabular').Table;
var TimeLogStore = require('../stores/time-log-store');
var Actions = require('../actions/view-actions');

var ClockOutBtn = React.createClass({
  _clockOut: function () {
    Actions.clockOut(this.props.clockOutID, {timeOut: new Date()});
  },

  render: function () {
    return (
      <button key={'clock-in-timesheet'}
        className={this.props.className}
        onClick={this._clockOut}>
        <i className="fa fa-sign-out"></i> Clock Out
      </button>
    );
  }
});

var Timesheet = React.createClass({

  mixins: [ Navigation ],

  getInitialState: function () {
    return {
      timeLogs: TimeLogStore.getTimeLogs(),
      isClockedIn: TimeLogStore.isClockedIn(),
      filter: 'week'
    };
  },

  componentDidMount: function () {
    TimeLogStore.addChangeListener(this._onChange);
    Actions.getTimeLogs();
  },

  componentWillUnmount: function () {
    TimeLogStore.removeChangeListener(this._onChange);
  },

  _onChange: function () {
    this.setState({
      timeLogs: TimeLogStore.getTimeLogs(),
      isClockedIn: TimeLogStore.isClockedIn()
    });
  },

  _clockIn: function () {
    var now = new Date();
    Actions.clockIn({
      date: now,
      timeIn: now
    });
  },

  _clockOut: function () {
    alert('Clocked out!' + this.props.clockOutID);
  },

  _goHome: function () {
    this.transitionTo('/');
  },

  _setFilter: function (e) {
    this.setState({
      filter: e.target.value
    });
  },

  render: function () {

    var clockInBtn, clockOutBtn;
    var filter = this.state.filter;
    var columns = [
      {
        property: 'date',
        header: 'Date',
      },
      {
        property: 'timeIn',
        header: 'Time In',
      },
      {
        property: 'timeOut',
        header: 'Time Out',
      },
      {
        property: 'hours',
        header: 'Hours'
      }
    ];

    if (this.state.isClockedIn) {
      var clockOutID = this.state.timeLogs[0]._id;
      clockOutBtn = (
        <ClockOutBtn key={'clock-out-timesheet'} clockOutID={clockOutID} className='btn feed-btn' />
      );
    } else {
      clockInBtn = (
        <button key={'clock-in-timesheet'}
          className='btn feed-btn'
          onClick={this._clockIn}
          disabled={this.state.isClockedIn}>
          <i className="fa fa-sign-in"></i> Clock In
        </button>
      );
    }

    return (
      <section className='modal-sheet timesheet'>
        <div className="fixed-top">
          <div className="flex-center flex-row">
            <h2>Timesheet</h2>
          </div>
          <div className="filter-btns">
            <span className='switch'>
              <input type='radio' name='filter' onChange={this._setFilter} defaultChecked={filter === 'week'} value='week'/>
              <label>Week</label>
            </span>
            <span className='switch'>
              <input type='radio' name='filter' onChange={this._setFilter} defaultChecked={filter === 'month'} value='month'/>
              <label>Month</label>
            </span>
            <span className='switch'>
              <input type='radio' name='filter' onChange={this._setFilter} defaultChecked={filter === 'all'} value='all'/>
              <label>All</label>
            </span>
          </div>
        </div>
        <div className="middle">
          <div className="flex-center flex-row">
            <Table className="timesheet-table" columns={columns} data={this.state.timeLogs} />
          </div>
        </div>
        <div key={'div-timesheet-action-sheet'} className="fixed-bottom translucent-bg flex-center flex-col">
          <div key={'div-timesheet-quick-btns'} className='timesheet-btn-container flex-center flex-row'>
            {clockInBtn}
            {clockOutBtn}
            <button className="btn home-btn feed-btn"
              onClick={this._goHome}>
              <i className="fa fa-home"></i> Home
            </button>
          </div>
        </div>
      </section>
    );
  }
});

module.exports = Timesheet;