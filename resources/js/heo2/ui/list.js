(function(HeO2, $) {
    "use strict";

    const UIHost = HeO2.require('HeO2.UIHost');
    const helpers = HeO2.require('HeO2.common.helpers');
    const logger = HeO2.require('HeO2.common.logger');

    const ListController = UIHost.Controller.extend({
        init: function(host, options) {
            this._super(host);

            this._heedReadiness();
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
    const ListView = UIHost.View.extend({
        NAME: 'default',

        init: function(host, options) {
            this._super(host);
            this._options = helpers.merge(true, VIEW_DEFAULT_OPTIONS, options, this._options);
        },


        /* LIFECYCLE */
        _attach: function() {
            this._targetNode = $(this._options.target)[0];

            this._super();
        },


        /* EVENT HANDLERS */

        /* PRIVATE */

    });

    HeO2.UI.List = UIHost.extend({
        init: function(host, element) {
            this._super(host, element, [ListController, {constructor: ListView, options: {target: element}}]);
        }
    });
}(HeO2, jQuery));
