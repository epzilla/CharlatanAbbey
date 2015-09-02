/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var LogEvent = require('../api/log-event/log-event.model');
var DeprecatedFeeding = require('../api/log-event/feeding-deprecated.model');
var Feeder = require('../api/feeder/feeder.model');
var Baby = require('../api/baby/baby.model');
var TimeLog = require('../api/time-log/time-log.model');

Baby.find(function (err, babies) {
  if (babies && babies.length > 0) {
    return;
  }

  Baby.create({
    name: 'Charlotte',
    birth: "2015-05-22T20:34:00.000Z",
    weight: '10lb 2oz'
  }, {
    name: 'Abby',
    birth: "2015-05-22T20:34:00.000Z",
    weight: '10lb 2oz'
  }, function () {
    console.log('Babies created! <wink wink>');
  });
});

Feeder.find(function (err, feeders) {
  if (feeders && feeders.length > 0) {
    return;
  }

  Feeder.create(
    { name: 'Mommy' },
    { name: 'Daddy' },
    { name: 'Gigi' },
    { name: 'Nana' },
    { name: 'Papa Joe' },
    { name: 'Aunt Tree' },
    { name: 'Harmony' },
    { name: 'Paula' },
    function () {
      console.log('Feeders created!');
    });
});

LogEvent.find(function (err, logEvents) {
  if (!logEvents || logEvents.length === 0) {
    DeprecatedFeeding.find(function (err, feedings) {
      if (feedings && feedings.length > 0) {
        console.log('Feedings found!\nTrying to convert to Log-Events...');
        var i = 0;
        feedings.forEach(function (feeding) {
          LogEvent.create({
            name: feeding.name,
            burp: feeding.burp,
            diaper: feeding.diaper,
            spit: feeding.spit,
            time: feeding.time,
            medicine: feeding.medicine,
            amount: feeding.amount,
            eventType: 'feeding'
          }, function () {
            i++;
            if (i === feedings.length) {
              console.log('Finished. Successfully created ' + i + ' Log-Events.');
            }
          });
        });
      }
    });
  }
});

TimeLog.find(function (err, timeLogEvents) {
  if (!timeLogEvents || timeLogEvents.length === 0) {
    TimeLog.create(
      {
        date: '2015-08-28T19:00:10.000Z',
        timeIn: '2015-08-28T19:00:10.000Z',
        timeOut: '2015-08-29T00:00:10.000Z',
        hours: 5
      },
      {
        date: '2015-08-29T14:00:10.000Z',
        timeIn: '2015-08-29T14:00:10.000Z',
        timeOut: '2015-08-29T18:00:10.000Z',
        hours: 4
      },
      {
        date: '2015-08-31T15:00:10.000Z',
        timeIn: '2015-08-31T15:00:10.000Z',
        timeOut: '2015-09-01T01:00:10.000Z',
        hours: 10
      },
      {
        date: '2015-09-01T15:00:10.000Z',
        timeIn: '2015-09-01T15:00:10.000Z',
        timeOut: '2015-09-01T23:00:10.000Z',
        hours: 8
      },
      {
        date: '2015-09-02T15:00:10.000Z',
        timeIn: '2015-09-02T15:00:10.000Z',
        timeOut: '2015-09-02T23:00:10.000Z',
        hours: 8
      },
      function () {
        console.log('Time Logs created!');
      });
  }
});
