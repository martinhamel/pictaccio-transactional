(function(HeO2) {
    "use strict";

    const EventingClass = HeO2.require('HeO2.EventingClass');
    const logger = HeO2.require('HeO2.common.logger');

    const PARAM_SEPARATOR = ';';
    const PARAM_DELIMITER = ':';

    HeO2.View.Component = EventingClass.extend({
        init: function(view, options) {

            this._super();

            this._view = view;
            this._options = this._prepareOptions(options);

            // Call initialize life-cycle
            this._initialize()
            this._heedReadiness();
        },


        /* LIFECYCLE */
        _initialize: function() {

        },

        _attach: function() {

        },

        _prepareOptions: function(options) {
            return options;
        },


        /* PROTECTED */
        _parseParamString: function(paramString) {
            var attachStrings = paramString.split(PARAM_SEPARATOR);
            var params = Object.create(null);

            for (var i = 0, length = attachStrings.length; i < length; ++i) {
                if (attachStrings[i].indexOf(PARAM_DELIMITER) !== -1) {
                    var name = attachStrings[i].substr(0, attachStrings[i].indexOf(PARAM_DELIMITER));
                    var value = attachStrings[i].substr(attachStrings[i].indexOf(PARAM_DELIMITER) + 1);
                    params[name] = value;
                }
            }

            return params;
        },


        /* PRIVATE */
        _heedReadiness: function() {
            this._view.host().on('ready', function() {
                this._attach();
            }.bind(this));
        }
    });

    HeO2.View.Component._collection = {};
    HeO2.View.Component.add = function(name, objClass) {
        objClass.CLASS = name + 'Component';
        if (HeO2.View.Component._collection[name] === undefined) {
            HeO2.View.Component._collection[name] = objClass;
            return;
        }

        logger.warn('ViewComponent: A component named \'' + name + '\' already exist.');
    };
    HeO2.View.Component.get = function(name) {
        if (HeO2.View.Component._collection[name]) {
            return HeO2.View.Component._collection[name];
        }

        logger.error('ViewComponent: Component \'' + name + '\' not found.');
    }
}(HeO2));
