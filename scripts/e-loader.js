'use strict';

(function () {
  var pendingKeys = [];
  var target = "boxtone";

  window.btLoadEgg = function () {
    var container = document.querySelector('div#ee-root');
    if (!container) {
      container = document.createElement('div');
      container.setAttribute('id', 'ee-root');
      container.setAttribute('style', 'overflow: hidden; position: fixed; left: 0; top: 0; width: 100%; height: 800px');
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
      payload.setAttribute('style', 'position: relative; left: -50%; border-radius: 5px; width: 1250px; height: 700px; background: #fff; box-shadow: 0 0 15px #000');
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
