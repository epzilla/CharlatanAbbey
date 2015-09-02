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

var FilterStepper = React.createClass({
  getInitialState: function () {
    return {
      currentStep: this.props.options[this.props.options.length - 1],
      options: this.props.options,
      pointer: this.props.options.length - 1,
      moreNext: false,
      morePrev: this.props.options.length > 1
    };
  },

  _prev: function () {
    var newPtr = this.state.pointer - 1;
    this.setState({
      pointer: newPtr,
      currentStep: this.state.options[newPtr]
    }, function () {
      this.props.onChange(this.state.currentStep);
    });
  },

  _next: function () {
    var newPtr = this.state.pointer + 1;
    this.setState({
      pointer: newPtr,
      currentStep: this.state.options[newPtr]
    }, function () {
      this.props.onChange(this.state.currentStep);
    });
  },

  render: function () {
    return (
      <div className="filter-stepper flex-right flex-row">
        <button className="btn btn-filter-stepper btn-prev" onClick={this._prev}>
          <i className="fa fa-angle-left"></i>
        </button>
        <h4>{this.state.currentStep}</h4>
        <button className="btn btn-filter-stepper btn-next" onClick={this._next}>
          <i className="fa fa-angle-right"></i>
        </button>
      </div>
    );
  }
});

var Timesheet = React.createClass({

  mixins: [ Navigation ],

  getInitialState: function () {
    var now = moment(new Date());
    var thisWeek = now.startOf('week').format('M/D');
    var logs = TimeLogStore.getEverything();

    if (!logs.weekly[thisWeek]) {
      thisWeek = this._findMostRecentWeek(logs.weekly);
    }

    return {
      timeLogs: logs,
      isClockedIn: TimeLogStore.isClockedIn(),
      timeFilter: 'weekly',
      subFilter: thisWeek
    };
  },

  componentDidMount: function () {
    TimeLogStore.addChangeListener(this._onChange);
    Actions.getTimeLogs();
  },

  componentWillUnmount: function () {
    TimeLogStore.removeChangeListener(this._onChange);
  },

  _findMostRecentWeek: function (weeklyLogs) {
    return Object.keys(weeklyLogs).sort().reverse()[0];
  },

  _onChange: function () {
    this.setState({
      timeLogs: TimeLogStore.getEverything(),
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
      timeFilter: e.target.value
    });
  },

  _setSubFilter: function (val) {
    this.setState({
      subFilter: val
    });
  },

  render: function () {

    var clockInBtn, clockOutBtn;
    var filter = this.state.timeFilter;
    var subFilter = this.state.subFilter;

    var dataSet = this.state.timeLogs[filter];
    var specificData = dataSet[subFilter];

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
          <div className="flex-center flex-row">
            <section className="width-50">
              <div className="filter-btns">
                <span className='switch'>
                  <input type='radio' name='filter' onChange={this._setFilter} defaultChecked={filter === 'weekly'} value='weekly'/>
                  <label>Week</label>
                </span>
                <span className='switch'>
                  <input type='radio' name='filter' onChange={this._setFilter} defaultChecked={filter === 'monthly'} value='monthly'/>
                  <label>Month</label>
                </span>
                <span className='switch'>
                  <input type='radio' name='filter' onChange={this._setFilter} defaultChecked={filter === 'all'} value='all'/>
                  <label>All</label>
                </span>
              </div>
            </section>
            <section className="width-50">
              <FilterStepper options={Object.keys(dataSet).reverse()} onChange={this._setSubFilter} />
            </section>
          </div>
        </div>
        <div className="middle">
          <div className="flex-center flex-row">
            <Table className="timesheet-table" columns={columns} data={specificData} />
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