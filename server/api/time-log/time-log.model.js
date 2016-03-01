var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TimeLogSchema = new Schema({
  date: Date,
  timeIn: Date,
  timeOut: Date,
  hours: Number,
  babyID: {
  	type: Schema.Types.ObjectId,
  	ref: 'Baby'
  }
});

module.exports = mongoose.model('TimeLog', TimeLogSchema);
