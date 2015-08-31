module.exports = {
  prefix: 'charlatan',
  get: function (key) {
    var prefixedKey, self;
    self = this;
    prefixedKey = self.prefix.concat('-', key);
    if (window.localStorage && window.localStorage.getItem) {
      try {
        return JSON.parse(window.localStorage.getItem(prefixedKey));
      } catch (e) {
        return;
      }
    }
  },
  set: function (key, val) {
    var prefixedKey, self, value;
    self = this;
    prefixedKey = self.prefix.concat('-', key);
    value = JSON.stringify(val);
    if (window.localStorage && window.localStorage.setItem) {
      try {
        window.localStorage.setItem(prefixedKey, value);
        return value;
      } catch (e) {
        return value;
      }
    }
  }
};