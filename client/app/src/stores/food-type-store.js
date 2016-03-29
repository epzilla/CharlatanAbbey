var Constants = require('../constants/constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var Dispatcher = require('../dispatcher/app-dispatcher');
import ls from '../utils/local-storage';
var ActionTypes = Constants.ActionTypes;
var CHANGE_EVENT = 'change';
var _foodTypes = ls.get('foodTypes') || [];


var FoodTypeStore = assign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getFoodTypes: function () {
    return _foodTypes;
  }
});

FoodTypeStore.dispatchToken = Dispatcher.register(function (payload) {
  var action;
  action = payload.action;
  switch (action.type) {
    case ActionTypes.RECEIVE_FOOD_TYPES:
      _foodTypes = action.data;
      ls.set('foodTypes', _foodTypes);
      break;
  }
  FoodTypeStore.emitChange();
});

module.exports = FoodTypeStore;