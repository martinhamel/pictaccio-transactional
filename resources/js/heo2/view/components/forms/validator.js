(function(HeO2, $) {
    "use strict";

    const EventingClass = HeO2.require('HeO2.EventingClass');
    const helpers = HeO2.require('HeO2.common.helpers');
    const logger = HeO2.require('HeO2.common.logger');

    const DEFAULT_OPTIONS = {
        rules: {},
        map: Object.create(null)
    };

    /**
     * options format:
     * options {
     *   rules: {object} Use CakePHP validation rules format
     * }
     *
     * parsedRules format: // Object returned by Validator::_parseRules
     * [
     *  {
     *   name: <string>
     *   ruleParams: <array> {optional}
     *   message: <string> {optional}
     *   validationParams: <object> {optional}
     *  }, {...}
     * ]
     *
     * @type {Validator}
     */
    const Validator = EventingClass.extend({
        init: function(options) {
            this._super();

            this._options = helpers.merge(true, DEFAULT_OPTIONS, options);
            this._elements = [];
		},

		validate: function(form) {
			return this._validate(form);
		},

		/* PRIVATE */
		_findValidator: function(ruleName) {
			if (typeof Validator.__validators[ruleName] !== 'undefined') {
				return Validator.__validators[ruleName]
			}

			logger.warn('FormsComponent[Validator]: Cannot find validator for rule ' + ruleName);
			return null;
		},

		_parseKeyMessage: function(messageKey) {
			if (messageKey !== undefined) {
				return {message: messageKey};
			}
			return messageKey;
		},

		_parseKeyRule: function(ruleKey) {
			let rule = null;

			if (ruleKey !== undefined) {
				if (Array.isArray(ruleKey)) {
					rule = this._parseRuleWithParam(ruleKey);
				} else if (typeof ruleKey === 'string') {
					rule = {name: ruleKey};
				}
				rule.validator = this._findValidator(rule.name);
				return rule;
			}

			logger.warn('FormsComponent[Validator]: Rule is missing rule name');
			return null;
		},

		_parseRules: function(rules) {
			let parsedRules = [];

			if (typeof rules === 'object') {
				if (rules.rule !== undefined) {
					parsedRules[0] = this._parseSingleRule(rules);
				} else {
					// _parseMultipleRules will modify parseRules
					this._parseMultipleRules(parsedRules, rules);
				}
			} else if (typeof rules === 'string') {
				parsedRules[0] = this._parseKeyRule(rules);
			}

			return parsedRules;
		},

		// Modifies argument parsedRules
		_parseMultipleRules: function(parsedRules, rules) {
			for (let prop in rules) {
				if (prop !== 'required' && (typeof rules.hasOwnProperty !== 'function' || rules.hasOwnProperty(prop))) {
					let rule = this._parseSingleRule(rules[prop]);
					if (rule.name !== undefined) {
						parsedRules.push(this._parseSingleRule(rules[prop]));
					}
				}
			}
		},

		_parseSingleRule: function(rule) {
			let ruleCopy = helpers.clone(rule);
			let parsedRule = helpers.merge(
				this._parseKeyMessage(ruleCopy.message),
				this._parseKeyRule(ruleCopy.rule)
			);

			delete ruleCopy.message;
			delete ruleCopy.rule;

			parsedRule.validationParams = ruleCopy;

			return parsedRule;
		},

		_parseRuleWithParam: function(rule) {
			return {name: rule[0], ruleParams: rule.slice(1)};
		},

		_validate: function(form) {
			let validation = {
				status: 'success',
                fields: Object.create(null),
				addField: function(fieldName, status, messages) {
				    messages = Array.isArray(messages) ? messages : [messages];
				    if (typeof status === 'boolean') {
				        status = status ? 'success' : 'fail'
                    }

				    if (status === 'fail') {
				        validation.status = 'fail';
                    }

				    if (validation.fields[fieldName] === undefined) {
				        validation.fields[fieldName] = Object.create(null);
				        validation.fields[fieldName].results = [];
                    }

                    if (validation.fields[fieldName].status !== 'fail') {
				        validation.fields[fieldName].status = status;
                    }

                    for (let i = 0, length = messages.length; i < length; ++i) {
                        validation.fields[fieldName].results.push(messages[i]);
                    }
                }
			};
			for (let i = 0, keys = Object.keys(this._options.rules), keysLength = keys.length, ruleFieldName = keys[0]; i < keysLength; ruleFieldName = [keys[++i]]) {
			    let rulesBlueprint = this._options.rules[ruleFieldName];

                if (rulesBlueprint) {
                    let fieldName = form[ruleFieldName] !== undefined ? ruleFieldName : (this._options.map && form[this._options.map[ruleFieldName]] !== undefined ? this._options.map[ruleFieldName] : undefined);
                    let results = [];

                    if (fieldName) {
                        let field = form[ruleFieldName] || form[this._options.map[ruleFieldName]];
                        let rules = this._parseRules(rulesBlueprint);

                        for (let j = 0, length = rules.length, currentRule = rules[0]; j < length; currentRule = rules[++j]) {
                            if (!currentRule.validator.validate(currentRule, field)) {
                                results.push(currentRule.message);
                            }
                        }
                    } else if (rulesBlueprint.required) {
                        results.push('MESSAGE_REQUIRED_FIELD_MISSING');
                    }

                   validation.addField(fieldName, results.length === 0 ? 'success' : 'fail', results);
                }
			}

			return validation;
		}
	});

	Validator.__handlers = [];
	Validator.__validators = Object.create(null);
	Validator.addHandler = function(handler) {
		Validator.__handlers.push(new handler);
	};
	Validator.addValidator = function(names, validator) {
		let validatorObj = new validator();
		let nameArray = names.split(' ');
		let nameArrayLength = nameArray.length;
		for (let i = 0; i < nameArrayLength; ++i) {
			Validator.__validators[nameArray[i]] = validatorObj;
		}
	};

	HeO2.__impl.Validator = Validator;
}(HeO2, jQuery));
