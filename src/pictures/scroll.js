'use strict';

var render = require('./render');
var filter = require('./filter');

module.exports = {
  enable: function() {
    var scrollTimeout;
    window.addEventListener('scroll', function() {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(function() {
        render.renderNextPages(filter.getPicturesFiltered());
      }, 100);
    });
  }
};
