/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2014-2019, Heliox - All Right Reserved
 */

(function (global) {

	global.HTMLElement.prototype.getImmediateText = function() {
		var text = '';

		var elementChildLength = this.childNodes.length;
		for (var i = 0; i < elementChildLength; ++i) {
			if (this.childNodes[i].nodeName === '#text') {
				text += this.childNodes[i].nodeValue.trim();
			}
		}

		return text;
	}
}(window));
