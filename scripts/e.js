'use strict';

(function () {
  var C = {
    width: 800,
    height: 600,

    left: 0,
    top: 0,

    background: '#fff',

    ball: {
      radius: 8,
      gutter: 50,
      startHeightOffset: 50
    }
  };
  C.right = C.width;
  C.bottom = C.height;

  var R = {
    rand: function (high) {
      return Math.floor(Math.random() * high);
    },

    randRange: function (low, high) {
      return this.rand(high - low + 1) + low;
    }
  };

  var M = {
    radian: function (deg) {
      return deg * Math.PI / 180;
    },

    degree: function (rad) {
      return rad * 180 / Math.PI;
    },

    pos: function (x, y) {
      return {
        x: x,
        y: y,

        assign: function (o) {
          this.x = o.x;
          this.y = o.y;
        },

        addPolar: function (mag, angle) {
          this.x += mag * Math.cos(angle);
          this.y += mag * Math.sin(angle);
        }
      };
    }
  };

  var Ball = function (radius) {
    var randomBallPos = function () {
      return M.pos(R.randRange(C.ball.gutter, C.width - C.ball.gutter),
                   C.height - C.ball.startHeightOffset);
    };

    return {
      'type': 'ball',
      radius: radius || C.ball.radius,
      oldp: M.pos(0, 0),
      p: randomBallPos(),
      angle: M.radian(R.randRange(225, 315)),
      speed: 8,
      increment: 2,

      show: function (c, p, color) {
        c.fillStyle = color || 'red';
        c.beginPath();
        c.arc(p.x, p.y, this.radius, 0, 2 * Math.PI, true);
        c.fill();
      },

      render: function (c) {
        this.show(c, this.p);
      },

      animate: function (c) {
        this.oldp.assign(this.p);

        var count = this.speed / this.increment;
        for (var i = 0; i < count; ++i) {
          this.p.addPolar(this.increment, this.angle);
          this.collide(c);
        }
        this.show(c, this.p);
      },

      collide: function (c) {
        var angle = this.angle;
        var low = angle - Math.PI / 2,
            high = angle + Math.PI / 2;
        var delta = M.radian(5);

        var minCollide = -5000, maxCollide = -5000;
        var epsilon = 1e-5;
        for (var theta = low; theta <= high + epsilon; theta += delta) {
          if (this.collidesAtAngle(theta)) {
            minCollide = theta;
            break;
          }
        }
        if (minCollide === -5000) {
          return;
        }

        for (var theta = high; theta > minCollide - epsilon; theta -= delta) {
          if (this.collidesAtAngle(theta)) {
            maxCollide = theta;
            break;
          }
        }
        if (maxCollide === -5000) {
          maxCollide = minCollide;
        }

        var collideAngle = (minCollide + maxCollide) / 2;
        console.log("Collision detected: " + M.degree(minCollide) + " to " +
                    M.degree(maxCollide) + ", center: " + M.degree(collideAngle));

        var oldAngle = this.angle;
        this.angle = this.bounceAngle(collideAngle);
      },

      bounceAngle: function (collideAngle) {
        var delta = this.angle - collideAngle;
        var bounceAngle = (this.angle + (Math.PI - 2 * delta)) % (2 * Math.PI);
        console.log("bounceAngle(" + M.degree(collideAngle) + ", theta=" +
                    M.degree(this.angle) + ") = " + M.degree(bounceAngle));
        return bounceAngle;
      },

      collidesAtAngle: function (theta) {
        var x = this.p.x + this.radius * Math.cos(theta),
            y = this.p.y + this.radius * Math.sin(theta);
        return this.collidesAtPoint(x, y);
      },

      collidesAtPoint: function (x, y) {
        // Wall check:
        return (x <= 0 || x >= C.width || y <= 0 || y >= C.height);
      }
    };
  };

  function GameState(canvas) {
    var ball = Ball();
    var state = {
      canvas: canvas,
      ball: ball,

      paused: false,

      init: function () {
        document.addEventListener('keypress', this.onKeyPress.bind(this));
      },

      onKeyPress: function (e) {
        switch (String.fromCharCode(e.charCode)) {
        case ' ':
          this.setPaused(!this.paused);
          break;
        }
      },

      setPaused: function (paused) {
        this.paused = paused;
      },

      render: function () {
        var context = this.canvas.getContext('2d');
        this.ball.render(context);
      },

      animate: function () {
        var context = this.canvas.getContext('2d');
        context.clearRect(0, 0, C.width, C.height);
        this.ball.animate(context);
      },

      tick: function () {
        if (!this.paused) {
          this.animate();
        }
        this.startAnimation();
      },

      startAnimation: function () {
        window.requestAnimationFrame(this.tick.bind(this));
      }
    };
    ball.world = state;
    return state;
  }

  function initializeEgg(canvas) {
    var gameState = GameState(canvas);
    gameState.init();
    gameState.render();
    gameState.startAnimation();
  }

  function ecanvas(sel) {
    var container = document.querySelector(sel);
    var canvas = document.querySelector('canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.setAttribute('width', C.width);
      canvas.setAttribute('height', C.height);
      container.appendChild(canvas);
    }
    return canvas;
  }

  initializeEgg(ecanvas('#easter'));
})();
