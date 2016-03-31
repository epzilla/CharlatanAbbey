'use strict';

import React from 'react';
import _ from 'lodash';
import moment from 'moment-timezone';
import { Table } from 'reactabular';
import TimeLogStore from '../stores/time-log-store';
import Actions from '../actions/view-actions';
import ls from '../utils/local-storage';

const ClockOutBtn = React.createClass({

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

const FilterStepper = React.createClass({
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
    let ptr = this.state.pointer;
    if (ptr !== 0) {
      let newPtr = this.state.pointer - 1;
      this.setState({
        pointer: newPtr,
        currentStep: this.props.options[newPtr]
      }, function () {
        this.props.onChange(this.state.currentStep);
      });
    }
  },

  _next: function () {
    let ptr = this.state.pointer;
    if (ptr !== this.props.options.length - 1) {
      let newPtr = this.state.pointer + 1;
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

const Timesheet = React.createClass({

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  getInitialState: function () {
    let now = moment(new Date());
    let thisWeek = now.startOf('week').format('M/D');
    let logs = TimeLogStore.getEverything();

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
    let babyIDs = _.map(ls.get('babies') || [], '_id');
    Actions.getTimeLogs(babyIDs);
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
    let now = new Date();
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
    let filter = e.target.value;
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

    let clockInBtn, clockOutBtn, filterStepper, totalHours, table;
    let filter = this.state.timeFilter;
    let subFilter = this.state.subFilter;

    let dataSet = this.state.timeLogs[filter];

    if (_.isEmpty(dataSet)) {
      table = <div></div>;
    } else {
      let specificData = subFilter ? dataSet[subFilter] : dataSet;

      let columns = [
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

      if (filter !== 'all') {
        let totalTime = _.reduce(specificData, function (total, n) {
          return total + n.hours;
        }, 0).toFixed(2);

        filterStepper = <FilterStepper options={Object.keys(dataSet).reverse()} onChange={this._setSubFilter} />;
        totalHours = (
          <div className="text-center">
            <h3>Total: {totalTime} hrs.</h3>
          </div>
        );
      }

      table = <Table className="timesheet-table" columns={columns} data={specificData} />;
    }

    if (this.state.isClockedIn && !_.isEmpty(dataSet)) {
      let clockOutID = this.state.timeLogs.all[0]._id;
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
            {table}
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

export default Timesheet;