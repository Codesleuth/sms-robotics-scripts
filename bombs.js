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
    
    plant: function(playerObj, position) {
      var newBomb = this.bomb.clone();
      newBomb.setName('Bomb_' + playerObj.getId());
      newBomb.enabled = true;
      newBomb.setPosition(position);
      
      var bombObj = newBomb.script.bomb;
      bombObj.setPlayer(player);

      this.bombsNode.addChild(newBomb);

      return bombObj;
    },
    
    _remove: function (bombNode) {
      var bombObj = bombNode.script.bomb;
      var result = {
        playerId: bombObj.getPlayer().getId()
      };
      
      bombNode.destroy();
      
      return result;
    },
    
    delete: function(playerId) {
      var bomb = this.bombsNode.findByName('Bomb_' + playerId);
      if (!bomb) return null;
      
      var result = this._remove(bomb);
      return result;
    },
    
    findByPlayerId: function (playerId) {
      var bomb = this.playersNode.findByName('Bomb_' + playerId);
      if (!bomb) return null;
      
      return bomb.script.bomb;
    }
  };

  return Bombs;
});