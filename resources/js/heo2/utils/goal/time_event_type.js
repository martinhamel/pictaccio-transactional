(function(HeO2) {
	"use strict";

	const EventingClass = HeO2.require('HeO2.EventingClass');
	const GoalManager = HeO2.require('HeO2.utils.GoalManager');

	GoalManager.addTypeHandler('time', EventingClass.extend({
		init: function(host) {
			this._super();

			this._host = host;
			this._attachEvents();
		},


		/* EVENT HANDLERS */
		_host_requestHandlers: function(args) {
			args.func = this._createHandler(args);
		},


		/* PRIVATE */
		_attachEvents: function() {
			this.on('request-handler', this._host_requestHandlers.bind(this));
		},

		_createHandler: function(args) {
			return function(action) {
				switch (action) {
					case 'start':
						args.params.timeoutId = setTimeout(function () {
								args.eventTrigger();
							}, args.params.delay);
						break;

					case 'stop':
						clearInterval(args.params.timeoutId);
				}
			};
		}
	}));
}(HeO2));
