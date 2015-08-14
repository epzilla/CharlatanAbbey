var Constants = require('../constants/constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var Dispatcher = require('../dispatcher/app-dispatcher');
var ls = require('../utils/local-storage');
var ActionTypes = Constants.ActionTypes;
var CHANGE_EVENT = 'change';
var _babies = ls.get('babies') || [];

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
  }
});

BabyStore.dispatchToken = Dispatcher.register(function (payload) {
  var action;
  action = payload.action;
  switch (action.type) {
    case ActionTypes.RECEIVE_BABIES:
      _babies = action.data;
      ls.set('babies', _babies);
      break;
  }
  BabyStore.emitChange();
});

module.exports = BabyStore;