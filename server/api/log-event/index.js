'use strict';

var express = require('express');
var controller = require('./log-event.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/feedings', controller.findAllFeedings);
router.get('/diapers', controller.findAllDiapers);
router.get('/meds', controller.findAllMedications);
router.get('/spits', controller.findAllSpitups);
router.get('/:id', controller.show);

router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;