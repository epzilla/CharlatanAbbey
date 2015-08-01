var address, env, port;
env = process.env.NODE_ENV || 'dev';

if (env === 'prod' || env === 'production') {
  address = 'http://charlatan-abbey.herokuapp.com';
  port = process.env.PORT || 80;
} else {
  address = 'http://localhost';
  port = 3000;
}

module.exports = {
  ENVIRONMENT: env,
  PORT: port,
  API_URL: '/api/',
  LOCAL_STORAGE_PREFIX: 'charlatan-abbey',
  ADDRESS: address,
  DEV_DB_ADDRESS: 'mongodb://localhost:27017/charlatan',
  PROD_DB_ADDRESS: 'mongodb://archimedes:pinfeathers&gullyfluff@ds053808.mongolab.com:53808/heroku_mkjhj5wg',
  TEMPLATE_DIR: 'partials'
};
