'use strict';

var render = require('./render');
var filter = require('./filter');

var enableScrolling = function() {
  var scrollTimeout;
  window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function() {
      render.renderNextPages(filter.getPicturesFiltered());
    }, 100);
  });
};

module.exports = enableScrolling;
