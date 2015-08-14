var Constants = require('../constants/constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var Dispatcher = require('../dispatcher/app-dispatcher');
var ls = require('../utils/local-storage');
var ActionTypes = Constants.ActionTypes;
var CHANGE_EVENT = 'change';
var _feeders = ls.get('feeders') || [];


var FeederStore = assign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getFeeders: function () {
    return _feeders;
  }
});

FeederStore.dispatchToken = Dispatcher.register(function (payload) {
  var action;
  action = payload.action;
  switch (action.type) {
    case ActionTypes.RECEIVE_FEEDERS:
      _feeders = action.data;
      ls.set('feeders', _feeders);
      break;
  }
  FeederStore.emitChange();
});

module.exports = FeederStore;