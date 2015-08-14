module.exports = {
  prefix: 'charlatan',
  get: function (key) {
    var prefixedKey, self;
    self = this;
    prefixedKey = self.prefix.concat('-', key);
    return JSON.parse(window.localStorage.getItem(prefixedKey));
  },
  set: function (key, val) {
    var prefixedKey, self, value;
    self = this;
    prefixedKey = self.prefix.concat('-', key);
    value = JSON.stringify(val);
    window.localStorage.setItem(prefixedKey, value);
    return value;
  }
};