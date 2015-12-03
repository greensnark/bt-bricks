'use strict';

(function () {
  var C = {
    width: 850,
    height: 600,

    gridSize: 100,

    left: 0,
    top: 0,

    background: '#fff',

    color: {
      boxtone: '#009dec',
      namedBrick: '#32cdfc',
      namedBrickOutline: '#22e'
    },

    font: {
      nameSprite: '14px Helvetica'
    },
    
    block: {
      offsetX: 25,
      width: 15,
      height: 7,
      gutter: 1
    },
    
    key: {
      up: 38,
      down: 40,
      left: 37,
      right: 39
    },

    ball: {
      radius: 6.5,
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

  var State = {
    pregame: 0,
    game: 1,
    outofplay: 2,
    postgame: 3
  };

  var R = {
    rand: function (high) {
      return Math.floor(Math.random() * high);
    },

    randRange: function (low, high) {
      return this.rand(high - low + 1) + low;
    }
  };

  var namedBricks = "aakirekadu adestefano aeapen aweston bscheffey dbhat dshaligram emalloy ganderson gginsberg gmiller hkesar jfarrow jgluck jjarrett jjordan klouis mberk mcovington mdonovan mgaffney mmack mnehrbass mramsay msmith psharma rfiste sbain sgirumala shqiu sknippenberg tsackett vgupta vpathak".split(' ');
  var brickPositions = [{"x":0,"y":32},{"x":16,"y":32},{"x":32,"y":32},{"x":48,"y":32},{"x":64,"y":32},{"x":368,"y":32},{"x":384,"y":32},{"x":400,"y":32},{"x":416,"y":32},{"x":432,"y":32},{"x":448,"y":32},{"x":0,"y":40},{"x":16,"y":40},{"x":32,"y":40},{"x":48,"y":40},{"x":64,"y":40},{"x":80,"y":40},{"x":368,"y":40},{"x":384,"y":40},{"x":400,"y":40},{"x":416,"y":40},{"x":432,"y":40},{"x":448,"y":40},{"x":0,"y":48},{"x":16,"y":48},{"x":32,"y":48},{"x":48,"y":48},{"x":64,"y":48},{"x":80,"y":48},{"x":368,"y":48},{"x":384,"y":48},{"x":400,"y":48},{"x":416,"y":48},{"x":432,"y":48},{"x":448,"y":48},{"x":0,"y":56},{"x":16,"y":56},{"x":32,"y":56},{"x":48,"y":56},{"x":64,"y":56},{"x":80,"y":56},{"x":96,"y":56},{"x":368,"y":56},{"x":384,"y":56},{"x":400,"y":56},{"x":416,"y":56},{"x":432,"y":56},{"x":448,"y":56},{"x":0,"y":64},{"x":16,"y":64},{"x":32,"y":64},{"x":64,"y":64},{"x":80,"y":64},{"x":96,"y":64},{"x":368,"y":64},{"x":384,"y":64},{"x":400,"y":64},{"x":416,"y":64},{"x":432,"y":64},{"x":448,"y":64},{"x":0,"y":72},{"x":16,"y":72},{"x":32,"y":72},{"x":64,"y":72},{"x":80,"y":72},{"x":96,"y":72},{"x":160,"y":72},{"x":176,"y":72},{"x":192,"y":72},{"x":240,"y":72},{"x":256,"y":72},{"x":272,"y":72},{"x":304,"y":72},{"x":320,"y":72},{"x":336,"y":72},{"x":384,"y":72},{"x":400,"y":72},{"x":416,"y":72},{"x":480,"y":72},{"x":496,"y":72},{"x":512,"y":72},{"x":528,"y":72},{"x":576,"y":72},{"x":592,"y":72},{"x":640,"y":72},{"x":656,"y":72},{"x":720,"y":72},{"x":736,"y":72},{"x":752,"y":72},{"x":0,"y":80},{"x":16,"y":80},{"x":32,"y":80},{"x":48,"y":80},{"x":64,"y":80},{"x":80,"y":80},{"x":144,"y":80},{"x":160,"y":80},{"x":176,"y":80},{"x":192,"y":80},{"x":208,"y":80},{"x":240,"y":80},{"x":256,"y":80},{"x":272,"y":80},{"x":288,"y":80},{"x":304,"y":80},{"x":320,"y":80},{"x":384,"y":80},{"x":400,"y":80},{"x":416,"y":80},{"x":464,"y":80},{"x":480,"y":80},{"x":496,"y":80},{"x":512,"y":80},{"x":528,"y":80},{"x":544,"y":80},{"x":576,"y":80},{"x":592,"y":80},{"x":640,"y":80},{"x":656,"y":80},{"x":704,"y":80},{"x":720,"y":80},{"x":736,"y":80},{"x":752,"y":80},{"x":768,"y":80},{"x":0,"y":88},{"x":16,"y":88},{"x":32,"y":88},{"x":48,"y":88},{"x":64,"y":88},{"x":80,"y":88},{"x":128,"y":88},{"x":144,"y":88},{"x":160,"y":88},{"x":176,"y":88},{"x":192,"y":88},{"x":208,"y":88},{"x":256,"y":88},{"x":272,"y":88},{"x":288,"y":88},{"x":304,"y":88},{"x":320,"y":88},{"x":384,"y":88},{"x":400,"y":88},{"x":416,"y":88},{"x":464,"y":88},{"x":480,"y":88},{"x":496,"y":88},{"x":512,"y":88},{"x":528,"y":88},{"x":544,"y":88},{"x":576,"y":88},{"x":592,"y":88},{"x":608,"y":88},{"x":624,"y":88},{"x":640,"y":88},{"x":656,"y":88},{"x":704,"y":88},{"x":720,"y":88},{"x":752,"y":88},{"x":768,"y":88},{"x":0,"y":96},{"x":16,"y":96},{"x":32,"y":96},{"x":48,"y":96},{"x":64,"y":96},{"x":80,"y":96},{"x":128,"y":96},{"x":144,"y":96},{"x":160,"y":96},{"x":176,"y":96},{"x":192,"y":96},{"x":208,"y":96},{"x":224,"y":96},{"x":256,"y":96},{"x":272,"y":96},{"x":288,"y":96},{"x":304,"y":96},{"x":320,"y":96},{"x":384,"y":96},{"x":400,"y":96},{"x":416,"y":96},{"x":464,"y":96},{"x":480,"y":96},{"x":496,"y":96},{"x":512,"y":96},{"x":528,"y":96},{"x":544,"y":96},{"x":576,"y":96},{"x":592,"y":96},{"x":608,"y":96},{"x":624,"y":96},{"x":640,"y":96},{"x":656,"y":96},{"x":688,"y":96},{"x":704,"y":96},{"x":720,"y":96},{"x":752,"y":96},{"x":768,"y":96},{"x":784,"y":96},{"x":0,"y":104},{"x":16,"y":104},{"x":32,"y":104},{"x":64,"y":104},{"x":80,"y":104},{"x":96,"y":104},{"x":128,"y":104},{"x":144,"y":104},{"x":192,"y":104},{"x":208,"y":104},{"x":224,"y":104},{"x":272,"y":104},{"x":288,"y":104},{"x":304,"y":104},{"x":384,"y":104},{"x":400,"y":104},{"x":416,"y":104},{"x":464,"y":104},{"x":480,"y":104},{"x":528,"y":104},{"x":544,"y":104},{"x":576,"y":104},{"x":592,"y":104},{"x":608,"y":104},{"x":640,"y":104},{"x":656,"y":104},{"x":688,"y":104},{"x":704,"y":104},{"x":720,"y":104},{"x":736,"y":104},{"x":752,"y":104},{"x":768,"y":104},{"x":784,"y":104},{"x":0,"y":112},{"x":16,"y":112},{"x":32,"y":112},{"x":64,"y":112},{"x":80,"y":112},{"x":96,"y":112},{"x":128,"y":112},{"x":144,"y":112},{"x":192,"y":112},{"x":208,"y":112},{"x":224,"y":112},{"x":272,"y":112},{"x":288,"y":112},{"x":304,"y":112},{"x":384,"y":112},{"x":400,"y":112},{"x":416,"y":112},{"x":464,"y":112},{"x":480,"y":112},{"x":528,"y":112},{"x":544,"y":112},{"x":576,"y":112},{"x":592,"y":112},{"x":608,"y":112},{"x":640,"y":112},{"x":656,"y":112},{"x":688,"y":112},{"x":704,"y":112},{"x":720,"y":112},{"x":736,"y":112},{"x":752,"y":112},{"x":768,"y":112},{"x":784,"y":112},{"x":0,"y":120},{"x":16,"y":120},{"x":32,"y":120},{"x":64,"y":120},{"x":80,"y":120},{"x":96,"y":120},{"x":128,"y":120},{"x":144,"y":120},{"x":192,"y":120},{"x":208,"y":120},{"x":224,"y":120},{"x":272,"y":120},{"x":288,"y":120},{"x":304,"y":120},{"x":384,"y":120},{"x":400,"y":120},{"x":416,"y":120},{"x":464,"y":120},{"x":480,"y":120},{"x":528,"y":120},{"x":544,"y":120},{"x":576,"y":120},{"x":592,"y":120},{"x":608,"y":120},{"x":640,"y":120},{"x":656,"y":120},{"x":688,"y":120},{"x":704,"y":120},{"x":720,"y":120},{"x":0,"y":128},{"x":16,"y":128},{"x":32,"y":128},{"x":48,"y":128},{"x":64,"y":128},{"x":80,"y":128},{"x":96,"y":128},{"x":128,"y":128},{"x":144,"y":128},{"x":160,"y":128},{"x":176,"y":128},{"x":192,"y":128},{"x":208,"y":128},{"x":224,"y":128},{"x":256,"y":128},{"x":272,"y":128},{"x":288,"y":128},{"x":304,"y":128},{"x":320,"y":128},{"x":384,"y":128},{"x":400,"y":128},{"x":416,"y":128},{"x":464,"y":128},{"x":480,"y":128},{"x":496,"y":128},{"x":512,"y":128},{"x":528,"y":128},{"x":544,"y":128},{"x":576,"y":128},{"x":592,"y":128},{"x":608,"y":128},{"x":640,"y":128},{"x":656,"y":128},{"x":688,"y":128},{"x":704,"y":128},{"x":720,"y":128},{"x":752,"y":128},{"x":768,"y":128},{"x":784,"y":128},{"x":0,"y":136},{"x":16,"y":136},{"x":32,"y":136},{"x":48,"y":136},{"x":64,"y":136},{"x":80,"y":136},{"x":96,"y":136},{"x":128,"y":136},{"x":144,"y":136},{"x":160,"y":136},{"x":176,"y":136},{"x":192,"y":136},{"x":208,"y":136},{"x":256,"y":136},{"x":272,"y":136},{"x":288,"y":136},{"x":304,"y":136},{"x":320,"y":136},{"x":384,"y":136},{"x":400,"y":136},{"x":416,"y":136},{"x":464,"y":136},{"x":480,"y":136},{"x":496,"y":136},{"x":512,"y":136},{"x":528,"y":136},{"x":544,"y":136},{"x":576,"y":136},{"x":592,"y":136},{"x":608,"y":136},{"x":640,"y":136},{"x":656,"y":136},{"x":704,"y":136},{"x":720,"y":136},{"x":736,"y":136},{"x":752,"y":136},{"x":768,"y":136},{"x":784,"y":136},{"x":0,"y":144},{"x":16,"y":144},{"x":32,"y":144},{"x":48,"y":144},{"x":64,"y":144},{"x":80,"y":144},{"x":144,"y":144},{"x":160,"y":144},{"x":176,"y":144},{"x":192,"y":144},{"x":208,"y":144},{"x":240,"y":144},{"x":256,"y":144},{"x":272,"y":144},{"x":304,"y":144},{"x":320,"y":144},{"x":336,"y":144},{"x":384,"y":144},{"x":400,"y":144},{"x":416,"y":144},{"x":464,"y":144},{"x":480,"y":144},{"x":496,"y":144},{"x":512,"y":144},{"x":528,"y":144},{"x":544,"y":144},{"x":576,"y":144},{"x":592,"y":144},{"x":608,"y":144},{"x":640,"y":144},{"x":656,"y":144},{"x":704,"y":144},{"x":720,"y":144},{"x":736,"y":144},{"x":752,"y":144},{"x":768,"y":144},{"x":0,"y":152},{"x":16,"y":152},{"x":32,"y":152},{"x":48,"y":152},{"x":64,"y":152},{"x":80,"y":152},{"x":160,"y":152},{"x":176,"y":152},{"x":192,"y":152},{"x":240,"y":152},{"x":256,"y":152},{"x":272,"y":152},{"x":304,"y":152},{"x":320,"y":152},{"x":336,"y":152},{"x":384,"y":152},{"x":400,"y":152},{"x":416,"y":152},{"x":480,"y":152},{"x":496,"y":152},{"x":512,"y":152},{"x":528,"y":152},{"x":576,"y":152},{"x":592,"y":152},{"x":640,"y":152},{"x":656,"y":152},{"x":720,"y":152},{"x":736,"y":152},{"x":752,"y":152},{"x":336,"y":80},{"x":160,"y":104},{"x":160,"y":120},{"x":160,"y":112},{"x":96,"y":48},{"x":352,"y":64},{"x":352,"y":56},{"x":352,"y":48},{"x":352,"y":40},{"x":352,"y":32},{"x":624,"y":80},{"x":624,"y":72},{"x":608,"y":152},{"x":224,"y":88},{"x":224,"y":136},{"x":96,"y":144}];  

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

  var Brick = function (x, y) {
    return {
      type: 'block',
      collisionTarget: true,
      p: M.pos(x, y),
      width: C.block.width,
      height: C.block.height,

      name: undefined,

      bbox: {
        x1: x,
        y1: y,
        x2: x + C.block.width - 1,
        y2: y + C.block.height - 1
      },

      active: true,
      needRemove: false,

      init: function () {
        this.clearName();
        this.active = true;
        this.needRemove = false;
      },

      setName: function (name) {
        this.name = name;
      },

      clearName: function () {
        this.name = undefined;
      },

      getBBox: function () {
        return this.bbox;
      },

      collideWith: function (thing) {
        if (this.active) {
          this.active = false;
          if (this.name) {
            this.animateNameDrop();
            this.clearSurroundingBlocks(thing);
          }
        }
        this.needRemove = true;
      },

      // Animate the name falling away and fading.
      animateNameDrop: function () {
        this.world.addSprite(
          NameSprite(this.name,
                     Math.floor(x + C.block.width / 2),
                     Math.floor(y + C.block.height / 2)));
      },

      clearSurroundingBlocks: function (thing) {
        for (var y = -1; y <= 1; ++y) {
          for (var x = -1; x <= 1; ++x) {
            if ((!x && !y) || (x && y)) {
              continue;
            }
            var blockX = Math.floor(this.p.x + (x + 0.5) * (C.block.width + C.block.gutter)),
                blockY = Math.floor(this.p.y + (y + 0.5) * (C.block.height + C.block.gutter));
            this.clearBlock(blockX, blockY);
          }
        }
      },

      clearBlock: function (x, y, thing) {
        x = Math.floor(x);
        y = Math.floor(y);
        var object = this.world.collidesAtPoint(this, x, y);
        if (object && object !== this) {
          object.collideWith(thing);
        }
      },

      containsPoint: function (x, y) {
        return x >= this.bbox.x1 && x <= this.bbox.x2 && y >= this.bbox.y1 && y <= this.bbox.y2;
      },
      
      render: function (c) {
        if (!this.active) {
          if (this.needRemove) {
            this.world.grid.remove(this);
            this.needRemove = false;
          }
          return;
        }
        c.fillStyle = this.name? C.color.namedBrick : C.color.boxtone;
        c.fillRect(this.bbox.x1, this.bbox.y1, C.block.width, C.block.height);
      },

      animate: function (c) {
        this.render(c);
      }
    };
  };

  var NameSprite = function (name, x, y) {
    return {
      name: name,
      x: x,
      y: y,
      velocity: 0,
      maxVelocity: 10,
      acceleration: 0.1,
      alpha: 1,

      render: function (c) {
        c.font = C.font.nameSprite;
        c.fillColor = 'rgba(30, 80, 150, ' + this.alpha + ')';
        c.textAlign = 'center';
        c.fillText(this.name, this.x, this.y);
      },

      animate: function (c) {
        this.y += this.velocity;
        this.velocity += this.acceleration;
        if (this.velocity > this.maxVelocity) {
          this.velocity = this.maxVelocity;
        }
        this.alpha -= 0.01;
        if (this.alpha < 0) {
          this.alpha = 0;
        }
        this.render(c);

        if (this.alpha <= 0 || this.y >= C.height) {
          this.world.removeSprite(this);
        }
      }
    };
  };

  var Paddle = function () {
    return {
      type: 'paddle',
      collisionTarget: true,
      p: M.pos(0, 0),
      width: 75,
      height: 8,

      move: 12,
      
      bbox: {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0
      },

      init: function () {
        this.p = M.pos(Math.floor(C.width / 2) - 0.5, C.height - C.bat.heightOffset);
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
        if (this.world.state !== State.game) {
          return;
        }
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
          var grid = this.world.grid;
          grid.remove(this, oldBBox);
          grid.add(this);
        }
      }
    };
  };

  var Ball = function (radius) {
    return {
      type: 'ball',
      radius: radius || C.ball.radius,
      p: M.pos(0, 0),
      angle: 0,
      speed: 8,
      increment: 2,

      flashCounter: 0,
      flashDirection: -1,
      flashAlpha: 1.0,
      flashThreshold: 12,

      flashTimes: 0,
      maxFlashCount: 9,

      init: function () {
        this.p = M.pos(C.width / 2, C.height - C.ball.startHeightOffset);
        this.angle = R.randRange(225, 315);
      },
      
      show: function (c, p, color) {
        c.fillStyle = color || 'rgba(255, 0, 0, 1)';
        c.beginPath();
        c.arc(p.x, p.y, this.radius, 0, 2 * Math.PI, true);
        c.fill();
      },

      render: function (c) {
        this.show(c, this.p);
      },

      animate: function (c) {
        switch (this.world.state) {
        case State.pregame:
          this.show(c, this.p);
          break;
        case State.game:
          this.move(c);
          break;
        case State.outofplay:
          this.flash(c);
          break;
        default:
          break;
        }
      },

      move: function (c) {
        for (var i = 0; i < this.speed; i += this.increment) {
          this.p.addPolar(this.increment, this.angle);
          this.collide(c);

          if (this.isOutOfBounds()) {
            this.endGame();
            break;
          }
        }
        this.show(c, this.p);
      },

      endGame: function () {
        console.error("Game over");
        this.world.setState(State.outofplay);
      },

      isOutOfBounds: function () {
        return this.p.y > (C.height - C.ball.startHeightOffset / 3);
      },

      flash: function (c) {
        if (++this.flashCounter >= this.flashThreshold) {
          this.flashDirection = -this.flashDirection;
          this.flashCounter = 0;
          if (++this.flashTimes >= this.maxFlashCount) {
            this.flashTimes = 0;
            this.world.setState(State.postgame);
          }
        }
        this.flashAlpha += this.flashDirection * (1.0 / this.maxFlashCount);
        this.show(c, this.p, 'rgba(255, 0, 0, ' + this.flashAlpha + ')');
      },

      collide: function (c) {
        var angle = this.angle;
        var low = angle - 90,
            high = angle + 90;
        var delta = 6;

        var minCollide = -5000, maxCollide = -5000;
        for (var theta = low; theta <= high; theta += delta) {
          var obj = this.collidesAtAngle(theta);
          if (obj) {
            if (obj.collideWith) {
              obj.collideWith(this);
            }
            minCollide = theta;
            break;
          }
        }
        if (minCollide === -5000) {
          return;
        }

        for (theta = high; theta > minCollide; theta -= delta) {
          var obj = this.collidesAtAngle(theta);
          if (obj) {
            if (obj.collideWith) {
              obj.collideWith(this);
            }
            maxCollide = theta;
            break;
          }
        }
        if (maxCollide === -5000) {
          maxCollide = minCollide;
        }

        var collideAngle = (minCollide + maxCollide) / 2;
        var oldAngle = this.angle;
        this.angle = this.bounceAngle(collideAngle);
      },

      bounceAngle: function (collideAngle) {
        var delta = this.angle - collideAngle;
        var bounceAngle = Math.round(this.angle + (180 - 2 * delta) + this.bounceFuzz()) % 360;
        return bounceAngle;
      },

      bounceFuzz: function () {
        return (R.randRange(-4, 4) + R.randRange(-4, 4)) / 2;
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

    var emptyCells = function () {
      var cells = new Array(nrows);
      for (var i = 0; i < nrows; ++i) {
        var row = new Array(ncols);
        for (var j = 0; j < ncols; ++j) {
          row[j] = [];
        }
        cells[i] = row;
      }
      return cells;
    };
    
    return {
      cells: emptyCells(),

      clear: function () {
        this.cells = emptyCells();
      },
      
      add: function (obj, bbox) {
        if (!obj.collisionTarget) {
          return;
        }
        var box = bbox || obj.getBBox();
        this.eachCell(box, function (x, y) {
          this.registerAt(x, y, obj);
        });
      },

      remove: function (obj, bbox) {
        if (!obj.collisionTarget) {
          return;
        }
        var box = bbox || obj.getBBox();
        this.eachCell(box, function (x, y) {
          this.removeAt(x, y, obj);
        });
      },

      eachCell: function (box, fn) {
        fn = fn.bind(this);
        for (var y = box.y1; y <= box.y2; y += C.gridSize) {
          for (var x = box.x1; x <= box.x2; x += C.gridSize) {
            fn(x, y);
          }
        }
        fn(box.x2, box.y2);
      },

      gridIndex: function (pos) {
        return Math.floor(pos / C.gridSize);
      },

      cell: function (x, y) {
        if (!C.inBounds(x, y)) {
          return undefined;
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
      state: State.pregame,
      
      wall: {
        type: 'wall'
      },
      
      paused: false,

      init: function () {
        this.setState(State.pregame);
        this.registerObjects();
        this.reset();
        document.addEventListener('keypress', this.onKeyPress.bind(this));
        document.addEventListener('keydown', this.onKeyDown.bind(this));
        document.addEventListener('keyup', this.onKeyUp.bind(this));
      },

      addSprite: function (sprite) {
        if (this.objects.lastIndexOf(sprite) === -1) {
          sprite.world = this;
          this.objects.push(sprite);
        }
      },

      removeSprite: function (sprite) {
        var idx = this.objects.lastIndexOf(sprite);
        if (idx !== -1) {
          this.objects.splice(idx, 1);
          return true;
        }
        return false;
      },

      setState: function (state) {
        this.state = state;
      },

      collidesAtPoint: function (actor, x, y) {
        if (this.inWall(x, y)) {
          return this.wall;
        }

        var candidates = this.grid.objectsAt(x, y);
        if (!candidates) {
          return undefined;
        }
        for (var i = 0, length = candidates.length; i < length; ++i) {
          var obj = candidates[i];
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
        for (var i = 0, length = brickPositions.length; i < length; ++i) {
          var p = brickPositions[i];
          this.bricks.push(Brick(p.x + C.block.offsetX, p.y));
        }
        
        for (i = 0, length = this.bricks.length; i < length; ++i) {
          this.objects.push(this.bricks[i]);
        }
        
        this.objects.push(this.ball);
        this.objects.push(this.paddle);
      },

      clearBrickNames: function () {
        for (var i = 0, length = this.bricks.length; i < length; ++i) {
          this.bricks[i].clearName();
        }
      },

      assignBrickNames: function () {
        var availableIndexes = [];
        for (var i = 0, length = this.bricks.length; i < length; ++i) {
          availableIndexes.push(i);
        }

        var bricks = this.bricks;
        var nextBrick = function () {
          var n = R.rand(availableIndexes.length);
          var brick = bricks[availableIndexes[n]];
          availableIndexes.splice(n, 1);
          return brick;
        };

        for (i = 0, length = namedBricks.length; i < length; ++i) {
          nextBrick().setName(namedBricks[i]);
        }
      },

      reset: function () {
        this.grid.clear();
        for (var i = 0, length = this.objects.length; i < length; ++i) {
          var obj = this.objects[i];
          obj.world = this;
          if (obj.init) {
            obj.init();
            if (obj.collisionTarget) {
              this.grid.add(obj);
            }
          }
        }
        this.clearBrickNames();
        this.assignBrickNames();
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
        if (this.state === State.pregame || this.state === State.postgame) {
          this.reset();
          this.setState(this.state === State.postgame ? State.pregame : State.game);
        }
        
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
        for (var i = this.objects.length - 1; i >= 0; --i) {
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
