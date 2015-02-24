pc.script.attribute('radius', 'number', 3);

pc.script.create('bomb', function (app) {

  var Bomb = function (entity) {
    this.entity = entity;
  };

  Bomb.prototype = {
    initialize: function () {
      this.bombs = app.root.getChildren()[0].script.bombs;
      this.players = app.root.getChildren()[0].script.players;
      this.smokes = app.root.getChildren()[0].script.smokes;
      this.model = this.entity.findByName('Model');

      this._player = null;
      this._timer = null;
    },
    
    getPlayer: function () {
      return this._player;
    },
    
    setPlayer: function (player) {
      this._player = player;
    },

    countDown: function (seconds) {
      this._timer = seconds;
      this._timerMax = seconds;
    },

    update: function (dt) {
      if (this._timer === null) return;

      var scale = 2 - (this._timer / this._timerMax);
      this.model.setLocalScale(scale, scale, scale);

      this._timer -= dt;

      if (this._timer <= 0) {
        this._timer = null;
        this.explode();
      }
    },

    explode: function () {
      var modelPos = this.model.getPosition();
      var playerId = this._player.getId();
      this.players.kill(playerId, modelPos);

      this.bombs.delete(playerId);
      var smoke = this.smokes.new(modelPos);
      smoke.countDown(5);
    }
  };

  return Bomb;
});