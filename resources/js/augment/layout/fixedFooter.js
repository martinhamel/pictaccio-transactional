/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2014-2019, Heliox - All Right Reserved
 */

(function (global, $) {
	var fixed = false,
		footer = global.document.getElementById('footer');

	function window_resize(event) {
		var height = Math.max(
				global.document.documentElement.clientHeight,
				global.document.body.scrollHeight, global.document.documentElement.scrollHeight,
				global.document.body.offsetHeight, global.document.documentElement.offsetHeight
			);

		if (global.innerHeight < footer.offsetTop && !fixed) {
			$(global.document.body).addClass('fixed-footer');
			fixed = true;
		} else if (fixed) {
			$(global.document.body).removeClass('fixed-footer');
			fixed = false;
		}
	}

	global.addEventListener('resize', window_resize);
	window_resize();
}(window, $));
