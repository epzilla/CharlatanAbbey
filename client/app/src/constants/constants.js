'use strict';
const keyMirror = require('keymirror');

export const ActionTypes = keyMirror({
  CLOCKED_IN: null,
  CLOCKED_OUT: null,
  INITIALIZED: null,
  NO_BABIES_FOUND: null,
  RECEIVE_EVENTS: null,
  RECEIVE_BABIES: null,
  RECEIVE_FEEDERS: null,
  RECEIVE_FEEDINGS: null,
  RECEIVE_FOOD_TYPES: null,
  RECEIVE_TIME_LOGS: null,
  SUCCESSFUL_EVENT_POST: null,
  SUCCESSFUL_EVENT_EDIT: null,
  WIZARD_NEXT: null,
  WIZARD_PREV: null,
  WIZARD_DONE: null
});

export const PayloadSources = keyMirror({
  SERVER_ACTION: null,
  VIEW_ACTION: null,
  REQUEST_ACTION: null
});

export const EventTypes = {
  FEEDING: 'feeding',
  SPIT_UP: 'spit',
  BURP: 'burp',
  MEDS: 'meds',
  DIAPER: 'diaper',
  NAP: 'nap'
};