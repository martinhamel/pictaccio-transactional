(function(HeO2, $) {
    "use strict";

    const UIHost = HeO2.require('HeO2.UIHost');
    const helpers = HeO2.require('HeO2.common.helpers');
    const logger = HeO2.require('HeO2.common.logger');

    /* CONTROLLER */
    const BOILERPLATEController = UIHost.Controller.extend({
        init: function(host, options) {
            this._super(host);

            this._heedReadiness();
        },

        /* PRIVATE */
        _heedReadiness: function() {
            this.host().on('ready', () => {

            });
        }
    });


    /* VIEW */
    const VIEW_DEFAULT_OPTIONS = {
        target: null
    };

    const BOILERPLATEView = UIHost.View.extend({
        NAME: 'default',

        init: function(host, options) {
            this._super(host);
            this._options = helpers.merge(true, VIEW_DEFAULT_OPTIONS, options, this._options);
        },


        /* LIFECYCLE */
        _attach: function() {
            this._targetNode = $(this._options.target);

            this._super();
        },


        /* EVENT HANDLERS */

        /* PRIVATE */

    });


    HeO2.UI.BOILERPLATE = UIHost.extend({
        init: function(host, element) {
            this._super(host, element, [BOILERPLATEController, {constructor: BOILERPLATEView, options: {target: element}}]);
        }
    });
}(HeO2, jQuery));
