/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2014-2019, Heliox - All Right Reserved
 */

(function(HeO2, $) {
	"use strict";

	const Class = HeO2.require('HeO2.Class');
	const Promise = HeO2.require('HeO2.Promise');
	const logger = HeO2.require('HeO2.common.logger');

	HeO2.Config = Class.extend({
		_config: null,
		_configLoaded: false,
		_promise: null,

		init: function(url) {
			if (url !== undefined) {
				this.load(url);
			}
		},

		read: function(key) {
			if (this._config[key] === undefined) {
				var keys = key.split('.');
				var config = this._config;

				for (var i = 0, length = keys.length; i < length; ++i) {
					if (config[keys[i]] === undefined) {
						console.warn('WARNING: Invalid key: ' + key);
					} else {
						if (i === length - 1) {
							return config[keys[i]];
						} else {
							config = config[keys[i]];
						}
					}
				}
			} else {
				return this._config[key];
			}
		},

		load: function(url) {
			if (this._promise !== null) {
				return this._promise;
			}

			this._promise = new Promise();

            $.getJSON(url)
				.done(function(data) {
					this._config = data;
					this._configLoaded = true;
					this._promise.resolve();
				}.bind(this))
				.fail(function() {
					logger.error('ERROR: Cannot load configuration ' + url);
					this._promise.fail();
				});

			return this._promise;
		}
	});

	HeO2.config = new HeO2.Config;
}(HeO2, jQuery));
