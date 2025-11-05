(function (HeO2) {
    "use strict";

    const Validator = HeO2.require('HeO2.__impl.Validator');

    Validator.addValidator('notBlank', Validator.Base.extend({
        validate: function(rule, value) {
            return !/^\s*$/.test(value);
        }
    }));
})(HeO2);
