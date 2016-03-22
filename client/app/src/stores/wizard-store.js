var Constants = require('../constants/constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var Dispatcher = require('../dispatcher/app-dispatcher');
var ActionTypes = Constants.ActionTypes;
var CHANGE_EVENT = 'change';

var state = { step: 0 };

var WizardStore = assign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getAll: function () {
    return state;
  }
});

WizardStore.dispatchToken = Dispatcher.register(function (payload) {
  var action;
  action = payload.action;
  switch (action.type) {
    case ActionTypes.WIZARD_NEXT:
      state.step++;
      WizardStore.emitChange();
      break;
    case ActionTypes.WIZARD_PREV:
      if (state.step > 0) {
        state.step--;
        WizardStore.emitChange();
      }
      break;
    case ActionTypes.WIZARD_DONE:
      state = { step: 0 };
      WizardStore.emitChange();
      break;
  }
});

module.exports = WizardStore;