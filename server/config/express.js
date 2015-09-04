/**
 * Express configuration
 */

'use strict';

var express = require('express');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var errorHandler = require('errorhandler');
var path = require('path');
var config = require('./environment');
// var passport = require('passport');
// var session = require('express-session');
// var mongoStore = require('connect-mongo')(session);
// var mongoose = require('mongoose');

module.exports = function(app) {
  var env = app.get('env');

  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');
  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(cookieParser());

  if ('production' === env || 'prod' === env) {
    config.root = path.normalize(__dirname + '/..');
    app.set('views', config.root + '/views');
    app.use(favicon(path.join(config.root, 'img', 'favicon.ico')));
    app.use(express.static(path.join(config.root)));
    app.set('appPath', config.root);
    app.use(morgan('dev'));
  } else {
    app.set('views', config.root + '/server/views');
    app.use(express.static(path.join(config.root, '.tmp')));
    app.use(express.static(path.join(config.root, 'client')));
    app.set('appPath', 'client');
    app.use(morgan('dev'));
    app.use(errorHandler()); // Error handler - has to be last
  }
};
