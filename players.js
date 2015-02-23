pc.script.create('players', function (app) {
  // Creates a new Players instance
  var Players = function (entity) {
    this.entity = entity;
    
    this.onPositionUpdate = null;
  };

  Players.prototype = {
    // Called once after all resources are loaded and before the first update
    initialize: function () {
      this.player = app.root.findByName('Player');
      this.player.enabled = false;
      
      this.playersNode = app.root.findByName('Players');
    },
    
    callPositionUpdate: function (id, position) {
      if (this.onPositionUpdate)
        this.onPositionUpdate(id, position);
    },
    
    new: function (args) {
      var newPlayer = this.player.clone();
      newPlayer.setName('Player_' + args.id);
      newPlayer.enabled = true;

      var x = Math.floor(pc.math.random(-10, 10));
      var z = Math.floor(pc.math.random(-10, 10));

      newPlayer.setPosition(x, 0, z);
      
      var playerObj = newPlayer.script.player;
      playerObj.setName(args.name);
      playerObj.setId(args.id);
      
      if (args.position) {
        playerObj.teleport(args.position.x, args.position.y, args.position.z);
      }
      
      var self = this;
      
      playerObj.onPositionUpdate = function (position) {
        self.callPositionUpdate(args.id, position);
      };
      
      this.playersNode.addChild(newPlayer);
    },
    
    _remove: function (playerNode) {
      var playerObj = playerNode.script.player;
      var result = {
        name: playerObj.getName(),
        id: playerObj.getId()
      };
      
      playerNode.destroy();
      
      return result;
    },
    
    delete: function (id) {
      var player = this.playersNode.findByName('Player_' + id);
      if (!player) return;
      
      var result = this._remove(player);
      return result;
    },
    
    findById: function (id) {
      var player = this.playersNode.findByName('Player_' + id);
      if (!player) return null;
      
      return player.script.player;
    },

    within: function (position, radius) {
      var result = [];
      var playerNodes = this.playersNode.getChildren();
      for (i = 0; i < playerNodes.length; i++) {
        var playerNode = playerNodes[i];;
        var playerPos = playerNode.getPosition();

        var vec = position.clone().sub(playerPos);

        if (vec.length() <= radius) {
          var playerObj = playerNode.script.player;
          result.push(playerObj);
        }
      }
      return result;
    },
    
    sync: function (syncdata) {
      var syncIds = syncdata.map(function (d) { return d.id; });
      var playerNodes = this.playersNode.getChildren();
      
      var nodesToRemove = [];
      
      // update & flag for delete
      for (i = 0; i < playerNodes.length; i++) {
        var playerNode = playerNodes[i];
        var player = playerNode.script.player;
        var playerId = player.getId();
        var syncIdsIndex = syncIds.indexOf(playerId);
        
        if (syncIdsIndex === -1) {
          nodesToRemove.push(playerNode);
          continue;
        }
        
        var playerData = syncdata[syncIdsIndex];
        
        // update existing player
        player.setName(playerData.name);
        player.setId(playerData.id);
        player.teleport(playerData.position.x, playerData.position.y, playerData.position.z);
      }
      
      for (var i = 0; i < nodesToRemove.length; i++) {
        // player left
        var playerNode = nodesToRemove[i];
        console.log('Removing player ' + playerNode.name);
        this._remove(playerNode);
      }
      
      // add new
      for (var i = 0; i < syncdata.length; i++) {
        var newData = syncdata[i];
        if (this.findById(newData.id) !== null) continue;
        
        this.new({
          id: newData.id,
          name: newData.name,
          position: newData.position
        });
      }
    }
  };

  return Players;
});