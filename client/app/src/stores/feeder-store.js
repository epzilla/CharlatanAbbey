import { ActionTypes } from '../constants/constants';
import { EventEmitter } from 'events';
import assign from 'object-assign';
import AppDispatcher from '../dispatcher/app-dispatcher';
import ls from '../utils/local-storage';

const CHANGE_EVENT = 'change';
let _feeders = ls.get('feeders') || [];

const FeederStore = assign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getFeeders: () => _feeders
});

FeederStore.dispatchToken =
AppDispatcher.register(function (payload) {
  let action = payload.action;
  switch (action.type) {
    case ActionTypes.RECEIVE_FEEDERS:
      _feeders = action.data;
      ls.set('feeders', _feeders);
      break;
  }
  FeederStore.emitChange();
});

export default FeederStore;