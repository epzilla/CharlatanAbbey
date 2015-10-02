'use strict';
var keyMirror = require('keymirror');

module.exports = {
  ActionTypes: keyMirror({
    CLOCKED_IN: null,
    CLOCKED_OUT: null,
    RECEIVE_EVENTS: null,
    RECEIVE_BABIES: null,
    RECEIVE_FEEDERS: null,
    RECEIVE_FEEDINGS: null,
    RECEIVE_TIME_LOGS: null,
    SUCCESSFUL_EVENT_POST: null,
    SUCCESSFUL_EVENT_EDIT: null
  }),

  PayloadSources: keyMirror({
    SERVER_ACTION: null,
    VIEW_ACTION: null,
    REQUEST_ACTION: null
  }),

  EventTypes: {
    FEEDING: 'feeding',
    SPIT_UP: 'spit',
    BURP: 'burp',
    MEDS: 'meds',
    DIAPER: 'diaper',
    NAP: 'nap'
  }
};