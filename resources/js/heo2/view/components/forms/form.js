/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2014-2019, Heliox - All Right Reserved
 */

(function(HeO2, $) {
	"use strict";

	const EventingClass = HeO2.require('HeO2.EventingClass');
	const Validator = HeO2.require('HeO2.__impl.Validator');
	const Bubble = HeO2.require('HeO2.UI.Widgets.Bubble');
	const helpers = HeO2.require('HeO2.common.helpers');

	const DEFAULT_OPTIONS = {
        target: null,
        validatorMap: undefined
    };

	HeO2.__impl.Form = EventingClass.extend({
		/* FIELDS */
		_targetNode: null,
		_inputs: null,
		_options: null,

		/* PUBLIC */
		init: function(options) {
			this._super();

			this._inputs = Object.create(null);
			this._results = null;

			this._options = helpers.merge(true,  DEFAULT_OPTIONS, options);
			this._attach();
		},

        clear: function() {
            for (let name in this._inputs) {
                if (typeof this._inputs.hasOwnProperty !== 'function' || this._inputs.hasOwnProperty(name)) {
                    this.val(name, '');
                }
            }

            return this;
        },

        dismissBubble: function(name) {
		    if (name) {
                if (this._inputs[name] && this._inputs[name].bubble) {
                    this._inputs[name].bubble.detach();
                    delete this._inputs[name].bubble;
                }
            } else {
		        for (let i = 0, keys = Object.keys(this._inputs), length = keys.length; i < length; ++i) {
		            if (this._inputs[keys[i]].bubble) {
		                this._inputs[keys[i]].bubble.detach();
                        delete this._inputs[keys[i]].bubble;
                    }
                }
            }

            return this;
        },

		list: function() {
			let vals = Object.create(null);

			for (let name in this._inputs) {
				if (typeof this._inputs.hasOwnProperty !== 'function' || this._inputs.hasOwnProperty(name)) {
					vals[name] = this.val(name);
				}
			}

			return vals;
		},

		ref: function(name) {
            if (this._inputs[name]) {
                return this._inputs[name].$ref[0];
            }

            return undefined;
        },

		val: function(name, value) {
			if (this._inputs[name]) {
				return this._inputs[name].mediator.val(value);
			}
		},

        validate: function(rules) {
            let validator = new Validator({rules: rules, map: this._options.validatorMap});
            this._results = validator.validate(this.list());

            return this._results;
        },

        reindex: function() {
		    this._index();
		    return this;
        },

        report: function(position, results) {
		    if (typeof position === 'object') {
		        results = position;
		        position = 'right';
            } else {
                position = position || 'right';
                results = results || this._results;
            }

            if (results) {
                for (let i = 0, keys = Object.keys(results.fields), length = keys.length, fieldName = keys[0]; i < length; fieldName = keys[++i]) {
                    if (this._inputs[fieldName] && this._inputs[fieldName].bubble) {
                        this.dismissBubble(fieldName);
                    }

                    if (results.fields[fieldName].status === 'fail') {
                        let inputNode = this._targetNode.find('[name="' + fieldName + '"]');

                        if (inputNode.length === 0) {
                            inputNode = this._targetNode.find('#' + fieldName);
                        }

                        if (inputNode.length !== 0) {
                            this._inputs[fieldName].bubble = Bubble.create({
                                pointAt: inputNode,
                                position: position,
                                text: results.fields[fieldName].results.reduce(
                                    (message, textId) => {
                                        return (textId ? ((message.length ? (message + '<br>') : '') + $.i18n(textId)) : message);
                                    }, '')
                                }
                            );
                        }
                    }
                }
            }
        },

		restore: function(items) {
			Object.keys(items).forEach((name) => {
				if (this._inputs[name]) {
					this._inputs[name].mediator.val(items[name]);
				}
			});
		},

		setOptions: function(options) {
			this._options = helpers.merge(true, this._options, options);
			this._attach();
		},

		simpleValidate: function() {
			let validates = true;

			for (let name in this._inputs) {
				if (typeof this._inputs.hasOwnProperty !== 'function' || this._inputs.hasOwnProperty(name)) {
					validates &= this._inputs[name].$ref[0].checkValidity();
				}
			}

			return validates;
		},


		/* PRIVATE */
		_attach: function() {
			this._targetNode = $(this._options.target);
			this._index();
		},

		_index: function() {
		    this._inputs = Object.create(null);
			this._targetNode.find('input:not(.' + HeO2.CONST.UI_CLASSES.SKIP_INPUT + '),textarea,select,[data-heo2-ui],.' + HeO2.CONST.UI_CLASSES.CUSTOM_INPUT)
				.each(function(index, input) {
					let name = input.getAttribute('name') || input.getAttribute('id') || input.getAttribute('data-heo2-name');
					if (name) {
						this._inputs[name] = {
							$ref: $(input),
							mediator: this._captureMediator(input)
						};
					}
				}.bind(this));
		},

		_captureMediator: function(input) {
			let winGrade = -1,
				winner = null;

			Object.keys(HeO2.__impl.Form.mediators).forEach((name) => {
				let mediator = HeO2.__impl.Form.mediators[name];
				let grade =	['low', 'normal', 'high', 'perfect'].indexOf(mediator.test(input));
				if (grade > winGrade) {
					winGrade = grade;
					winner = mediator;
				}
			});

			return winner.capture(input);
		}
	});

	HeO2.__impl.Form.mediators = Object.create(null);
}(HeO2, jQuery));
