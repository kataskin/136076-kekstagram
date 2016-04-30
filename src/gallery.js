'use strict';

var Gallery = function() {
  this.galleryOverlay = document.querySelector('.gallery-overlay');
  this.galleryImage = this.galleryOverlay.querySelector('.gallery-overlay-image');
  this.galleryLikesCount = this.galleryOverlay.querySelector('.likes-count');
  this.galleryCommentsCount = this.galleryOverlay.querySelector('.comments-count');
  this.galleryCloseButton = this.galleryOverlay.querySelector('.gallery-overlay-close');
  this.pictures = [];
  this.currentPictureIndex = 0;
  this.imageOnLoad = this.imageOnLoad.bind(this);
  this.imageOnError = this.imageOnError.bind(this);
};

Gallery.prototype.show = function(startIndex) {
  this.currentPictureIndex = startIndex;
  this.showPicture();
  this.showNextPicture = this.showNextPicture.bind(this);
  this.galleryImage.addEventListener('click', this.showNextPicture);
  this.onDocumentKeyDown = this.onDocumentKeyDown.bind(this);
  document.addEventListener('keydown', this.onDocumentKeyDown);
  this.hideGalleryByClick = this.hideGalleryByClick.bind(this);
  this.galleryOverlay.addEventListener('click', this.hideGalleryByClick);
  this.galleryOverlay.classList.remove('invisible');
};

Gallery.prototype.imageOnLoad = function(evt) {
  this.galleryImage.classList.remove('picture-load-failure');
  this.galleryImage.setAttribute('src', evt.target.src);
};

Gallery.prototype.imageOnError = function() {
  this.galleryImage.classList.add('picture-load-failure');
  this.galleryImage.setAttribute('src', 'img/logo-mask.png');
};

Gallery.prototype.showPicture = function() {
  var picture = this.pictures[this.currentPictureIndex];
  this.galleryLikesCount.textContent = picture.likes;
  this.galleryCommentsCount.textContent = picture.comments;
  var image = new Image();
  image.onload = this.imageOnLoad;
  image.onerror = this.imageOnError;
  image.src = picture.url;
};

Gallery.prototype.update = function(pics) {
  this.pictures = pics;
};

Gallery.prototype.onDocumentKeyDown = function(evt) {
  var key = evt.keyCode;

  // next: → ↓ d s space
  if ([39, 40, 68, 83, 32].includes(key)) {
    evt.preventDefault();
    this.showNextPicture();
  } else

  // prev: ← ↑ a w
  if ([37, 38, 65, 87].includes(key)) {
    evt.preventDefault();
    this.showPrevPicture();
  } else

  // hide: esc
  if (key === 27) {
    evt.preventDefault();
    this.hide();
  }
};

Gallery.prototype.showNextPicture = function() {
  this.currentPictureIndex++;
  if (this.currentPictureIndex >= this.pictures.length) {
    this.currentPictureIndex = 0;
  }
  this.showPicture();
};
Gallery.prototype.showPrevPicture = function() {
  this.currentPictureIndex--;
  if (this.currentPictureIndex < 0) {
    this.currentPictureIndex = this.pictures.length - 1;
  }
  this.showPicture();
};

Gallery.prototype.hideGalleryByClick = function(evt) {
  var target = evt.target;
  if (target === this.galleryOverlay ||
      target === this.galleryCloseButton) {
    this.hide();
  }
};

Gallery.prototype.hide = function() {
  this.galleryOverlay.classList.add('invisible');
  this.galleryImage.removeEventListener('click', this.showNextPicture);
  document.removeEventListener('keydown', this.onDocumentKeyDown);
  this.galleryOverlay.removeEventListener('click', this.hideGalleryByClick);
};

module.exports = new Gallery();
