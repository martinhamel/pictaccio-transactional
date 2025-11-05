(function (HeO2) {
    "use strict";

    HeO2.common.logger = {
        log: function() {
            if (HeO2.DEBUG) {
                console.log.apply(null, arguments);
            }
        },

        warn: function() {
            if (HeO2.DEBUG) {
                console.warn.apply(null, arguments);
            }
        },

        error: function() {
            if (HeO2.DEBUG) {
                console.error.apply(null, arguments);
            }
        }
    }
}(HeO2));
