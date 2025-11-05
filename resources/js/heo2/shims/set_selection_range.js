(function (HeO2) {
	"use strict";

	if (!HTMLInputElement.prototype.hasOwnProperty('setSelectionRange') || HeO2.__unittest__) {
		HTMLInputElement.prototype.setSelectionRange = function(start, end) {
			var range = this.createTextRange();
			if (start === end) {
				range.move('character', caretPos);
			} else {
				range.moveStart('character', start);
				range.moveEnd('character', end);
			}
			range.select();
		}
	}
})(HeO2);
