'use strict';
var keyMirror = require('keymirror');

module.exports = {
  ActionTypes: keyMirror({
    RECEIVE_EVENTS: null,
    RECEIVE_BABIES: null,
    RECEIVE_FEEDERS: null,
    RECEIVE_FEEDINGS: null,
    SUCCESSFUL_EVENT_POST: null
  }),

  PayloadSources: keyMirror({
    SERVER_ACTION: null,
    VIEW_ACTION: null,
    REQUEST_ACTION: null
  })
};