import { EventEmitter } from 'events';
import assign from 'object-assign';
import AppDispatcher from '../dispatcher/app-dispatcher';
import ls from '../utils/local-storage';
import { ActionTypes } from '../constants/constants';
import _ from 'lodash';
import moment from 'moment';
import 'moment-timezone';

const CHANGE_EVENT = 'change';
let _rawLogs = ls.get('raw-time-logs') || [];
let _timeLogs = ls.get('time-logs') || [];
let _weeklyTimeLogs = ls.get('weekly-time-logs') || {};
let _monthlyTimeLogs = ls.get('monthly-time-logs') || {};
let _thisWeekLog;
let _thisMonthLog;
let _isClockedIn = false;

const TimeLogStore = assign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getTimeLogs: () => _timeLogs,

  getEverything: function () {
    return {
      weekly: _weeklyTimeLogs,
      monthly: _monthlyTimeLogs,
      all: _timeLogs
    };
  },

  isClockedIn: () => _isClockedIn
});

const updateStore = function () {
  _timeLogs = _.chain(_rawLogs)
    .map(function (tl) {
      return {
        _id: tl._id,
        date: moment(tl.date).format('M/D/YY'),
        timeIn: moment(tl.timeIn).format('h:mma'),
        timeOut: tl.timeOut ? moment(tl.timeOut).format('h:mma') : null,
        hours: (tl.hours || tl.hours === 0) ? tl.hours: null,
        weekOf: moment(tl.timeIn).startOf('week').format('M/D'),
        monthOf: moment(tl.timeIn).startOf('month').format('MMM')
      };
    })
    .value();

  _isClockedIn = !(_timeLogs[0].timeOut);

  let now = moment(new Date());
  let thisWeek = now.startOf('week').format('M/D');
  let thisMonth = now.startOf('month').format('MMM');
  _weeklyTimeLogs = _.groupBy(_timeLogs, 'weekOf');
  _monthlyTimeLogs = _.groupBy(_timeLogs, 'monthOf');
  _thisWeekLog = _weeklyTimeLogs[thisWeek];
  _thisMonthLog = _monthlyTimeLogs[thisMonth];
  ls.set('weekly-time-logs', _weeklyTimeLogs);
  ls.set('monthly-time-logs', _monthlyTimeLogs);
  ls.set('time-logs', _timeLogs);
  TimeLogStore.emitChange();
};

const needsUpdating = (logs) => ((!logs) || (logs.length === 0) || (JSON.stringify(_rawLogs) !== JSON.stringify(logs)));

TimeLogStore.dispatchToken =
AppDispatcher.register(function (payload) {
  let action = payload.action;
  switch (action.type) {
    case ActionTypes.RECEIVE_TIME_LOGS:
      if (needsUpdating(action.data)) {
        let newLogs = action.data;
        _rawLogs = _.chain(action.data)
          .concat(newLogs)
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

export default TimeLogStore;