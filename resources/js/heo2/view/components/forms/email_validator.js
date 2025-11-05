(function (HeO2) {
    "use strict";

    const Validator = HeO2.require('HeO2.__impl.Validator');

    const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ui;

    Validator.addValidator('email', Validator.Base.extend({
        validate: function(rule, value) {
            return EMAIL_REGEX.test(value);
        }
    }));
})(HeO2);
