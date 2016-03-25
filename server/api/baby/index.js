'use strict';

var express = require('express');
var controller = require('./baby.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.post('/search', controller.find);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);
router.post('/initialize', controller.initialize);

module.exports = router;