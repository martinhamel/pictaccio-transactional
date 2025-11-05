(function(HeO2) {
	"use strict";

	const Class = HeO2.require('HeO2.Class');

	HeO2.__impl.Validator.Base = Class.extend({
        init: function(){},
		/*
		 * Returns:
		 * {
		 *	valid: boolean, // True if value is valid
		 *	message: string // If valid == true, a string indicating what the problem is
		 * }
		 */
		validate: function(rule, value) {
			console.error('ERROR: Minion does not implement BaseValidator::validate');
			return {valid: true};
		}
	});
}(HeO2));
