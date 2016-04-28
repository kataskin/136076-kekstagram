'use strict';

var generator = require('./generator');
var utils = require('../utils');
var gallery = require('../gallery');

var Photo = function(data) {
  this.data = data;
  this.element = generator.create(data);
  this.index = this.data.index;
  this.clickHandler = this.clickHandler.bind(this);
  this.element.addEventListener('click', this.clickHandler);
  this.keyHandler = this.keyHandler.bind(this);
  this.element.addEventListener('keydown', this.keyHandler);
};

Photo.prototype.clickHandler = function(evt) {
  evt.preventDefault();
  gallery.show(this.index);
};
Photo.prototype.keyHandler = function(evt) {
  if (utils.isActivationEvent(evt)) {
    evt.preventDefault();
    gallery.show(this.index);
  }
};

Photo.prototype.remove = function() {
  this.element.removeEventListener('click', this.clickHandler);
  this.element.removeEventListener('keydown', this.keyHandler);
  this.element.parentNode.removeChild(this.element);
};

module.exports = Photo;
