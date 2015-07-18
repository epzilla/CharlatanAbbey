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

  /**
   * Load all templates from server and cache them client-side
   * @param  {Function} done callback
   */
  window.loadTemplates = function(done) {
    var cachedTemplates = ls.get('templates');

    qwest.get('/api/templates')
      .then(function (response) {
        var el = document.createElement('html');
        el.innerHTML = response;
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
      })
      .catch(function (err) {
        console.error(err);
      });

    if (cachedTemplates) {
      window.templates = cachedTemplates;
      done();
    }
  };

  /**
   * Render a template with optional data
   * @param  {String}   thisTemplate      name of template
   * @param  {String}   intoThatContainer ID of container into which to render
   * @param  {Object}   optionalData      data object
   * @param  {Function} callback
   */
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
