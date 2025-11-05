(function(HeO2, $) {
    "use strict";

    const ViewCompoment = HeO2.require('HeO2.View.Component');
    const Form = HeO2.require('HeO2.__impl.Form');
    const inflector = HeO2.require('HeO2.common.inflector');
    const helpers = HeO2.require('HeO2.common.helpers');
    const logger = HeO2.require('HeO2.common.logger');

    const DEFAULT_OPTIONS = {
        targets: []
    };

    const FormsComponent = ViewCompoment.extend({

        /* LIFE CYCLE */
        _prepareOptions: function(options) {
            return helpers.merge(true, DEFAULT_OPTIONS, options);
        },

        _initialize: function() {
            this._files = Object.create(null);
        },

        _attach: function() {
            for (let i = 0, length = this._options.targets.length; i < length; ++i) {
                let advancedOptions = typeof this._options.targets[i] !== 'string';
                let selector = advancedOptions ? this._options.targets[i].selector : this._options.targets[i];
                let validatorMap = advancedOptions ? this._options.targets[i].map : undefined;
                let targetNode = $(selector);
                let id = targetNode.attr('id');

                if (id == null || id === '') {
                    logger.warn('FormsComponent: A form is missing an id, can\'t be added');
                    continue;
                }

                id = inflector.camelize(id);
                this[id] = new Form({target: targetNode, validatorMap: validatorMap});
            }
        }
    });


    ViewCompoment.add('Forms', FormsComponent);
}(HeO2, jQuery));
