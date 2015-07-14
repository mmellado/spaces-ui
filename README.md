# Spaces UI

Spaces UI is a layout generator replicating OsX spaces for your website.

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

### spaceWrapper

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
    <script>Spaces.init({spaceWrapper: '.myCustomWrapper'});</script>
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

`direction`

Type: `String`

Direction to move to relative to the current active space.
  `up`: Moves to the space above if available.
  `down`: Moves to the space below if available.
  `left`: Moves to the space to the left if available.
  `right`: Moves to the space to the rifght if available.
  `top`: Moves to the first space in the active column.


### Spaces.moveTo(selector);

Moves to a space based on a css Selector.

`selector`

Type: `String`

CSS selector of the desired space to move to.
