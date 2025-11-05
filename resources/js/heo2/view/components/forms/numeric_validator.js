(function (HeO2) {
	"use strict";

	const Validator = HeO2.require('HeO2.__impl.Validator');

	Validator.addValidator('numeric', Validator.Base.extend({
        validate: function(rule, value) {
            return (typeof value === 'number' || typeof value === 'string') && value !== '' && !isNaN(value);
        }
    }));
}(HeO2));
