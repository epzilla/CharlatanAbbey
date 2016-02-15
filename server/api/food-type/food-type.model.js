var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FoodTypeSchema = new Schema({
  name: String,
  img: String
});

module.exports = mongoose.model('FoodType', FoodTypeSchema);
