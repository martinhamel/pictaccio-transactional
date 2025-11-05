(function (HeO2) {
    "use strict";

    const Validator = HeO2.require('HeO2.__impl.Validator');

    const PHONE_REGEX = /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*(?![2-9]11)(?!555)([2-9][0-8][0-9])\s*\)|(?![2-9]11)(?!555)([2-9][0-8][0-9]))\s*(?:[.-]\s*)?)(?!(555(?:\s*(?:[.\-\s]\s*))(01([0-9][0-9])|1212)))(?!(555(01([0-9][0-9])|1212)))([2-9]1[02-9]|[2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/;

    Validator.addValidator('phone', Validator.Base.extend({
        validate: function(rule, value) {
            return PHONE_REGEX.test(value);
        }
    }));
})(HeO2);
