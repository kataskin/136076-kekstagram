'use strict';

var generator = require('./generator');
var utils = require('../utils');

var Photo = function(data) {
  this.data = data;
  this.element = generator.create(data);
  this.clickHandler = this.clickHandler.bind(this);
  this.element.addEventListener('click', this.clickHandler);
  this.keyHandler = this.keyHandler.bind(this);
  this.element.addEventListener('keydown', this.keyHandler);
};

Photo.prototype.showGallery = function() {
  location.hash = 'photo/' + this.data.url;
};

Photo.prototype.clickHandler = function(evt) {
  evt.preventDefault();
};
Photo.prototype.keyHandler = function(evt) {
  if (utils.isActivationEvent(evt)) {
    evt.preventDefault();
    this.showGallery();
  }
};

Photo.prototype.remove = function() {
  this.element.removeEventListener('click', this.clickHandler);
  this.element.removeEventListener('keydown', this.keyHandler);
  this.element.parentNode.removeChild(this.element);
};

module.exports = Photo;
