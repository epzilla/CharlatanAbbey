/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /babies              ->  index
 * POST    /babies              ->  create
 * GET     /babies/:id          ->  show
 * PUT     /babies/:id          ->  update
 * DELETE  /babies/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var baby = require('./baby.model');

// Get list of babies
exports.index = function (req, res) {
  baby.find(function (err, babies) {
    if(err) { return handleError(res, err); }
    return res.json(
      _.sortBy(babies, 'name')
    );
  });
};

// Get a single baby
exports.show = function (req, res) {
  baby.findById(req.params.id, function (err, baby) {
    if (err) { return handleError(res, err); }
    if (!baby) { return res.send(404); }
    return res.json(baby);
  });
};

// Creates a new baby in the DB.
exports.create = function (req, res) {
  baby.create(req.body, function (err, baby) {
    if(err) { return handleError(res, err); }
    return res.json(201, baby);
  });
};

// Updates an existing baby in the DB.
exports.update = function (req, res) {
  if(req.body._id) { delete req.body._id; }
  baby.findById(req.params.id, function (err, baby) {
    if (err) { return handleError(res, err); }
    if(!baby) { return res.send(404); }
    var updated = _.merge(baby, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, baby);
    });
  });
};

// Deletes a baby from the DB.
exports.destroy = function (req, res) {
  baby.findById(req.params.id, function (err, baby) {
    if(err) { return handleError(res, err); }
    if(!baby) { return res.send(404); }
    baby.remove(function (err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}