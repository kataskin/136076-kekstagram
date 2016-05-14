'use strict';

var container = require('./container');
var filter = require('./filter');
var scroll = require('./scroll');
var utils = require('../utils');
var gallery = require('../gallery');

var DATA_URL = 'http://o0.github.io/assets/json/pictures.json';

var loadCompleted = function() {

  // HTTP-код ответа должен быть 200 или 304
  if (!utils.isXHRStatusOk(this)) {
    displayLoadingFailure();
    return;
  }

  // парсим и обрабатываем данные
  var pictures = [];
  var response = this.response;
  try {
    pictures = JSON.parse(response);
    pictures.forEach(function(pic) {
      pic.date = new Date(pic.date);
    });
  } catch (e) {
    displayLoadingFailure();
    return;
  }

  // рендерим данные
  container.classList.remove('pictures-loading');
  filter.enable(pictures);
  scroll.enable();

  // применяем состояние галереи
  gallery.restoreFromHash();
};

var displayLoadingFailure = function() {
  container.classList.remove('pictures-loading');
  container.classList.add('pictures-failure');
};

module.exports = {
  load: function() {
    var xhr = new XMLHttpRequest();
    xhr.timeout = 10000;
    xhr.addEventListener('load', loadCompleted);
    xhr.addEventListener('error', displayLoadingFailure);
    xhr.addEventListener('timeout', displayLoadingFailure);
    xhr.open('GET', DATA_URL);
    xhr.send();
    container.classList.add('pictures-loading');
  }
};
