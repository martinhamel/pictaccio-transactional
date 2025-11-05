(function(HeO2, $) {
    "use strict";

    const UIHost = HeO2.require('HeO2.UIHost');
    const helpers = HeO2.require('HeO2.common.helpers');
    const logger = HeO2.require('HeO2.common.logger');

    const BreadcrumbController = UIHost.Controller.extend({
        init: function(host, options) {
            this._super(host);

            this._heedReadiness();
        },

        step: function(step) {
            "export";

            if (step === undefined) {
                return this._host.document().read('step');
            }

            this._host.document().write('step', step);
        },

        /* PRIVATE */
        _heedReadiness: function() {
            this._host.on('ready', function() {
                this.step(1);
            }.bind(this));
        }
    });

    const VIEW_DEFAULT_OPTIONS = {
        target: null,
        active: 'active',
        completed: 'completed'
    };
    const BreadcrumbView = UIHost.View.extend({
        NAME: 'default',

        init: function(host, options) {
            this._super(host);
            this._options = helpers.merge(true, VIEW_DEFAULT_OPTIONS, options, this._options);
        },


        /* LIFECYCLE */
        _attach: function() {
            this._targetNode = $(this._options.target)[0];
            if (this._targetNode && this._targetNode.nodeName.toUpperCase() !== 'UL' || !this._targetNode) {
                logger.warn('Breadcrumb: Expected UL target node, ' + this._targetNode.nodeName + ' received.');
                logger.log(this._targetNode);
            }

            this._host.document().on('written.step', this._self_update.bind(this));

            this._super();
        },


        /* EVENT HANDLERS */
        _self_update: function(event) {
            var current = event.value - 1;

            for (var i = 0, length = this._targetNode.children.length; i < length; ++i) {
                $(this._targetNode.children[i])
                    .toggleClass(this._options.completed, i < current)
                    .toggleClass(this._options.active, i == current);
            }
        }

        /* PRIVATE */

    });

    HeO2.UI.Breadcrumb = UIHost.extend({
        init: function(host, element) {
            this._super(host, element, [BreadcrumbController, {constructor: BreadcrumbView, options: {target: element}}]);
        }
    });
}(HeO2, jQuery));
