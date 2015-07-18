var address, env, port;
env = 'dev';

if (env === 'prod' || env === 'production') {
  address = 'http://some-place-tbd.com';
  port = 80;
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
  PROD_DB_ADDRESS: 'mongodb://user:pass@appnum.mongolab.com:port/heroku_app_id_num',
  TEMPLATE_DIR: 'partials'
};
