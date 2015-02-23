pc.script.create('bombs', function (app) {
  
  var Bombs = function (entity) {
    this.entity = entity;
    
    this.onPositionUpdate = null;
  };

  Bombs.prototype = {
    
    initialize: function () {
      this.bomb = app.root.findByName('Bomb');
      this.bomb.enabled = false;
      
      this.bombsNode = app.root.findByName('Bombs');
    },
    
    plant: function(playerId, position) {
      var newBomb = this.bomb.clone();
      newBomb.setName('Bomb_' + playerId);
      newBomb.enabled = true;
      newBomb.setPosition(position.x, 
                          position.y,
                          position.z);
      
      var bombObj = newBomb.script.bomb;
      bombObj.setPlayerId(playerId);

      this.bombsNode.addChild(newBomb);

      return bombObj;
    },
    
    _remove: function (bombNode) {
      var bombObj = bombNode.script.player;
      var result = {
        playerId: bombObj.getPlayerId()
      };
      
      bombNode.destroy();
      
      return result;
    },
    
    delete: function(playerId) {
      var bomb = this.bombsNode.findByName('Bomb_' + playerId);
      if (!bomb) return;
      
      var result = this._remove(bomb);
      return result;
    },
    
    findByPlayerId: function (playerId) {
      var player = this.playersNode.findByName('Bomb_' + playerId);
      if (!player) return null;
      
      return player.script.player;
    }
  };

  return Bombs;
});