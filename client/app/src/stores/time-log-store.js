var Constants = require('../constants/constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var Dispatcher = require('../dispatcher/app-dispatcher');
var ls = require('../utils/local-storage');
var ActionTypes = Constants.ActionTypes;
var CHANGE_EVENT = 'change';
var _ = require('lodash');
var moment = require('moment-timezone');
var _rawLogs = ls.get('raw-time-logs') || [];
var _timeLogs = ls.get('time-logs') || [];
var _weeklyTimeLogs = ls.get('weekly-time-logs') || {};
var _monthlyTimeLogs = ls.get('monthly-time-logs') || {};
var _thisWeekLog;
var _thisMonthLog;
var _isClockedIn = false;

var TimeLogStore = assign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getTimeLogs: function () {
    return _timeLogs;
  },

  isClockedIn: function () {
    return _isClockedIn;
  }
});

var updateStore = function () {
  _timeLogs = _.chain(_rawLogs)
    .map(function (tl) {
      var timeIn = moment(tl.timeIn);
      var timeOut = tl.timeOut ? moment(tl.timeOut) : null;
      return {
        _id: tl._id,
        date: moment(tl.date).format('M/D/YY'),
        timeIn: timeIn.format('h:mma'),
        timeOut: timeOut ? timeOut.format('h:mma') : null,
        hours: (tl.hours || tl.hours === 0) ? tl.hours: null,
        weekOf: timeIn.startOf('week').format('M/D'),
        monthOf: timeIn.startOf('month').format('MMMM')
      };
    })
    .value();

  _isClockedIn = !(_timeLogs[0].timeOut);

  var now = moment(new Date());
  var thisWeek = now.startOf('week').format('M/D');
  var thisMonth = now.startOf('month').format('MMMM');
  _weeklyTimeLogs = _.groupBy(_timeLogs, 'weekOf');
  _monthlyTimeLogs = _.groupBy(_timeLogs, 'monthOf');
  _thisWeekLog = _weeklyTimeLogs[thisWeek];
  _thisMonthLog = _monthlyTimeLogs[thisMonth];
  ls.set('weekly-time-logs', _weeklyTimeLogs);
  ls.set('monthly-time-logs', _monthlyTimeLogs);
  console.log(_weeklyTimeLogs);
  console.log(_monthlyTimeLogs);
  console.log(_thisWeekLog);
  console.log(_thisMonthLog);
  ls.set('time-logs', _timeLogs);
  TimeLogStore.emitChange();
};

var needsUpdating = function (logs) {
  return ((!logs) || (logs.length === 0) || (JSON.stringify(_rawLogs) !== JSON.stringify(logs)));
};

TimeLogStore.dispatchToken = Dispatcher.register(function (payload) {
  var action;
  action = payload.action;
  switch (action.type) {
    case ActionTypes.RECEIVE_TIME_LOGS:
      if (needsUpdating(action.data)) {
        _rawLogs = _.chain(action.data)
          .sortBy(function (tl) {
            return new Date(tl.timeIn);
          })
          .reverse()
          .value();

        updateStore();
      }
      break;
    case ActionTypes.CLOCKED_IN:
      _rawLogs.unshift(action.data);
      updateStore();
      break;
    case ActionTypes.CLOCKED_OUT:
      _rawLogs[0] = action.data;
      updateStore();
      break;
  }
});

module.exports = TimeLogStore;