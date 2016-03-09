'use strict';
var API = require('../utils/api');
var moment = require('moment-timezone');

var ViewActions = {

  findBabies: function (obj) {
    obj.birthdate = moment(obj.birthdate).format("MM-DD-YYYY");
    API.findBabies(obj);
  },

  getFoodTypes: function () {
    API.getFoodTypes();
  },

  getEvents: function (babyID) {
    API.getEvents(babyID);
  },

  getTimeLogs: function (babyID) {
    API.getTimeLogs(babyID);
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
