'use strict';

var filters = document.querySelector('.filters');
var pictureContainer = document.querySelector('.pictures');
var templateElement = document.getElementById('picture-template');
var elementToClone;

filters.classList.add('hidden');

if ('content' in templateElement) {
  elementToClone = templateElement.content.querySelector('.picture');
} else {
  elementToClone = templateElement.querySelector('.picture');
}

var getPictureElement = function(picture, container) {
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
  container.appendChild(element);
  return element;
};

window.pictures.forEach(function(picture) {
  getPictureElement(picture, pictureContainer);
});
