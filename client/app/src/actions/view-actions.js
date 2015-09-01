'use strict';
var API = require('../utils/api');

var ViewActions = {
  getFeeders: function () {
    API.getFeeders();
  },

  getEvents: function () {
    API.getEvents();
  },

  getTimeLogs: function () {
    API.getTimeLogs();
  },

  submitEventForm: function (formValues) {
    API.submitEvent(formValues);
  },

  editEventForm: function (formValues) {
    API.editEvent(formValues);
  },

  clockIn: function (timeLog) {
    API.clockIn(timeLog);
  },

  clockOut: function (id, timeLog) {
    API.clockOut(id, timeLog);
  }
};

module.exports = ViewActions;
