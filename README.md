# Spaces UI

Spaces UI is a layout generator replicating OsX spaces for your website.

Watch the [demo](http://www.mellados.com/spaces-ui/demo)

Spaces is super easy to use and dependency free. It provides a lot of flexibility to give your website a cool look and feel. The only requirements are a basic markup structure and to initialize the script.

## How to use

For Spaces to work, all you need is a wrapper with columns in rows. Any immediate children of your wrapper will be consider columns and all immediate wrappers of colums will be consider rows.

```html
  <div id="spaces">
    <ul data-column>
      <li>Content 1</li>
      <li>Content 2</li>
    </ul>
    <ul data-column>
      <li>Content 3</li>
      <li>Content 4</li>
    </ul>
    .
    .
    .
    <script src="dist/spaces-ui.min.js"></script>
    <script>Spaces.init();</script>
```

In the previous example I used `ul`s for columns and `li`s for rows, but you can use any element you want.

## Navigation

Spaces disables scroll on your site. You can navigate your spaces using the arrow keys. Additionally, you can use the Spaces API to create buttons to move around spaces.

## Options

### spacesWrapper

Type: `String`

Default: `#spaces`

CSS selector for the spaces wrapper.

#### Example

```html
  <div class="myCustomWrapper">
    <ul data-column>
      <li>Content 1</li>
      <li>Content 2</li>
    </ul>
    .
    .
    .
    <script src="dist/spaces-ui.min.js"></script>
    <script>Spaces.init({spacesWrapper: '.myCustomWrapper'});</script>
```

### initialSpace

Type: `String`

Default: top left space

CSS selector for the initial space. This is the first space a user will see when entering your site.

### Example

```html
  <div id="spaces">
    <ul data-column>
      <li>Content 1</li>
      <li id="home">Content 2</li>
    </ul>
    .
    .
    .
    <script src="dist/spaces-ui.min.js"></script>
    <script>Spaces.init({initialSpace: '#home'});</script>
```

### showMap

Type: `Boolean`

Default: `false`

Enables the display of a minimap. The minimap is displayed on the bottom right part of the page. It shows the current active space and allows navigation to other spaces by clicking on them.

#### Example

```html
  <div id="spaces">
    <ul data-column>
      <li>Content 1</li>
      <li>Content 2</li>
    </ul>
    .
    .
    .
    <script src="dist/spaces-ui.min.js"></script>
    <script>Spaces.init({showMap: true});</script>
```

## API

### Spaces.move(direction);

Moves to a space relative to the currently active space based on an indicated direction.

@param: `direction`

Type: `String`

Direction to move to relative to the current active space.
  `up`: Moves to the space above if available.
  `down`: Moves to the space below if available.
  `left`: Moves to the space to the left if available.
  `right`: Moves to the space to the rifght if available.
  `top`: Moves to the first space in the active column.

#### Example 1

```html
  <div id="spaces">
    <ul data-column>
      <li>
        .
        .
        .
      </li>
      <li>
        .
        .
        .
        <button id="up">Up</buttom>
      </li>
    </ul>
    .
    .
    .
    <script src="dist/spaces-ui.min.js"></script>
    <script>
      Spaces.init();
      document.getElementById('up').addEventListener('click', function() { Spaces.move('up'); });
    </script>
```

#### Example 2 - jQuery

```html
  <div id="spaces">
    <ul data-column>
      <li>
        .
        .
        .
      </li>
      <li>
        .
        .
        .
        <button id="up">Up</buttom>
      </li>
    </ul>
    .
    .
    .
    <script src="jquery.js"></script>
    <script src="dist/spaces-ui.min.js"></script>
    <script>
      Spaces.init();
      $('#up').on('click', function() { Spaces.move('up'); });
    </script>
```


### Spaces.moveTo(selector);

Moves to a space based on a css Selector.

@param: `selector`

Type: `String`

CSS selector of the desired space to move to.

#### Example

```html
  <a href="#home" id="logo">Home</a>
  <div id="spaces">
    <ul data-column>
      <li id="home">
        .
        .
        .
      </li>
      <li>
        .
        .
        .
      </li>
    </ul>
    .
    .
    .
    <script src="dist/spaces-ui.min.js"></script>
    <script>
      Spaces.init();
      document.getElementById('logo').addEventListener('click', function() { Spaces.moveTo('#home'); });
    </script>
```

## License

Copyright (c) 2015 Marcos Mellado (marcos@mellados.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
