(function(HeO2) {
    "use strict";

    if (!HeO2.common) {
        HeO2.common = Object.create(null);
        HeO2.__impl = Object.create(null);
    }

    if (HeO2.DEBUG) {
        HeO2._DEBUG = Object.create(null);
    }
}(HeO2));
