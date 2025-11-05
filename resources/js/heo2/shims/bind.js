/* Code taken from MDN */

(function (Function, HeO2) {
	"use strict";
	if (!Function.prototype.hasOwnProperty('bind') || HeO2.__unittest__) {
		Function.prototype.bind = function (oThis) {
			if (typeof this !== 'function') {
				throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
			}

			var aArgs = Array.prototype.slice.call(arguments, 1),
				fToBind = this;

			return function () {
				return fToBind.apply(this instanceof function(){} ? this : oThis,
					aArgs.concat(Array.prototype.slice.call(arguments))
				);
			};
		}
	}
}(Function, HeO2));
