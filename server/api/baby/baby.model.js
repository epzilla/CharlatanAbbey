var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BabySchema = new Schema({
  firstname: String,
  lastname: String,
  birth: String,
  weight: String,
  feeders: [{
  	name: String
  }]
});

module.exports = mongoose.model('Baby', BabySchema);
