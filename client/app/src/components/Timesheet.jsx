'use strict';

var React = require('react');
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
      pointer: this.props.options.length - 1,
    };
  },

  componentWillReceiveProps: function (nextProps) {
    if (!_.isEqual(this.props.options, nextProps.options)) {
      this.setState({
        currentStep: nextProps.options[nextProps.options.length - 1],
        pointer: nextProps.options.length - 1
      });
    }
  },

  _prev: function () {
    var ptr = this.state.pointer;
    if (ptr !== 0) {
      var newPtr = this.state.pointer - 1;
      this.setState({
        pointer: newPtr,
        currentStep: this.props.options[newPtr]
      }, function () {
        this.props.onChange(this.state.currentStep);
      });
    }
  },

  _next: function () {
    var ptr = this.state.pointer;
    if (ptr !== this.props.options.length - 1) {
      var newPtr = this.state.pointer + 1;
      this.setState({
        pointer: newPtr,
        currentStep: this.props.options[newPtr]
      }, function () {
        this.props.onChange(this.state.currentStep);
      });
    }
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

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  getInitialState: function () {
    var now = moment(new Date());
    var thisWeek = now.startOf('week').format('M/D');
    var logs = TimeLogStore.getEverything();

    if (!logs.weekly[thisWeek]) {
      thisWeek = this._findMostRecent(logs.weekly);
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

  _findMostRecent: function (logs) {
    return Object.keys(logs).sort().reverse()[0];
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
    this.context.router.push('/');
  },

  _setFilter: function (e) {
    var filter = e.target.value;
    if (filter === 'all') {
      this.setState({
        timeFilter: filter,
        subFilter: null
      });
    } else {
      this.setState({
        timeFilter: filter,
        subFilter: this._findMostRecent(this.state.timeLogs[filter])
      });
    }

  },

  _setSubFilter: function (val) {
    this.setState({
      subFilter: val
    });
  },

  render: function () {

    var clockInBtn, clockOutBtn, filterStepper, totalHours;
    var filter = this.state.timeFilter;
    var subFilter = this.state.subFilter;

    var dataSet = this.state.timeLogs[filter];
    var specificData = subFilter ? dataSet[subFilter] : dataSet;

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
      var clockOutID = this.state.timeLogs.all[0]._id;
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

    if (filter !== 'all') {
      var totalTime = _.reduce(specificData, function (total, n) {
        return total + n.hours;
      }, 0).toFixed(2);

      filterStepper = <FilterStepper options={Object.keys(dataSet).reverse()} onChange={this._setSubFilter} />;
      totalHours = (
        <div className="text-center">
          <h3>Total: {totalTime} hrs.</h3>
        </div>
      );
    }

    return (
      <section className='modal-sheet timesheet'>
        <div className="fixed-top">
          <div className="flex-center flex-row">
            <h2>Timesheet</h2>
          </div>
          <div className="flex-center flex-row space-between">
            <section className="width-50 text-left">
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
            <section className="width-35 text-right">
              {filterStepper}
            </section>
          </div>
        </div>
        <div className="middle">
          <div className="flex-center flex-row">
            <Table className="timesheet-table" columns={columns} data={specificData} />
          </div>
          {totalHours}
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