'use strict';
var _ = require('lodash');
import API from '../utils/api';
var moment = require('moment-timezone');
var AppDispatcher = require('../dispatcher/app-dispatcher');
var AppConstants = require('../constants/constants');
var fractions = require('../utils/fractions');
var ActionTypes = AppConstants.ActionTypes;

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
  },

  wizardNext: function () {
    AppDispatcher.handleViewAction({
      type: ActionTypes.WIZARD_NEXT
    });
  },

  wizardPrev: function () {
    AppDispatcher.handleViewAction({
      type: ActionTypes.WIZARD_PREV
    });
  },

  wizardDone: function () {
    AppDispatcher.handleViewAction({
      type: ActionTypes.WIZARD_DONE
    });
  },

  sendInitialConfig: function (info) {
    var babyA = {
      firstname: info.babyA,
      lastname: info.query.lastname,
      birth: info.query.birthdate,
      defaults: {
        hours: fractions.getDecimal(info.fullHours, info.fracHours),
        ounces: fractions.getDecimal(info.fullOunces, info.fracOunces)
      },
      feeders: _.map(info.feeders, function (feeder) {
        return {name: feeder.name};
      })
    };

    var babyB = _.assign({}, babyA, {firstname: info.babyB});

    API.sendInitialConfig({ babies: [babyA, babyB] });
  }
};

module.exports = ViewActions;
