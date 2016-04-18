'use strict';

module.exports = {

  getDateDifferenceInDays: function(firstDate, secondDate) {
    return (secondDate - firstDate) / 24 / 60 / 60 / 1000;
  },

  getMyLastBirthday: function() {
    var today = new Date();
    var d = today.getDate();
    var m = today.getMonth() + 1;
    var y = today.getFullYear();
    if (m < 4 || (m === 4 && d < 19)) {
      y--;
    }
    return new Date(y, 4 - 1, 19);
  },

  isNextPageAvailable: function(array, pageSize, pageNumber) {
    return pageNumber <= Math.floor(array.length / pageSize);
  },

  isBottomReached: function(element) {
    var bottom = element.getBoundingClientRect().bottom;
    var height = window.innerHeight;
    return bottom <= height + 100;
  },

  isXHRStatusOk: function(xhr) {
    return ('status' in xhr) &&
     (xhr.status === 200 ||
      xhr.status === 304);
  }

};
