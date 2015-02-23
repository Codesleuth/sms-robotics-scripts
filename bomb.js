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

      this._playerId = null;
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
      var currentPos = this.entity.getPosition();
      var playersHit = this.players.within(currentPos, this.radius);
      this.bombs.delete(this._player.getId());

      var smoke = this.smokes.new(currentPos);
      smoke.countDown(5);

      for (var i = 0; i < playersHit.length; i++) {
        var player = playersHit[i];
        console.log(player + ' hit by player ' + this._player + '!');

        player.die();
      }
    }
  };

  return Bomb;
});