var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BabySchema = new Schema({
  firstname: String,
  lastname: String,
  sex: String,
  birth: String,
  weight: String,
  feeders: [{
  	name: String
  }],
  meds: [{
    name: String,
    dosage: String,
    hours: Number
  }],
  defaults: {
    hours: Number,
    ounces: Number
  }
});

module.exports = mongoose.model('Baby', BabySchema);
