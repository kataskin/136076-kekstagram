'use strict';

var filtersForm = document.querySelector('.filters');
var pictureContainer = document.querySelector('.pictures');
var templateElement = document.getElementById('picture-template');
var elementToClone;
var picturesArr = [];
var xhr = new XMLHttpRequest();

xhr.open('GET', 'http://o0.github.io/assets/json/pictures.json');

var displayLoadingFailure = function() {
  pictureContainer.classList.remove('pictures-loading');
  pictureContainer.classList.add('pictures-failure');
};

xhr.onload = function() {

  // HTTP-код ответа должен быть 200 или 304
  var code = xhr.status;
  if (code !== 200 && code !== 304) {
    displayLoadingFailure();
    return;
  }

  // парсим и обрабатываем данные (в обоих операциях могут быть ошибки)
  var response = xhr.response;
  try {
    picturesArr = JSON.parse(response);
    picturesArr.forEach(function(pic) {
      pic.date = new Date(pic.date);
    });
  } catch (e) {
    displayLoadingFailure();
    return;
  }

  // рендерим данные
  pictureContainer.classList.remove('pictures-loading');
  renderPictures(picturesArr);
  setFiltrationEnabled();
};

xhr.timeout = 10000;
xhr.addEventListener('timeout', displayLoadingFailure);
xhr.addEventListener('error', displayLoadingFailure);
xhr.send();
pictureContainer.classList.add('pictures-loading');

var renderPictures = function(pictures) {
  pictureContainer.innerHTML = '';
  pictures.forEach(function(picture) {
    getPictureElement(picture, pictureContainer);
  });
};

var setFiltrationEnabled = function() {
  var filters = document.querySelectorAll('.filters-radio');
  for (var i = 0; i < filters.length; i++) {
    filters[i].onclick = function() {
      setFilterEnabled(this.id);
    };
  }
  filtersForm.classList.remove('hidden');
};

var setFilterEnabled = function(filter) {
  var filteredPictures = getFilteredPictures(picturesArr, filter);
  renderPictures(filteredPictures);
};

var getFilteredPictures = function(pictures, filter) {
  var picturesToFilter = picturesArr.slice(0);

  switch (filter) {
    case 'filter-discussed':
      picturesToFilter.sort(function(a, b) {
        return b.comments - a.comments;
      });
      break;
    case 'filter-new':
      var twoWeeksAgo = +new Date() - 2 * 7 * 24 * 60 * 60 * 1000;
      picturesToFilter = picturesToFilter.filter(function(pic) {
        return pic.date > twoWeeksAgo;
      });
      picturesToFilter.sort(function(a, b) {
        return b.date - a.date;
      });
      break;
  }
  return picturesToFilter;
};

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
