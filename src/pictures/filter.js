'use strict';

var render = require('./render');
var gallery = require('../gallery');

// форма с кнопками сортировки
var filtersForm = document.querySelector('.filters');

var picturesSource = [];
var picturesFiltered = [];

var applyFilter = function(filter) {
  applyFilterToData(picturesSource, filter, picturesFiltered);
  picturesFiltered.forEach(function(pic, index) {
    pic.index = index;
  });
  gallery.save(picturesFiltered);
  render.resetPage();
  render.renderNextPages(picturesFiltered);
};

var applyFilterToData = function(source, filter, destination) {

  // очищаем результирующий массив
  destination.length = 0;

  // собираем элементы по критериям
  var items = source.slice(0);
  switch (filter) {
    case 'filter-discussed':
      items.sort(function(a, b) {
        return b.comments - a.comments;
      });
      break;
    case 'filter-new':
      var twoWeeksAgo = +new Date() - 2 * 7 * 24 * 60 * 60 * 1000;
      items = items.filter(function(pic) {
        return pic.date > twoWeeksAgo;
      });
      items.sort(function(a, b) {
        return b.date - a.date;
      });
      break;
  }

  // вливаем в результирующий массив
  items.forEach(function(item) {
    destination.push(item);
  });
};

module.exports = {

  enable: function(pictures) {

    picturesSource = pictures;

    filtersForm.addEventListener('click', function(evt) {
      var target = evt.target;
      if (target.classList.contains('filters-radio')) {
        applyFilter(target.id);
      }
    });

    filtersForm.addEventListener('keydown', function(evt) {
      var target = evt.target;
      var key = evt.keyCode;
      if ((key === 13 || key === 32) &&
          target.classList.contains('filters-radio')) {
        evt.preventDefault();
        applyFilter(target.id);
      }
    });

    filtersForm.classList.remove('hidden');

    applyFilter();
  },

  getPicturesFiltered: function() {
    return picturesFiltered;
  }

};
