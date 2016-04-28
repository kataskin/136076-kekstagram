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
  this.restoreFromHash = this.restoreFromHash.bind(this);
  window.addEventListener('hashchange', this.restoreFromHash);
};

Gallery.prototype.restoreFromHash = function() {
  var regexp = /#photo\/(.*)/i;
  var match = location.hash.match(regexp);
  if (match !== null && match.length > 1) {
    var url = match[1];
    this.show(url);
  } else {
    this.hide();
  }
};

Gallery.prototype.updateCurrentPictureIndex = function(item) {
  switch (typeof item) {
    case 'number':
      this.currentPictureIndex = item;
      break;
    case 'string':
      this.currentPictureIndex = this.pictures.findIndex(function(pic) {
        return pic.url === item;
      });
      break;
    default:
      return;
  }
};
Gallery.prototype.updateHash = function() {
  var pic = this.pictures[this.currentPictureIndex];
  location.hash = 'photo/' + pic.url;
};

Gallery.prototype.cleanHash = function() {
  // при использовании пустой строки слетает скроллинг
  location.hash = 'list';
};

Gallery.prototype.show = function(item) {
  this.updateCurrentPictureIndex(item);
  if (this.currentPictureIndex >= 0) {
    this.showPicture();
    if (this.galleryOverlay.classList.contains('invisible')) {
      this.showNextPicture = this.showNextPicture.bind(this);
      this.galleryImage.addEventListener('click', this.showNextPicture);
      this.onDocumentKeyDown = this.onDocumentKeyDown.bind(this);
      document.addEventListener('keydown', this.onDocumentKeyDown);
      this.hideGalleryByClick = this.hideGalleryByClick.bind(this);
      this.galleryOverlay.addEventListener('click', this.hideGalleryByClick);
      this.galleryOverlay.classList.remove('invisible');
    }
  } else {
    this.hide();
  }
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
    this.cleanHash();
  }
};

Gallery.prototype.showNextPicture = function() {
  this.currentPictureIndex++;
  if (this.currentPictureIndex >= this.pictures.length) {
    this.currentPictureIndex = 0;
  }
  this.updateHash();
};
Gallery.prototype.showPrevPicture = function() {
  this.currentPictureIndex--;
  if (this.currentPictureIndex < 0) {
    this.currentPictureIndex = this.pictures.length - 1;
  }
  this.updateHash();
};

Gallery.prototype.hideGalleryByClick = function(evt) {
  var target = evt.target;
  if (target === this.galleryOverlay ||
      target === this.galleryCloseButton) {
    this.cleanHash();
  }
};

Gallery.prototype.hide = function() {
  if (!this.galleryOverlay.classList.contains('invisible')) {
    this.galleryOverlay.classList.add('invisible');
    this.galleryImage.removeEventListener('click', this.showNextPicture);
    document.removeEventListener('keydown', this.onDocumentKeyDown);
    this.galleryOverlay.removeEventListener('click', this.hideGalleryByClick);
  }
};

module.exports = new Gallery();
