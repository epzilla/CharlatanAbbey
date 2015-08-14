var qwest = require('qwest');

module.exports = {
  get: function(url) {
    return qwest.get(url, null, {
      responseType: 'json'
    });
  },
  post: function(url, data) {
    return qwest.post(url, data, {
      dataType: 'json',
      responseType: 'json'
    });
  },
  put: function(url, data) {
    return qwest.put(url, data, {
      dataType: 'json',
      responseType: 'json'
    });
  },
  upload: function(url, data) {
    return qwest.post(url, data, {
      dataType: 'formdata'
    });
  }
};