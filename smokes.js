pc.script.create('smokes', function (app) {
  
  var Smokes = function (entity) {
    this.entity = entity;
    
    this.onPositionUpdate = null;
  };

  Smokes.prototype = {
    
    initialize: function () {
      this.smoke = app.root.findByName('Smoke');
      this.smoke.enabled = false;
      
      this.smokesNode = app.root.findByName('Smokes');
    },
    
    new: function (position) {
      var newSmoke = this.smoke.clone();
      newSmoke.enabled = true;
      newSmoke.setPosition(position);

      this.smokesNode.addChild(newSmoke);
    },
    
    delete: function (smokeNode) {
      smokeNode.destroy();
    }
  };

  return Smokes;
});