var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DeprecatedFeedingSchema = new Schema({
  name: String,
  time: Date,
  burp: String,
  amount: Number,
  diaper: String,
  medicine: String,
  spit: String
}, { collection: 'feedings' });

module.exports = mongoose.model('DeprecatedFeeding', DeprecatedFeedingSchema);
