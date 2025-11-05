(function(HeO2, $) {
	"use strict";

	const GoalManager = HeO2.require('HeO2.utils.GoalManager');

	GoalManager.addTypeHandler('dom-object', GoalManager.EventObjectEventTypeModule.extend({
		_host: null,

		init: function(host) {
			this._super();
		},


		/* PRIVATE */
		_createHandler: function(args) {
			args.params.ref = $(args.params.selector);
			return this._super(args);
		}
	}));
}(HeO2, jQuery));
