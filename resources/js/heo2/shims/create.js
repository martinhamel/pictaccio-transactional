(function (Object, HeO2) {
	"use strict";

	if (!Object.hasOwnProperty('create') || HeO2.__unittest__) {
		Object.create = (function() {
			function Function() {}

			return function(obj) {
				if (arguments.length !== 1) {
					throw new Error('Object.create implementation only accepts one parameter.');
				}
				Function.prototype = obj;
				return new Function();
			};
		}());
	}
}(Object, HeO2));
