/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /time-log              ->  index
 * POST    /time-log              ->  create
 * GET     /time-log/:id          ->  show
 * PUT     /time-log/:id          ->  update
 * DELETE  /time-log/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var timeLog = require('./time-log.model');

// Get list of time-logs
exports.index = function (req, res) {
  timeLog.find(function (err, timeLogEvent) {
    if(err) { return handleError(res, err); }
    return res.json(timeLogEvent);
  });
};

// Get a single time-log
exports.show = function (req, res) {
  timeLog.findById(req.params.id, function (err, timeLogEvent) {
    if (err) { return handleError(res, err); }
    if (!timeLogEvent) { return res.send(404); }
    return res.json(timeLogEvent);
  });
};

// Creates a new time-log in the DB.
exports.create = function (req, res) {
  timeLog.create(req.body, function (err, timeLogEvent) {
    if(err) { return handleError(res, err); }
    return res.json(201, timeLogEvent);
  });
};

// Updates an existing time-log in the DB.
exports.update = function (req, res) {
  if(req.body._id) { delete req.body._id; }
  timeLog.findById(req.params.id, function (err, timeLogEvent) {
    if (err) { return handleError(res, err); }
    if(!timeLogEvent) { return res.send(404); }
    var updated = _.merge(timeLogEvent, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, timeLogEvent);
    });
  });
};

// Deletes a time-log from the DB.
exports.destroy = function (req, res) {
  timeLog.findById(req.params.id, function (err, timeLogEvent) {
    if(err) { return handleError(res, err); }
    if(!timeLogEvent) { return res.send(404); }
    timeLogEvent.remove(function (err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}