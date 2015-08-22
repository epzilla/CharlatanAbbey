var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LogEventSchema = new Schema({
  name: String,
  time: Date,
  burp: String,
  amount: Number,
  diaper: String,
  feeder: String,
  medicine: String,
  eventType: String,
  spit: String
}, { collection: 'logEvents' });

module.exports = mongoose.model('LogEvent', LogEventSchema);
