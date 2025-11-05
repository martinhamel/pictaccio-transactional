(function(HeO2, $) {
    "use strict";

    const UIHost = HeO2.require('HeO2.UIHost');
    const helpers = HeO2.require('HeO2.common.helpers');

    const LabelController = UIHost.Controller.extend({
        init: function(host, options) {
            this._super(host);

            this._heedReadiness();
        },

        text: function(text, cssClass) {
            "export";
            this._host.emit('text', text, cssClass);
        },

        /* PRIVATE */
        _heedReadiness: function() {
            this._host.on('ready', function() {

            }.bind(this));
        }
    });

    const VIEW_DEFAULT_OPTIONS = {
        target: null
    };
    const LabelView = UIHost.View.extend({
        NAME: 'default',

        init: function(host, options) {
            this._super(host);
            this._options = helpers.merge(true, VIEW_DEFAULT_OPTIONS, options, this._options);
        },


        /* LIFECYCLE */
        _attach: function() {
            this._super();

            this._targetNode = $(this._options.target);

            this._host.on('text', function(text, cssClass) {
                this._targetNode.text(text);

                if (cssClass) {
                    cssClass.split(',').forEach((className) => {
                        if (['-', '+'].includes(className[0])) {
                            this._targetNode.toggleClass(className.substr(1), className[0] === '+');
                        }
                    });
                }
            }.bind(this));
        },


        /* EVENT HANDLERS */

        /* PRIVATE */

    });

    HeO2.UI.Label = UIHost.extend({
        init: function(host, element) {
            this._super(host, element, [LabelController, {constructor: LabelView, options: {target: element}}]);
        }
    });
}(HeO2, jQuery));
