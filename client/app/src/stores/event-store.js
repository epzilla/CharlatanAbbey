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
var _poops = ls.get('poops') || [];
var _latest = ls.get('latest') || [];
var _latestPoops = ls.get('latest-poops') || {};
var _latestPrevacid = ls.get('latest-prevacid') || {};
var _lastDayFeedings = ls.get('last-day-feedings') || {};
var _lastDayEvents = ls.get('last-day-events') || {};
var _lastDayMeds = ls.get('last-day-meds') || {};
var _lastDayPoops= ls.get('last-day-poops') || {};
var _lastWeekEvents = ls.get('last-week-events') || {};
var _lastWeekFeedings = ls.get('last-week-feedings') || {};
var _lastWeekMeds = ls.get('last-week-meds') || {};
var _lastWeekPoops = ls.get('last-week-poops') || {};
var _groupedEvents = ls.get('grouped-events') || {};
var _groupedFeedings = ls.get('grouped-feedings') || {};
var _groupedMeds = ls.get('grouped-meds') || {};
var _groupedPoops= ls.get('grouped-poops') || {};

if (_groupedFeedings && _groupedFeedings.length > 0) {
  _latest = _.map(_groupedFeedings, function (baby) {
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
    return _groupedFeedings;
  },

  getLastDayFeedings: function () {
    return _lastDayFeedings;
  },

  getEverything: function () {
    return {
      lastDay: {
        meds: _lastDayMeds,
        poops: _lastDayPoops,
        feedings: _lastDayFeedings,
        events: _lastDayEvents
      },
      lastWeek: {
        meds: _lastWeekMeds,
        poops: _lastWeekPoops,
        feedings: _lastWeekFeedings,
        events: _lastWeekEvents
      },
      all: {
        meds: _groupedMeds,
        poops: _groupedPoops,
        feedings: _groupedFeedings,
        events: _groupedEvents
      },
    };
  }
});

var updateStore = function () {

  _feedings = _.filter(_events, {eventType: 'feeding'});
  _diapers = _.filter(_events, {eventType: 'diaper'});
  _spits = _.filter(_events, {eventType: 'spit'});
  _poops = _.filter(_events, function (ev) {
    return _.contains(ev.diaper, 'poop');
  });
  _meds = _.filter(_events, function (ev) {
    return (ev.eventType === 'medicine' || !_.isEmpty(ev.medicine));
  });

  _lastWeekEvents = _.chain(_events)
    .filter(function (ev) {
      return moment(Date.now()).diff(ev.time, 'days') <= 7;
    })
    .sortByOrder(['name', 'time'], ['asc', 'desc'])
    .groupBy('name')
    .value();

  _lastWeekFeedings = _.chain(_feedings)
    .filter(function (ev) {
      return moment(Date.now()).diff(ev.time, 'days') <= 7;
    })
    .sortByOrder(['name', 'time'], ['asc', 'desc'])
    .groupBy('name')
    .value();

  _lastWeekPoops = _.chain(_poops)
    .filter(function (ev) {
      return moment(Date.now()).diff(ev.time, 'days') <= 7;
    })
    .sortByOrder(['name', 'time'], ['asc', 'desc'])
    .groupBy('name')
    .value();

  _lastWeekMeds = _.chain(_meds)
    .filter(function (ev) {
      return moment(Date.now()).diff(ev.time, 'days') <= 7;
    })
    .sortByOrder(['name', 'time'], ['asc', 'desc'])
    .groupBy('name')
    .value();

  _lastDayEvents = _.chain(_events)
    .filter(function (ev) {
      return moment(Date.now()).diff(ev.time, 'hours') <= 24;
    })
    .sortByOrder(['name', 'time'], ['asc', 'desc'])
    .groupBy('name')
    .value();

  _lastDayFeedings = _.chain(_feedings)
    .filter(function (ev) {
      return moment(Date.now()).diff(ev.time, 'hours') <= 24;
    })
    .sortByOrder(['name', 'time'], ['asc', 'desc'])
    .groupBy('name')
    .value();

  _lastDayPoops = _.chain(_poops)
    .filter(function (ev) {
      return moment(Date.now()).diff(ev.time, 'hours') <= 24;
    })
    .sortByOrder(['name', 'time'], ['asc', 'desc'])
    .groupBy('name')
    .value();

  _lastDayMeds = _.chain(_meds)
    .filter(function (ev) {
      return moment(Date.now()).diff(ev.time, 'hours') <= 24;
    })
    .sortByOrder(['name', 'time'], ['asc', 'desc'])
    .groupBy('name')
    .value();

  _groupedFeedings = _.chain(_feedings)
    .sortByOrder(['name', 'time'], ['asc', 'desc'])
    .groupBy('name')
    .value();

  _groupedMeds = _.chain(_meds)
    .sortByOrder(['name', 'time'], ['asc', 'desc'])
    .groupBy('name')
    .value();

  _groupedPoops = _.chain(_poops)
    .sortByOrder(['name', 'time'], ['asc', 'desc'])
    .groupBy('name')
    .value();

  _groupedEvents = _.chain(_events)
    .sortByOrder(['name', 'time'], ['asc', 'desc'])
    .groupBy('name')
    .value();

  _latestPoops = _.chain(_events)
    .filter(function (e) {
      return e.diaper && _.contains(e.diaper, 'poop');
    })
    .sortByOrder(['name', 'time'], ['asc', 'desc'])
    .groupBy('name')
    .value();

  _latestPrevacid = _.chain(_events)
    .filter(function (e) {
      return e.medicine && _.contains(e.medicine, 'prevacid');
    })
    .sortByOrder(['name', 'time'], ['asc', 'desc'])
    .groupBy('name')
    .value();

  _.map(_latestPoops, function (baby) {
    var hoursSincePoop = moment(Date.now()).diff(baby[0].time, 'hours');
    if (hoursSincePoop < 24) {
      _groupedFeedings[baby[0].name][0].poopFlag = 0;
    } else if (hoursSincePoop < 72) {
      _groupedFeedings[baby[0].name][0].poopFlag = 1;
    } else {
      _groupedFeedings[baby[0].name][0].poopFlag = 2;
    }
  });

  _.map(_latestPrevacid, function (baby) {
    var hoursSincePrevacid = moment(Date.now()).diff(baby[0].time, 'hours');
    _groupedFeedings[baby[0].name][0].prevacidFlag = (hoursSincePrevacid > 8);
  });

  _latest = _.map(_groupedFeedings, function (baby) {
    return baby[0];
  });

  ls.set('last-day-feedings', _lastDayFeedings);
  ls.set('last-day-poops', _lastDayFeedings);
  ls.set('last-day-meds', _lastDayFeedings);
  ls.set('last-day-events', _lastDayEvents);
  ls.set('last-week-feedings', _lastWeekFeedings);
  ls.set('last-week-poops', _lastWeekPoops);
  ls.set('last-week-meds', _lastWeekMeds);
  ls.set('last-week-events', _lastWeekEvents);
  ls.set('latest', _latest);
  ls.set('feedings', _feedings);
  ls.set('meds', _meds);
  ls.set('poops', _poops);
  ls.set('grouped-feedings', _groupedFeedings);
  ls.set('grouped-meds', _groupedMeds);
  ls.set('grouped-poops', _groupedPoops);
  ls.set('grouped-events', _groupedEvents);
  ls.set('latest-poops', _latestPoops);
  EventStore.emitChange();
};

EventStore.dispatchToken = Dispatcher.register(function (payload) {
  var action;
  action = payload.action;
  switch (action.type) {
    case ActionTypes.RECEIVE_EVENTS:
      _events = action.data;
      ls.set('events', _events);
      updateStore();
      break;

    case ActionTypes.SUCCESSFUL_EVENT_POST:
      _events.push(action.data);
      ls.set('events', _events);
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
});

module.exports = EventStore;