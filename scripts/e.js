'use strict';

(function () {
  var C = {
    width: 850,
    height: 600,

    touchscreen: (function () {
      try {
        document.createEvent('TouchEvent');
        return true;
      } catch (e) {
        return false;
      }
    })(),

    namedBrickMax: 48, // Only so many named bricks in one screen.

    gridSize: 100,

    left: 0,
    top: 0,

    statusHeight: 50,
    gameTop: 0,

    background: '#fff',

    rollCall: {
      width: 150,
      height: 600
    },
    
    color: {
      ball: '#e32d20',
      boxtone: '#009dec',
      namedBrick: '#32cdfc',
      dyingBrick: '#fccd32',
      namedBrickOutline: '#22e'
    },

    font: {
      nameSprite: '16px "Lucida Grande", Helvetica, Arial'
    },
    
    block: {
      offsetX: 25,
      width: 15,
      height: 7,
      gutter: 1
    },
    
    key: {
      escape: 27,
      enter: 13,
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

    scoreRanks: [
      { sc: 400, title: 'Sith Lord' },
      { sc: 200, title: 'Grand Moff' },
      { sc: 100, title: 'Chief Executive Officer' },
      { sc: 80, title: 'Chief Finagling Officer' },
      { sc: 50, title: 'Vice President, Brickonomics' },
      { sc: 25, title: 'Principal Powershell Protagonist' },
      { sc: 10, title: 'Agile Antagonist' },
      { sc: 0, title: 'Use the arrow keys, Luke' }
    ],

    inBounds: function (x, y) {
      return x >= 0 && x <= this.width && y >= 0 && y <= this.height;
    }
  };
  C.right = C.width;
  C.bottom = C.height;

  var State = {
    pregame: 0,
    game: 1,
    screencleared: 2,
    outofplay: 3,
    balllost: 4,
    gameover: 5,

    isActive: function (state) {
      switch (state) {
      case this.game:
      case this.screencleared:
      case this.outofplay:
      case this.balllost:
        return true;
      default:
        return false;
      }
    }
  };

  var R = {
    rand: function (high) {
      return Math.floor(Math.random() * high);
    },

    randRange: function (low, high) {
      return this.rand(high - low + 1) + low;
    }
  };

  var namedBricks =
      [
        "Alan Snyder", "Alvin Guingab", "Anna Yap", "Annu Singh", "Anthony DeStefano",
        "Anurag Dwivedi", "Arianne Weston", "Ashwath Akirekadu", "Ashwin Eapen", "Bill Mollock",
        "Brian Murphy", "Brian Reed", "Brian Scheffey", "Bryant Maltese", "Cameron Horn",
        "Darshan Shaligram", "Daniel Cook", "Danny Dorsey", "Deepti Paranjape", "Dinesh Bhat",
        "Edna Malloy", "Eileen Mercilliot", "Galit Miller", "George Anderson", "Georgiy Frolov",
        "Greg Delaney", "Greg Persch", "Gregg Ginsberg", "Himanshu Kesar", "Howie Rappaport", "Janice Gluck",
        "Jennifer Cicik", "Jill Samuel", "Jim Farrow", "Jim Jarrett", "Jim Jordan", "Jon Edmunds",
        "Kenn Louis",  "Ki Jones", "Liz Crooks", "Liz Shannon", "Mark Donovan", "Matt Covington",
        "Matt Nehrbass", "Matt Smith", "Maureen Delong", "Mike Gaffney", "Mike Lott", "Mike Ramsay",
        "Missy Mack", "Mitch Berk", "Nat Medija", "Nicole Dunn", "Pat Pulliam", "Peter Kim",
        "Prayank Sharma", "Rakesh Kashyap", "Rashmi Deshpande", "Ruchika Yadav", "Rusty Fiste", "Shi-Yue Qiu",
        "Sameet Nasnodkar", "Samir Agte", "Shweta Harisinghani", "Sigurd Knippenberg", "Sinclair Bain",
        "Star Miller", "Steven Hor", "Sui Severance", "Susmitha Girumala", "Tammy Kelly",
        "Tim Head", "Todd Sackett", "Vipul Pathak", "Vishal Gupta", "Yancy Davis"
      ];
  
  var brickPositions = [{"x":0,"y":32},{"x":16,"y":32},{"x":32,"y":32},{"x":48,"y":32},{"x":64,"y":32},{"x":368,"y":32},{"x":384,"y":32},{"x":400,"y":32},{"x":416,"y":32},{"x":432,"y":32},{"x":448,"y":32},{"x":0,"y":40},{"x":16,"y":40},{"x":32,"y":40},{"x":48,"y":40},{"x":64,"y":40},{"x":80,"y":40},{"x":368,"y":40},{"x":384,"y":40},{"x":400,"y":40},{"x":416,"y":40},{"x":432,"y":40},{"x":448,"y":40},{"x":0,"y":48},{"x":16,"y":48},{"x":32,"y":48},{"x":48,"y":48},{"x":64,"y":48},{"x":80,"y":48},{"x":368,"y":48},{"x":384,"y":48},{"x":400,"y":48},{"x":416,"y":48},{"x":432,"y":48},{"x":448,"y":48},{"x":0,"y":56},{"x":16,"y":56},{"x":32,"y":56},{"x":48,"y":56},{"x":64,"y":56},{"x":80,"y":56},{"x":96,"y":56},{"x":368,"y":56},{"x":384,"y":56},{"x":400,"y":56},{"x":416,"y":56},{"x":432,"y":56},{"x":448,"y":56},{"x":0,"y":64},{"x":16,"y":64},{"x":32,"y":64},{"x":64,"y":64},{"x":80,"y":64},{"x":96,"y":64},{"x":368,"y":64},{"x":384,"y":64},{"x":400,"y":64},{"x":416,"y":64},{"x":432,"y":64},{"x":448,"y":64},{"x":0,"y":72},{"x":16,"y":72},{"x":32,"y":72},{"x":64,"y":72},{"x":80,"y":72},{"x":96,"y":72},{"x":160,"y":72},{"x":176,"y":72},{"x":192,"y":72},{"x":240,"y":72},{"x":256,"y":72},{"x":272,"y":72},{"x":304,"y":72},{"x":320,"y":72},{"x":336,"y":72},{"x":384,"y":72},{"x":400,"y":72},{"x":416,"y":72},{"x":480,"y":72},{"x":496,"y":72},{"x":512,"y":72},{"x":528,"y":72},{"x":576,"y":72},{"x":592,"y":72},{"x":640,"y":72},{"x":656,"y":72},{"x":720,"y":72},{"x":736,"y":72},{"x":752,"y":72},{"x":0,"y":80},{"x":16,"y":80},{"x":32,"y":80},{"x":48,"y":80},{"x":64,"y":80},{"x":80,"y":80},{"x":144,"y":80},{"x":160,"y":80},{"x":176,"y":80},{"x":192,"y":80},{"x":208,"y":80},{"x":240,"y":80},{"x":256,"y":80},{"x":272,"y":80},{"x":288,"y":80},{"x":304,"y":80},{"x":320,"y":80},{"x":384,"y":80},{"x":400,"y":80},{"x":416,"y":80},{"x":464,"y":80},{"x":480,"y":80},{"x":496,"y":80},{"x":512,"y":80},{"x":528,"y":80},{"x":544,"y":80},{"x":576,"y":80},{"x":592,"y":80},{"x":640,"y":80},{"x":656,"y":80},{"x":704,"y":80},{"x":720,"y":80},{"x":736,"y":80},{"x":752,"y":80},{"x":768,"y":80},{"x":0,"y":88},{"x":16,"y":88},{"x":32,"y":88},{"x":48,"y":88},{"x":64,"y":88},{"x":80,"y":88},{"x":128,"y":88},{"x":144,"y":88},{"x":160,"y":88},{"x":176,"y":88},{"x":192,"y":88},{"x":208,"y":88},{"x":256,"y":88},{"x":272,"y":88},{"x":288,"y":88},{"x":304,"y":88},{"x":320,"y":88},{"x":384,"y":88},{"x":400,"y":88},{"x":416,"y":88},{"x":464,"y":88},{"x":480,"y":88},{"x":496,"y":88},{"x":512,"y":88},{"x":528,"y":88},{"x":544,"y":88},{"x":576,"y":88},{"x":592,"y":88},{"x":608,"y":88},{"x":624,"y":88},{"x":640,"y":88},{"x":656,"y":88},{"x":704,"y":88},{"x":720,"y":88},{"x":752,"y":88},{"x":768,"y":88},{"x":0,"y":96},{"x":16,"y":96},{"x":32,"y":96},{"x":48,"y":96},{"x":64,"y":96},{"x":80,"y":96},{"x":128,"y":96},{"x":144,"y":96},{"x":160,"y":96},{"x":176,"y":96},{"x":192,"y":96},{"x":208,"y":96},{"x":224,"y":96},{"x":256,"y":96},{"x":272,"y":96},{"x":288,"y":96},{"x":304,"y":96},{"x":320,"y":96},{"x":384,"y":96},{"x":400,"y":96},{"x":416,"y":96},{"x":464,"y":96},{"x":480,"y":96},{"x":496,"y":96},{"x":512,"y":96},{"x":528,"y":96},{"x":544,"y":96},{"x":576,"y":96},{"x":592,"y":96},{"x":608,"y":96},{"x":624,"y":96},{"x":640,"y":96},{"x":656,"y":96},{"x":688,"y":96},{"x":704,"y":96},{"x":720,"y":96},{"x":752,"y":96},{"x":768,"y":96},{"x":784,"y":96},{"x":0,"y":104},{"x":16,"y":104},{"x":32,"y":104},{"x":64,"y":104},{"x":80,"y":104},{"x":96,"y":104},{"x":128,"y":104},{"x":144,"y":104},{"x":192,"y":104},{"x":208,"y":104},{"x":224,"y":104},{"x":272,"y":104},{"x":288,"y":104},{"x":304,"y":104},{"x":384,"y":104},{"x":400,"y":104},{"x":416,"y":104},{"x":464,"y":104},{"x":480,"y":104},{"x":528,"y":104},{"x":544,"y":104},{"x":576,"y":104},{"x":592,"y":104},{"x":608,"y":104},{"x":640,"y":104},{"x":656,"y":104},{"x":688,"y":104},{"x":704,"y":104},{"x":720,"y":104},{"x":736,"y":104},{"x":752,"y":104},{"x":768,"y":104},{"x":784,"y":104},{"x":0,"y":112},{"x":16,"y":112},{"x":32,"y":112},{"x":64,"y":112},{"x":80,"y":112},{"x":96,"y":112},{"x":128,"y":112},{"x":144,"y":112},{"x":192,"y":112},{"x":208,"y":112},{"x":224,"y":112},{"x":272,"y":112},{"x":288,"y":112},{"x":304,"y":112},{"x":384,"y":112},{"x":400,"y":112},{"x":416,"y":112},{"x":464,"y":112},{"x":480,"y":112},{"x":528,"y":112},{"x":544,"y":112},{"x":576,"y":112},{"x":592,"y":112},{"x":608,"y":112},{"x":640,"y":112},{"x":656,"y":112},{"x":688,"y":112},{"x":704,"y":112},{"x":720,"y":112},{"x":736,"y":112},{"x":752,"y":112},{"x":768,"y":112},{"x":784,"y":112},{"x":0,"y":120},{"x":16,"y":120},{"x":32,"y":120},{"x":64,"y":120},{"x":80,"y":120},{"x":96,"y":120},{"x":128,"y":120},{"x":144,"y":120},{"x":192,"y":120},{"x":208,"y":120},{"x":224,"y":120},{"x":272,"y":120},{"x":288,"y":120},{"x":304,"y":120},{"x":384,"y":120},{"x":400,"y":120},{"x":416,"y":120},{"x":464,"y":120},{"x":480,"y":120},{"x":528,"y":120},{"x":544,"y":120},{"x":576,"y":120},{"x":592,"y":120},{"x":608,"y":120},{"x":640,"y":120},{"x":656,"y":120},{"x":688,"y":120},{"x":704,"y":120},{"x":720,"y":120},{"x":0,"y":128},{"x":16,"y":128},{"x":32,"y":128},{"x":48,"y":128},{"x":64,"y":128},{"x":80,"y":128},{"x":96,"y":128},{"x":128,"y":128},{"x":144,"y":128},{"x":160,"y":128},{"x":176,"y":128},{"x":192,"y":128},{"x":208,"y":128},{"x":224,"y":128},{"x":256,"y":128},{"x":272,"y":128},{"x":288,"y":128},{"x":304,"y":128},{"x":320,"y":128},{"x":384,"y":128},{"x":400,"y":128},{"x":416,"y":128},{"x":464,"y":128},{"x":480,"y":128},{"x":496,"y":128},{"x":512,"y":128},{"x":528,"y":128},{"x":544,"y":128},{"x":576,"y":128},{"x":592,"y":128},{"x":608,"y":128},{"x":640,"y":128},{"x":656,"y":128},{"x":688,"y":128},{"x":704,"y":128},{"x":720,"y":128},{"x":752,"y":128},{"x":768,"y":128},{"x":784,"y":128},{"x":0,"y":136},{"x":16,"y":136},{"x":32,"y":136},{"x":48,"y":136},{"x":64,"y":136},{"x":80,"y":136},{"x":96,"y":136},{"x":128,"y":136},{"x":144,"y":136},{"x":160,"y":136},{"x":176,"y":136},{"x":192,"y":136},{"x":208,"y":136},{"x":256,"y":136},{"x":272,"y":136},{"x":288,"y":136},{"x":304,"y":136},{"x":320,"y":136},{"x":384,"y":136},{"x":400,"y":136},{"x":416,"y":136},{"x":464,"y":136},{"x":480,"y":136},{"x":496,"y":136},{"x":512,"y":136},{"x":528,"y":136},{"x":544,"y":136},{"x":576,"y":136},{"x":592,"y":136},{"x":608,"y":136},{"x":640,"y":136},{"x":656,"y":136},{"x":704,"y":136},{"x":720,"y":136},{"x":736,"y":136},{"x":752,"y":136},{"x":768,"y":136},{"x":784,"y":136},{"x":0,"y":144},{"x":16,"y":144},{"x":32,"y":144},{"x":48,"y":144},{"x":64,"y":144},{"x":80,"y":144},{"x":144,"y":144},{"x":160,"y":144},{"x":176,"y":144},{"x":192,"y":144},{"x":208,"y":144},{"x":240,"y":144},{"x":256,"y":144},{"x":272,"y":144},{"x":304,"y":144},{"x":320,"y":144},{"x":336,"y":144},{"x":384,"y":144},{"x":400,"y":144},{"x":416,"y":144},{"x":464,"y":144},{"x":480,"y":144},{"x":496,"y":144},{"x":512,"y":144},{"x":528,"y":144},{"x":544,"y":144},{"x":576,"y":144},{"x":592,"y":144},{"x":608,"y":144},{"x":640,"y":144},{"x":656,"y":144},{"x":704,"y":144},{"x":720,"y":144},{"x":736,"y":144},{"x":752,"y":144},{"x":768,"y":144},{"x":0,"y":152},{"x":16,"y":152},{"x":32,"y":152},{"x":48,"y":152},{"x":64,"y":152},{"x":80,"y":152},{"x":160,"y":152},{"x":176,"y":152},{"x":192,"y":152},{"x":240,"y":152},{"x":256,"y":152},{"x":272,"y":152},{"x":304,"y":152},{"x":320,"y":152},{"x":336,"y":152},{"x":384,"y":152},{"x":400,"y":152},{"x":416,"y":152},{"x":480,"y":152},{"x":496,"y":152},{"x":512,"y":152},{"x":528,"y":152},{"x":576,"y":152},{"x":592,"y":152},{"x":640,"y":152},{"x":656,"y":152},{"x":720,"y":152},{"x":736,"y":152},{"x":752,"y":152},{"x":336,"y":80},{"x":160,"y":104},{"x":160,"y":120},{"x":160,"y":112},{"x":96,"y":48},{"x":352,"y":64},{"x":352,"y":56},{"x":352,"y":48},{"x":352,"y":40},{"x":352,"y":32},{"x":624,"y":80},{"x":624,"y":72},{"x":608,"y":152},{"x":224,"y":88},{"x":224,"y":136},{"x":96,"y":144}].sort(
    function (a, b) {
      if (a.y < b.y || (a.y === b.y && a.x < b.x)) {
        return -1;
      }
      if (a.y === b.y && a.x === b.x) {
        return 0;
      }
      return 1;
    });  

  var M = (function () {
    var radians = new Float64Array(360);
    var cosines = new Float64Array(360);
    var sines = new Float64Array(360);

    for (var degree = 0; degree < 360; ++degree) {
      var rad = degree * Math.PI / 180;
      radians[degree] = rad;
      cosines[degree] = Math.cos(rad);
      sines[degree] = Math.sin(rad);
    }
    
    return {
      // Argument MUST be integer in the range [0, 360)
      radian: function (deg) {
        return radians[deg];
      },

      // Argument MUST be integer in the range [0, 360)
      cos: function (deg) {
        return cosines[deg];
      },

      sin: function (deg) {
        return sines[deg];
      },

      normalizeDegrees: function (deg) {
        deg = Math.round(deg);
        return deg < 0 ? 360 - (-deg % 360) : deg % 360;
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
            this.x += mag * M.cos(angleDegrees);
            this.y += mag * M.sin(angleDegrees);
          }
        };
      }
    };
  })();

  var Sprite = function () {
    var id = 0;
    return {
      // nextId returns the next unique sprite id.
      nextId: function () {
        return ++id;
      }
    };
  }();
  
  var Bounds = function () {
    var sentinel = -1000;
    return {
      x1: sentinel, y1: sentinel, x2: sentinel, y2: sentinel,

      isValid: function () {
        return !(this.x1 === sentinel || this.y1 === sentinel ||
                 this.x2 === sentinel || this.y2 === sentinel);
      },

      assign: function (other) {
        this.x1 = other.x1;
        this.x2 = other.x2;
        this.y1 = other.y1;
        this.y2 = other.y2;
        return this;
      },

      // dirtyBBox sets this bounding box to the smallest covering rectangle
      // that contains both oldBB and newBB.
      dirtyBBox: function (oldBB, newBB) {
        this.x1 = Math.min(oldBB.x1, newBB.x1);
        this.x2 = Math.max(oldBB.x2, newBB.x2);
        this.y1 = Math.min(oldBB.y1, newBB.y1);
        this.y2 = Math.min(oldBB.y2, newBB.y2);
        return this;
      },
      
      reset: function () {
        this.x1 = this.y1 = this.x2 = this.y2 = sentinel;
      },

      // Expand expands this bounding box to encompass the rectangle supplied
      // (as top-left and bottom-right corners).
      expand: function (nx1, ny1, nx2, ny2) {
        if (nx1 < this.x1) {
          this.x1 = nx1;
        }
        if (ny1 < this.y1) {
          this.y1 = ny1;
        }
        if (nx2 > this.x2) {
          this.x2 = nx2;
        }
        if (ny2 > this.y2) {
          this.y2 = ny2;
        }
      }
    };
  };
  
  var BrickState = {
    active: 1,
    dying: 2,
    dead: 3
  };

  var Brick = function (x, y) {
    var deathCycles = 32;
    return {
      id: Sprite.nextId(),
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

      state: BrickState.active,
      needRemove: false,
      deathCountdown: 0,

      init: function () {
        this.state = BrickState.active;
        this.needRemove = false;
        this.deathCountdown = 0;
      },

      isAlive: function () {
        return this.state === BrickState.active;
      },

      setName: function (name) {
        this.name = name;
        this.color = this.normalColor();
      },

      clearName: function () {
        this.setName(undefined);
      },

      getBBox: function () {
        return this.bbox;
      },

      getPoints: function () {
        return (this.name ? 500 : 5);
      },

      startDying: function (multiplier) {
        this.state = BrickState.dying;
        this.deathCountdown = deathCycles * (multiplier || 1);
      },

      collideWith: function (thing) {
        if (this.state === BrickState.active) {
          if (this.name) {
            // Named bricks go through death throes:
            this.startDying();
          } else {
            this.destroy();
          }
        }
      },

      destroy: function () {
        this.state = BrickState.dead;
        this.needRemove = true;
        this.world.destroyedBrick(this);
        this.world.score.add(this.getPoints());
        if (this.name) {
          this.world.addScalp(this.name);
          this.animateNameDrop();
          this.clearSurroundingBlocks(this);
        }
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
            if ((!x && !y)) {
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
        if (this.state !== BrickState.dead) {
          c.fillStyle = this.fillColor();
          c.fillRect(this.bbox.x1, this.bbox.y1, C.block.width, C.block.height);
        }
      },

      fillColor: function () {
        switch (this.state) {
        case BrickState.active:
          return this.color;
        case BrickState.dying:
          var flash = ((this.deathCountdown >> 3) & 1);
          return flash? C.color.dyingBrick : this.color;
        default:
          return C.color.dyingBrick;
        }
      },

      normalColor: function () {
        return this.name? C.color.namedBrick : C.color.boxtone;
      },

      animate: function (c) {
        if (this.state === BrickState.dead && this.needRemove) {
          this.world.grid.remove(this);
          this.needRemove = false;
          return this.bbox;
        }
        
        if (this.state === BrickState.dying && --this.deathCountdown <= 0) {
          this.destroy();
        }
        return this.state !== BrickState.active ? this.bbox : undefined;
      },
    };
  };

  var NameSprite = function (name, x, y) {
    return {
      id: Sprite.nextId(),
      type: 'name',
      name: name,
      x: x,
      y: y,
      velocity: 0,
      maxVelocity: 10,
      acceleration: 0.05,
      alpha: 1,
      alive: true,

      textBBox: { width: 0, height: 0 },
      dirtyBounds: Bounds(),

      render: function (c) {
        if (!this.alive) {
          return;
        }
        this.setStyle(c);
        c.fillText(this.name, this.x, this.y);
      },

      setStyle: function (c) {
        c.font = C.font.nameSprite;
        c.fillStyle = C.color.boxtone;
        c.textAlign = 'center';
      },

      measureText: function (c) {
        this.setStyle(c);
        var m = c.measureText(this.name);
        this.textBBox.width = Math.floor(m.width * 1.5);
        this.textBBox.height = 35;
      },

      animate: function (c) {
        if (!this.textBBox.width) {
          this.measureText(c);
        }
        this.dirtyBounds.x1 = this.x - this.textBBox.width / 2;
        this.dirtyBounds.y1 = this.y - this.textBBox.height / 2;

        this.y += this.velocity;
        this.dirtyBounds.x2 = this.dirtyBounds.x1 + this.textBBox.width;
        this.dirtyBounds.y2 = this.dirtyBounds.y1 + this.textBBox.height + this.velocity;
        
        this.velocity += this.acceleration;
        if (this.velocity > this.maxVelocity) {
          this.velocity = this.maxVelocity;
        }

        if (this.y >= C.height) {
          this.world.removeSprite(this);
          this.alive = false;
        }
        return this.dirtyBounds;
      }
    };
  };

  var Paddle = function () {
    return {
      id: Sprite.nextId(),
      type: 'paddle',
      collisionTarget: true,
      p: M.pos(0, 0),
      width: 75,
      height: 8,

      move: 12,
      
      bbox: Bounds(),
      oldBBox: Bounds(),
      dirtyBounds: Bounds(),

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
        c.font = '48px Helvetica';
        c.fillStyle = '#111';
        c.fillRect(this.p.x - this.width / 2, this.p.y,
                   this.width, this.height);
      },

      animate: function (c) {
        return this.applyMovement();
      },

      applyMovement: function () {
        if (this.world.state !== State.game) {
          return null;
        }

        this.dirtyBounds.reset();
        var world = this.world;
        var oldBBox = this.oldBBox.assign(this.getBBox());
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
          this.dirtyBounds.dirtyBBox(oldBBox, bbox);
        }
        return (this.dirtyBounds.isValid())? this.dirtyBounds : null;
      }
    };
  };

  var Ball = function (radius) {
    return {
      id: Sprite.nextId(),
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

      dirtyBounds: Bounds(),

      init: function () {
        this.p = M.pos(C.width / 2, C.height - C.ball.startHeightOffset);
        this.angle = R.randRange(225, 315);
      },
      
      show: function (c, p, color) {
        c.fillStyle = color || C.color.ball;
        c.beginPath();
        c.arc(p.x, p.y, this.radius, 0, 2 * Math.PI, true);
        c.fill();
      },

      render: function (c) {
        if (this.world && this.world.state === State.outofplay) {
          this.flash(c);
        } else {
          this.show(c, this.p);
        }
      },

      animate: function (c) {
        switch (this.world.state) {
        case State.game:
          return this.move(c);
          break;
        }
      },

      initDirtyBounds: function () {
        var d = this.dirtyBounds;
        d.x1 = this.p.x;
        d.x2 = this.p.x;
        d.y1 = this.p.y;
        d.y2 = this.p.y;
      },

      expandDirtyBounds: function () {
        var p = this.p;
        var d = this.dirtyBounds;
        if (p.x < d.x1) {
          d.x1 = p.x;
        }
        if (p.x > d.x2) {
          d.x2 = p.x;
        }
        if (p.y < d.y1) {
          d.y1 = p.y;
        }
        if (p.y > d.y2) {
          d.y2 = p.y;
        }
      },

      finalizeDirtyBounds: function () {
        var d = this.dirtyBounds;
        var rad = this.radius + 2;
        d.x1 -= rad;
        d.x2 += rad;
        d.y1 -= rad;
        d.y2 += rad;
        return d;
      },

      move: function (c) {
        this.initDirtyBounds();
        for (var i = 0; i < this.speed; i += this.increment) {
          this.p.addPolar(this.increment, this.angle);
          this.collide(c);
          this.expandDirtyBounds();

          if (this.isOutOfBounds()) {
            this.endGame();
            break;
          }
        }
        return this.finalizeDirtyBounds();
      },

      endGame: function () {
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
            this.world.setState(State.balllost);
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
        return M.normalizeDegrees((this.angle + (180 - 2 * delta) + this.bounceFuzz(this.angle)));
      },

      bounceFuzz: function () {
        if (Math.abs(this.angle) < 5 || Math.abs(this.angle - 180) < 5) {
          return R.randRange(-8, 8);
        }
        
        return (R.randRange(-4, 4) + R.randRange(-4, 4)) / 2;
      },

      collidesAtAngle: function (theta) {
        theta = M.normalizeDegrees(theta);
        var x = this.p.x + this.radius * M.cos(theta),
            y = this.p.y + this.radius * M.sin(theta);
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

      dirtyCells: [],
      seenDirtyCells: [],
      nDirtyCells: 0,

      render: function (c) {
        c.strokeStyle = '#333';
        c.fillStyle = '#333';
        c.beginPath();
        for (var y = 0; y < C.height; y += C.gridSize) {
          c.moveTo(0, y);
          c.lineTo(C.width, y);
        }
        for (var x = 0; x < C.width; x += C.gridSize) {
          c.moveTo(x, 0);
          c.lineTo(x, C.height);
        }
        c.stroke();
      },

      clearDirty: function () {
        this.nDirtyCells = 0;
        this.seenDirtyCells.splice(0, this.seenDirtyCells.length);
      },

      dirtyBBox: function (bbox) {
        var y1 = this.gridIndex(bbox.y1),
            y2 = this.gridIndex(bbox.y2),
            x1 = this.gridIndex(bbox.x1),
            x2 = this.gridIndex(bbox.x2);

        var pos = y1 * ncols;
        for (var y = y1; y <= y2; ++y) {
          for (var x = x1; x <= x2; ++x) {
            if (x < 0 || x >= ncols || y < 0 || y >= nrows) {
              continue;
            }
            var dirtyOffset = pos + x;
            if (!this.seenDirtyCells[dirtyOffset]) {
              this.seenDirtyCells[dirtyOffset] = true;
              this.registerDirtyCell(x, y);
            }
          }
          pos += ncols;
        }
      },

      registerDirtyCell: function (x, y) {
        var obj = this.dirtyCells[this.nDirtyCells];
        if (!obj) {
          this.dirtyCells[this.nDirtyCells] = obj = { x: x, y: y };
        } else {
          obj.x = x;
          obj.y = y;
        }
        ++this.nDirtyCells;
      },

      redrawDirty: function (c) {
        for (var i = 0, length = this.nDirtyCells; i < length; ++i) {
          var cell = this.dirtyCells[i];
          this.clearCell(c, cell.x, cell.y);
        }
        for (var i = 0, length = this.nDirtyCells; i < length; ++i) {
          var cell = this.dirtyCells[i];
          this.redrawCellSprites(c, this.cells[cell.y][cell.x]);
        }
      },

      redrawCellSprites: function (c, cellSprites) {
        for (var i = cellSprites.length - 1; i >= 0; --i) {
          cellSprites[i].render(c);
        }
      },

      clearCell: function (c, x, y) {
        c.clearRect(x * C.gridSize, y * C.gridSize,
                    C.gridSize, C.gridSize);
      },
      
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
        fn(box.x2, box.y1);
        fn(box.x1, box.y2);
        fn(box.x2, box.y2);
      },

      gridIndex: function (pos) {
        return Math.floor(pos / C.gridSize);
      },

      cell: function (x, y) {
        if (!C.inBounds(x, y)) {
          return null;
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

  var BallReserve = function () {
    var ballCount = 2;
    return {
      reserve: ballCount,
      ball: Ball(),
      alwaysDraw: true,
      
      dirty: true,

      init: function (newgame) {
        if (newgame) {
          this.reserve = ballCount;
          this.dirty = true;
        }
      },

      alive: function () {
        return this.reserve >= 0;
      },

      continueAfterLostBall: function () {
        this.dirty = true;
        return --this.reserve >= 0;
      },
      
      render: function () {
        if (!this.dirty) {
          return;
        }
        var c = this.world.statusPane.getContext('2d');
        c.clearRect(0, 0, C.width / 2, C.statusHeight);
        for (var i = 0; i < this.reserve; ++i) {
          this.ball.p.x = i * (this.ball.radius * 2 + 5) + this.ball.radius + 5;
          this.ball.p.y = Math.floor(C.statusHeight / 2);
          this.ball.render(c);
        }
        this.dirty = false;
      },

      animate: function () {
        this.render();
      }
    };
  };

  var ScoreTicker = function (initial) {
    return {
      score: initial,
      displayedScore: initial,
      alwaysDraw: true,

      add: function (n) {
        this.score += n;
      },

      getRank: function () {
        var perc = Math.floor(this.score * 100 / this.world.maxScore);
        for (var i = 0, length = C.scoreRanks.length; i < length; ++i) {
          var r = C.scoreRanks[i];
          if (perc >= r.sc) {
            return r.title;
          }
        }
        return 'Manatee';
      },

      init: function (newgame) {
        if (newgame) {
          this.score = this.displayedScore = initial;
        }
      },
      
      render: function (c) {
        this.world.scorePane.innerHTML = this.displayedScore;
      },
      
      animate: function (c) {
        if (this.displayedScore < this.score) {
          var gap = this.score - this.displayedScore;
          var step = (gap > 200) ? 100 :
              (gap > 50) ? 10 : 1;
          this.displayedScore += Math.min(this.score - this.displayedScore, step);
        }
        this.render(c);
      }
    };
  };

  function GameState(dom) {
    var ball = Ball();
    var state = {
      animationActive: false,
      animating: false,
      awaitingAnimationFrame: false,
      
      canvas: dom.canvas,
      scorePane: dom.score,
      statusPane: dom.status,
      rollCall: dom.rollCall,
      rollCallTitle: dom.rollCallTitle,
      names: dom.names,

      ball: ball,
      ballReserve: BallReserve(),
      paddle: Paddle(),
      bricks: [],
      destroyedBricks: 0,
      destroyedNamedBricks: 0,
      namedBrickCount: 0,
      
      objects: [],
      keys: [],
      transients: [],
      touches: { },
      touchState: { },

      score: ScoreTicker(0),
      maxScore: 0,

      grid: ObjectGrid(),
      state: State.pregame,

      nextScreenCountDown: 0,
      
      wall: {
        type: 'wall'
      },

      redraw: true,
      paused: false,

      init: function () {
        this.tickBound = this.tick.bind(this);
        this.setState(State.pregame);
        this.registerObjects();
        this.reset(true);

        if (!this.boundListeners) {
          this.boundListeners = {
            keypress: this.onKeyPress.bind(this),
            keydown: this.onKeyDown.bind(this),
            keyup: this.onKeyUp.bind(this),
            touchstart: this.onTouchStart.bind(this),
            touchmove: this.onTouchMove.bind(this),
            touchend: this.onTouchEnd.bind(this),
            touchcancel: this.onTouchEnd.bind(this)
          };
        }

        for (var event in this.boundListeners) {
          if (this.boundListeners.hasOwnProperty(event)) {
            document.addEventListener(event, this.boundListeners[event]);
          }
        }
      },

      destroy: function () {
        for (var event in this.boundListeners) {
          if (this.boundListeners.hasOwnProperty(event)) {
            document.removeEventListener(event, this.boundListeners[event]);
          }
        }
      },

      addScalp: function (name) {
        if (!this.names.childNodes.length) {
          this.rollCallTitle.innerHTML = '';
        }
        var li = document.createElement('li');
        li.setAttribute('style', 'font: 10px "Lucida Grande", Helvetica, Arial; color: #999; list-style-type: decimal; margin-left: 15px');
        var span = document.createElement('span');
        span.setAttribute('style', 'color: #333');
        span.innerHTML = name;
        li.appendChild(span);
        this.names.appendChild(li);
      },

      clearScalps: function () {
        this.names.innerHTML = '';
      },

      addSprite: function (sprite) {
        if (this.objects.lastIndexOf(sprite) === -1) {
          sprite.world = this;
          this.objects.push(sprite);
          this.transients.push(sprite);
        }
      },

      removeSprite: function (sprite) {
        var idx = this.objects.lastIndexOf(sprite);
        if (idx !== -1) {
          this.objects.splice(idx, 1);
          var transientIndex = this.transients.lastIndexOf(sprite);
          if (transientIndex !== -1) {
            this.transients.splice(transientIndex, 1);
          }
          return true;
        }
        return false;
      },

      setState: function (state) {
        this.redraw = true;
        if (state !== this.state) {
          this.state = state;

          switch (state) {
          case State.balllost:
            if (!this.ballReserve.continueAfterLostBall()) {
              this.setState(State.gameover);
            } else {
              this.resetBallPaddle();
            }
            break;
          case State.screencleared:
            this.score.add(15000);
            this.nextScreenCountDown = 300;
            break;
          }

          if (State.isActive(state)) {
            this.setAnimationActive(true);
          } else {
            this.setAnimationActive(false);
            if (!this.animating) {
              this.render();
            }
          }
        }
      },

      collidesAtPoint: function (actor, x, y) {
        if (this.inWall(x, y)) {
          return this.wall;
        }

        var candidates = this.grid.objectsAt(x, y);
        if (!candidates) {
          return null;
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
        return null;
      },

      inWall: function (x, y) {
        // Wall check:
        return (x <= 0 || x >= C.width || y <= C.gameTop || y >= C.height);
      },

      // registers objects in the objects array, and adds them to the collision
      // grid.
      registerObjects: function () {
        this.bricks = [];
        for (var i = 0, length = brickPositions.length; i < length; ++i) {
          var p = brickPositions[i];
          this.bricks.push(Brick(p.x + C.block.offsetX, p.y + C.gameTop));
        }
        
        for (i = 0, length = this.bricks.length; i < length; ++i) {
          this.registerObject(this.bricks[i]);
        }
        
        this.registerObject(this.ball);
        this.registerObject(this.paddle);
        this.registerObject(this.score);
        this.registerObject(this.ballReserve);
      },
      
      registerObject: function (obj) {
        obj.world = this;
        this.objects.push(obj);
      },

      clearBrickNames: function () {
        for (var i = 0, length = this.bricks.length; i < length; ++i) {
          this.bricks[i].clearName();
        }
      },

      assignBrickNames: function () {
        var indexes = function (n) {
          var res = [];
          for (var i = n - 1; i >= 0; --i) {
            res.push(i);
          }
          return res;
        };
        
        var availableBricks = indexes(this.bricks.length);
        var availableNames = indexes(namedBricks.length);

        var bricks = this.bricks;
        var pickRandom = function (choices, indexes) {
          var n = R.rand(indexes.length);
          var chosen = choices[indexes[n]];
          indexes.splice(n, 1);
          return chosen;
        };
        
        var nextBrick = function () {
          return pickRandom(bricks, availableBricks);
        };

        var nextName = function () {
          return pickRandom(namedBricks, availableNames);
        };

        var brickCount = Math.min(C.namedBrickMax, namedBricks.length);
        this.namedBrickCount = 0;
        for (var i = 0; i < brickCount; ++i) {
          var name = nextName();
          if (name) {
            ++this.namedBrickCount;
          }
          nextBrick().setName(name);
        }
      },

      resetBallPaddle: function (c) {
        this.paddle.init();
        this.ball.init();
        this.render(c);
      },

      destroyedBrick: function (brick) {
        ++this.destroyedBricks;
        if (brick.name) {
          ++this.destroyedNamedBricks;
        }
        if (this.destroyedBricks >= this.bricks.length) {
          this.setState(State.screencleared);
          return;
        }

        if (this.namedBrickCount > 10 && this.destroyedNamedBricks >= (this.namedBrickCount - 3)) {
          for (var i = 0, length = this.bricks.length; i < length; ++i) {
            var brick = this.bricks[i];
            if (brick.isAlive()) {
              brick.startDying(5);
            }
          }
        }
      },

      reset: function (newgame) {
        this.clearScalps();
        this.clearBrickNames();
        this.assignBrickNames();

        this.resetScreen(newgame);
      },

      resetScreen: function (newgame) {
        this.redraw = true;
        this.destroyedBricks = 0;
        this.destroyedNamedBricks = 0;
        this.grid.clear();
        for (var i = 0, length = this.objects.length; i < length; ++i) {
          var obj = this.objects[i];
          obj.world = this;
          if (obj.init) {
            obj.init(newgame);
            if (obj.collisionTarget) {
              this.grid.add(obj);
            }
          }
        }
        this.maxScore = this.calcMaxScore();
      },

      calcMaxScore: function () {
        var score = 0;
        for (var i = 0, length = this.bricks.length; i < length; ++i) {
          score += this.bricks[i].getPoints();
        }
        return score;
      },

      setTouched: function (touched, id, x, y) {
        if (touched) {
          if (!this.touches[id]) {
            this.touches[id] = { x: x, y: y };
          } else {
            var t = this.touches[id];
            t.x = x;
            t.y = y;
          }
        } else {
          delete this.touches[id];
        }
      },

      applyTouch: function (e) {
        e.preventDefault();
        var touches = e.touches;
        for (var i = touches.length - 1; i >= 0; --i) {
          var t = touches[i];
          this.setTouched(true, t.identifier, t.clientX, t.clientY);
        }
        this.updateTouchState();
      },
      
      onTouchStart: function (e) {
        this.resumeGame(true);
        this.applyTouch(e);
      },

      onTouchMove: function (e) {
        this.applyTouch(e);
      },

      onTouchEnd: function (e) {
        e.preventDefault();
        var touches = e.changedTouches;
        for (var i = touches.length - 1; i >= 0; --i) {
          var t = touches[i];
          this.setTouched(false, t.identifier, t.clientX, t.clientY);
        }
        this.updateTouchState();
      },

      updateTouchState: function () {
        var screenX = window.innerWidth;
        var halfDeadZoneWidth = screenX / 8;
        var leftX = screenX / 2 - halfDeadZoneWidth;
        var rightX = screenX / 2 + halfDeadZoneWidth;

        var leftTouches = 0, rightTouches = 0;
        for (var id in this.touches) {
          var obj = this.touches[id];
          if (obj.x <= leftX) {
            leftTouches++;
          } else if (obj.x >= rightX) {
            rightTouches++;
          }
        }
        if (leftTouches > rightTouches) {
          this.keys[C.key.left] = 1;
          this.keys[C.key.right] = 0;
        } else if (rightTouches > leftTouches) {
          this.keys[C.key.right] = 1;
          this.keys[C.key.left] = 0;
        } else {
          this.keys[C.key.right] = 0;
          this.keys[C.key.left] = 0;
        }
      },

      onKeyPress: function (e) {
        e.preventDefault();
        switch (String.fromCharCode(e.charCode)) {
        case ' ':
          if (State.isActive(this.state)) {
            this.setPaused(!this.paused);
          }
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
        if (e.keyCode === C.key.escape) {
          this.destroy();
          return;
        }
        
        if (this.state === State.screencleared && this.nextScreenCountDown < 200) {
          this.nextScreenCountDown = 0;
        }

        this.resumeGame(e.keyCode === C.key.enter);
        
        if (this.isMovementKey(e.keyCode)) {
          this.keys[e.keyCode] = 1;
        }
      },

      resumeGame: function (startRequested) {
        if (startRequested || this.state === State.balllost) {
          if (this.state === State.pregame || this.state >= State.balllost) {
            if (this.state > State.balllost) {
              this.reset(true);
            }
            this.setState(State.game);
          }
        }
      },

      onKeyUp: function (e) {
        if (this.isMovementKey(e.keyCode)) {
          this.keys[e.keyCode] = 0;
        }
      },

      setPaused: function (paused) {
        this.paused = paused;

        var c = this.canvas.getContext('2d');
        this.clearScreen(c);
        this.render(c);
      },
 
      render: function (c) {
        var context = c || this.canvas.getContext('2d');
        for (var i = 0, length = this.objects.length; i < length; ++i) {
          this.objects[i].render(context);
        }
        this.showGameState(context);
      },

      dirtyList: [],
      ndirty: 0,

      isFullRedraw: function () {
        return this.redraw || this.state !== State.game;
      },
     
      animate: function () {
        // Using a try-finally here disables js optimization:
        this.animating = true;
        this.doAnimate();
        this.animating = false;
      },

      clearScreen: function (c) {
        c.clearRect(0, 0, C.width, C.height);
      },

      doAnimate: function () {
        var context = this.canvas.getContext('2d');
        if (this.isFullRedraw()) {
          this.clearScreen(context);
        }

        this.ndirty = 0;
        // Loop explicitly over objects of the same types:
        // Looping over this.objects is much less code, but the
        // polymorphic animate call causes browsers to not inline
        // the call.
        for (var i = this.transients.length - 1; i >= 0; --i) {
          var tr = this.transients[i];
          this.checkDirty(tr.animate(context), tr);
        }
        this.checkDirty(this.paddle.animate(context), this.paddle);
        this.checkDirty(this.ball.animate(context), this.ball);
        this.score.animate(context);
        this.ballReserve.animate(context);
        for (i = this.bricks.length - 1; i >= 0; --i) {
          var brick = this.bricks[i];
          this.checkDirty(brick.animate(context), brick);
        }
        this.redrawDirty(context);
        this.showGameState(context);
        this.redraw = false;
        this.applyStateTransitions();
      },

      applyStateTransitions: function () {
        switch (this.state) {
        case State.screencleared:
          if (--this.nextScreenCountDown <= 0) {
            this.nextScreenCountDown = 0;
            this.reset(false);
            this.setState(State.game);
          }
          break;
        }
      },

      checkDirty: function (bbox, sprite) {
        if (!bbox) {
          return;
        }
        this.registerDirty(this.ndirty++, bbox, sprite);
      },

      // redrawDirty draws the ball and all sprites that are in dirtied zones.
      redrawDirty: function (c) {
        if (this.isFullRedraw()) {
          this.render(c);
          return;
        }

        this.markDirtyGridCells();
        this.grid.redrawDirty(c);
        for (var i = this.ndirty - 1; i >= 0; --i) {
          this.dirtyList[i].obj.render(c);
        }
      },

      markDirtyGridCells: function () {
        this.grid.clearDirty();
        for (var i = 0, length = this.ndirty; i < length; ++i) {
          var dirty = this.dirtyList[i];
          var d = dirty.dirty;
          this.grid.dirtyBBox(dirty.dirty);
        }
      },

      registerDirty: function (ndirty, dirty, obj) {
        var dirtyObj = this.dirtyList[ndirty];
        if (!dirtyObj) {
          this.dirtyList[ndirty] = { dirty: dirty, obj: obj };
        } else {
          dirtyObj.dirty = dirty;
          dirtyObj.obj = obj;
        }
      },

      showGameState: function (c) {
        if (this.paused) {
          this.showPaused(c);
        }
        switch (this.state) {
        case State.gameover:
          this.showGameOver(c);
          break;
        case State.pregame:
          this.showPreGame(c);
          break;
        case State.screencleared:
          this.showScreenCleared(c);
          break;
        }
      },

      showPreGame: function (c) {
        this.setTextStyles(c);
        this.setSubtitleFont(c);
        if (C.touchscreen) {
          this.message(c, 'Tap to start, touch to left/right to move', C.width / 2, C.height / 2 + 50);
        } else {
          this.message(c, 'Hit Enter to start, arrow keys to move', C.width / 2, C.height / 2);
        }
        this.resetShadow(c);
      },

      showScreenCleared: function (c) {
        this.setTextStyles(c);
        this.setLargeFont(c);
        this.message(c, 'Preferred Stock Awarded!', C.width / 2, C.height / 2);
        this.resetShadow(c);
      },

      setTextStyles: function (c) {
        c.shadowColor = '#999';
        c.shadowOffsetX = 2;
        c.shadowOffsetY = 2;
        c.shadowBlur = 4;
        c.fillStyle = '#fff';
        c.strokeStyle = '#666';
        c.textAlign = 'center';
      },

      setLargeFont: function (c) {
        c.font = 'bold 48px "Lucida Grande", Helvetica, Arial';
      },

      setSubtitleFont: function (c) {
        c.font = 'bold 36px "Lucida Grande", Helvetica, Arial';
      },

      message: function (c, text, x, y) {
        c.fillText(text, x, y);
        c.strokeText(text, x, y);
      },

      showPaused: function (c) {
        this.setTextStyles(c);
        this.setSubtitleFont(c);
        this.message(c, 'Paused, hit space to resume', C.width / 2, C.height / 2 - 50);
        this.resetShadow(c);
      },

      showGameOver: function (c) {
        this.setTextStyles(c);
        this.setLargeFont(c);
        this.message(c, 'Game Over', C.width / 2, C.height / 2);
        this.setSubtitleFont(c);
        this.message(c, 'Score: ' + this.score.score, C.width / 2, C.height / 2 + 50);
        this.message(c, 'Rank: ' + this.score.getRank(), C.width / 2, C.height / 2 + 100);
        this.resetShadow(c);
      },

      resetShadow: function (c) {
        c.shadowColor = '#999';
        c.shadowOffsetX = 0;
        c.shadowOffsetY = 0;
        c.shadowBlur = 0;
      },

      setAnimationActive: function (active) {
        if (active !== this.animationActive) {
          this.animationActive = active;
          if (active) {
            this.startAnimation();
          }
        }
      },

      startAnimation: function () {
        if (!this.awaitingAnimationFrame) {
          window.requestAnimationFrame(this.tickBound);
          this.awaitingAnimationFrame = true;
        }
      },

      tick: function () {
        this.awaitingAnimationFrame = false;
        if (!this.paused) {
          this.animate();
        }
        if (this.animationActive) {
          this.startAnimation();
        }
      }
    };
    return state;
  }

  function initializeEgg(canvas) {
    var gameState = GameState(canvas);
    window.world = gameState;
    gameState.init();
    gameState.render();
    gameState.startAnimation();
    return gameState;
  }

  function ecanvas(sel) {
    var place = document.querySelector(sel);
    var backdrop = place.querySelector('div#ee-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.setAttribute('id', 'ee-backdrop');
      place.appendChild(backdrop);
    }

    var container = place.querySelector('div.ee-layout');
    if (!container) {
      container = document.createElement('div');
      container.classList.add('ee-layout');
      container.setAttribute('style', 'position: relative; z-index: 5; display: block; margin: 15px auto; width: ' + C.width + 'px; height: ' + (C.height + C.statusHeight) + 'px');
      place.appendChild(container);
    }
    
    var statusPane, score, rollCall, rollCallTitle, names;
    var addHUDElements = function () {
      rollCall = container.querySelector('div.ee-rollcall');
      if (!rollCall) {
        rollCall = document.createElement('div');
        rollCall.classList.add('ee-rollcall');
        rollCall.setAttribute('style', 'position: absolute; left: -' + C.rollCall.width + 'px; top: ' +
                              C.statusHeight + 'px; margin: 0; padding: 0; padding-left: 15px');        
        container.appendChild(rollCall);
      }

      rollCallTitle = rollCall.querySelector('h1.ee-title');
      if (!rollCallTitle) {
        rollCallTitle = document.createElement('h1');
        rollCallTitle.classList.add('ee-title');
        rollCallTitle.setAttribute('style', 'padding: 0; margin: 0; margin-bottom: 0.2em; font: 12px "Lucida Grande", Arial;');
        rollCall.appendChild(rollCallTitle);
      }

      names = rollCall.querySelector('ol.names');
      if (!names) {
        names = document.createElement('ol');
        names.classList.add('names');
        names.setAttribute('style', 'padding: 0');
        rollCall.appendChild(names);
      }
      
      statusPane = container.querySelector('canvas.status');
      if (!statusPane) {
        statusPane = document.createElement('canvas');
        statusPane.classList.add('status');
        statusPane.setAttribute('style', 'position: absolute; left: 0; top: 0; margin: 0; padding: 0');
        statusPane.setAttribute('width', Math.floor(C.width / 2));
        statusPane.setAttribute('height', C.statusHeight);
        container.appendChild(statusPane);
      }
      
      score = container.querySelector('div.game-score');
      if (!score) {
        score = document.createElement('div');
        score.classList.add('game-score');
        score.setAttribute('style', 'position: absolute; right: 0px; top: 0; padding-right: 5px; font: 48px "Lucida Sans Typewriter"; font-weight: bold; color: #777');
        container.appendChild(score);
      }
    };
    addHUDElements();
    var canvas = container.querySelector('canvas.main');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.setAttribute('style', 'position: relative; top: ' + C.statusHeight + 'px; border: 1px solid #9a9a9a');
      canvas.classList.add('main');
      canvas.setAttribute('width', C.width);
      canvas.setAttribute('height', C.height);
      container.appendChild(canvas);
    }
    return {
      canvas: canvas,
      status: statusPane,
      score: score,
      rollCall: rollCall,
      rollCallTitle: rollCallTitle,
      names: names
    };
  }

  window.btStartEgg = function () {
    window.btEgg = initializeEgg(ecanvas('#ee-payload'));
  };

  window.btStopEgg = function () {
    window.btEgg.stop();
  };

  var pendingKeys = [];
  var hotword = "boxtone";
  window.btLoadEgg = function () {
    var container = document.querySelector('div#ee-root');
    if (!container) {
      container = document.createElement('div');
      container.setAttribute('id', 'ee-root');
      container.setAttribute('style', 'overflow: hidden; position: fixed; left: 0; top: 0; width: 100%; height: 800px; cursor: none; z-index: 20000');
      document.body.appendChild(container);
    }

    var wrapper = container.querySelector('div#ee-wrap');
    if (!wrapper) {
      wrapper = document.createElement('div');
      wrapper.setAttribute('id', 'ee-wrap');
      wrapper.setAttribute('style', 'position: absolute; left: 50%; top: 20px');
      container.appendChild(wrapper);
    }

    var payload = wrapper.querySelector('div#ee-payload');
    if (!payload) {
      payload = document.createElement('div');
      payload.setAttribute('id', 'ee-payload');
      payload.setAttribute('style', 'position: relative; left: -50%; border-radius: 5px; width: 1250px; padding-bottom: 1px; background: #fff; box-shadow: 0 0 15px #000');
      wrapper.appendChild(payload);
    }
    btStartEgg();
    return container;
  };

  window.btDestroyEgg = function () {
    delete window.btEgg;
    var root = document.querySelector('#ee-root');
    if (root && root.parentElement) {
      root.parentElement.removeChild(root);
    }
  };

  if (document.addEventListener) {
    document.addEventListener('keydown', function (e) {
      try {
        var key = e.keyCode;
        if (key === 27) {
          pendingKeys = [];
          window.btDestroyEgg();
          return;
        }
        pendingKeys.unshift(String.fromCharCode(key));
        if (pendingKeys.length > hotword.length) {
          pendingKeys.splice(hotword.length, pendingKeys.length - hotword.length);
        }
        if (pendingKeys.join('').toLowerCase() === hotword) {
          if (!window.btEgg) {
            window.btLoadEgg();
          }
        }
      } catch (ignored) {
      }
    });
  }
})();
