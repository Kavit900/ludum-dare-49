// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"game_map.json":[function(require,module,exports) {
module.exports = [{
  "layout": ["=====1======", "=  @       =", "=          =", "=          =", "=          2", "=          =", "=          =", "=          =", "=      i   =", "=          =", "============"],
  "doors": {
    "1": {
      "leadsTo": 1
    },
    "2": {
      "leadsTo": 2
    }
  }
}, {
  "layout": ["============", "=  @       =", "=          =", "=          =", "=          =", "=          4", "=          =", "=          =", "=          =", "=          =", "=======3===="],
  "doors": {
    "3": {
      "leadsTo": 3
    },
    "4": {
      "leadsTo": 4
    }
  }
}, {
  "layout": ["============", "=  @       =", "=          =", "=          =", "=          =", "=          =", "=          =", "=          =", "6          =", "=          =", "====5======="],
  "doors": {
    "6": {
      "leadsTo": 0,
      "isEnd": true,
      "itemsRequired": 2
    },
    "5": {
      "leadsTo": 5
    }
  }
}, {
  "layout": ["============", "=  @       =", "=          =", "=          =", "=          =", "=====      =", "=   =      =", "= i =      =", "=   =      =", "=          =", "=========5=="],
  "doors": {
    "5": {
      "leadsTo": 5
    }
  }
}, {
  "layout": ["======4=====", "=  @       =", "=          =", "=          =", "=          5", "=     =    =", "=     =    =", "=     =    =", "=     =    =", "=     =    =", "====2====0=="],
  "doors": {
    "0": {
      "leadsTo": 0
    },
    "2": {
      "leadsTo": 2
    },
    "4": {
      "leadsTo": 4
    },
    "5": {
      "leadsTo": 5
    }
  }
}, {
  "layout": ["============", "=  @       =", "=          =", "=  =========", "=      =   6", "=      =   =", "=      =   =", "=      =   =", "=          =", "=          =", "====3======="],
  "doors": {
    "3": {
      "leadsTo": 3
    },
    "6": {
      "leadsTo": 0
    }
  }
}];
},{}],"main.js":[function(require,module,exports) {
//import kaboom from 'kaboom';
//import kaboom from "https://unpkg.com/kaboom@next/dist/kaboom.mjs";
kaboom({
  global: true,
  scale: 3,
  clearColor: [0, 0, 0, 1],
  canvas: document.getElementById('game'),
  width: 180,
  height: 180
});
loadSprite('player', 'hero.png');
loadSprite('wall', 'wall2.png');
loadSprite('opendoor', 'opendoor.png');
loadSprite('finaldoor', 'finaldoor.png');
loadSprite('item', 'item.png');

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

window.onload = function () {
  var gameData = require("./game_map.json"); //console.log(JSON.stringify(gameData[0]));
  // Goal is to exit the unstable dome after collecting two important items from the dome.


  var itemsHeld = [];
  var totalRooms = JSON.parse(JSON.stringify(gameData)).length;
  console.log("Total number of rooms:- ", totalRooms);
  scene('play', function (roomNumber) {
    var rooms = JSON.parse(JSON.stringify(gameData));
    var roomDetails = rooms[roomNumber];
    var popupMsg = null;
    var itemsHeldMsg = null; // Let's show message to show how many items player has to collect

    var showMsg = function showMsg(msg) {
      popupMsg = add([text(msg, 6), pos(width() / 2, 10), origin('center')]);
    };

    var updateItemsHeld = function updateItemsHeld() {
      if (itemsHeldMsg) {
        destroy(itemsHeldMsg);
      }

      itemsHeldMsg = add([text("Room ".concat(roomNumber, ". Items Held: ").concat(itemsHeld.length), 6), pos(80, 150), origin('center')]);
    }; // Map characters of the room layout into the sprites that we have


    var roomConf = {
      width: roomDetails.layout[0].length,
      height: roomDetails.layout.length,
      pos: vec2(20, 20),
      '=': [sprite('wall'), solid(), 'wall'],
      '@': [sprite('player'), 'player'],
      i: [sprite('item'), solid(), 'item']
    }; // Mapping doors for each room

    for (var doorId in roomDetails.doors) {
      var door = roomDetails.doors[doorId];
      roomConf[doorId] = [sprite(door.keysRequired > 0 ? 'finaldoor' : 'opendoor'), 'door', {
        leadsTo: door.leadsTo,
        itemsRequired: door.itemsRequired,
        isEnd: door.isEnd || false
      }, solid()];
    }

    addLevel(roomDetails.layout, roomConf);
    updateItemsHeld();
    var items = get('item');
    console.log("Items are:- ", items);
    console.log("Items held are:- ", itemsHeld);

    if (items.length > 0 && itemsHeld.includes(roomNumber)) {
      destroy(items[0]);
    }

    var player = get('player')[0];
    var directions = {
      'left': vec2(-1, 0),
      'right': vec2(1, 0),
      'up': vec2(0, -1),
      'down': vec2(0, 1)
    }; // Map key presses to player movement actions.

    var _loop = function _loop(direction) {
      keyPress(direction, function () {
        // destroy any popup message 1/2 a second after the player starts to move again.
        if (popupMsg) {
          wait(0.5, function () {
            if (popupMsg) {
              destroy(popupMsg);
              popupMsg = null;
            }
          });
        }
      });
      keyDown(direction, function () {
        player.move(directions[direction].scale(60));
      });
    };

    for (var direction in directions) {
      _loop(direction);
    } // Event when player touches door


    player.overlaps('door', function (d) {
      wait(0.3, function () {
        // Does opening this door require more keys than the player holds?
        if (d.itemsRequired && d.itemsRequired > itemsHeld.length) {
          showMsg("You need ".concat(d.itemsRequired - itemsHeld.length, " more keys!"));
          camShake(10);
        } else {
          // Does this door lead to the end
          if (d.isEnd) {
            go('winner');
          } else {
            go('play', d.leadsTo);
          }
        }
      });
    }); // Event when player touches the item

    player.overlaps('item', function (i) {
      destroy(i);
      showMsg('You have got the item!'); //We need to store the room number, so next time they enter the room, they should not see it

      itemsHeld.push(roomNumber);
      updateItemsHeld(); // Also Because the Cave is unstable, we will rotate and make player land in a random room

      var angle = 0.1;
      var timer = setInterval(function () {
        camRot(angle);
        angle += 0.1;

        if (angle >= 6.0) {
          // stop spinning and go to the new random room
          camRot(0);
          clearInterval(timer);
          var newRoomNumber = getRandomInt(totalRooms);
          console.log("New Room Number:- ", newRoomNumber);
          go('play', newRoomNumber);
        }
      }, 10);
    }); // Update the player position etc - run every frame.

    player.action(function () {
      player.resolve();
    });
  }); // Winner scene when the game comes to an end

  scene('winner', function () {
    add([text("You have escaped the cave successfully!", 6), pos(width() / 2, height() / 2), origin('center')]);
  });
  scene('main', function () {
    // Display a message telling the player on how to start a new game
    add([text('Press space to begin!', 6), pos(width() / 2, height() / 2), origin('center')]);
    keyPress('space', function () {
      go('play', 0);
    });
  });
  start('main');
};
},{"./game_map.json":"game_map.json"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "61234" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","main.js"], null)
//# sourceMappingURL=/main.1f19ae8e.js.map