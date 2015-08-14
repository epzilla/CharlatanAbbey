'use strict';
var AppDispatcher = require('../dispatcher/app-dispatcher');
var AppConstants = require('../constants/constants');
var ActionTypes = AppConstants.ActionTypes;
var API = require('../utils/api');

var ViewActions = {
  getFeeders: function () {
    API.getFeeders();
  }
};

module.exports = ViewActions;
