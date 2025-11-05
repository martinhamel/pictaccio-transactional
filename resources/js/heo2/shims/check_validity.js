/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2014-2019, Heliox - All Right Reserved
 */

(function (HeO2) {
	"use strict";

	if (!HTMLInputElement.prototype.hasOwnProperty('checkValidity') || HeO2.__unittest__) {
		HTMLInputElement.prototype.checkValidity = function() {
			if (this.disabled) {
				return true;
			}

			return !((this.attributes.required !== undefined) && this.value === '');
		}
	}
}(HeO2));
