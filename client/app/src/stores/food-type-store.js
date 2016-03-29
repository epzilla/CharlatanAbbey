import { ActionTypes } from '../constants/constants';
import { EventEmitter } from 'events';
import assign from 'object-assign';
import AppDispatcher from '../dispatcher/app-dispatcher';
import ls from '../utils/local-storage';

const CHANGE_EVENT = 'change';
let _foodTypes = ls.get('foodTypes') || [];

const FoodTypeStore = assign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getFoodTypes: () => _foodTypes
});

FoodTypeStore.dispatchToken =
AppDispatcher.register(function (payload) {
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

export default FoodTypeStore;