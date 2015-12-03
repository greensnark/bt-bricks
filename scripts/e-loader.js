'use strict';

(function () {
  var pendingKeys = [];
  var target = "boxtone";

  window.btLoadEgg = function () {
    var container = document.querySelector('div#ee-root');
    if (!container) {
      container = document.createElement('div');
      container.setAttribute('id', 'ee-root');
      document.body.appendChild(container);
    }
    btStartEgg();
    return container;
  };

  if (document.addEventListener) {
    document.addEventListener('keydown', function (e) {
      try {
        var key = e.keyCode;
        if (key === 27) {
          pendingKeys = [];
          return;
        }
        pendingKeys.unshift(String.fromCharCode(key));
        if (pendingKeys.length > target.length) {
          pendingKeys.splice(target.length, pendingKeys.length - target.length);
        }
        if (pendingKeys.join('').toLowerCase() === target) {
          if (!window.btEgg) {
            window.btLoadEgg();
          }
        }
      } catch (ignored) {
      }
    });
  }
})();
