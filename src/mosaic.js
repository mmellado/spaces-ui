// TODO: innvalidTile API
// TODO: Go top on horizontal
// TODO: Add focus to pane when it appears on screen
// TODO: add click navigation to map
// TODO: scroll to top
// Document


var Mosaic = (function(config) {

  // Config Variables
  var _tileWrapper,
      _columnSelector,
      _initialTile,
      _showMap,
      _wrapper,

  // Necessary placeholder variables
      _tileWidth,
      _tileHeight,
      _timeout;

  var _resetLayout = function() {
    _setLayout();
    _setInitialTile();
  };

  var _setInitialTile = function() {
    var tile = document.querySelector(_initialTile);
    _moveToTile(tile.dataset.x, tile.dataset.y);
  };

  var _moveToTile = function(x, y) {
    var activeTile = document.querySelector('[data-active]'),
        newActiveTile = document.querySelector('[data-x="' + x + '"][data-y="' + y + '"]'),
        map, mapActive;

    if (activeTile) activeTile.removeAttribute('data-active');

    newActiveTile.dataset.active = '';

    _wrapper.style.left = -x * _tileWidth + 'px';
    _wrapper.style.top = -y * _tileHeight + 'px';

    if (_showMap) {
      map = document.querySelector('[data-mapactive]');
      map.style.background = 'transparent';
      map.removeAttribute('data-mapactive');

      mapActive = document.querySelector('[data-mapx="' + x + '"][data-mapy="' + y + '"]');
      mapActive.style.background = '#000';
      mapActive.dataset.mapactive = '';
    }
  };

  var _moveToBoundingTile = function(direction) {
    var currentTile = document.querySelector('[data-active]'),
        posX = parseInt(currentTile.dataset.x, 10),
        posY = parseInt(currentTile.dataset.y, 10),
        newX, newY, newTile;

    switch(direction) {
      case 'up':
        newX = posX;
        newY = posY - 1;
      break;

      case 'down':
        newX = posX;
        newY = posY + 1;
      break;

      case 'left':
        newX = posX - 1;
        newY = posY;
      break;

      case 'right':
        newX = posX + 1;
        newY = posY;
      break;
    }

    newTile = document.querySelector('[data-x="' + newX + '"][data-y="' + newY + '"]');

    if (newTile) {
      _moveToTile(newX, newY);
    }

  };

  var _setLayout = function() {
    var columns = document.querySelectorAll(_columnSelector),
        rows, col, row;

        _tileWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        _tileHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

        _wrapper.style.position = 'fixed';
        _wrapper.style.top = 0;
        _wrapper.style.left = 0;
        _wrapper.style.transition = 'all 0.5s ease-in-out';


    for (var i = 0; i < columns.length; i++ ) {
      col = columns[i];

      col.style.position = 'absolute';
      col.style.left = i * _tileWidth + 'px';

      rows = col.children;

      for (var j = 0; j < rows.length; j ++) {
        row = rows[j];

        row.style.width = _tileWidth + 'px';
        row.style.height = _tileHeight + 'px';
        row.style.top = j * _tileHeight + 'px';

        row.dataset.x = i;
        row.dataset.y = j;

        // For demo
        row.style.background = '#' + Math.floor(Math.random()*16777215).toString(16); // Setting the random color on your div element.
      }
    }
  };

  var _debounce = function(func, wait, evt) {
     if (timeout) {
      return false;
    }
    clearTimeout(timeout);
    timeout = setTimeout(function(){
      func.apply(this, [evt]);
      timeout = null;
    }, wait);
  };

  var _debouncedScroll = function() {
    var evt = arguments[0];
    _debounce(_detectDirection, 300, evt);
  };

  var _detectDirection = function() {
    var evt = arguments[0];
    var wDelta = (evt.wheelDeltaX !== 0) ? 'horizontal' : 'vertical';
    var direction;


    if (wDelta == 'horizontal') {
      direction = (evt.wheelDeltaX < 0) ? 'right' : 'left';
    } else {
      direction = (evt.wheelDeltaY < 0) ? 'down' : 'up';
    }

    _moveToBoundingTile(direction);
  };

  var _keyNavigation = function() {
    var evt = arguments[0],
        direction = evt.keyCode;

    // r-39, d-40, l-37, u-38
    direction = (direction > 38) ? ((direction == 39) ? 'right' : 'down' ): ((direction == 37) ? 'left' : 'up');
    _moveToBoundingTile(direction);
  };

  // Handle touch gestures: http://www.javascriptkit.com/javatutors/touchevents2.shtml
   _swipedetect = function(el, callback){

    var touchsurface = el,
    swipedir,
    startX,
    startY,
    distX,
    distY,
    threshold = 50, //required min distance traveled to be considered swipe
    restraint = 100, // maximum distance allowed at the same time in perpendicular direction
    allowedTime = 1000, // maximum time allowed to travel that distance
    elapsedTime,
    startTime,
    handleswipe = callback || function(swipedir){};

    touchsurface.addEventListener('touchstart', function(e){
      var touchobj = e.changedTouches[0];
      swipedir = 'none';
      dist = 0;
      startX = touchobj.pageX;
      startY = touchobj.pageY;
      startTime = new Date().getTime(); // record time when finger first makes contact with surface
    }, false);

    touchsurface.addEventListener('touchend', function(e){
      var touchobj = e.changedTouches[0];
      distX = touchobj.pageX - startX; // get horizontal dist traveled by finger while in contact with surface
      distY = touchobj.pageY - startY; // get vertical dist traveled by finger while in contact with surface
      elapsedTime = new Date().getTime() - startTime; // get time elapsed
      if (elapsedTime <= allowedTime){ // first condition for awipe met
        if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){ // 2nd condition for horizontal swipe met
          swipedir = (distX < 0)? 'right' : 'left'; // if dist traveled is negative, it indicates left swipe
        }
        else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint){ // 2nd condition for vertical swipe met
          swipedir = (distY < 0)? 'down' : 'up'; // if dist traveled is negative, it indicates up swipe
        }
      }
      handleswipe(swipedir);
    }, false);
  };

  var _initEvents = function() {
    //window.addEventListener('mousewheel', _debouncedScroll);
    window.addEventListener('keydown', _keyNavigation);
    window.addEventListener('resize', _resetLayout);
    _swipedetect(_wrapper, function(direction) {
      _moveToBoundingTile(direction);
    });
  };

  var _buildMap = function() {
    var unitWidth = 20;
    var unitHeigth = 10;
    var mapWrapper = document.createElement('div');
    var start = document.querySelector(_initialTile);
    var ul;
    var li;

    mapWrapper.style.position = 'absolute';

    var columns = document.querySelectorAll(_columnSelector);

    for(var i = 0; i < columns.length; i++) {
      ul = document.createElement('ul');
      ul.style.position = 'relative';
      ul.style.left = i * unitWidth + 2 + 'px';

      rows = columns[i].children;

      for (var j = 0; j < columns[i].children.length; j ++) {
        li = document.createElement('div');
        li.style.width = unitWidth + 'px';
        li.style.height = unitHeigth + 'px';
        li.style.position = 'absolute';
        li.style.top = j * unitHeigth + 2 + 'px';
        li.style.border = '1px solid #666';
        li.dataset.mapx = i;
        li.dataset.mapy = j;

        if (i == start.dataset.x && j == start.dataset.y) {
          li.dataset.mapactive = '';
          li.style.background = 'black';
        }
        ul.appendChild(li);
      }
      mapWrapper.appendChild(ul);
    }
    mapWrapper.style.bottom = unitHeigth * columns.length + 20 + 'px';
    mapWrapper.style.right = unitWidth * columns.length + 20 + 'px';

    document.body.appendChild(mapWrapper);
  };

  // Public API

  var _init = function(config) {
    var c = config || {},

    _tileWrapper = c.tileWrapper || '#mosaic';
    _columnSelector = c.columnSelector || '[data-column]';
    _initialTile = c.initialTile || '[data-x="0"][data-y="0"]';
    _showMap = c.showMap || false;
    _wrapper = document.querySelector(_tileWrapper);

    _setLayout();
    if (_showMap) _buildMap();
    _setInitialTile();
    _initEvents();
  };

  var _move = function(direction) {
    var directions = ['up', 'down', 'left', 'right'];
    if (directions.indexOf(direction) > -1) {
      _moveToBoundingTile(direction);
    }
  };

  var _moveTo = function(element) {
    var el = document.querySelector(element),
        elX = el.dataset.x,
        elY = el.dataset.y;

    _moveToTile(elX, elY);
  };

  return {
    init: _init,
    move: _move,
    moveTo: _moveTo
  };

})();