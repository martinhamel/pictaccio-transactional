/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2014-2019, Heliox - All Right Reserved
 */

(function (HeO2) {
	"use strict";

	const Class = HeO2.require('HeO2.Class');

	HeO2.EventingClass = Class.extend({
		_eventing: null,

		init: function() {
			this._eventing = Object.create(null);
			this._eventing.events = Object.create(null);
			this._eventing.emitting = false;
			this._eventing.offIndex = null;
		},

		emit: function(eventName, args) {
			let oneOffs = [];

			if (this._eventing.events[eventName] !== undefined) {
				let processing = true;
				let controlParams = {
					stopEvent: function() {processing = false;},
					sender: this
				};

				this._eventing.emitting = true;
				for (let i = 0, length = this._eventing.events[eventName].length; i < length && processing; ++i) {
					let event = this._eventing.events[eventName][i];

					if (event) {
						if (typeof event.callable === 'function') {
							event.callable.apply(
								event.context || this,
								Array.prototype.concat(
									Array.prototype.slice.call(arguments, 1),
									[controlParams]
								));
							if (this._eventing.offIndex !== null) {
								--length;
								if (this._eventing.offIndex <= i) {
									--i;
								}
							}
						}

						if (event.oneOff) {
							oneOffs.push(i);
						}
					}
				}
				this._eventing.emitting = false;

				if (oneOffs.length) {
					for (let i  = 0, length = oneOffs.length; i < length; ++i) {
						this._off(eventName, oneOffs[i]);
					}
				}
			}

			return this;
		},

		off: function(eventName, callable) {
			if (this._eventing.events[eventName] !== undefined) {
				for (let i in this._eventing.events[eventName]) {
					if (this._eventing.events[eventName][i].callable === callable) {
						this._off(eventName, i);
					}
				}
			}

			return this;
		},

		on: function(eventName, callable, context, oneOff) {
			context = context || null;
			oneOff = oneOff || false;

			if (this._eventing.events[eventName] === undefined) {
				this._eventing.events[eventName] = [];
			}

			this._eventing.events[eventName].push({callable: callable,
												   context: context,
												   oneOff: oneOff});

			return this;
		},

		one: function(eventName, callback, context) {
			return this.on(eventName, callback, context, true);
		},

		/* PRIVATE */

		_off: function(eventName, index) {
			this._eventing.events[eventName].splice(index, 1);
			if (this._eventing.emitting) {
				this._eventing.offIndex = index;
			}
		}
	});
}(HeO2));
