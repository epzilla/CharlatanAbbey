var Constants = require('../constants/constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var Dispatcher = require('../dispatcher/app-dispatcher');
var _ = require('lodash');
var ls = require('../utils/local-storage');
var ActionTypes = Constants.ActionTypes;
var CHANGE_EVENT = 'change';
var _feedings = ls.get('feedings') || [];
var _latest = [];

if (_feedings && _feedings.length > 0) {
  _latest = _.map(_feedings, function (baby) {
    return baby[0];
  });
}


var FeedingStore = assign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getFeedings: function () {
    return _feedings;
  },

  getLatestFeedings: function () {
    return _latest;
  }
});

FeedingStore.dispatchToken = Dispatcher.register(function (payload) {
  var action;
  action = payload.action;
  switch (action.type) {
    case ActionTypes.RECEIVE_FEEDINGS:
      _feedings = action.data;
      _latest = _.map(_feedings, function (baby) {
        return baby[0];
      });
      ls.set('feedings', _feedings);
      ls.set('latest', _latest);
      break;
  }
  FeedingStore.emitChange();
});

module.exports = FeedingStore;