var Rest = require('./rest-service');
var ServerActions = require('../actions/server-actions');

if (!String.prototype.includes) {
  String.prototype.includes = function() {
    return String.prototype.indexOf.apply(this, arguments) !== -1;
  };
}

module.exports = {
  getEvents: function () {
    return Rest.get('/api/events').then(function (res) {
      ServerActions.receiveEvents(res.response);
    });
  },

  getFeedings: function () {
    return Rest.get('/api/events/feedings').then(function (res) {
      ServerActions.receiveFeedings(res.response);
    });
  },

  getBabies: function () {
    return Rest.get('/api/babies').then(function (res) {
      ServerActions.receiveBabies(res.response);
    });
  },

  getFeeders: function () {
    return Rest.get('/api/feeders').then(function (res) {
      ServerActions.receiveFeeders(res.response);
    });
  },

  submitEvent: function (info) {
    return Rest.post('/api/events', info).then(function (res) {
      ServerActions.successfulEventPost(res.response);
    });
  }
};