'use strict';
var AppDispatcher = require('../dispatcher/app-dispatcher');
var AppConstants = require('../constants/constants');
var ActionTypes = AppConstants.ActionTypes;

var ServerActions = {
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

  receiveFeeders: function (data) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.RECEIVE_FEEDERS,
      data: data
    });
  }
};

module.exports = ServerActions;
