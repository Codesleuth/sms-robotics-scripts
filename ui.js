pc.script.create('ui', function (app) {
    
  var css = [
    '.ui-div {',
    '    width: 100%;',
    '    height: 100%;',
    '    position: absolute;',
    '    top: 0;',
    '    left: 0;',
    '    overflow: hidden;',
    '}',
    '.ui-text {',
    '    font-family: Lato, sans-serif;',
    '    text-anchor: middle;',
    '    dominant-baseline: central;',
    '    -webkit-touch-callout: none;',
    '    -webkit-user-select: none;',
    '    -khtml-user-select: none;',
    '    -moz-user-select: none;',
    '    -ms-user-select: none;',
    '    user-select: none;',
    '}',
    '.anchorstart {',
    '    text-anchor: start;',
    '}',
    '.anchorend {',
    '    text-anchor: end;',
    '}',
    '.ignoreinput {',
    '    pointer-events: none;',
    '}',
    '.interactive {',
    '    cursor: pointer;',
    '}',
    'a.color-link, a .color-link {',
    '   fill: #FF9900;',
    '}',
    '.outline-white, .outline-black {',
    '   stroke-width: 1;',
    '   stroke-linecap: butt;',
    '   stroke-linejoin: miter;',
    '   stroke-opacity: 1;',
    '}',
    '.outline-white {',
    '   stroke: white;',
    '}',
    '.outline-black {',
    '   stroke: black;',
    '}'
  ].join('\n');
    
  var svgStart = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="100%" height="100%" viewBox="0 0 1280 720">';
  var svgEnd = '</svg>';

  var logoHref = 'http://sms-robotics.herokuapp.com/img/esendex-logo.png';
  
  var instructions = [
      svgStart,
      '    <text class="ui-text outline-white" x="200" y="50" fill="purple" font-size="85" font-weight="bold">Esendex</text>',
      '    <image x="200" y="150" width="360" height="89" xlink:href="', logoHref, '">',
      //'    <text class="ui-text outline-black" x="200" y="150" fill="white" font-size="60" font-weight="bold">SMS Robotics</text>',
      '    <text class="ui-text outline-black" x="1050" y="50" fill="white" font-size="60" font-weight="bold">Text &quot;JOIN&quot; to</text>',
      '    <text class="ui-text outline-black" x="1050" y="150" fill="white" font-size="60" font-weight="bold">07860026441</text>',
      svgEnd
  ].join('\n');
  
  var Ui = function (entity) {
    this.entity = entity;
  };

  Ui.prototype = {
    // Called once after all resources are loaded and before the first update
    initialize: function () {
      var style = document.createElement('style');
      style.innerHTML = css;
      document.getElementsByTagName("head")[0].appendChild(style);
      
      this.uiDiv = document.createElement('div');
      this.uiDiv.setAttribute("id", "ui-div");
      this.uiDiv.setAttribute("class", "ui-div");
      
      var appDiv = document.body;
      appDiv.appendChild(this.uiDiv);
      
      this.uiDiv.innerHTML = instructions;
    },

    setVisibility: function (visible) {
      this.div.style.visibility = visible ? 'visible' : 'hidden';
    },

    setText: function (message) {
      this.div.innerHTML = message;
    }
  };

  return Ui;
});