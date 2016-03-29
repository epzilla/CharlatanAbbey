import { ActionTypes } from '../constants/constants';
import { EventEmitter } from 'events';
import assign from 'object-assign';
import AppDispatcher from '../dispatcher/app-dispatcher';
import _ from 'lodash';
import moment from 'moment';
import 'moment-timezone';
import ls from '../utils/local-storage';

let CHANGE_EVENT = 'change';
let _events = ls.get('events') || [];
let _feedings = ls.get('feedings') || [];
let _diapers = ls.get('diapers') || [];
let _meds = ls.get('meds') || [];
let _spits = ls.get('spits') || [];
let _poops = ls.get('poops') || [];
let _latest = ls.get('latest') || [];
let _latestPoops = ls.get('latest-poops') || {};
let _latestPrevacid = ls.get('latest-prevacid') || {};
let _lastDayFeedings = ls.get('last-day-feedings') || {};
let _lastDayEvents = ls.get('last-day-events') || {};
let _lastDayMeds = ls.get('last-day-meds') || {};
let _lastDayPoops= ls.get('last-day-poops') || {};
let _lastWeekEvents = ls.get('last-week-events') || {};
let _lastWeekFeedings = ls.get('last-week-feedings') || {};
let _lastWeekMeds = ls.get('last-week-meds') || {};
let _lastWeekPoops = ls.get('last-week-poops') || {};
let _groupedEvents = ls.get('grouped-events') || {};
let _groupedFeedings = ls.get('grouped-feedings') || {};
let _groupedMeds = ls.get('grouped-meds') || {};
let _groupedPoops= ls.get('grouped-poops') || {};

if (_groupedFeedings && _groupedFeedings.length > 0) {
  _latest = _.map(_groupedFeedings, function (baby) {
    return baby[0];
  });
}


const EventStore = assign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getEvents: () => _events,

  getEvent: id => _.find(_events, {_id: id}),

  getLatestFeedings: () => _latest,

  getFeedings: () => _groupedFeedings,

  getLastDayFeedings: () => _lastDayFeedings,

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

const updateStore = function () {

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

EventStore.dispatchToken =
AppDispatcher.register(function (payload) {
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

export default EventStore;