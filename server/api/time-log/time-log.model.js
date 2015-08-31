var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TimeLogSchema = new Schema({
  date: Date,
  timeIn: Date,
  timeOut: Date,
  hours: Number
});

module.exports = mongoose.model('TimeLog', TimeLogSchema);
