/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(1);
	__webpack_require__(2);
	__webpack_require__(5)();


/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	(function() {
	  /**
	   * @constructor
	   * @param {string} image
	   */
	  var Resizer = function(image) {
	    // Изображение, с которым будет вестись работа.
	    this._image = new Image();
	    this._image.src = image;

	    // Холст.
	    this._container = document.createElement('canvas');
	    this._ctx = this._container.getContext('2d');

	    // Создаем холст только после загрузки изображения.
	    this._image.onload = function() {
	      // Размер холста равен размеру загруженного изображения. Это нужно
	      // для удобства работы с координатами.
	      this._container.width = this._image.naturalWidth;
	      this._container.height = this._image.naturalHeight;

	      /**
	       * Предлагаемый размер кадра в виде коэффициента относительно меньшей
	       * стороны изображения.
	       * @const
	       * @type {number}
	       */
	      var INITIAL_SIDE_RATIO = 0.75;

	      // Размер меньшей стороны изображения.
	      var side = Math.min(
	          this._container.width * INITIAL_SIDE_RATIO,
	          this._container.height * INITIAL_SIDE_RATIO);

	      // Изначально предлагаемое кадрирование — часть по центру с размером в 3/4
	      // от размера меньшей стороны.
	      this._resizeConstraint = new Square(
	          this._container.width / 2 - side / 2,
	          this._container.height / 2 - side / 2,
	          side);

	      // Отрисовка изначального состояния канваса.
	      this.setConstraint();
	    }.bind(this);

	    // Фиксирование контекста обработчиков.
	    this._onDragStart = this._onDragStart.bind(this);
	    this._onDragEnd = this._onDragEnd.bind(this);
	    this._onDrag = this._onDrag.bind(this);
	  };

	  Resizer.prototype = {
	    /**
	     * Родительский элемент канваса.
	     * @type {Element}
	     * @private
	     */
	    _element: null,

	    /**
	     * Положение курсора в момент перетаскивания. От положения курсора
	     * рассчитывается смещение на которое нужно переместить изображение
	     * за каждую итерацию перетаскивания.
	     * @type {Coordinate}
	     * @private
	     */
	    _cursorPosition: null,

	    /**
	     * Объект, хранящий итоговое кадрирование: сторона квадрата и смещение
	     * от верхнего левого угла исходного изображения.
	     * @type {Square}
	     * @private
	     */
	    _resizeConstraint: null,

	    /**
	     * Отрисовка канваса.
	     */
	    redraw: function() {
	      // Очистка изображения.
	      this._ctx.clearRect(0, 0, this._container.width, this._container.height);

	      // Сохранение состояния канваса.
	      // Подробней см. строку 132.
	      this._ctx.save();

	      // Установка начальной точки системы координат в центр холста.
	      this._ctx.translate(this._container.width / 2, this._container.height / 2);

	      var displX = -(this._resizeConstraint.x + this._resizeConstraint.side / 2);
	      var displY = -(this._resizeConstraint.y + this._resizeConstraint.side / 2);
	      // Отрисовка изображения на холсте. Параметры задают изображение, которое
	      // нужно отрисовать и координаты его верхнего левого угла.
	      // Координаты задаются от центра холста.
	      this._ctx.drawImage(this._image, displX, displY);

	      // Сохраним значение толщины рамки заранее, так как оно нам понадобится
	      // для расчетов параметров затеняющего слоя.
	      var borderLineWidth = 6;

	      this._ctx.save();
	      this._ctx.beginPath();
	      this._ctx.rect(displX, displY, this._container.width, this._container.height);
	      this._ctx.rect(
	          (-this._resizeConstraint.side / 2) - borderLineWidth,
	          (-this._resizeConstraint.side / 2) - borderLineWidth,
	          this._resizeConstraint.side + 2 * borderLineWidth,
	          this._resizeConstraint.side + 2 * borderLineWidth);
	      this._ctx.closePath();
	      this._ctx.clip('evenodd');
	      this._ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
	      this._ctx.fillRect(displX, displY, this._container.width, this._container.height);
	      this._ctx.restore();

	      this._ctx.fillStyle = '#ffe753';
	      for (var i = -this._resizeConstraint.side / 2 - borderLineWidth / 2; this._resizeConstraint.side / 2 + borderLineWidth / 2 >= i; i = i + 6 + borderLineWidth) {
	        this._ctx.beginPath();
	        this._ctx.arc(i, -this._resizeConstraint.side / 2 - borderLineWidth / 2, 3, 0, Math.PI * 2, true);
	        this._ctx.arc(this._resizeConstraint.side / 2 + borderLineWidth / 2, i, 3, 0, Math.PI * 2, true);
	        this._ctx.closePath();
	        this._ctx.fill();
	        this._ctx.beginPath();
	        this._ctx.arc(i, this._resizeConstraint.side / 2 + borderLineWidth / 2, 3, 0, Math.PI * 2, true);
	        this._ctx.arc(-this._resizeConstraint.side / 2 - borderLineWidth / 2, i, 3, 0, Math.PI * 2, true);
	        this._ctx.closePath();
	        this._ctx.fill();
	      }

	      var text = this._image.naturalWidth + ' x ' + this._image.naturalHeight;
	      this._ctx.fillStyle = '#ffffff';
	      this._ctx.font = '14px Arial';
	      this._ctx.textAlign = 'center';
	      this._ctx.textBaseline = 'bottom';
	      this._ctx.fillText(text, 0, -this._resizeConstraint.side / 2 - borderLineWidth * 2);

	      // Восстановление состояния канваса, которое было до вызова ctx.save
	      // и последующего изменения системы координат. Нужно для того, чтобы
	      // следующий кадр рисовался с привычной системой координат, где точка
	      // 0 0 находится в левом верхнем углу холста, в противном случае
	      // некорректно сработает даже очистка холста или нужно будет использовать
	      // сложные рассчеты для координат прямоугольника, который нужно очистить.
	      this._ctx.restore();
	    },

	    /**
	     * Включение режима перемещения. Запоминается текущее положение курсора,
	     * устанавливается флаг, разрешающий перемещение и добавляются обработчики,
	     * позволяющие перерисовывать изображение по мере перетаскивания.
	     * @param {number} x
	     * @param {number} y
	     * @private
	     */
	    _enterDragMode: function(x, y) {
	      this._cursorPosition = new Coordinate(x, y);
	      document.body.addEventListener('mousemove', this._onDrag);
	      document.body.addEventListener('mouseup', this._onDragEnd);
	    },

	    /**
	     * Выключение режима перемещения.
	     * @private
	     */
	    _exitDragMode: function() {
	      this._cursorPosition = null;
	      document.body.removeEventListener('mousemove', this._onDrag);
	      document.body.removeEventListener('mouseup', this._onDragEnd);
	    },

	    /**
	     * Перемещение изображения относительно кадра.
	     * @param {number} x
	     * @param {number} y
	     * @private
	     */
	    updatePosition: function(x, y) {
	      this.moveConstraint(
	          this._cursorPosition.x - x,
	          this._cursorPosition.y - y);
	      this._cursorPosition = new Coordinate(x, y);
	    },

	    /**
	     * @param {MouseEvent} evt
	     * @private
	     */
	    _onDragStart: function(evt) {
	      this._enterDragMode(evt.clientX, evt.clientY);
	    },

	    /**
	     * Обработчик окончания перетаскивания.
	     * @private
	     */
	    _onDragEnd: function() {
	      this._exitDragMode();
	    },

	    /**
	     * Обработчик события перетаскивания.
	     * @param {MouseEvent} evt
	     * @private
	     */
	    _onDrag: function(evt) {
	      this.updatePosition(evt.clientX, evt.clientY);
	    },

	    /**
	     * Добавление элемента в DOM.
	     * @param {Element} element
	     */
	    setElement: function(element) {
	      if (this._element === element) {
	        return;
	      }

	      this._element = element;
	      this._element.insertBefore(this._container, this._element.firstChild);
	      // Обработчики начала и конца перетаскивания.
	      this._container.addEventListener('mousedown', this._onDragStart);
	    },

	    /**
	     * Возвращает кадрирование элемента.
	     * @return {Square}
	     */
	    getConstraint: function() {
	      return this._resizeConstraint;
	    },

	    /**
	     * Смещает кадрирование на значение указанное в параметрах.
	     * @param {number} deltaX
	     * @param {number} deltaY
	     * @param {number} deltaSide
	     */
	    moveConstraint: function(deltaX, deltaY, deltaSide) {
	      this.setConstraint(
	          this._resizeConstraint.x + (deltaX || 0),
	          this._resizeConstraint.y + (deltaY || 0),
	          this._resizeConstraint.side + (deltaSide || 0));
	    },

	    /**
	     * @param {number} x
	     * @param {number} y
	     * @param {number} side
	     */
	    setConstraint: function(x, y, side) {
	      if (typeof x !== 'undefined') {
	        this._resizeConstraint.x = x;
	      }

	      if (typeof y !== 'undefined') {
	        this._resizeConstraint.y = y;
	      }

	      if (typeof side !== 'undefined') {
	        this._resizeConstraint.side = side;
	      }

	      requestAnimationFrame(function() {
	        this.redraw();
	        window.dispatchEvent(new CustomEvent('resizerchange'));
	      }.bind(this));
	    },

	    /**
	     * Удаление. Убирает контейнер из родительского элемента, убирает
	     * все обработчики событий и убирает ссылки.
	     */
	    remove: function() {
	      this._element.removeChild(this._container);

	      this._container.removeEventListener('mousedown', this._onDragStart);
	      this._container = null;
	    },

	    /**
	     * Экспорт обрезанного изображения как HTMLImageElement и исходником
	     * картинки в src в формате dataURL.
	     * @return {Image}
	     */
	    exportImage: function() {
	      // Создаем Image, с размерами, указанными при кадрировании.
	      var imageToExport = new Image();

	      // Создается новый canvas, по размерам совпадающий с кадрированным
	      // изображением, в него добавляется изображение взятое из канваса
	      // с измененными координатами и сохраняется в dataURL, с помощью метода
	      // toDataURL. Полученный исходный код, записывается в src у ранее
	      // созданного изображения.
	      var temporaryCanvas = document.createElement('canvas');
	      var temporaryCtx = temporaryCanvas.getContext('2d');
	      temporaryCanvas.width = this._resizeConstraint.side;
	      temporaryCanvas.height = this._resizeConstraint.side;
	      temporaryCtx.drawImage(this._image,
	          -this._resizeConstraint.x,
	          -this._resizeConstraint.y);
	      imageToExport.src = temporaryCanvas.toDataURL('image/png');

	      return imageToExport;
	    }
	  };

	  /**
	   * Вспомогательный тип, описывающий квадрат.
	   * @constructor
	   * @param {number} x
	   * @param {number} y
	   * @param {number} side
	   * @private
	   */
	  var Square = function(x, y, side) {
	    this.x = x;
	    this.y = y;
	    this.side = side;
	  };

	  /**
	   * Вспомогательный тип, описывающий координату.
	   * @constructor
	   * @param {number} x
	   * @param {number} y
	   * @private
	   */
	  var Coordinate = function(x, y) {
	    this.x = x;
	    this.y = y;
	  };

	  window.Resizer = Resizer;
	})();


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/* global Resizer: true */

	/**
	 * @fileoverview
	 * @author Igor Alexeenko (o0)
	 */

	'use strict';

	var browserCookies = __webpack_require__(3);
	var utils = __webpack_require__(4);

	(function() {
	  /** @enum {string} */
	  var FileType = {
	    'GIF': '',
	    'JPEG': '',
	    'PNG': '',
	    'SVG+XML': ''
	  };

	  /** @enum {number} */
	  var Action = {
	    ERROR: 0,
	    UPLOADING: 1,
	    CUSTOM: 2
	  };

	  /**
	   * Регулярное выражение, проверяющее тип загружаемого файла. Составляется
	   * из ключей FileType.
	   * @type {RegExp}
	   */
	  var fileRegExp = new RegExp('^image/(' + Object.keys(FileType).join('|').replace('\+', '\\+') + ')$', 'i');

	  /**
	   * @type {Object.<string, string>}
	   */
	  var filterMap;

	  /**
	   * Объект, который занимается кадрированием изображения.
	   * @type {Resizer}
	   */
	  var currentResizer;

	  var formLeft = document.querySelector('#resize-x');
	  var formTop = document.querySelector('#resize-y');
	  var formSide = document.querySelector('#resize-size');
	  var formSubmit = document.querySelector('.upload-form-controls-fwd');

	  /**
	   * Удаляет текущий объект {@link Resizer}, чтобы создать новый с другим
	   * изображением.
	   */
	  function cleanupResizer() {
	    if (currentResizer) {
	      currentResizer.remove();
	      currentResizer = null;
	    }
	  }

	  /**
	   * Ставит одну из трех случайных картинок на фон формы загрузки.
	   */
	  function updateBackground() {
	    var images = [
	      'img/logo-background-1.jpg',
	      'img/logo-background-2.jpg',
	      'img/logo-background-3.jpg'
	    ];

	    var backgroundElement = document.querySelector('.upload');
	    var randomImageNumber = Math.round(Math.random() * (images.length - 1));
	    backgroundElement.style.backgroundImage = 'url(' + images[randomImageNumber] + ')';
	  }

	  var updateResizerBoundLimits = function() {
	    formSide.max = Math.min(
	      currentResizer._image.naturalWidth - formLeft.value,
	      currentResizer._image.naturalHeight - formTop.value);
	  };

	  window.addEventListener('resizerchange', function() {
	    var con = currentResizer.getConstraint();
	    formLeft.value = Math.round(con.x);
	    formTop.value = Math.round(con.y);
	    formSide.value = Math.round(con.side);
	    updateResizerBoundLimits();
	    updateSubmitState(false);
	  });

	  document.querySelector('.upload-resize-controls')
	          .addEventListener('change', function(evt) {
	            switch (evt.target.name) {
	              case 'x':
	              case 'y':
	                updateResizerBoundLimits();
	                // fall through
	              case 'size':
	                updateSubmitState(true);
	            }
	          });

	  /**
	   * Проверяет, валидны ли данные в форме кадрирования.
	   * @return {boolean}
	   */
	  function resizeFormIsValid() {
	    function isInRange(value, min, max) {
	      if (value === '') {
	        return false;
	      }
	      value = +value;
	      return (value >= min && value <= max);
	    }
	    function isElementValueAllowed(input) {
	      return isInRange(input.value, input.min, input.max);
	    }
	    return [formLeft, formTop, formSide]
	        .every(isElementValueAllowed);
	  }

	  function updateSubmitState(updateConstraint) {
	    if(!resizeFormIsValid()) {
	      formSubmit.setAttribute('disabled', 'disabled');
	    } else {
	      formSubmit.removeAttribute('disabled');
	      if (updateConstraint) {
	        currentResizer.setConstraint(
	          +formLeft.value,
	          +formTop.value,
	          +formSide.value);
	      }
	    }
	  }

	  var filter = browserCookies.get('filter');
	  var activeFilter = document.querySelector('#upload-filter-' + filter);
	  if (activeFilter !== null) {
	    activeFilter.setAttribute('checked', 'checked');
	  }

	  /**
	   * Форма загрузки изображения.
	   * @type {HTMLFormElement}
	   */
	  var uploadForm = document.forms['upload-select-image'];

	  /**
	   * Форма кадрирования изображения.
	   * @type {HTMLFormElement}
	   */
	  var resizeForm = document.forms['upload-resize'];

	  /**
	   * Форма добавления фильтра.
	   * @type {HTMLFormElement}
	   */
	  var filterForm = document.forms['upload-filter'];

	  /**
	   * @type {HTMLImageElement}
	   */
	  var filterImage = filterForm.querySelector('.filter-image-preview');

	  /**
	   * @type {HTMLElement}
	   */
	  var uploadMessage = document.querySelector('.upload-message');

	  /**
	   * @param {Action} action
	   * @param {string=} message
	   * @return {Element}
	   */
	  function showMessage(action, message) {
	    var isError = false;

	    switch (action) {
	      case Action.UPLOADING:
	        message = message || 'Кексограмим&hellip;';
	        break;

	      case Action.ERROR:
	        isError = true;
	        message = message || 'Неподдерживаемый формат файла<br> <a href="' + document.location + '">Попробовать еще раз</a>.';
	        break;
	    }

	    uploadMessage.querySelector('.upload-message-container').innerHTML = message;
	    uploadMessage.classList.remove('invisible');
	    uploadMessage.classList.toggle('upload-message-error', isError);
	    return uploadMessage;
	  }

	  function hideMessage() {
	    uploadMessage.classList.add('invisible');
	  }

	  /**
	   * Обработчик изменения изображения в форме загрузки. Если загруженный
	   * файл является изображением, считывается исходник картинки, создается
	   * Resizer с загруженной картинкой, добавляется в форму кадрирования
	   * и показывается форма кадрирования.
	   * @param {Event} evt
	   */
	  uploadForm.addEventListener('change', function(evt) {
	    var element = evt.target;
	    if (element.id === 'upload-file') {
	      // Проверка типа загружаемого файла, тип должен быть изображением
	      // одного из форматов: JPEG, PNG, GIF или SVG.
	      if (fileRegExp.test(element.files[0].type)) {
	        var fileReader = new FileReader();

	        showMessage(Action.UPLOADING);

	        fileReader.addEventListener('load', function() {
	          cleanupResizer();

	          currentResizer = new Resizer(fileReader.result);
	          currentResizer.setElement(resizeForm);
	          uploadMessage.classList.add('invisible');

	          formLeft.min = formTop.min = formSide.min = 0;
	          formLeft.max = currentResizer._image.naturalWidth;
	          formTop.max = currentResizer._image.naturalHeight;

	          uploadForm.classList.add('invisible');
	          resizeForm.classList.remove('invisible');

	          hideMessage();
	        });

	        fileReader.readAsDataURL(element.files[0]);
	      } else {
	        // Показ сообщения об ошибке, если загружаемый файл, не является
	        // поддерживаемым изображением.
	        showMessage(Action.ERROR);
	      }
	    }
	  });

	  /**
	   * Обработка сброса формы кадрирования. Возвращает в начальное состояние
	   * и обновляет фон.
	   * @param {Event} evt
	   */
	  resizeForm.addEventListener('reset', function(evt) {
	    evt.preventDefault();

	    cleanupResizer();
	    updateBackground();

	    resizeForm.classList.add('invisible');
	    uploadForm.classList.remove('invisible');
	  });

	  /**
	   * Обработка отправки формы кадрирования. Если форма валидна, экспортирует
	   * кропнутое изображение в форму добавления фильтра и показывает ее.
	   * @param {Event} evt
	   */
	  resizeForm.addEventListener('submit', function(evt) {
	    evt.preventDefault();

	    if (resizeFormIsValid()) {
	      filterImage.src = currentResizer.exportImage().src;

	      resizeForm.classList.add('invisible');
	      filterForm.classList.remove('invisible');

	      applyFilter();
	    }
	  });

	  /**
	   * Сброс формы фильтра. Показывает форму кадрирования.
	   * @param {Event} evt
	   */
	  filterForm.addEventListener('reset', function(evt) {
	    evt.preventDefault();

	    filterForm.classList.add('invisible');
	    resizeForm.classList.remove('invisible');
	  });

	  /**
	   * Отправка формы фильтра. Возвращает в начальное состояние, предварительно
	   * записав сохраненный фильтр в cookie.
	   * @param {Event} evt
	   */
	  filterForm.addEventListener('submit', function(evt) {
	    evt.preventDefault();

	    cleanupResizer();
	    updateBackground();

	    filterForm.classList.add('invisible');
	    uploadForm.classList.remove('invisible');
	  });

	  /**
	   * Обработчик изменения фильтра. Добавляет класс из filterMap соответствующий
	   * выбранному значению в форме.
	   */
	  function applyFilter() {
	    if (!filterMap) {
	      // Ленивая инициализация. Объект не создается до тех пор, пока
	      // не понадобится прочитать его в первый раз, а после этого запоминается
	      // навсегда.
	      filterMap = {
	        'none': 'filter-none',
	        'chrome': 'filter-chrome',
	        'sepia': 'filter-sepia'
	      };
	    }

	    var selectedFilter = filterForm['upload-filter'].value;

	    // Класс перезаписывается, а не обновляется через classList потому что нужно
	    // убрать предыдущий примененный класс. Для этого нужно или запоминать его
	    // состояние или просто перезаписывать.
	    filterImage.className = 'filter-image-preview ' + filterMap[selectedFilter];

	    // save
	    var days = utils.getDateDifferenceInDays(utils.getMyLastBirthday(), new Date());
	    browserCookies.set('filter', selectedFilter, { expires: days });
	  }
	  filterForm.addEventListener('change', applyFilter);

	  cleanupResizer();
	  updateBackground();
	})();


/***/ },
/* 3 */
/***/ function(module, exports) {

	exports.defaults = {};

	exports.set = function(name, value, options) {
	  // Retrieve options and defaults
	  var opts = options || {};
	  var defaults = exports.defaults;

	  // Apply default value for unspecified options
	  var expires  = opts.expires || defaults.expires;
	  var domain   = opts.domain  || defaults.domain;
	  var path     = opts.path     != undefined ? opts.path     : (defaults.path != undefined ? defaults.path : '/');
	  var secure   = opts.secure   != undefined ? opts.secure   : defaults.secure;
	  var httponly = opts.httponly != undefined ? opts.httponly : defaults.httponly;

	  // Determine cookie expiration date
	  // If succesful the result will be a valid Date, otherwise it will be an invalid Date or false(ish)
	  var expDate = expires ? new Date(
	      // in case expires is an integer, it should specify the number of days till the cookie expires
	      typeof expires == 'number' ? new Date().getTime() + (expires * 864e5) :
	      // else expires should be either a Date object or in a format recognized by Date.parse()
	      expires
	  ) : '';

	  // Set cookie
	  document.cookie = name.replace(/[^+#$&^`|]/g, encodeURIComponent)                // Encode cookie name
	  .replace('(', '%28')
	  .replace(')', '%29') +
	  '=' + value.replace(/[^+#$&/:<-\[\]-}]/g, encodeURIComponent) +                  // Encode cookie value (RFC6265)
	  (expDate && expDate.getTime() >= 0 ? ';expires=' + expDate.toUTCString() : '') + // Add expiration date
	  (domain   ? ';domain=' + domain : '') +                                          // Add domain
	  (path     ? ';path='   + path   : '') +                                          // Add path
	  (secure   ? ';secure'           : '') +                                          // Add secure option
	  (httponly ? ';httponly'         : '');                                           // Add httponly option
	};

	exports.get = function(name) {
	  var cookies = document.cookie.split(';');

	  // Iterate all cookies
	  for(var i = 0; i < cookies.length; i++) {
	    var cookie = cookies[i];
	    var cookieLength = cookie.length;

	    // Determine separator index ("name=value")
	    var separatorIndex = cookie.indexOf('=');

	    // IE<11 emits the equal sign when the cookie value is empty
	    separatorIndex = separatorIndex < 0 ? cookieLength : separatorIndex;

	    // Decode the cookie name and remove any leading/trailing spaces, then compare to the requested cookie name
	    if (decodeURIComponent(cookie.substring(0, separatorIndex).replace(/^\s+|\s+$/g, '')) == name) {
	      return decodeURIComponent(cookie.substring(separatorIndex + 1, cookieLength));
	    }
	  }

	  return null;
	};

	exports.erase = function(name, options) {
	  exports.set(name, '', {
	    expires:  -1,
	    domain:   options && options.domain,
	    path:     options && options.path,
	    secure:   0,
	    httponly: 0}
	  );
	};


/***/ },
/* 4 */
/***/ function(module, exports) {

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
	  },

	  isActivationEvent: function(evt) {
	    return evt.keyCode === 13;
	  },

	  isLocalStorageSupported: (function() {
	    if (typeof localStorage === 'undefined') {
	      return false;
	    }
	    try {
	      var x = '__localStorage__test__';
	      localStorage.setItem(x, x);
	      localStorage.removeItem(x);
	      return true;
	    } catch(e) {
	      return false;
	    }
	  })()
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var filter = __webpack_require__(6);
	var scroller = __webpack_require__(11);
	var utils = __webpack_require__(4);
	var gallery = __webpack_require__(10);

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
	  scroller();

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


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var render = __webpack_require__(7);
	var gallery = __webpack_require__(10);
	var utils = __webpack_require__(4);

	// форма с кнопками сортировки
	var filtersForm = document.querySelector('.filters');

	var picturesSource = [];
	var picturesFiltered = [];

	var applyFilter = function(filter) {
	  if (utils.isLocalStorageSupported) {
	    localStorage.setItem('pictureListFilter', filter);
	  }
	  applyFilterToData(picturesSource, filter, picturesFiltered);
	  gallery.update(picturesFiltered);
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

	    if (utils.isLocalStorageSupported) {
	      var filter = localStorage.getItem('pictureListFilter');
	      var filterItem = filtersForm.querySelector('#' + filter);
	      if (filterItem !== null) {
	        filterItem.setAttribute('checked', 'checked');
	        applyFilter(filter);
	      } else {
	        applyFilter();
	      }
	    } else {
	      applyFilter();
	    }
	  },

	  getPicturesFiltered: function() {
	    return picturesFiltered;
	  }

	};


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(4);
	var Photo = __webpack_require__(8);

	var container = document.querySelector('.pictures');

	// размер страницы
	var pageSize = 12;

	// текущая страница
	var pageNumber = 0;

	// объекты отрисованных сейчас фотографий
	var renderedPhotos = [];

	var renderCurrentPage = function(pictures) {
	  var from = pageNumber * pageSize;
	  var to = from + pageSize;
	  var frag = document.createDocumentFragment();
	  pictures
	    .slice(from, to)
	    .forEach(function(item) {
	      var photo = new Photo(item);
	      renderedPhotos.push(photo);
	      frag.appendChild(photo.element);
	    });
	  container.appendChild(frag);
	};

	var clearRenderedPhotos = function() {
	  renderedPhotos.forEach(function(item) {
	    item.remove();
	  });
	  renderedPhotos = [];
	};

	module.exports = {

	  resetPage: function() {
	    pageNumber = 0;
	    clearRenderedPhotos();
	  },

	  renderNextPages: function(pictures) {
	    while (utils.isBottomReached(container) &&
	           utils.isNextPageAvailable(pictures, pageSize, pageNumber)) {
	      renderCurrentPage(pictures);
	      pageNumber++;
	    }
	  }

	};


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var generate = __webpack_require__(9);
	var utils = __webpack_require__(4);

	var Photo = function(data) {
	  this.data = data;
	  this.element = generate(data);
	  this.keyHandler = this.keyHandler.bind(this);
	  this.element.addEventListener('keydown', this.keyHandler);
	};

	Photo.prototype.showGallery = function() {
	  location.hash = 'photo/' + this.data.url;
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


/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';

	// шаблон
	var templates = document.getElementById('picture-template');
	var template = ('content' in templates) ?
	  templates.content.querySelector('.picture') :
	  templates.querySelector('.picture');

	var generate = function(picture) {
	  var element = template.cloneNode(true);
	  element.setAttribute('href', '#photo/' + picture.url);
	  var img = element.querySelector('img');
	  var image = new Image();
	  var timeoutTimer;
	  var stopTimeoutTimer = function() {
	    if (timeoutTimer) {
	      clearTimeout(timeoutTimer);
	      timeoutTimer = null;
	    }
	  };
	  var imageLoadingFail = function() {
	    stopTimeoutTimer();
	    image.onload = image.onerror = null;
	    element.classList.add('picture-load-failure');
	  };
	  var imageLoaded = function() {
	    stopTimeoutTimer();
	    image.onload = image.onerror = null;
	    img.setAttribute('src', picture.url);
	  };
	  image.onload = imageLoaded;
	  image.onerror = imageLoadingFail;
	  timeoutTimer = setTimeout(imageLoadingFail, 1000); // проверить можно на 20-30мс
	  image.src = picture.url;
	  element.querySelector('.picture-comments').textContent = picture.comments;
	  element.querySelector('.picture-likes').textContent = picture.likes;
	  return element;
	};

	module.exports = generate;


/***/ },
/* 10 */
/***/ function(module, exports) {

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
	  this.showNextPicture = this.showNextPicture.bind(this);
	  this.onDocumentKeyDown = this.onDocumentKeyDown.bind(this);
	  this.hideGalleryByClick = this.hideGalleryByClick.bind(this);
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
	      this.galleryImage.addEventListener('click', this.showNextPicture);
	      document.addEventListener('keydown', this.onDocumentKeyDown);
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


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var render = __webpack_require__(7);
	var filter = __webpack_require__(6);

	var enableScrolling = function() {
	  var scrollTimeout;
	  window.addEventListener('scroll', function() {
	    clearTimeout(scrollTimeout);
	    scrollTimeout = setTimeout(function() {
	      render.renderNextPages(filter.getPicturesFiltered());
	    }, 100);
	  });
	};

	module.exports = enableScrolling;


/***/ }
/******/ ]);