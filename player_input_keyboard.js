pc.script.create('player_input_keyboard', function (context) {
  var Player_input_keyboard = function (entity) {
    this.entity = entity;
    
    this.horizontalSpeed = 0;
    this.verticalSpeed = 0;
  };

  Player_input_keyboard.prototype = {
    // Called once after all resources are loaded and before the first update
    initialize: function () {
      context.controller = new pc.Controller(document);
      
      context.controller.registerKeys("left", [pc.KEY_A, pc.KEY_LEFT]);
      context.controller.registerKeys("right", [pc.KEY_D, pc.KEY_RIGHT]);
      context.controller.registerKeys("up", [pc.KEY_W, pc.KEY_UP]);
      context.controller.registerKeys("down", [pc.KEY_S, pc.KEY_DOWN]);
    },

    update: function (dt) {
      var controller = context.controller;
      var player_controller = this.entity.script.player_controller;
      
      if (controller.isPressed("right")) {
        player_controller.moveRight();
      } else if (controller.isPressed("left")) {
        player_controller.moveLeft();
      } else if (controller.isPressed("up")) {
        player_controller.moveUp();
      } else if (controller.isPressed("down")) {
        player_controller.moveDown();
      }
    }
  };

  return Player_input_keyboard;
});