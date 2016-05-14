'use strict';

var filter = require('./filter');
var scroll = require('./scroll');
var utils = require('../utils');
var gallery = require('../gallery');

var container = document.querySelector('.pictures');

var DATA_URL = 'http://o0.github.io/assets/json/pictures.json';

var loadCompleted = function(evt) {
  var xhr = evt.target;
  removeHandlers(xhr);

  // HTTP-код ответа должен быть 200 или 304
  if (!utils.isXHRStatusOk(xhr)) {
    displayLoadingFailure();
    return;
  }

  // парсим и обрабатываем данные
  var pictures = [];
  var response = xhr.response;
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

var displayLoadingFailure = function(evt) {
  removeHandlers(evt.target);
  container.classList.remove('pictures-loading');
  container.classList.add('pictures-failure');
};

var removeHandlers = function(xhr) {
  xhr.removeEventListener('load', loadCompleted);
  xhr.removeEventListener('error', displayLoadingFailure);
  xhr.removeEventListener('timeout', displayLoadingFailure);
};

var load = function() {
  var xhr = new XMLHttpRequest();
  xhr.timeout = 10000;
  xhr.addEventListener('load', loadCompleted);
  xhr.addEventListener('error', displayLoadingFailure);
  xhr.addEventListener('timeout', displayLoadingFailure);
  xhr.open('GET', DATA_URL);
  xhr.send();
  container.classList.add('pictures-loading');
};

module.exports = load;
