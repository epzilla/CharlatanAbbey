var Rest = require('./rest-service');
var ServerActions = require('../actions/server-actions');

if (!String.prototype.includes) {
  String.prototype.includes = function() {
    return String.prototype.indexOf.apply(this, arguments) !== -1;
  };
}

module.exports = {
  getFeedings: function() {
    return Rest.get('/api/feedings').then(function(res) {
      ServerActions.receiveFeedings(res.response);
    });
  },

  getBabies: function() {
    return Rest.get('/api/babies').then(function(res) {
      ServerActions.receiveBabies(res.response);
    });
  },

  getFeeders: function() {
    return Rest.get('/api/feeders').then(function(res) {
      ServerActions.receiveFeeders(res.response);
    });
  }
};