/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /feeders              ->  index
 * POST    /feeders              ->  create
 * GET     /feeders/:id          ->  show
 * PUT     /feeders/:id          ->  update
 * DELETE  /feeders/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var feeder = require('./feeder.model');

// Get list of feeders
exports.index = function (req, res) {
  feeder.find(function (err, feeders) {
    if(err) { return handleError(res, err); }
    return res.json(feeders);
  });
};

// Get a single feeder
exports.show = function (req, res) {
  feeder.findById(req.params.id, function (err, feeder) {
    if (err) { return handleError(res, err); }
    if (!feeder) { return res.send(404); }
    return res.json(feeder);
  });
};

// Creates a new feeder in the DB.
exports.create = function (req, res) {
  feeder.create(req.body, function (err, feeder) {
    if(err) { return handleError(res, err); }
    return res.json(201, feeder);
  });
};

// Updates an existing feeder in the DB.
exports.update = function (req, res) {
  if(req.body._id) { delete req.body._id; }
  feeder.findById(req.params.id, function (err, feeder) {
    if (err) { return handleError(res, err); }
    if(!feeder) { return res.send(404); }
    var updated = _.merge(feeder, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, feeder);
    });
  });
};

// Deletes a feeder from the DB.
exports.destroy = function (req, res) {
  feeder.findById(req.params.id, function (err, feeder) {
    if(err) { return handleError(res, err); }
    if(!feeder) { return res.send(404); }
    feeder.remove(function (err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}