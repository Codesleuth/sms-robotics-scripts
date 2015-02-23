pc.script.attribute('bombtimer', 'number', 5);

pc.script.create('player', function (app) {
  var ANIMATIONS = {
    "idle": "Playbot_idle",
    "run": "Playbot_run",
    "die": "Playbot_die"
  };
  
  var Player = function (entity) {
    this.entity = entity;
    
    this.animState = "idle";
    this.queuedMove = null;
    this.onPositionUpdate = null;
  };

  Player.prototype = {
    initialize: function () {
      this.bombs = app.root.getChildren()[0].script.bombs;
    
      this.model = this.entity.findByName("Model");
      this.dolly = this.entity.findByName("Dolly");
      
      this._name = null;
      this._dead = false;
    
      this.stop();
    },
    
    callPositionUpdate: function () {
      if (this.onPositionUpdate) {
        var position = this.entity.getPosition();
        this.onPositionUpdate({
          x: position.x,
          y: position.y,
          z: position.z
        });
      }
    },
    
    getName: function () {
      return this._name;
    },
    
    setName: function (name) {
      this._name = name;
    },
    
    getId: function () {
      return this._id;
    },
    
    setId: function (id) {
      this._id = id;
    },

    isDead: function () {
      return this._dead;
    },

    update: function (dt) {
      if (this.isMoving()) {
        this.movingTimer += dt;
        
        if (this.movingTimer >= 1) {
          this.entity.setPosition(this.movingTo);
          
          if (this.queuedMove !== null) {
            this.move(this.queuedMove.direction, this.queuedMove.rotation);
            this.queuedMove = null;
          } else {
            this.callPositionUpdate();
            this.stop();
          }
        } else {
          var frameMove = this.movingDirection.clone().scale(dt);
          var framePos = this.movingFrom.clone().add(frameMove);
          this.entity.setPosition(framePos);
        }
      }
      
      this.dolly.rotate(0, 180 * dt, 0);
    },
    
    stop: function () {
      this.movingFrom = null;
      this.movingTo = null;
      this.movingDirection = null;
      this.movingTimer = 0;
      this.model.animation.play(ANIMATIONS.idle, 0.2);
    },
    
    run: function () {
      this.model.animation.play(ANIMATIONS.run, 0.2);
    },
    
    move: function (direction, rotation) {
      this.entity.setEulerAngles(0, rotation, 0);
      
      var currentPos = this.entity.getPosition();
      var targetPos = currentPos.clone().add(direction);
      
      this.movingFrom = currentPos;
      this.movingTo = targetPos;
      this.movingDirection = direction;
      this.movingTimer = 0;
    },
    
    moveOrQueue: function (direction, rotation) {
      if (this.isMoving()) {
        if (this.movingTimer >= 0.5) {
          this.queuedMove = {
            direction: direction,
            rotation: rotation
          };
        }
        return;
      }
      
      this.move(direction, rotation);
      this.run();
    },
    
    moveRight: function () {
      if (this._dead) return;
      this.moveOrQueue(pc.Vec3.RIGHT, 90);
    },
    
    moveLeft: function () {
      if (this._dead) return;
      this.moveOrQueue(pc.Vec3.LEFT, -90);
    },
    
    moveUp: function () {
      if (this._dead) return;
      this.moveOrQueue(pc.Vec3.FORWARD, 180);
    },
    
    moveDown: function () {
      if (this._dead) return;
      this.moveOrQueue(pc.Vec3.BACK, 0);
    },
    
    isMoving: function () {
      return this.movingTo !== null;
    },
    
    teleport: function (x, y, z) {
      this.stop();
      this.entity.setPosition(x, y, z);
    },

    bomb: function () {
      var bomb = this.bombs.plant(this, this.entity.getPosition());
      bomb.countDown(this.bombtimer);
    },

    die: function () {
      this.model.animation.play(ANIMATIONS.die, 0.2);
      this.queuedMove = null;
      this._dead = true;
    },

    revive: function () {
      this.model.animation.play(ANIMATIONS.idle, 0);
      this._dead = false;

      var x = Math.floor(pc.math.random(-9, 9));
      var z = Math.floor(pc.math.random(-9, 9));
      this.teleport(x, 0, z);
    }
  };

  return Player;
});