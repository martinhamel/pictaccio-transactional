(function(HeO2, $) {
    "use strict";

    const ViewComponent = HeO2.require('HeO2.View.Component');
    const helpers = HeO2.require('HeO2.common.helpers');

    const DEFAULT_OPTIONS = {
        attributes: ['for', 'id', 'name'],
        hookCharacter: '#'
    };

    const TemplateComponent = ViewComponent.extend({
        clone: function(template, idValue, options) {
            options = options || {};
            var clone = template.clone(true);

            if (options.removeId) {
                clone.removeAttr('id');
            }

            if (idValue !== undefined) {
                this.updateAttribute(clone, idValue);
            }

            if (this._view.MaterialFormAnimation) {
                this._view.MaterialFormAnimation.attachBehaviour(clone);
            }

            return clone;
        },

        updateAttribute: function(template, value) {
            template = $(template);
            template.find('*').add(template).each(function(index, element) {
                for (var i = 0, length = element.attributes.length; i < length; ++i) {
                    if (    this._options.attributes.indexOf(element.attributes[i].nodeName) !== -1 &&
                            element.attributes[i].nodeValue.indexOf(this._options.hookCharacter) !== -1) {
                        element.attributes[i].nodeValue =
                            element.attributes[i].nodeValue.replace(this._options.hookCharacter, value);
                    }
                }
            }.bind(this));
        },

        /* LIFE CYCLE */
        _prepareOptions: function(options) {
            return helpers.merge(DEFAULT_OPTIONS, options);
        }

    });

    ViewComponent.add('Template', TemplateComponent);
}(HeO2, jQuery));
