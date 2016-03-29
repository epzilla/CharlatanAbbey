'use strict';
import AppDispatcher from '../dispatcher/app-dispatcher';
import { ActionTypes } from '../constants/constants';

const Actions = {
  receiveEvents: function (data) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.RECEIVE_EVENTS,
      data: data
    });
  },

  receiveFeedings: function (data) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.RECEIVE_FEEDINGS,
      data: data
    });
  },

  receiveBabies: function (data) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.RECEIVE_BABIES,
      data: data
    });
  },

  noBabiesFound: function () {
    AppDispatcher.handleServerAction({
      type: ActionTypes.NO_BABIES_FOUND
    });
  },

  receiveFoodTypes: function (data) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.RECEIVE_FOOD_TYPES,
      data: data
    });
  },

  receiveTimeLogs: function (data) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.RECEIVE_TIME_LOGS,
      data: data
    });
  },

  successfulEventPost: function (data) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.SUCCESSFUL_EVENT_POST,
      data: data
    });
  },

  successfulEventEdit: function (data) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.SUCCESSFUL_EVENT_EDIT,
      data: data
    });
  },

  clockedIn: function (data) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.CLOCKED_IN,
      data: data
    });
  },

  clockedOut: function (data) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.CLOCKED_OUT,
      data: data
    });
  },

  initialized: function (data) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.RECEIVE_BABIES,
      data: data
    });
  }
};

export default Actions;
