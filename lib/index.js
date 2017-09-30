"use strict";

var Freezer = require("freezer-js");
var objectAssign = require('object-assign');

var defaultOptions = {
    cacheKey: "droopy-hub-cache",
    cacheEnabled: true
};

var createHub = function createHub(defaultState, opts) {
    opts = Object.assign({}, defaultOptions, opts);
    var cache = setupCache(opts.cacheKey);
    var initialState = objectAssign({}, defaultState, opts.cacheEnabled ? cache.get() : {});
    var state = new Freezer(initialState);

    var hub = state.getEventHub();
    Object.defineProperty(hub, "state", {
        get: function get() {
            return state.get();
        }
    });
    hub.cache = cache;
    hub.cacheState = function () {
        return cache.set(state.get().toJS());
    };
    hub.trigger = function (key) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }

        return hub.emit.apply(hub, [key].concat(args));
    };

    return hub;
};

var setupCache = function setupCache() {
    var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "droopy-hub-cache";

    return {
        KEY: key,
        get: function get() {
            try {
                var cachedVal = localStorage.getItem(key);
                return cachedVal ? JSON.parse(cachedVal) : null;
            } catch (ex) {
                return null;
            }
        },
        set: function set(val) {
            return localStorage.setItem(key, JSON.stringify(val));
        },
        clear: function clear() {
            localStorage.removeItem(key);
        }
    };
};

module.exports = { createHub: createHub };
//# sourceMappingURL=index.js.map