(function(HeO2, $) {
    "use strict";

    const UIHost = HeO2.require('HeO2.UIHost');
    const helpers = HeO2.require('HeO2.common.helpers');
    const logger = HeO2.require('HeO2.common.logger');

    const DropdownController = UIHost.Controller.extend({
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

    const DROPDOWN_CLASS = 'heo2-ui-dropdown input';
    const MAT_ANIM_FILLED_CLASS = 'filled';
    const VIEW_DEFAULT_OPTIONS = {
        target: null,
        updateMatAnim: false
    };
    const DropdownView = UIHost.View.extend({
        NAME: 'default',

        init: function(host, options) {
            this._super(host);
            this._options = helpers.merge(true, VIEW_DEFAULT_OPTIONS, options, this._options);
        },


        /* LIFECYCLE */
        _attach: function() {
            this._selectNode = $(this._options.target).eq(0);
            if (this._selectNode && this._selectNode[0].nodeName.toUpperCase() !== 'SELECT' || !this._selectNode) {
                logger.warn('Dropdown: Target should be a SELECT node.');
                logger.log(this._selectNode[0]);
                return;
            }

            this._targetNode = $('<div></div>').addClass(DROPDOWN_CLASS);
            this._labelNode = $('<span></span>');
            this._selectNode.replaceWith(this._targetNode);
            this._targetNode
                .append(this._selectNode)
                .append(this._labelNode);

            this._selectNode
                .focus(this._select_click.bind(this))
                .change(this._select_change.bind(this));

            this._super();
        },


        /* EVENT HANDLERS */
        _select_change: function() {
            if (this._selectNode.val()) {
                this._labelNode.text(this._selectNode.children(':selected').text());

                if (this._options.updateMatAnim) {
                    this._targetNode.parent().addClass(MAT_ANIM_FILLED_CLASS);
                }
            }
        },

        _select_click: function() {
            if (this._options.autoRemoveFirst && this._select_click_removed !== true) {
                this._targetNode.find('option').first().detach();
                this._select_click_remove = true;
            }
        }

        /* PRIVATE */

    });

    HeO2.UI.Dropdown = UIHost.extend({
        init: function(host, element) {
            this._super(host, element, [DropdownController, {constructor: DropdownView, options: {target: element}}]);
        }
    });
}(HeO2, jQuery));
