/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /feedings              ->  index
 * POST    /feedings              ->  create
 * GET     /feedings/:id          ->  show
 * PUT     /feedings/:id          ->  update
 * DELETE  /feedings/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var feeding = require('./feeding.model');

// Get list of feedings
exports.index = function (req, res) {
  feeding.find(function (err, feedings) {
    if(err) { return handleError(res, err); }
    return res.json(
      _.chain(feedings)
        .sortByOrder(['time'], ['desc'])
        .groupBy('name')
        .value()
    );
  });
};

// Get a single feeding
exports.show = function (req, res) {
  feeding.findById(req.params.id, function (err, feeding) {
    if (err) { return handleError(res, err); }
    if (!feeding) { return res.send(404); }
    return res.json(feeding);
  });
};

// Creates a new feeding in the DB.
exports.create = function (req, res) {
  feeding.create(req.body, function (err, feeding) {
    if(err) { return handleError(res, err); }
    return res.json(201, feeding);
  });
};

// Updates an existing feeding in the DB.
exports.update = function (req, res) {
  if(req.body._id) { delete req.body._id; }
  feeding.findById(req.params.id, function (err, feeding) {
    if (err) { return handleError(res, err); }
    if(!feeding) { return res.send(404); }
    var updated = _.merge(feeding, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, feeding);
    });
  });
};

// Deletes a feeding from the DB.
exports.destroy = function (req, res) {
  feeding.findById(req.params.id, function (err, feeding) {
    if(err) { return handleError(res, err); }
    if(!feeding) { return res.send(404); }
    feeding.remove(function (err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}