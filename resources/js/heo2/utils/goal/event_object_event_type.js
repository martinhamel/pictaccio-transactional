(function(HeO2) {
	"use strict";

	const EventingClass = HeO2.require('HeO2.EventingClass');
	const GoalManager = HeO2.require('HeO2.utils.GoalManager');

	GoalManager.EventObjectEventTypeModule = EventingClass.extend({
		init: function(host) {
			this._super();

			this._host = host;
			this._attachEvents();
		},


		/* EVENT HANDLERS */
		_host_requestHandlers: function(args) {
			args.params.times = args.params.times === undefined ? 1 : args.params.times;
			args.params.duration = args.params.duration || 0;

			args.func = this._createHandler(args);
		},


		/* PRIVATE */
		_attachEvents: function() {
			this.on('request-handler', this._host_requestHandlers.bind(this));
		},

		_checkEvent: function(event, against) {
			if (event !== undefined && against !== undefined) {
				for (var prop in against) {
					if (against.hasOwnProperty(prop)) {
						// REMARK: Using != to allow for a less strict comparison, strict may be more desirable though.
						if ( (typeof against[prop] === 'function' && !against[prop](prop, event[prop])) ||
							 (typeof against[prop] !== 'function' && against[prop] != event[prop]) ) {
							return typeof against[prop] === 'object' ?
								this._checkEvent(event[prop], against[prop]) :
								false;
						}
					}
				}
			}

			return true;
		},

		_createCallback: function(args) {
			if (args.params.times === 0) {
				args.params.timeoutId = setTimeout(function() {
					args.eventTrigger()
				}.bind(this), args.params.delay);
				return function(event) {
					if (this._checkEvent(event, args.params.eventProps)) {
						clearTimeout(args.params.timeoutId);
					}
				}.bind(this);
			} else {
				return function(event) {
					if (this._checkEvent(event, args.params.eventProps) && --args.params.times === 0) {
						args.eventTrigger();
					}
				}.bind(this);
			}
		},

		_createHandler: function(args) {
			return function(action) {
				switch (action) {
					case 'start':
						args.params.callback = this._createCallback(args);
						args.params.ref.on(args.params.event, args.params.callback);
						break;

					case 'stop':
						args.params.ref.off(args.params.event, args.params.callback);
						break;
				}
			}.bind(this);
		}
	});

	GoalManager.addTypeHandler('event-object', GoalManager.EventObjectEventTypeModule);
}(HeO2));
