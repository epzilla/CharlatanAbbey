// Avoid `console` errors in browsers that lack a console.
(function() {

  /**
   * LocalStorage helper
   */
  window.ls = {
    // Prefix to use for LocalStorage keys
    prefix: 'charlatan-abbey',

    /**
     * Store item in LocalStorage
     * @param  {String} key - The key to store the item under
     * @param  {Object} val - The object to store
     * @return {Object} val
     */
    set: function(key, val) {
      window.localStorage.setItem(this.prefix + '-' + key, JSON.stringify(val));
      return val;
    },

    /**
     * Retrieve an object from LocalStorage
     * @param  {String} key - The key of the item to retrieve
     * @return {Object}
     */
    get: function(key) {
      return JSON.parse(window.localStorage.getItem(this.prefix + '-' + key));
    },

    /**
     * Remove an object from LocalStorage
     * @param  {String} key - The key of the item to remove
     */
    remove: function(key) {
      window.localStorage.removeItem(this.prefix + '-' + key);
    }
  };

  window.loadTemplates = function(done) {
    var cachedTemplates = ls.get('templates');
    var req = new XMLHttpRequest();

    var handleResponse = function() {
      if (req.readyState === 4) {
        if (req.status >= 200 && req.status < 400) {
          var el = document.createElement('html');
          el.innerHTML = req.responseText;
          var templateNodes = el.querySelectorAll('script');
          var templates = [];

          [].forEach.call(templateNodes, function (node) {
            templates.push({
              id: node.getAttribute('id').replace(/\\"/g, ''),
              template: node.innerHTML
            });
          });

          window.templates = templates;
          window.ls.set('templates', templates);

          if (!cachedTemplates) {
            done();
          }
        } else {
          console.error(req.responseText);
          return false;
        }
      }
    };

    req.onreadystatechange = handleResponse;
    req.open('GET', '/api/templates');
    req.send();

    if (cachedTemplates) {
      window.templates = cachedTemplates;
      done();
    }
  };

  window.renderIntoTemplate = function (thisTemplate, intoThatContainer, optionalData, callback) {
    var container = document.getElementById(intoThatContainer);
    var rawTemplate = _.find(window.templates, {id: thisTemplate}).template;
    var template = _.template(rawTemplate.replace(/\\n/g, '').replace(/\\"/g, '"'));
    container.innerHTML = template({data: optionalData ? optionalData : null});

    if (callback) {
      callback();
    }
  };

}());
