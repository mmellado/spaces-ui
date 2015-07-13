// TODO: unit tests
// TODO: grunt build
// TODO: Write README docs

/**
 * Layout generator replicating OsX spaces for your website
 */
var Spaces = (function(config) {
  // Config Variables
  var _spaceWrapper,
      _columnSelector,
      _initialSpace,
      _showMap,
      _wrapper,

  // Necessary placeholder variables
      _spaceWidth,
      _spaceHeight,
      _timeout;

  /**
   * _setLayout
   * Configures the layout adding the necessary properties and setting the necessary
   * width and height for rows and columns. This funciton takes care of drawing the spaces.
   */
  var _setLayout = function() {
    var columns = document.querySelectorAll(_columnSelector),
        rows, col, row;

        // Get window dimentions to set the size of each space
        _spaceWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        _spaceHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

        // Set wrappers properties. Setting it's position to fixed to block scrolling
        _wrapper.style.position = 'fixed';
        _wrapper.style.top = 0;
        _wrapper.style.left = 0;
        _wrapper.style.transition = 'all 0.5s ease-in-out';

    // Check for the number of columns
    for (var i = 0; i < columns.length; i++ ) {
      col = columns[i];

      // Column properties so we can just move the wrapper around
      col.style.position = 'absolute';
      col.style.left = i * _spaceWidth + 'px';

      rows = col.children;

      // Check for the number of rows per column
      for (var j = 0; j < rows.length; j ++) {
        row = rows[j];

        // Setting sixe for each space and making sure they are focusable for accessibility
        row.style.width = _spaceWidth + 'px';
        row.style.height = _spaceHeight + 'px';
        row.style.top = j * _spaceHeight + 'px';
        row.tabIndex = -1;

        // Setting space coordinates
        row.dataset.x = i;
        row.dataset.y = j;
      }
    }
  };

  /**
   * _setInitialSpace
   * Checks what the desired initial space is and sets it as the active one
   */
  var _setInitialSpace = function() {
    // Use config variable to figure out which space to enable
    var space = document.querySelector(_initialSpace);
    _moveToSpace(space.dataset.x, space.dataset.y);
  };

  /**
   * _resetLayout
   * Resets the layout to it's original state. Makes sure to recalculate
   * viewport dimensions in case of resize.
   */
  var _resetLayout = function() {
    _setLayout();
    _setInitialSpace();
  };

  /**
   * _moveToSpace
   * Sets a new space as active based on its coordinate.
   * @param {number} x - The x coordinate for the new active space.
   * @param {number} y - The y coordinate for the new active space.
   */
  var _moveToSpace = function(x, y) {
    var activeSpace = document.querySelector('[data-active]'),
        newActiveSpace = document.querySelector('[data-x="' + x + '"][data-y="' + y + '"]'),
        map, mapActive;

    // remove acrtive status of the currently visible one if available
    if (activeSpace) activeSpace.removeAttribute('data-active');

    // Set the active status on the new space
    newActiveSpace.dataset.active = '';
    newActiveSpace.focus();

    // Move the wrapper around to ensure the new active space is visible
    _wrapper.style.left = -x * _spaceWidth + 'px';
    _wrapper.style.top = -y * _spaceHeight + 'px';

    // If showing map, updting the map as well
    if (_showMap) {
      map = document.querySelector('[data-mapactive]');
      map.style.background = 'transparent';
      map.removeAttribute('data-mapactive');

      mapActive = document.querySelector('[data-mapx="' + x + '"][data-mapy="' + y + '"]');
      mapActive.style.background = 'rgba(0, 0, 0, 0.5)';
      mapActive.dataset.mapactive = '';
    }
  };

  /**
   * _moveToBoundingSpace
   * Sets a new space as active based on a direction from the current active space.
   * @param {string} direction - Direction of the new active space.
   *                             Can be set to up, down, left and right.
   */
  var _moveToBoundingSpace = function(direction) {
    var currentSpace = document.querySelector('[data-active]'),
        posX = parseInt(currentSpace.dataset.x, 10),
        posY = parseInt(currentSpace.dataset.y, 10),
        newX, newY, newSpace;

    // Get new coordinates based on desired direction
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

    // Get the new space
    newSpace = document.querySelector('[data-x="' + newX + '"][data-y="' + newY + '"]');

    // If the new space is a valid one, move to it.
    if (newSpace) {
      _moveToSpace(newX, newY);
    }

  };

  /**
   * _buildMap
   * Builds a minimap based on the valid spaces on the page.
   */
  var _buildMap = function() {
    var unitWidth = 20,
        unitHeigth = 10,

        // Create container for the minimap
        mapWrapper = document.createElement('div'),
        start = document.querySelector(_initialSpace),
        rows, ul, li;

    // Minimap's properties
    mapWrapper.style.position = 'absolute';
    mapWrapper.id = 'spaces-map';

    var columns = document.querySelectorAll(_columnSelector);

    for(var i = 0; i < columns.length; i++) {
      // Creating columns and setting properties
      ul = document.createElement('ul');
      ul.style.position = 'relative';
      ul.style.left = i * unitWidth + 2 + 'px';

      rows = columns[i].children;

      // Creating rows and adding properties.
      for (var j = 0; j < rows.length; j ++) {
        li = document.createElement('li');
        li.style.width = unitWidth + 'px';
        li.style.height = unitHeigth + 'px';
        li.style.position = 'absolute';
        li.style.top = j * unitHeigth + 2 + 'px';
        li.style.border = '1px solid #666';
        li.style.cursor = 'pointer';
        li.dataset.mapx = i;
        li.dataset.mapy = j;

        // Marking the initial space as active
        if (i == start.dataset.x && j == start.dataset.y) {
          li.dataset.mapactive = '';
          li.style.background = 'rgba(0, 0, 0, 0.5)';
        }

        // Adding the row to the colum
        ul.appendChild(li);
      }
      // Adding the colum to the map
      mapWrapper.appendChild(ul);
    }
    // Figuring out the right location of the map based on its size
    mapWrapper.style.bottom = unitHeigth * columns.length + 20 + 'px';
    mapWrapper.style.right = unitWidth * columns.length + 20 + 'px';

    // Adding the map to the body
    document.body.appendChild(mapWrapper);
  };

  // Event functions

  /**
   * _keyNavigation
   * Defines the behavior to navigate using the keyboard arrows
   */
  var _keyNavigation = function() {
    var evt = arguments[0],
        direction = evt.keyCode;

    // r-39, d-40, l-37, u-38
    direction = (direction > 38) ? ((direction == 39) ? 'right' : 'down' ): ((direction == 37) ? 'left' : 'up');
    _moveToBoundingSpace(direction);
  };

  /**
   * _swipedetect
   * Enables touch gesture detection. Built based on the code found at
   * http://www.javascriptkit.com/javatutors/touchevents2.shtml
   * @param {DOMElement} el - The element to detect the swipe on.
   * @param {Function} callback - Callback to execute code based on the swipe behavior.
   */
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

  /**
   * _mapEvents
   * Handles events needed for navigating using the map (on click)
   */
  var _mapEvents = function() {
    var evt = arguments[0],
        el = evt.target,
        x = el.dataset.mapx,
        y = el.dataset.mapy;

    if (x && y) {
      _moveToSpace(x, y);
    }
  }

  /**
   * _initEvents
   * Initializes all event handlers
   */
  var _initEvents = function() {
    // Keyboard arrows navigation
    window.addEventListener('keydown', _keyNavigation);
    // Fix position on window resize
    window.addEventListener('resize', _resetLayout);
    // Touch gestures
    _swipedetect(_wrapper, function(direction) {
      _moveToBoundingSpace(direction);
    });
    // Map navigation
    if (_showMap) document.getElementById('spaces-map').addEventListener('click', _mapEvents);
  };

  // Public API

  /**
   * _init
   * Creates an instance of Spaces ui.
   * @constructor
   * @param {Object} config - Config object with details on the desired behavior for the framework.
   * @param {string} config.spaceWrapper - CSS selector for the spaces wrapper. Defaults to #spaces.
   * @param {string} config.columnSelector - CSS selector for columns. Defaults to elements having the data-column attribute.
   * @param {string} config.initialSpace - CSS selector for the initial space Defaults to the top left space.
   * @param {Boolean} config.showMap - Enables the display of a minimap. Defaults to false.
   */
  var _init = function(config) {
    var c = config || {},

    _spaceWrapper = c.spaceWrapper || '#spaces';
    _columnSelector = c.columnSelector || '[data-column]';
    _initialSpace = c.initialSpace || '[data-x="0"][data-y="0"]';
    _showMap = c.showMap || false;
    _wrapper = document.querySelector(_spaceWrapper);

    _setLayout();
    if (_showMap) _buildMap();
    _setInitialSpace();
    _initEvents();
  };

  /**
   * _move
   * Allows user to move to a space based on a direction.
   * @param {string} direction - Direction to move to relative to the current active space.
   *                             up - Moves to the space above if available.
   *                             down - Moves to the space below if available.
   *                             left - Moves to the space to the left if available.
   *                             right - Moves to the space to the rifght if available.
   *                             top - Moves to the first space in the active column.
   */
  var _move = function(direction) {
    var directions = ['up', 'down', 'left', 'right'],
        currentX = document.querySelector('[data-active]').dataset.x;
    if (direction === 'top') {
      _moveToSpace(currentX, 0);
    }else if (directions.indexOf(direction) > -1) {
      _moveToBoundingSpace(direction);
    }
  };

  /**
   * _moveTo
   * Allows user to move to a space based on a css Selector
   * @param {string} element - CSS selector for the desired space.
   */
  var _moveTo = function(element) {
    var el = document.querySelector(element),
        elX, elY;

    if (el) {
      elX = el.dataset.x;
      elY = el.dataset.y;
      if (elX && elY)  _moveToSpace(elX, elY);
    }
  };

  // Exposing public API
  return {
    init: _init,
    move: _move,
    moveTo: _moveTo
  };
})();