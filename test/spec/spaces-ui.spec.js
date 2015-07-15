/**
 * @venus-library mocha
 * @venus-include ../../src/spaces-ui.js
 * @venus-fixture ../fixture/spaces-ui-fixture.html
 */
describe('Spec for spaces-ui.js', function () {

  it('snorlax should be defined', function () {
    expect(typeof Spaces).to.be('object');
  });

  it('should have fixture elements', function () {
    Spaces.init();

    expect(document.getElementById('omg-home').hasAttribute('data-active')).to.be(true);
  });

  it('should init in a custom wrapper', function() {
    Spaces.init({spacesWrapper: '.test'});

    expect(document.getElementById('omg-home').hasAttribute('data-active')).to.be(true);
  });

  it('should init with a custom initial space', function() {
    Spaces.init({initialSpace: '#bbq-home'});

    expect(document.getElementById('bbq-home').hasAttribute('data-active')).to.be(true);
  });

  it('should init and inject a mini map', function() {
    Spaces.init({showMap: 'true'});

    expect(document.getElementById('spaces-map').tagName).to.be('DIV');
  });

  it('clicking on a map element should set its equivalent as active', function() {
    Spaces.init({showMap: 'true'});

    var evObj = document.createEvent('Events');
    evObj.initEvent('click', true, false);
    document.querySelector('#spaces-map li[data-mapx="1"][data-mapy="1"]').dispatchEvent(evObj);

    expect(document.querySelector('[data-x="1"][data-y="1"]').hasAttribute('data-active')).to.be(true);
  });

  // Events

  it('the move API properly allows to move right', function() {
    Spaces.init();

    var btn = document.querySelector('.right'),
        evObj = document.createEvent('Events');

    evObj.initEvent('click', true, false);
    btn.addEventListener('click', function(){ Spaces.move('right'); });
    btn.dispatchEvent(evObj);

    expect(document.querySelector('#wtf-home').hasAttribute('data-active')).to.be(true);
  });

  it('the move API properly allows to move down', function() {
    Spaces.init({initialSpace: '#wtf-home'});

    var btn = document.querySelector('.down'),
        evObj = document.createEvent('Events');

    evObj.initEvent('click', true, false);
    btn.addEventListener('click', function(){ Spaces.move('down'); });
    btn.dispatchEvent(evObj);

    expect(document.querySelector('[data-x="1"][data-y="1"]').hasAttribute('data-active')).to.be(true);
  });

  it('the move API properly allows to move up', function() {
    Spaces.init({initialSpace: '[data-x="1"][data-y="1"]'});

    var btn = document.querySelector('.up'),
        evObj = document.createEvent('Events');

    evObj.initEvent('click', true, false);
    btn.addEventListener('click', function(){ Spaces.move('up'); });
    btn.dispatchEvent(evObj);

    expect(document.querySelector('#wtf-home').hasAttribute('data-active')).to.be(true);
  });

  it('the move API properly allows to move left', function() {
    Spaces.init({initialSpace: '#wtf-home'});

    var btn = document.querySelector('.left'),
        evObj = document.createEvent('Events');

    evObj.initEvent('click', true, false);
    btn.addEventListener('click', function(){ Spaces.move('left'); });
    btn.dispatchEvent(evObj);

    expect(document.querySelector('#omg-home').hasAttribute('data-active')).to.be(true);
  });

  it('the moveTo API properly allows to move to a new space', function() {
    Spaces.init();

    var btn = document.querySelector('#LOL'),
        evObj = document.createEvent('Events');

    evObj.initEvent('click', true, false);
    btn.addEventListener('click', function(){ Spaces.moveTo('#lol-home'); });
    btn.dispatchEvent(evObj);

    expect(document.querySelector('#lol-home').hasAttribute('data-active')).to.be(true);
  });

});