var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FeederSchema = new Schema({
  name: String
});

module.exports = mongoose.model('Feeder', FeederSchema);
