// Avoid `console` errors in browsers that lack a console.
(function() {
  var method;
  var noop = function () {};
  var methods = [
  'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
  'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
  'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
  'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
  ];
  var length = methods.length;
  var console = (window.console = window.console || {});

  while (length--) {
    method = methods[length];

    // Only stub undefined methods.
    if (!console[method]) {
      console[method] = noop;
    }
  }

  window.renderIntoTemplate = function (thisTemplate, intoThatContainer, optionalData, callback) {
    var req = new XMLHttpRequest();
    var handleResponse = function() {
      if (req.readyState === 4) {
        if (req.status < 400) {
          var el = document.createElement('html');
          el.innerHTML = req.responseText;
          var guts = el.querySelector('#' + thisTemplate).innerHTML;
          var template = _.template(guts);
          var container = document.getElementById(intoThatContainer);
          container.innerHTML = template({data: optionalData ? optionalData : null});
          if (callback) {
            callback();
          }
          return container;
        } else {
          console.error(req.responseText);
          return false;
        }
      }
    };

    req.onreadystatechange = handleResponse;
    req.open('GET', '/partials/' + thisTemplate + '.html');
    req.send();
  };
}());
