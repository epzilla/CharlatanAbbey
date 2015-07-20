var router = require('express').Router();
var _ = require('lodash');
var fs = require('fs');
var config = require('../config');
var Feeding = require('../models/feeding');

router.use(function(req, res, next) {
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Origin, Access-Control-Allow-Methods');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Origin', '*');
  return next();
});

router.get('/feedings', function (req, res) {
  Feeding.find()
    .sort({'time': 'desc'})
    .exec(function(err, feedings) {
      if (err) {
        res.status(500).send(err);
      }
      res.json(_.groupBy(feedings, 'name'));
    });
});

router.post('/feedings', function (req, res) {
  var feeding = new Feeding(req.body);
  feeding.save(function (err) {
    if (err) {
      res.status(500).send(err);
    }
    res.json(feeding);
  });
});

router.get('/templates', function (req, res) {
  fs.readdir(config.TEMPLATE_DIR, function (err, files) {
    if (err) {
      res.status(500).send(err);
    }

    var templates = [];

    files.forEach(function (file) {
      templates.push(fs.readFileSync(config.TEMPLATE_DIR + '/' + file, {
        encoding: 'utf-8'
      }));
    });

    res.send(templates);
  });
});

module.exports = router;
