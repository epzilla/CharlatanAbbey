var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var morgan = require('morgan');
var path = require('path');
var conf = require('./config');
var routes = require('./routes/api');
var server = require('http').createServer(app);

port = conf.PORT || 3000;
env = conf.ENVIRONMENT || 'dev';
app.use(morgan('dev'));
app.use(bodyParser());

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express["static"](path.join(__dirname, './')));
app.set('views', path.join(__dirname, './'));

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  return next();
});

mongoose = require('mongoose');

if (env === 'prod' || env === 'production') {
  mongoose.connect(conf.PROD_DB_ADDRESS);
} else {
  mongoose.connect(conf.DEV_DB_ADDRESS);
}

app.use('/api', routes);
app.set('port', port);

app.get('/*', function(req, res) {
  console.log('loading index file');
  res.render('./index.html');
});

server.listen(app.get('port'), function() {
  console.info('server listening on port ' + port);
});
