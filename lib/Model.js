var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { useEffect, useState, useMemo } from "react";
var Model = /** @class */ (function () {
    function Model() {
    }
    Model.prototype.listenForChanges = function (handler) {
        var _this = this;
        if (this.listener) {
            this.listener.on("update", handler);
        }
        return function () {
            if (_this.listener) {
                _this.listener.off("update", handler);
            }
        };
    };
    return Model;
}());
export default Model;
export function useModel(T) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var model = useMemo(function () {
        return new (T.bind.apply(T, __spreadArrays([void 0], args)))();
    }, __spreadArrays(args));
    useWatchModel(model);
    return model;
}
export function useWatchModel(model) {
    var _a = useState(Date.now()), _ = _a[0], forceRefresh = _a[1];
    useEffect(function () {
        var handler = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            // console.log("MODEL UPDATE", args);
            forceRefresh(Date.now());
        };
        return model.listenForChanges(handler);
    }, [model]);
}
//# sourceMappingURL=Model.js.map