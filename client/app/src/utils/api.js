var Rest = require('./rest-service');
var ServerActions = require('../actions/server-actions');
var _ = require('lodash');

if (!String.prototype.includes) {
  String.prototype.includes = function() {
    return String.prototype.indexOf.apply(this, arguments) !== -1;
  };
}

var getJSON = function (json) {
  if (typeof json === 'string') {
    return JSON.parse(json);
  }
  return json;
};

module.exports = {
  getEvents: function (babyIDs) {
    return Rest.get('/api/events/babies/' + babyIDs).then(function (res) {
      ServerActions.receiveEvents(getJSON(res.response));
    });
  },

  getFeedings: function () {
    return Rest.get('/api/events/feedings').then(function (res) {
      ServerActions.receiveFeedings(getJSON(res.response));
    });
  },

  getBabies: function () {
    return Rest.get('/api/babies').then(function (res) {
      ServerActions.receiveBabies(getJSON(res.response));
    });
  },

  findBabies: function (obj) {
    return Rest.post('/api/babies/search', obj)
      .then(function (res) {
        if (!_.isEmpty(res.response)) {
          ServerActions.receiveBabies(getJSON(res.response));
        } else {
          ServerActions.noBabiesFound();
        }
      })
      .catch(function () {
        ServerActions.noBabiesFound();
      });
  },

  getFoodTypes: function () {
    return Rest.get('/api/food-types').then(function (res) {
      ServerActions.receiveFoodTypes(getJSON(res.response));
    });
  },

  getTimeLogs: function (babyIDs) {
    return Rest.get('/api/time-logs/babies/' + babyIDs).then(function (res) {
      ServerActions.receiveTimeLogs(getJSON(res.response));
    });
  },

  submitEvent: function (info) {
    return Rest.post('/api/events', info).then(function (res) {
      ServerActions.successfulEventPost(getJSON(res.response));
    });
  },

  editEvent: function (info) {
    return Rest.put('/api/events/' + info._id, info).then(function (res) {
      ServerActions.successfulEventEdit(getJSON(res.response));
    });
  },

  clockIn: function (timeLog) {
    return Rest.post('/api/time-logs', timeLog).then(function (res) {
      ServerActions.clockedIn(getJSON(res.response));
    });
  },

  clockOut: function (id, timeLog) {
    return Rest.put('/api/time-logs/' + id, timeLog).then(function (res) {
      ServerActions.clockedOut(getJSON(res.response));
    });
  }
};