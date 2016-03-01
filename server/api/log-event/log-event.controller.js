/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /logEvents              ->  index
 * POST    /logEvents              ->  create
 * GET     /logEvents/:id          ->  show
 * PUT     /logEvents/:id          ->  update
 * DELETE  /logEvents/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var logEvent = require('./log-event.model');

var sortedGroupedList = function (things) {
  return _.chain(things)
      .sortByOrder(['time'], ['desc'])
      .groupBy('name')
      .value();
};

// Get list of logEvents by array of baby IDs
exports.index = function (req, res) {
  logEvent.find({babyID: {'$in': req.params.id.split(',')}}, function (err, logEvents) {
    if(err) { return handleError(res, err); }
    return res.json(_.sortByOrder(logEvents, ['time', 'desc']));
  });
};

// Get a single logEvent
exports.show = function (req, res) {
  logEvent.findById(req.params.id, function (err, logEvent) {
    if (err) { return handleError(res, err); }
    if (!logEvent) { return res.send(404); }
    return res.json(logEvent);
  });
};

// Creates a new logEvent in the DB.
exports.create = function (req, res) {
  logEvent.create(req.body, function (err, logEvent) {
    if(err) { return handleError(res, err); }
    return res.json(201, logEvent);
  });
};

// Updates an existing logEvent in the DB.
exports.update = function (req, res) {
  if(req.body._id) { delete req.body._id; }
  logEvent.findById(req.params.id, function (err, logEvent) {
    if (err) { return handleError(res, err); }
    if(!logEvent) { return res.send(404); }
    var updated = _.merge(logEvent, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, logEvent);
    });
  });
};

// Deletes a logEvent from the DB.
exports.destroy = function (req, res) {
  logEvent.findById(req.params.id, function (err, logEvent) {
    if(err) { return handleError(res, err); }
    if(!logEvent) { return res.send(404); }
    logEvent.remove(function (err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

exports.findAllFeedings = function (req, res) {
  logEvent.find({
    babyID: { '$in': req.params.id.split(',') },
    eventType: 'feeding'}, function (err, feedings) {
    if(err) { return handleError(res, err); }
    return res.json(sortedGroupedList(feedings));
  });
};

exports.findAllDiapers = function (req, res) {
  logEvent.find({ babyID: { '$in': req.params.id.split(',') }})
    .exists('diaper')
    .exec(function (err, diapers) {
      if(err) { return handleError(res, err); }
      return res.json(sortedGroupedList(diapers));
  });
};

exports.findAllMedications = function (req, res) {
  logEvent.find({ babyID: { '$in': req.params.id.split(',') }})
    .exists('medicine')
    .exec(function (err, meds) {
      if(err) { return handleError(res, err); }
      return res.json(sortedGroupedList(meds));
  });
};

exports.findAllSpitups = function (req, res) {
  logEvent.find({ babyID: { '$in': req.params.id.split(',') }})
    .where('spit')
    .nin([null, 'no', 'none'])
    .exec(function (err, spits) {
      if(err) { return handleError(res, err); }
      return res.json(sortedGroupedList(spits));
  });
};


function handleError(res, err) {
  return res.send(500, err);
}