'use strict';

(function () {
  var C = {
    width: 800,
    height: 600,

    gridSize: 100,

    left: 0,
    top: 0,

    background: '#fff',

    key: {
      up: 38,
      down: 40,
      left: 37,
      right: 39
    },

    ball: {
      radius: 8,
      gutter: 50,
      startHeightOffset: 50
    },

    bat: {
      heightOffset: 40
    },

    inBounds: function (x, y) {
      return x >= 0 && x <= this.width && y >= 0 && y <= this.height;
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

        addPolar: function (mag, angleDegrees) {
          var rad = M.radian(angleDegrees);
          this.x += mag * Math.cos(rad);
          this.y += mag * Math.sin(rad);
        }
      };
    }
  };

  var Paddle = function () {
    return {
      type: 'paddle',
      collisionTarget: true,
      p: M.pos(Math.floor(C.width / 2), C.height - C.bat.heightOffset),
      width: 55,
      height: 8,

      move: 12,
      
      bbox: {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0
      },

      getBBox: function () {
        this.bbox.x1 = this.p.x - this.width / 2;
        this.bbox.x2 = this.p.x + this.width / 2;
        this.bbox.y1 = this.p.y;
        this.bbox.y2 = this.p.y + this.height;
        return this.bbox;
      },

      containsPoint: function (x, y) {
        return (x >= (this.p.x - this.width / 2) && x <= (this.p.x + this.width / 2) &&
                y >= this.p.y && y <= (this.p.y + this.height));
      },

      render: function (c) {
        var bbox = this.getBBox();
        c.fillStyle = '#111';
        c.fillRect(this.p.x - this.width / 2, this.p.y,
                   this.width, this.height);
      },

      animate: function (c) {
        this.applyMovement();
        this.render(c);
      },

      applyMovement: function () {
        var world = this.world;
        var oldBBox = this.getBBox();
        var didMove = false;
        if (world.keys[C.key.left]) {
          this.p.x -= this.move;
          if (this.p.x <= this.width / 2) {
            this.p.x = this.width / 2;
          }
          didMove = true;
        }
        if (world.keys[C.key.right]) {
          this.p.x += this.move;
          if (this.p.x >= C.width - this.width / 2) {
            this.p.x = C.width - this.width / 2;
          }
          didMove = true;
        }

        if (didMove) {
          var bbox = this.getBBox();
          console.log("Moved to (" + bbox.x1 + "," + bbox.y1 + ")-(" + bbox.x2 + "," + bbox.y2 + ")");
          var grid = this.world.grid;
          grid.remove(this, oldBBox);
          grid.add(this);
        }
      }
    };
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
      angle: R.randRange(225, 315),
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
        for (var i = 0; i < this.speed; i += this.increment) {
          this.p.addPolar(this.increment, this.angle);
          this.collide(c);
        }
        this.show(c, this.p);
      },

      collide: function (c) {
        var angle = this.angle;
        var low = angle - 90,
            high = angle + 90;
        var delta = 6;

        var minCollide = -5000, maxCollide = -5000;
        for (var theta = low; theta <= high; theta += delta) {
          if (this.collidesAtAngle(theta)) {
            minCollide = theta;
            break;
          }
        }
        if (minCollide === -5000) {
          return;
        }

        for (var theta = high; theta > minCollide; theta -= delta) {
          if (this.collidesAtAngle(theta)) {
            maxCollide = theta;
            break;
          }
        }
        if (maxCollide === -5000) {
          maxCollide = minCollide;
        }

        var collideAngle = (minCollide + maxCollide) / 2;
        console.log("Collision detected: " + minCollide + " to " +
                    maxCollide + ", center: " + collideAngle);

        var oldAngle = this.angle;
        this.angle = this.bounceAngle(collideAngle);
      },

      bounceAngle: function (collideAngle) {
        var delta = this.angle - collideAngle;
        var bounceAngle = Math.round(this.angle + (180 - 2 * delta)) % 360;
        console.log("bounceAngle(" + collideAngle + ", theta=" +
                    this.angle + ") = " + bounceAngle);
        return bounceAngle;
      },

      collidesAtAngle: function (theta) {
        var rad = M.radian(theta);
        var x = this.p.x + this.radius * Math.cos(rad),
            y = this.p.y + this.radius * Math.sin(rad);
        return this.collidesAtPoint(x, y);
      },

      collidesAtPoint: function (x, y) {
        return this.world.collidesAtPoint(this, x, y);
      }
    };
  };

  // An ObjectGrid keeps a list of objects divided into a coarse grid
  // for collision detection.
  function ObjectGrid() {
    var nrows = Math.ceil(C.height / C.gridSize);
    var ncols = Math.ceil(C.width / C.gridSize);
    var cells = new Array(nrows);
    for (var i = 0; i < nrows; ++i) {
      var row = new Array(ncols);
      for (var j = 0; j < ncols; ++j) {
        row[j] = [];
      }
      cells[i] = row;
    }
    return {
      cells: cells,
      
      add: function (obj, bbox) {
        if (!obj.collisionTarget) {
          return;
        }
        var box = bbox || obj.getBBox();
        for (var y = box.y1; y <= box.y2; y += C.gridSize) {
          for (var x = box.x1; x <= box.x2; x += C.gridSize) {
            this.registerAt(x, y, obj);
          }
        }
      },

      remove: function (obj, bbox) {
        if (!obj.collisionTarget) {
          return;
        }
        var box = bbox || obj.getBBox();
        for (var y = box.y1; y <= box.y2; y += C.gridSize) {
          for (var x = box.x1; x <= box.x2; x += C.gridSize) {
            this.removeAt(x, y, obj);
          }
        }
        this.removeAt(box.x2, box.y2, obj);
      },

      gridIndex: function (pos) {
        return Math.floor(pos / C.gridSize);
      },

      cell: function (x, y) {
        if (!C.inBounds(x, y)) {
          return;
        }
        var row = this.gridIndex(y),
            col = this.gridIndex(x);
        return this.cells[row][col];
      },

      objectsAt: function (x, y) {
        return this.cell(x, y);
      },
      
      registerAt: function (x, y, obj) {
        this.addCellObject(this.cell(x, y), obj);
      },

      removeAt: function (x, y, obj) {
        this.removeCellObject(this.cell(x, y), obj);
      },

      addCellObject: function (cell, obj) {
        if (!cell) {
          return;
        }
        if (cell.indexOf(obj) === -1) {
          cell.push(obj);
        }
      },

      removeCellObject: function (cell, obj) {
        if (!cell) {
          return;
        }
        var pos = cell.indexOf(obj);
        if (pos !== -1) {
          cell.splice(pos, 1);
        }
      }
    };
  }

  function GameState(canvas) {
    var ball = Ball();
    var state = {
      canvas: canvas,

      ball: ball,
      paddle: Paddle(),
      bricks: [],
      
      objects: [],
      keys: [],

      grid: ObjectGrid(),
      
      wall: {
        type: 'wall'
      },
      
      paused: false,

      init: function () {
        this.registerObjects();
        document.addEventListener('keypress', this.onKeyPress.bind(this));
        document.addEventListener('keydown', this.onKeyDown.bind(this));
        document.addEventListener('keyup', this.onKeyUp.bind(this));
      },

      collidesAtPoint: function (actor, x, y) {
        if (this.inWall(x, y)) {
          return this.wall;
        }

        for (var i = 0, length = this.objects.length; i < length; ++i) {
        // var candidates = this.grid.objectsAt(x, y);
        // for (var i = 0, length = candidates.length; i < length; ++i) {
          var obj = this.objects[i];
          if (obj === actor) {
            continue;
          }
          if (obj.containsPoint(x, y)) {
            return obj;
          }
        }
        return undefined;
      },

      inWall: function (x, y) {
        // Wall check:
        return (x <= 0 || x >= C.width || y <= 0 || y >= C.height);
      },

      // registers objects in the objects array, and adds them to the collision
      // grid.
      registerObjects: function () {
        this.objects.push(this.ball);
        this.objects.push(this.paddle);
        for (var i = 0, length = this.bricks; i < length; ++i) {
          this.objects.push(this.bricks[i]);
        }

        for (var i = 0, length = this.objects.length; i < length; ++i) {
          this.objects[i].world = this;
        }
      },

      onKeyPress: function (e) {
        switch (String.fromCharCode(e.charCode)) {
        case ' ':
          this.setPaused(!this.paused);
          break;
        }
      },

      isMovementKey: function (keyCode) {
        switch (keyCode) {
        case C.key.left:
        case C.key.right:
        case C.key.up:
        case C.key.down:
          return true;
        default:
          return false;
        }
      },
      
      onKeyDown: function (e) {
        if (this.isMovementKey(e.keyCode)) {
          this.keys[e.keyCode] = 1;
        }
      },

      onKeyUp: function (e) {
        if (this.isMovementKey(e.keyCode)) {
          this.keys[e.keyCode] = 0;
        }
      },

      setPaused: function (paused) {
        this.paused = paused;
      },

      render: function () {
        var context = this.canvas.getContext('2d');
        for (var i = 0, length = this.objects; i < length; ++i) {
          this.objects[i].render(context);
        }
      },

      animate: function () {
        var context = this.canvas.getContext('2d');
        context.clearRect(0, 0, C.width, C.height);
        for (var i = 0, length = this.objects.length; i < length; ++i) {
          this.objects[i].animate(context);
        }
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
