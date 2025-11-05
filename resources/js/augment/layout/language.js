/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2014-2019, Heliox - All Right Reserved
 */

(function(global, $){
	"use strict";

	$(global.document).ready(function () {
		$('select[name="lang"]').change(function() {
			$.ajax({
				method: 'POST',
				url: global.serverUrl + 'api/config/lang',
				data: {
					lang: $(this).val()
				},
				success: function () {
					location.reload();
				}
			});
		});
	});
}(window, jQuery));
