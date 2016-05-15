'use strict';

// шаблон
var templates = document.getElementById('picture-template');
var template = ('content' in templates) ?
  templates.content.querySelector('.picture') :
  templates.querySelector('.picture');

var generate = function(picture) {
  var element = template.cloneNode(true);
  element.setAttribute('href', '#photo/' + picture.url);
  var img = element.querySelector('img');
  var image = new Image();
  var timeoutTimer;
  var stopTimeoutTimer = function() {
    if (timeoutTimer) {
      clearTimeout(timeoutTimer);
      timeoutTimer = null;
    }
  };
  var imageLoadingFail = function() {
    stopTimeoutTimer();
    image.onload = image.onerror = null;
    element.classList.add('picture-load-failure');
  };
  var imageLoaded = function() {
    stopTimeoutTimer();
    image.onload = image.onerror = null;
    img.setAttribute('src', picture.url);
  };
  image.onload = imageLoaded;
  image.onerror = imageLoadingFail;
  timeoutTimer = setTimeout(imageLoadingFail, 1000); // проверить можно на 20-30мс
  image.src = picture.url;
  element.querySelector('.picture-comments').textContent = picture.comments;
  element.querySelector('.picture-likes').textContent = picture.likes;
  return element;
};

module.exports = generate;
