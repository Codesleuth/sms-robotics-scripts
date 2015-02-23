pc.script.create('smoke', function (app) {

  var Smoke = function (entity) {
    this.entity = entity;
  };

  Smoke.prototype = {
    initialize: function () {
      this.smokes = app.root.getChildren()[0].script.smokes;
      this._timer = null;
    },

    countDown: function (seconds) {
      this._timer = seconds;
      this._timerMax = seconds;
    },

    update: function (dt) {
      if (this._timer === null) return;

      this._timer -= dt;

      var moveDistance = (this._timer / this._timerMax) * 12 - 10;

      var pos = this.entity.getPosition();
      this.entity.setPosition(pos.x, moveDistance, pos.z);

      if (this._timer <= 0) {
        this._timer = null;
        this.smokes.delete(this.entity);
      }
    }
  };

  return Smoke;
});