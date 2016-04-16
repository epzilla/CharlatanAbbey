import { ActionTypes } from '../constants/constants';
import { EventEmitter } from 'events';
import assign from 'object-assign';
import _ from 'lodash';
import AppDispatcher from '../dispatcher/app-dispatcher';
import ls from '../utils/local-storage';

const CHANGE_EVENT = 'change';
let _babies = ls.get('babies') || [];
let _feeders = ls.get('feeders') || [];
let _meds = ls.get('med-schedule') || {};
let _failedSearch;

const BabyStore = assign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit(CHANGE_EVENT)
  },

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getBabies: () => _babies,

  getBaby: id => _.find(_babies, {'_id': id}),

  getFeeders: () => _feeders,

  getMeds: () => _meds,

  getSearchFailed: () => _failedSearch,

  getDefaults: () => _babies.length ? _babies[0].defaults : null
});

BabyStore.dispatchToken =
AppDispatcher.register(function (payload) {
  let action = payload.action;
  switch (action.type) {
    case ActionTypes.RECEIVE_BABIES:
      _babies = action.data;
      _feeders = _babies[0].feeders;
      _meds = [];
      _meds.concat(_babies[0].meds).concat(_babies[1].meds);
      ls.set('babies', _babies);
      ls.set('feeders', _feeders);
      ls.set('med-schedule', _meds);
      break;
    case ActionTypes.NO_BABIES_FOUND:
      _failedSearch = true;
  }
  BabyStore.emitChange();
});

export default BabyStore;