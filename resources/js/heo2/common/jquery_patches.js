/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2014-2019, Heliox - All Right Reserved
 */

(function () {
	"use strict";

	var fn = Object.create(null);
	var jQueryProto = jQuery.prototype;

	fn.width = jQueryProto.width;
	jQueryProto.width = function() {
		var oldCss = Object.create(null);
		var width;

		if (this.css('block') === 'none') {
			oldCss.visibility = this.css('visibility');
			oldCss.position = this.css('position');
			this.css({
				position: 'absolute',
				visibility: 'hidden'
			});
		}

		width = fn.width.call(this);
		this.css(oldCss);
		return width;
	};

	fn.height = jQueryProto.height;
	jQueryProto.height = function() {
		var oldCss = Object.create(null);
		var height;

		if (this.css('block') === 'none') {
			oldCss.visibility = this.css('visibility');
			oldCss.position = this.css('position');
			this.css({
				position: 'absolute',
				visibility: 'hidden'
			});
		}

		height = fn.height.call(this);
		this.css(oldCss);
		return height;
	};
})();
