var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BabySchema = new Schema({
  name: String,
  birth: Date,
  weight: String,
  feeders: [{
  	name: String
  }]
});

module.exports = mongoose.model('Baby', BabySchema);
