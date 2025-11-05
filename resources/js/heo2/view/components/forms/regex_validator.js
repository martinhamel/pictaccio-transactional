(function (HeO2) {
	"use strict";

	const Validator = HeO2.require('HeO2.__impl.Validator');

	Validator.addValidator('custom regex', Validator.Base.extend({
        validate: function(rule, value) {
            let regEx = rule.ruleParams[0];

            if (typeof regEx === 'string') {
                if (regEx[0] === '/' && regEx[regEx.length - 1] === '/') {
                    regEx = regEx.substring(1, regEx.length - 1);
                }
                regEx = new RegExp(regEx);
            }

            return regEx.test(value);
        }
    }));
}(HeO2));
