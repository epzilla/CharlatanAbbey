'use strict';
import _ from 'lodash';
import API from '../utils/api';
import moment from 'moment-timezone';
import AppDispatcher from '../dispatcher/app-dispatcher';
import { ActionTypes } from '../constants/constants';
import * as fractions from '../utils/fractions';

const Actions = {

  findBabies: (obj) => {
    obj.birthdate = moment(obj.birthdate).format("MM-DD-YYYY");
    API.findBabies(obj);
  },

  getFoodTypes: () => API.getFoodTypes(),

  getEvents: babyID => API.getEvents(babyID),

  getTimeLogs: babyID => API.getTimeLogs(babyID),

  submitEventForm: formValues => API.submitEvent(formValues),

  editEventForm: formValues => API.editEvent(formValues),

  clockIn: timeLog => API.clockIn(timeLog),

  clockOut: (id, timeLog) => API.clockOut(id, timeLog),

  wizardNext: () => {
    AppDispatcher.handleViewAction({
      type: ActionTypes.WIZARD_NEXT
    });
  },

  wizardPrev: () => {
    AppDispatcher.handleViewAction({
      type: ActionTypes.WIZARD_PREV
    });
  },

  wizardDone: () => {
    AppDispatcher.handleViewAction({
      type: ActionTypes.WIZARD_DONE
    });
  },

  sendInitialConfig: info => {
    let babyA = {
      firstname: info.babyA,
      lastname: info.query.lastname,
      birth: info.query.birthdate,
      defaults: {
        hours: fractions.getDecimal(info.fullHours, info.fracHours),
        ounces: fractions.getDecimal(info.fullOunces, info.fracOunces)
      },
      feeders: _.map(info.feeders, feeder => ({name: feeder.name})),
      meds: _.map(info.meds, med => ({name: med.name}))
    };

    let babyB = _.assign({}, babyA, {firstname: info.babyB});

    API.sendInitialConfig({ babies: [babyA, babyB] });
  }
};

export default Actions;
