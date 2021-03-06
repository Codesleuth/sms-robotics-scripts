pc.script.attribute('serverUrl', 'string', 'http://sms-robotics.herokuapp.com', {
    displayName: "Server Url"
});

pc.script.create('client', function (app) {

  var Client = function (entity) {
    this.entity = entity;
  };

  Client.prototype = {

    initialize: function () {
      this.players = app.root.getChildren()[0].script.players;
      this.players.onPositionUpdate = this.sendPositionUpdate.bind(this);
      this.players.onPlayerDeath = this.sendPlayerDeath.bind(this);
      this.players.onPlayerKill = this.sendPlayerKill.bind(this);
      
      this.initializeSocketIo();
    },
    
    initializeSocketIo: function () {
      var players = io(this.serverUrl + '/players');
      this.io = players;
      
      players.on('connect', this.onPlayersConnected.bind(this));
      players.on('disconnect', this.onPlayersConnected);
      players.on('player_joined', this.onPlayerJoined.bind(this));
      players.on('player_left', this.onPlayerLeft.bind(this));
      players.on('player_move_left', this.onPlayerMove.bind(this, "left", "moveLeft"));
      players.on('player_move_right', this.onPlayerMove.bind(this, "right", "moveRight"));
      players.on('player_move_up', this.onPlayerMove.bind(this, "up", "moveUp"));
      players.on('player_move_down', this.onPlayerMove.bind(this, "down", "moveDown"));
      players.on('player_bomb', this.onPlayerBomb.bind(this));
      players.on('player_revive', this.onPlayerRevive.bind(this));
      
      players.on('sync_response', this.onSyncResponse.bind(this));
    },
    
    onPlayersConnected: function () {
      console.log("Players connection established.");
      
      console.log("Syncing data...");
      this.io.emit('sync_request');
    },
    
    onPlayersDisconnected: function () {
      console.log("Players connection lost..");
    },
    
    onPlayerJoined: function (player) {
      var newPlayer = this.players.new({
        name: player.name,
        id: player.id,
      });
      console.log(newPlayer + " joined.");
    },
    
    onPlayerLeft: function (id) {
      var player = this.players.delete(id);
      if (player)
        console.log(player + " left.");
    },
    
    onPlayerMove: function (direction, func, id) {
      var player = this.players.findById(id);
      if (player === null) {
        console.log("Player " + id + " not found; could not move " + direction + ".");
        return;
      }
      
      console.log(player + " moving " + direction + ".");
      player[func]();
    },
    
    onPlayerBomb: function (id) {
      var player = this.players.findById(id);
      if (player === null) {
        console.log("Player " + id + " not found; could not place bomb.");
        return;
      }
      
      console.log(player + " planting bomb.");
      player.bomb();
    },
    
    onPlayerRevive: function (id) {
      var player = this.players.findById(id);
      if (player === null) {
        console.log("Player " + id + " not found; could not revive.");
        return;
      }
      
      console.log(player + " reviving.");
      player.revive(true);
    },
    
    onSyncResponse: function (syncdata) {
      console.log('Sync response received for ' + syncdata.length + ' players.');
      this.players.sync(syncdata);
    },
    
    sendPositionUpdate: function (id, position) {
      var payload = {
        id: id,
        position: {
          x: position.x,
          y: position.y,
          z: position.z
        }
      };
      console.log('Sending position update: ', payload);
      this.io.emit('player_position_update', payload);
    },
    
    sendPlayerKill: function (playerId) {
      console.log('Sending player kill: ', playerId);
      this.io.emit('player_kill', playerId);
    },
    
    sendPlayerDeath: function (playerId) {
      console.log('Sending player death: ', playerId);
      this.io.emit('player_death', playerId);
    }
  };

  return Client;
});