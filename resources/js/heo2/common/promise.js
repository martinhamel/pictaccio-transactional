/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2014-2019, Heliox - All Right Reserved
 */

(function(HeO2) {
	"use strict";

	const EventingClass = HeO2.require('HeO2.EventingClass');

	HeO2.Promise = EventingClass.extend({
		_arguments: null,
		_joined: null,
		_state: null,

		init: function(callbacks) {
			this._super();

			this._joined = [];
			this._state = 'unresolved';

			if (callbacks) {
				['success', 'fail', 'always'].forEach((state) => {
					if (typeof callbacks[state] === 'function') {
                        this.on(state, callbacks[state]);
					}
				});
			}
		},

		fail: function(callable) {
			this.on('fail', callable);

			return this;
		},

		join: function() {
			let promiseCount = 0;

			let success = () => {
				for (let promise of this._joined) {
				    if (promise.state() !== 'success') {
                        return;
                    }
                }
                this.resolve.apply(this, Array.prototype.slice.call(arguments));
            };
			let fail = () => {
                this.reject.apply(this, Array.prototype.slice.call(arguments));
            };

			for (let i = 0, argsLength = arguments.length; i < argsLength; ++i) {
				if (Array.isArray(arguments[i])) {
					this._joined = this._joined.concat(arguments[i]);

					for (let j = 0, length = arguments[i].length; j < length; ++j) {
					    arguments[i][j].on('success', success);
					    arguments[i][j].on('fail', fail);
					    promiseCount += 1;
                    }
				} else {
					this._joined.push(arguments[i]);
                    arguments[i].on('success', success);
                    arguments[i].on('fail', fail);
					promiseCount += 1;
				}
			}

			return this;
		},

		on: function(eventName, callable, context, oneShot) {
			oneShot = true;
			if (eventName === this._state ||
				(this._state !== 'unresolved' && eventName === 'always') ) {
			    setImmediate(() => {
                    callable.apply(context || this, this._arguments);
                });
				return this;
			}

			this._super(eventName, callable, context, oneShot);
		},

		reject: function() {
			this._state = 'fail';

			if (this._state !== 'unresolved') {
				this._joined.forEach((promise) => {
					promise.reject.apply(promise, arguments);
				});

				this._arguments = Array.prototype.slice.call(arguments);

				this.emit.apply(this, Array.prototype.concat('fail', this._arguments));
				this.emit.apply(this, Array.prototype.concat('always', this._arguments));
			}

			return this;
		},

		resolve: function() {
			if (this._state === 'unresolved') {
				this._state = 'success';
                this._arguments = Array.prototype.slice.call(arguments);
                this.emit.apply(this, Array.prototype.concat('success', this._arguments));
                this.emit.apply(this, Array.prototype.concat('always', this._arguments));
			}

			return this;
		},

		state: function() {
			return this._state;
		},

		success: function(callable) {
			this.on('success', callable);

			return this;
		},

		then: function(callable) {
			this.on('always', callable);

			return this;
		}
	});

	HeO2.Promise.create = function(callbacks) {
		return new HeO2.Promise(callbacks);
	};

	HeO2.Promise.when = function() {
		let callbacks;
		let promises;

		if (Array.isArray(arguments[0])) {
			promises = arguments[0];

			if (typeof arguments[1] === 'object' && ('success' in arguments[1] || 'fail' in arguments[1] || 'always' in arguments[1])) {
				callbacks = arguments[1];
			}
		} else if (typeof arguments[arguments.length - 1] === 'object' && ('success' in arguments[arguments.length - 1] || 'fail' in arguments[arguments.length - 1] || 'always' in arguments[arguments.length - 1])) {
			promises = Array.prototype.slice.call(arguments, 0, -1);
			callbacks = arguments[arguments.length - 1];
		} else {
            promises = arguments
        }

		return (new HeO2.Promise(callbacks)).join(promises);
	}
}(HeO2));
