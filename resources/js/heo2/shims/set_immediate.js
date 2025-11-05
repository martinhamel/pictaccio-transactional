(function (global) {
    "use strict";

    if (!Object.prototype.hasOwnProperty.call(global, 'setImmediate') || HeO2.__unittest__) {
        global.setImmediate = function(callback) {
            setTimeout(callback, 0);
        }
    }
}(window));
