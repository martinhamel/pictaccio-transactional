/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2014-2019, Heliox - All Right Reserved
 */

(function (HeO2) {
	"use strict";

	const EventingClass = HeO2.require('HeO2.EventingClass');
	const helpers = HeO2.require('HeO2.common.helpers');

	HeO2.utils.CashRegister = EventingClass.extend({
		_DEFAULTS: {
			format: '${#}'
		},

		_descriptor: null,
		_values: null,
		_options: null,

		init: function(descriptor, options) {
			this._super();

			this._descriptor = descriptor;

			this._options = helpers.merge(this._DEFAULTS, options);
			this._values = Object.create(null);
			if (!helpers.isEmpty(descriptor)) {
				this._prepare();
			}
		},


		/* PRIVATE */
		_prepare: function() {
			this._descriptor.order.forEach((name) => {
				let item = this._descriptor.operations[name];

				this._values[name] = 0;

				Object.defineProperty(this, name, {
					get: () => {
						let oldFormat = helpers.currency.format(this._options.format),
							money = helpers.currency(this._values[name] >= 0 ? this._values[name] : 0);
						helpers.currency.format(oldFormat);
						return money;
					},
					set: (value) => {
						this._values[name] = value;

						this._descriptor.order.forEach((name) => {
							let item = this._descriptor.operations[name];

							if (item !== null && typeof item === 'object') {
								Object.keys(item).forEach((action) => {
									let params = item[action];

									this._values[name] = this._round(
										this['_action_' + action](this._values[name], params)
									);
								});
							}
						});

						this.emit('change', this);
					}
				});

				if (helpers.isNumeric(item)) {
					this._values[name] = item;
				} else if (item !== null && typeof item === 'object') {
					Object.keys(item).forEach((action) => {
						let params = item[action];

						this._values[name] = this._round(
							this['_action_' + action](this._values[name], params)
						);
					});
				}
			});
		},

		_round: function(value) {
			return Math.round(value * 100) / 100;
		},


		/* ACTIONS */
		_action_subtract: function(value, params) {
			let first = true;
			value = (helpers.isNumeric(params[0]) ? params[0] : this._values[params[0]]);
			params.forEach((param) => {
				if (!first) {
					value = this._round(
						value - (helpers.isNumeric(param) ? param : this._values[param])
					);
				}

				first = false;
			});

			return value;
		},

		_action_sum: function(value, params) {
			value = 0;
			params.forEach((param) => {
				value = this._round(
					value + (helpers.isNumeric(param) ? param : this._values[param])
				);
			});

			return value;
		},

		_action_multiply: function(value, params) {
			if (params.length !== 2) {
				throw new Error('CashRegister::_action_multiply | Expecting 2 arguments');
			}

			return 	(helpers.isNumeric(params[0]) ? params[0] : this._values[params[0]]) *
					(helpers.isNumeric(params[1]) ? params[1] : this._values[params[1]]);
		}
	});
}(HeO2));
