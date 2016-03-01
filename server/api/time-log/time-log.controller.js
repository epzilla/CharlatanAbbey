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
var moment = require('moment-timezone');

// Get list of time-logs by baby ID
exports.index = function (req, res) {
  timeLog.find({ babyID: { '$in': req.params.id.split(',') }}, function (err, timeLogEvent) {
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
  if (req.body._id) { delete req.body._id; }

  if (req.body.hours) {
    // This is an edit
    timeLog.findById(req.params.id, function (err, timeLogEvent) {
      if (err) { return handleError(res, err); }
      if(!timeLogEvent) { return res.send(404); }
      var updated = _.merge(timeLogEvent, req.body);
      updated.save(function (err) {
        if (err) { return handleError(res, err); }
        return res.json(200, timeLogEvent);
      });
    });
  } else {
    // This is a clock-out
    timeLog.findById(req.params.id, function (err, timeLogEvent) {
      if (err) { return handleError(res, err); }
      if(!timeLogEvent) { return res.send(404); }

      var updated = _.merge(timeLogEvent, req.body);
      var hours = moment(updated.timeOut).diff(moment(updated.timeIn), 'hours', true);
      updated.hours = hours.toFixed(2);

      updated.save(function (err) {
        if (err) { return handleError(res, err); }
        return res.json(200, timeLogEvent);
      });
    });
  }
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