'use strict';

var utils = require('../utils');
var container = require('./container');
var gallery = require('../gallery');

// набор шаблонов
var templateElement = document.getElementById('picture-template');

// шаблон для отрисовки одной фотографии
var elementToClone = ('content' in templateElement) ?
  templateElement.content.querySelector('.picture') :
  templateElement.querySelector('.picture');

// размер страницы
var pageSize = 12;

// текущая страница
var pageNumber = 0;

var renderPicture = function(picture) {
  var element = elementToClone.cloneNode(true);
  var img = element.querySelector('img');
  var image = new Image();
  image.onload = function() {
    img.setAttribute('src', picture.url);
  };
  image.onerror = function() {
    element.classList.add('picture-load-failure');
  };
  image.src = picture.url;
  element.querySelector('.picture-comments').textContent = picture.comments;
  element.querySelector('.picture-likes').textContent = picture.likes;
  element.addEventListener('click', function(evt) {
    evt.preventDefault();
    gallery.show(picture.index);
  });
  container.appendChild(element);
  return element;
};

var renderCurrentPage = function(pictures) {
  var from = pageNumber * pageSize;
  var to = from + pageSize;
  pictures
    .slice(from, to)
    .forEach(function(picture) {
      renderPicture(picture);
    });
};

module.exports = {

  resetPage: function() {
    pageNumber = 0;
  },

  renderNextPages: function(pictures) {
    if (pageNumber === 0) {
      container.innerHTML = '';
    }
    while (utils.isBottomReached(container) &&
           utils.isNextPageAvailable(pictures, pageSize, pageNumber)) {
      renderCurrentPage(pictures);
      pageNumber++;
    }
  }

};
