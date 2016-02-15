/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /food-types              ->  index
 * POST    /food-types              ->  create
 * GET     /food-types/:id          ->  show
 * PUT     /food-types/:id          ->  update
 * DELETE  /food-types/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var foodType = require('./food-type.model');

// Get list of foodTypes
exports.index = function (req, res) {
  foodType.find(function (err, foodTypes) {
    if(err) { return handleError(res, err); }
    return res.json(foodTypes);
  });
};

// Get a single foodType
exports.show = function (req, res) {
  foodType.findById(req.params.id, function (err, foodType) {
    if (err) { return handleError(res, err); }
    if (!foodType) { return res.send(404); }
    return res.json(foodType);
  });
};

// Creates a new foodType in the DB.
exports.create = function (req, res) {
  foodType.create(req.body, function (err, foodType) {
    if(err) { return handleError(res, err); }
    return res.json(201, foodType);
  });
};

// Updates an existing foodType in the DB.
exports.update = function (req, res) {
  if(req.body._id) { delete req.body._id; }
  foodType.findById(req.params.id, function (err, foodType) {
    if (err) { return handleError(res, err); }
    if(!foodType) { return res.send(404); }
    var updated = _.merge(foodType, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, foodType);
    });
  });
};

// Deletes a foodType from the DB.
exports.destroy = function (req, res) {
  foodType.findById(req.params.id, function (err, foodType) {
    if(err) { return handleError(res, err); }
    if(!foodType) { return res.send(404); }
    foodType.remove(function (err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}