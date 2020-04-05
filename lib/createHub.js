var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import Freezer from "freezer-js";
var defaultOptions = {
    cacheKey: "droopy-hub",
    cacheEnabled: true,
};
export default function createHub(defaultState, opts) {
    opts = __assign(__assign({}, defaultOptions), opts);
    var cache = setupCache(opts.cacheKey);
    var initialState = __assign(__assign({}, defaultState), (opts.cacheEnabled ? cache.get() : {}));
    var freezer = new Freezer(initialState, opts);
    var hub = freezer.getEventHub();
    Object.defineProperty(hub, "state", {
        get: function () { return freezer.get(); },
    });
    hub.freezer = freezer;
    hub.cache = cache;
    hub.cacheState = function () { return cache.set(freezer.get().toJS()); };
    hub.trigger = function (key) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return hub.emit.apply(hub, __spreadArrays([key], args));
    };
    return hub;
}
var setupCache = function (key) {
    return {
        KEY: key,
        get: function () {
            try {
                var cachedVal = localStorage.getItem(key);
                return cachedVal ? JSON.parse(cachedVal) : null;
            }
            catch (ex) {
                return null;
            }
        },
        set: function (val) {
            return localStorage.setItem(key, JSON.stringify(val));
        },
        clear: function () {
            localStorage.removeItem(key);
        },
    };
};
//# sourceMappingURL=createHub.js.map