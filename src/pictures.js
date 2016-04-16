'use strict';

// форма с кнопками сортировки
var filtersForm = document.querySelector('.filters');

// изначально - пустой div, контейнер для отрисовки фотографий
var pictureContainer = document.querySelector('.pictures');

// набор шаблонов
var templateElement = document.getElementById('picture-template');

// шаблон для отрисовки одной фотографии
var elementToClone = ('content' in templateElement) ?
  templateElement.content.querySelector('.picture') :
  templateElement.querySelector('.picture');

// массив данных (исходный и обработанный)
var picturesArr = [];
var picturesFiltered = [];

// XMLHttpRequest
var xhr = new XMLHttpRequest();
var loadData = function() {
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
    setFilterEnabled();
    setFiltrationEnabled();
    setScrollEnabled();
  };

  xhr.timeout = 10000;
  xhr.addEventListener('timeout', displayLoadingFailure);
  xhr.addEventListener('error', displayLoadingFailure);
  xhr.send();
  pictureContainer.classList.add('pictures-loading');
};
loadData();

// настройки страниц
var pageSize = 12;
var pageNumber = 0;

// отрисовка
var renderPicture = function(picture) {
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
  pictureContainer.appendChild(element);
  return element;
};
var renderCurrentPage = function() {
  var from = pageNumber * pageSize;
  var to = from + pageSize;
  picturesFiltered
    .slice(from, to)
    .forEach(function(picture) {
      renderPicture(picture);
    });
};
var renderNextPages = function() {
  if (pageNumber === 0) {
    pictureContainer.innerHTML = '';
  }
  while (isBottomReached() && isNextPageAvailable()) {
    renderCurrentPage();
    pageNumber++;
  }
};

// скроллинг
var isBottomReached = function() {
  var bottom = pictureContainer.getBoundingClientRect().bottom;
  var height = window.innerHeight;
  return bottom <= height + 100;
};
var isNextPageAvailable = function() {
  return pageNumber <= Math.floor(picturesFiltered.length / pageSize);
};
var setScrollEnabled = function() {
  var scrollTimeout;
  window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(renderNextPages, 100);
  });
};

// фильтрация и сортировка
var setFiltrationEnabled = function() {
  filtersForm.addEventListener('click', function(evt) {
    var target = evt.target;
    if (target.classList.contains('filters-radio')) {
      setFilterEnabled(target.id);
    }
  });
  filtersForm.addEventListener('keydown', function(evt) {
    var target = evt.target;
    var key = evt.keyCode;
    if ((key === 13 || key === 32) &&
        target.classList.contains('filters-radio')) {
      evt.preventDefault();
      setFilterEnabled(target.id);
    }
  });
  filtersForm.classList.remove('hidden');
};
var setFilterEnabled = function(filter) {
  picturesFiltered = getFilteredPictures(picturesArr, filter);
  pageNumber = 0;
  renderNextPages();
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
