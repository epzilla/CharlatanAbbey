import { ActionTypes } from '../constants/constants';
import { EventEmitter } from 'events';
import assign from 'object-assign';
import AppDispatcher from '../dispatcher/app-dispatcher';

const CHANGE_EVENT = 'change';

let state = { step: 0 };

const WizardStore = assign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getAll: () => state
});

WizardStore.dispatchToken =
AppDispatcher.register(function (payload) {
  let action;
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

export default WizardStore;