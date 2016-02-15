var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LogEventSchema = new Schema({
  name: String,
  time: Date,
  burp: String,
  amount: Number,
  duration: Number,
  startTime: Date,
  endTime: Date,
  diaper: String,
  feeder: String,
  food: String,
  medicine: String,
  eventType: String,
  spit: String
}, { collection: 'logEvents' });

module.exports = mongoose.model('LogEvent', LogEventSchema);
