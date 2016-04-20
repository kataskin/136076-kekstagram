'use strict';

var utils = require('../utils');
var container = require('./container');
var Photo = require('./photo');

// размер страницы
var pageSize = 12;

// текущая страница
var pageNumber = 0;

// объекты отрисованных сейчас фотографий
var renderedPhotos = [];

var renderCurrentPage = function(pictures) {
  var from = pageNumber * pageSize;
  var to = from + pageSize;
  var frag = document.createDocumentFragment();
  pictures
    .slice(from, to)
    .forEach(function(item) {
      var photo = new Photo(item);
      renderedPhotos.push(photo);
      frag.appendChild(photo.element);
    });
  container.appendChild(frag);
};

var clearRenderedPhotos = function() {
  renderedPhotos.forEach(function(item) {
    item.remove();
  });
  renderedPhotos = [];
};

module.exports = {

  resetPage: function() {
    pageNumber = 0;
    clearRenderedPhotos();
  },

  renderNextPages: function(pictures) {
    while (utils.isBottomReached(container) &&
           utils.isNextPageAvailable(pictures, pageSize, pageNumber)) {
      renderCurrentPage(pictures);
      pageNumber++;
    }
  }

};
