'use strict';
var AppDispatcher = require('../dispatcher/app-dispatcher');
var AppConstants = require('../constants/constants');
var ActionTypes = AppConstants.ActionTypes;

var ServerActions = {
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
  }
};

module.exports = ServerActions;
