var Constants = require('../constants/constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var _ = require('lodash');
var Dispatcher = require('../dispatcher/app-dispatcher');
var ls = require('../utils/local-storage');
var ActionTypes = Constants.ActionTypes;
var CHANGE_EVENT = 'change';
var _babies = ls.get('babies') || [];
var _feeders = ls.get('feeders') || [];

var BabyStore = assign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getBabies: function () {
    return _babies;
  },

  getBaby: function (id) {
    return _.find(_babies, {'_id': id});
  },

  getFeeders: function () {
    return _feeders;
  }
});

BabyStore.dispatchToken = Dispatcher.register(function (payload) {
  var action;
  action = payload.action;
  switch (action.type) {
    case ActionTypes.RECEIVE_BABIES:
      _babies = action.data;
      _feeders = _babies[0].feeders;
      ls.set('babies', _babies);
      ls.set('feeders', _feeders);
      break;
  }
  BabyStore.emitChange();
});

module.exports = BabyStore;