var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FeedingSchema = new Schema({
  name: String,
  time: Date,
  burp: String,
  amount: Number,
  diaper: String,
  medicine: String,
  spit: String
});

module.exports = mongoose.model('Feeding', FeedingSchema);
