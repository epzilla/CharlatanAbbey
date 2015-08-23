var Constants = require('../constants/constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var Dispatcher = require('../dispatcher/app-dispatcher');
var _ = require('lodash');
var moment = require('moment-timezone');
var ls = require('../utils/local-storage');
var ActionTypes = Constants.ActionTypes;
var CHANGE_EVENT = 'change';
var _events = ls.get('events') || [];
var _feedings = ls.get('feedings') || [];
var _diapers = ls.get('diapers') || [];
var _meds = ls.get('meds') || [];
var _spits = ls.get('spits') || [];
var _latest = ls.get('latest') || [];
var _latestPoops = ls.get('latest-poops') || {};

if (_feedings && _feedings.length > 0) {
  _latest = _.map(_feedings, function (baby) {
    return baby[0];
  });
}


var EventStore = assign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getEvents: function () {
    return _events;
  },

  getEvent: function (id) {
    return _.find(_events, {_id: id});
  },

  getLatestFeedings: function () {
    return _latest;
  },

  getFeedings: function () {
    return _feedings;
  },

  getMeds: function () {
    return _meds;
  },

  getDiapers: function () {
    return _diapers;
  },

  getSpits: function () {
    return _spits;
  }
});

var updateStore = function () {
  _feedings = _.chain(_events)
    .filter({eventType: 'feeding'})
    .sortByOrder(['name', 'time'], ['asc', 'desc'])
    .groupBy('name')
    .value();

  _meds = _.filter(_events, {eventType: 'medicine'});
  _diapers = _.filter(_events, {eventType: 'diaper'});
  _spits = _.filter(_events, {eventType: 'spit'});

  _latestPoops = _.chain(_events)
    .filter(function (e) {
      return e.diaper && _.contains(e.diaper, 'poop');
    })
    .sortByOrder(['name', 'time'], ['asc', 'desc'])
    .groupBy('name')
    .value();

  _.map(_latestPoops, function (baby) {
    var hoursSincePoop = moment(Date.now()).diff(baby[0].time, 'hours');
    if (hoursSincePoop < 24) {
      _feedings[baby[0].name][0].poopFlag = 0;
    } else if (hoursSincePoop < 72) {
      _feedings[baby[0].name][0].poopFlag = 1;
    } else {
      _feedings[baby[0].name][0].poopFlag = 2;
    }
  });

  _latest = _.map(_feedings, function (baby) {
    return baby[0];
  });

  ls.set('events', _events);
  ls.set('feedings', _feedings);
  ls.set('latest', _latest);
  ls.set('meds', _meds);
  ls.set('diapers', _diapers);
  ls.set('spits', _spits);
  ls.set('latest-poops', _latestPoops);
};

EventStore.dispatchToken = Dispatcher.register(function (payload) {
  var action;
  action = payload.action;
  switch (action.type) {
    case ActionTypes.RECEIVE_EVENTS:
      _events = action.data;
      updateStore();
      break;

    case ActionTypes.SUCCESSFUL_EVENT_POST:
      _events.push(action.data);
      updateStore();
      break;

    case ActionTypes.SUCCESSFUL_EVENT_EDIT:
      for (var i = 0; i < _events.length; i++) {
        if (_events[i]._id.toString() === action.data._id.toString()) {
          _events.splice(i, 1, action.data);
          break;
        }
      }
      _events.forEach(function (e) {
        if (e._id.toString() === action.data._id.toString()) {
          _events.splice(_events.indexOf(e), 1, action.data);
        }
      });
      updateStore();
      break;
  }
  EventStore.emitChange();
});

module.exports = EventStore;