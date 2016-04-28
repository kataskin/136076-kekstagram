'use strict';

// шаблон
var templates = document.getElementById('picture-template');
var template = ('content' in templates) ?
  templates.content.querySelector('.picture') :
  templates.querySelector('.picture');

var create = function(picture) {
  var element = template.cloneNode(true);
  element.setAttribute('href', '#photo/' + picture.url);
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
  return element;
};

module.exports = {
  create: create
};
