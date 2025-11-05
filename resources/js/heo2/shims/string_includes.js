(function (Object, HeO2) {
    "use strict";

    if (!String.hasOwnProperty('includes') || HeO2.__unittest__) {
        String.prototype.includes = function(search, start) {
            if (typeof start !== 'number') {
                start = 0;
            }

            if (start + search.length > this.length) {
                return false;
            } else {
                return this.indexOf(search, start) !== -1;
            }
        };
    }
}(Object, HeO2));
