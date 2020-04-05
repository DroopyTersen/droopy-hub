import { useEffect, useState } from "react";
var Model = /** @class */ (function () {
    function Model() {
    }
    Model.prototype.listenForChanges = function (handler) {
        var _this = this;
        this.listener.on("update", handler);
        return function () {
            _this.listener.off("update", handler);
        };
    };
    return Model;
}());
export default Model;
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