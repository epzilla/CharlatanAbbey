'use strict';
var keyMirror = require('keymirror');

module.exports = {
  ActionTypes: keyMirror({
    RECEIVE_FEEDINGS: null,
    RECEIVE_BABIES: null,
    RECEIVE_FEEDERS: null
  }),

  PayloadSources: keyMirror({
    SERVER_ACTION: null,
    VIEW_ACTION: null,
    REQUEST_ACTION: null
  })
};