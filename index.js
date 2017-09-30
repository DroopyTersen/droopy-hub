var Freezer = require("freezer-js");
var objectAssign = require('object-assign');
const defaultOptions = {
    cacheKey: "droopy-hub-cache",
    cacheEnabled: true
}

var createHub = function(defaultState, opts) {
    opts = Object.assign({}, defaultOptions, opts);
    var cache = setupCache(opts.cacheKey);
    var initialState = objectAssign({}, defaultState, (opts.cacheEnabled ? cache.get() : {}));
    var state = new Freezer(initialState);

    var hub = state.getEventHub();
    Object.defineProperty(hub, "state", {
        get: () => state.get()
    })
    hub.cache = cache;
    hub.cacheState = () => cache.set(state.get().toJS());
    hub.trigger = (key, ...args) => hub.emit(key, ...args);

    
    return hub;
}

var setupCache = function(key = "droopy-hub-cache") {
    return {
        KEY: key,
        get() {
            try {
                var cachedVal = localStorage.getItem(key);
                return cachedVal ? JSON.parse(cachedVal) : null;
    
            } catch (ex) {
                return null;
            }
        },
        set(val) {
            return localStorage.setItem(key, JSON.stringify(val))
        },
        clear() {
            localStorage.removeItem(key);
        }
    }
}

module.exports = { createHub };