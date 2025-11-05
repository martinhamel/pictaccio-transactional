(function (HeO2) {
	"use strict";

	const Validator = HeO2.require('HeO2.__impl.Validator');

	const MONEY_REGEX = /^\$?\d+(,\d{3})*(\.\d*)?$/;

	Validator.addValidator('money', Validator.Base.extend({
        validate: function(rule, value) {
            return MONEY_REGEX.test(value);
        }
    }));
})(HeO2);
