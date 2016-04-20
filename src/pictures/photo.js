'use strict';

var generator = require('./generator');
var utils = require('../utils');
var gallery = require('../gallery');

var Photo = function(data) {
  this.data = data;
  this.element = generator.create(data);
  var index = this.data.index;
  this.clickHandler = function(evt) {
    evt.preventDefault();
    gallery.show(index);
  };
  this.keyHandler = function(evt) {
    if (utils.isActivationEvent(evt)) {
      evt.preventDefault();
      gallery.show(index);
    }
  };
  this.remove = function() {
    this.element.removeEventListener('click', this.clickHandler);
    this.element.removeEventListener('keydown', this.keyHandler);
    this.element.parentNode.removeChild(this.element);
  };
  this.element.addEventListener('click', this.clickHandler);
  this.element.addEventListener('keydown', this.keyHandler);
};

module.exports = Photo;
