'use strict';

var Gallery = function() {
  var self = this;

  var galleryOverlay = document.querySelector('.gallery-overlay');
  var galleryImage = galleryOverlay.querySelector('.gallery-overlay-image');
  var galleryLikesCount = galleryOverlay.querySelector('.likes-count');
  var galleryCommentsCount = galleryOverlay.querySelector('.comments-count');
  var galleryCloseButton = galleryOverlay.querySelector('.gallery-overlay-close');

  var pictures = [];
  var currentPictureIndex = 0;

  this.update = function(pics) {
    pictures = pics;
  };

  this.show = function(startIndex) {
    currentPictureIndex = startIndex;
    showPicture();
    galleryImage.addEventListener('click', showNextPicture);
    document.addEventListener('keydown', onDocumentKeyDown);
    galleryOverlay.addEventListener('click', hideGalleryByClick);
    galleryOverlay.classList.remove('invisible');
  };

  var showPicture = function() {
    var picture = pictures[currentPictureIndex];
    galleryLikesCount.textContent = picture.likes;
    galleryCommentsCount.textContent = picture.comments;
    var image = new Image();
    image.onload = function() {
      galleryImage.classList.remove('picture-load-failure');
      galleryImage.setAttribute('src', picture.url);
    };
    image.onerror = function() {
      galleryImage.classList.add('picture-load-failure');
      galleryImage.setAttribute('src', 'img/logo-mask.png');
    };
    image.src = picture.url;
  };

  var onDocumentKeyDown = function(evt) {
    var key = evt.keyCode;

    // next: → ↓ d s space
    if ([39, 40, 68, 83, 32].includes(key)) {
      evt.preventDefault();
      showNextPicture();
    } else

    // prev: ← ↑ a w
    if ([37, 38, 65, 87].includes(key)) {
      evt.preventDefault();
      showPrevPicture();
    } else

    // hide: esc
    if (key === 27) {
      evt.preventDefault();
      self.hide();
    }
  };
  var showNextPicture = function() {
    currentPictureIndex++;
    if (currentPictureIndex >= pictures.length) {
      currentPictureIndex = 0;
    }
    showPicture();
  };
  var showPrevPicture = function() {
    currentPictureIndex--;
    if (currentPictureIndex < 0) {
      currentPictureIndex = pictures.length - 1;
    }
    showPicture();
  };

  var hideGalleryByClick = function(evt) {
    var target = evt.target;
    if (target === galleryOverlay ||
        target === galleryCloseButton) {
      self.hide();
    }
  };

  this.hide = function() {
    galleryOverlay.classList.add('invisible');
    galleryImage.removeEventListener('click', showNextPicture);
    document.removeEventListener('keydown', onDocumentKeyDown);
    galleryOverlay.removeEventListener('click', hideGalleryByClick);
  };
};

module.exports = new Gallery();
