(function(HeO2, $) {
    "use strict";

    const View = HeO2.require('HeO2.View');
    const UIHost = HeO2.require('HeO2.UIHost');
    const helpers = HeO2.require('HeO2.common.helpers');
    const logger = HeO2.require('HeO2.common.logger');

    const DATA_OPTIONS_ATTRIBUTE = 'data-heo2-options';
    const NAME_VALUE_DELIMITER = ':';
    const OPTIONS_SEPARATOR = ';';
    const STRING_CHARACTER = '\'';
    const ESCAPE_CHARACTER = '\\';

    UIHost.View = View.extend({
        init: function(host) {
            this._super(host);
            this._options = this._parseOptions();
        },

        options: function() {
            return this._options;
        },


        /* LIFECYCLE */
        _attach: function() {
            this._super();

            if (this._targetNode.length === 1) {
                this._targetNode[0].__heo2_ref = this.host();
            }
        },

        /* PRIVATE */
        _parseValue: function(value) {
            if (value[0] === STRING_CHARACTER && value[value.length - 1] === STRING_CHARACTER) {
                return value.substr(1, value.length - 1);
            } else if (helpers.isNumeric(value)) {
                if (helpers.isFloat(value)) {
                    return parseFloat(value);
                }

                return parseInt(value, 10);
            } else if (value === 'true' || value === 'false') {
                return value === 'true';
            } else {
                return value;
            }

            logger.warn('UIHost.View: Invalid option value \'' + value + '\'.');
            return undefined;
        },

        _parseOptions: function() {
            let element = $(this._host.element());
            let options = Object.create(null);
            let optionString = element.attr(DATA_OPTIONS_ATTRIBUTE);

            if (optionString) {
                let markerStart = 0;
                let state = 'key';
                let memory = '';

                for (let i = 0, length = optionString.length; i <= length; ++i) {
                    switch (state) {
                    case 'key':
                        if (optionString[i] === NAME_VALUE_DELIMITER) {
                            memory = optionString.substring(markerStart, i);
                            markerStart = i + 1;
                            state = 'value';
                        }
                        break;

                    case 'value':
                        if (optionString[i] === STRING_CHARACTER) {
                            state = 'string';
                            continue;
                        }
                        if (optionString[i] === OPTIONS_SEPARATOR || optionString[i] === undefined) {
                            options[memory] = this._parseValue(optionString.substring(markerStart, i));
                            markerStart = i + 1;
                            state = 'key';
                        }
                        break;

                    case 'string':
                        if (optionString[i] === STRING_CHARACTER && optionString[i - 1] !== ESCAPE_CHARACTER) {
                            state = 'value';
                        }
                        break;
                    }
                }

                return options;
            }
        }
    });
}(HeO2, jQuery));
