pc.script.create('player_input_server', function (app) {
  // Creates a new Player_input_server instance
  var Player_input_server = function (entity) {
    this.entity = entity;
  };

  Player_input_server.prototype = {
    // Called once after all resources are loaded and before the first update
    initialize: function () {
      this.initializeSocketIo();
    },
    
    initializeSocketIo: function () {
      var socket = io('http://nas.codesleuth.co.uk:5555');
      socket.on('connect', this.onSocketIoConnect);
      socket.on('disconnect', this.onSocketIoDisconnect);
      this.socket = socket;
    },
    
    onSocketIoConnect: function () {
      console.log("Player 1 connected to socket.io server.");
    },
    
    onSocketIoDisconnect: function () {
      console.log("Player 1 disconnected from socket.io server.");
    },

    // Called every frame, dt is time in seconds since last update
    update: function (dt) {
    }
  };

  return Player_input_server;
});