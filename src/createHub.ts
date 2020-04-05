import Freezer from "freezer-js";
import { Hub, HubOptions } from "interfaces";

const defaultOptions: HubOptions = {
  cacheKey: "droopy-hub",
  cacheEnabled: true,
};

export default function createHub<T>(defaultState: T, opts: HubOptions) {
  opts = { ...defaultOptions, ...opts };
  var cache = setupCache(opts.cacheKey);
  var initialState = { ...defaultState, ...(opts.cacheEnabled ? cache.get() : {}) };
  var freezer = new Freezer<T>(initialState, opts);

  var hub = freezer.getEventHub() as Hub<T>;
  Object.defineProperty(hub, "state", {
    get: () => freezer.get(),
  });
  hub.freezer = freezer;
  hub.cache = cache;
  hub.cacheState = () => cache.set(freezer.get().toJS());
  hub.trigger = (key, ...args) => hub.emit(key, ...args);
  return hub;
}

var setupCache = function (key: string) {
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
      return localStorage.setItem(key, JSON.stringify(val));
    },
    clear() {
      localStorage.removeItem(key);
    },
  };
};
