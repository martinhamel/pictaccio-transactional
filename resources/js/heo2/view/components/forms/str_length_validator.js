(function (HeO2) {
	"use strict";

	const Validator = HeO2.require('HeO2.__impl.Validator');

	Validator.addValidator('maxLength minLength lengthBetween between', Validator.Base.extend({
        validate: function(rule, value) {
            let valueLength = value.length;
            switch (rule.name) {
            case 'maxLength':
                return valueLength <= rule.ruleParams[0];
            case 'minLength':
                return valueLength >= rule.ruleParams[1];
            case 'lengthBetween':
            case 'between':
                return valueLength >= rule.ruleParams[0] && valueLength <= rule.ruleParams[1];
            }
        }
    }));
}(HeO2));
