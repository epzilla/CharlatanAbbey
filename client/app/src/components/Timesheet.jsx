/** @jsx React.DOM */
'use strict';

var React = require('react');
var Navigation = require('react-router').Navigation;
var _ = require('lodash');
var moment = require('moment-timezone');
var cx = require('classnames');
var Table = require('reactabular').Table;
var TimeLogStore = require('../stores/time-log-store');

var Timesheet = React.createClass({

  mixins: [ Navigation ],

  getInitialState: function () {
    return {
      timeLogs: TimeLogStore.getTimeLogs(),
      isClockedIn: TimeLogStore.isClockedIn(),
      filter: 'week'
    };
  },

  _clockIn: function () {
    alert('Clocked in!');
  },

  _clockOut: function () {
    alert('Clocked out!');
  },

  _setFilter: function (e) {
    this.setState({
      filter: e.target.value
    });
  },

  render: function () {

    var clockInBtn;
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

    var clockOutClasses = cx({
      'btn': true,
      'feed-btn': true,
      'full-width': this.state.isClockedIn
    });

    if (!this.state.isClockedIn) {
      clockInBtn = (
        <button key={'clock-in-timesheet'}
          className="btn feed-btn"
          onClick={this._clockIn}
          disabled={this.state.isClockedIn}>
          <i className="fa fa-sign-in"></i> Clock In
        </button>
      );
    }

    return (
      <section className='modal-sheet timesheet'>
        <div className="flex-center flex-row">
          <h2>Timesheet</h2>
        </div>
        <div className="flex-center flex-row">
          <h4>Display:</h4>
        </div>
        <div className="filter-btns">
          <span className='switch'>
            <input type='radio' name='filter' onChange={this._setFilter} defaultChecked={filter === 'week'} value='week'/>
            <label>Weekly</label>
          </span>
          <span className='switch'>
            <input type='radio' name='filter' onChange={this._setFilter} defaultChecked={filter === 'month'} value='month'/>
            <label>Monthly</label>
          </span>
          <span className='switch'>
            <input type='radio' name='filter' onChange={this._setFilter} defaultChecked={filter === 'all'} value='all'/>
            <label>All</label>
          </span>
        </div>
        <div className="flex-center flex-row">
          <Table className="timesheet-table" columns={columns} data={this.state.timeLogs} />
        </div>
        <div key={'div-timesheet-action-sheet'} className="fixed-bottom translucent-bg flex-center flex-col">
          <div key={'div-timesheet-quick-btns'} className='timesheet-btn-container flex-center flex-row'>
            {clockInBtn}
            <button key={'clock-out-timesheet'}
              className={clockOutClasses}
              onClick={this._clockOut}>
              Clock Out <i className="fa fa-sign-out after"></i>
            </button>
          </div>
        </div>
      </section>
    );
  }
});

module.exports = Timesheet;