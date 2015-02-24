pc.script.create('players', function (app) {

  var Players = function (entity) {
    this.entity = entity;
    
    this.onPositionUpdate = null;
    this.onPlayerDeath = null;
    this.onPlayerKill = null;
  };

  Players.prototype = {

    initialize: function () {
      this.player = app.root.findByName('Player');
      this.player.enabled = false;
      
      this.playersNode = app.root.findByName('Players');
    },
    
    callPositionUpdate: function (id, position) {
      if (this.onPositionUpdate)
        this.onPositionUpdate(id, position);
    },
    
    callPlayerDeath: function (playerId) {
      if (this.onPlayerDeath)
        this.onPlayerDeath(playerId);
    },
    
    callPlayerKill: function (playerId) {
      if (this.onPlayerKill)
        this.onPlayerKill(playerId);
    },
    
    new: function (args) {
      var newPlayer = this.player.clone();
      newPlayer.setName('Player_' + args.id);
      newPlayer.enabled = true;

      var x = Math.floor(pc.math.random(-9, 9));
      var z = Math.floor(pc.math.random(-9, 9));

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

      return playerObj;
    },
    
    _remove: function (playerNode) {
      var playerObj = playerNode.script.player;
      playerNode.destroy();
      
      return playerObj;
    },
    
    delete: function (id) {
      var player = this.playersNode.findByName('Player_' + id);
      if (!player) return null;
      
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
        var distance = vec.length();

        var playerObj = playerNode.script.player;
        console.log(playerObj + ' was found ' + distance + ' away from explosion.');

        if (vec.length() < radius) {
          result.push(playerObj);
        }
      }
      return result;
    },

    explosion: function (playerId, position, radius) {
      var playersHit = this.within(position, radius);

      for (var i = 0; i < playersHit.length; i++) {
        var player = playersHit[i];
        console.log(player + ' hit by player id ' + playerId + '!');

        player.die();
        
        this.callPlayerDeath(player.getId());
        this.callPlayerKill(playerId);
      }
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

        if (playerData.dead)
          player.die();
        else
          player.revive(false);
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
        
        var newPlayer = this.new({
          id: newData.id,
          name: newData.name,
          position: newData.position
        });

        if (newData.dead)
          newPlayer.die();
      }
    }
  };

  return Players;
});