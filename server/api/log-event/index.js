'use strict';

var express = require('express');
var controller = require('./log-event.controller');

var router = express.Router();

router.get('/babies/:id', controller.index);
router.get('/feedings/babies/:id', controller.findAllFeedings);
router.get('/diapers/babies/:id', controller.findAllDiapers);
router.get('/meds/babies/:id', controller.findAllMedications);
router.get('/spits/babies/:id', controller.findAllSpitups);
router.get('/:id', controller.show);

router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;