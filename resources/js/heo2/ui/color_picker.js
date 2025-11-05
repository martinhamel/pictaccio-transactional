(function(HeO2, $) {
    "use strict";

    const UIHost = HeO2.require('HeO2.UIHost');
    const helpers = HeO2.require('HeO2.common.helpers');
    const logger = HeO2.require('HeO2.common.logger');

    const DEFAULT_OPTIONS = {
        noHash: true
    };

    const ColorPickerController = UIHost.Controller.extend({
        init: function(host, options) {
            this._super(host);

            this._color = '';
            this._options = helpers.merge(true, DEFAULT_OPTIONS, options);

            this._heedReadiness();
            this._heedSetValue();
        },

        val: function() {
            "export";

            return this._color;
        },

        /* PRIVATE */
        _heedReadiness: function() {
            this._host.on('ready', function() {

            }.bind(this));
        },

        _heedSetValue: function() {
            this._host.on('_set-value', function(color) {
                this._color = this._options.noHash ? color.replace('#', '') : color;
                this._host.emit('change', {
                    color: color
                });
            }.bind(this));
        }
    });

    const TARGET_CLASS = 'heo2-ui-color-picker input';
    const MAT_ANIM_FILLED_CLASS = 'filled';
    const DROPDOWN_CLASS = 'dropdown';
    const PREVIEW_CLASS = 'preview';
    const ITEM_LABEL_CLASS = 'item-label';
    const LABEL_CLASS = 'label';
    const SHOW_CLASS = 'show-fade-in';
    const VIEW_DEFAULT_OPTIONS = {
        target: null
    };
    const ColorPickerView = UIHost.View.extend({
        NAME: 'default',

        init: function(host, options) {
            this._super(host);
            this._options = helpers.merge(true, VIEW_DEFAULT_OPTIONS, options, this._options);
            this._opened = false;
            this._predefinedColor = [
                {name: 'Green', color: '#96c03d'},
                {name: 'Blue', color: '#006fd7'},
                {name: 'Red', color: '#910608'},
                {name: 'Orange', color: '#f99e1d'},
                {name: 'Pink', color: '#e853af'},
                {name: 'Yellow', color: '#e5e840'},
                {name: 'Purple', color: '#8335a5'}
            ]
        },


        /* LIFECYCLE */
        _attach: function() {
            this._dropdownNode = $('<ul></ul>')
                .addClass(DROPDOWN_CLASS)
                .on('click', 'li', this._item_click.bind(this));
            this._renderPredefinedColor();

            this._labelNode = $('<div></div>')
                .addClass(LABEL_CLASS);
            this._targetNode = $(this._options.target)
                .append(this._labelNode)
                .append(this._dropdownNode)
                .addClass(TARGET_CLASS)
                .data('ui-obj', this._host)
                .click(this._target_click.bind(this));

            this._super();
        },

        _renderPredefinedColor: function() {
            for (var i = 0, length = this._predefinedColor.length; i < length; ++i) {
                this._dropdownNode.append(
                    $('<li>' +
                        '<i class="' + PREVIEW_CLASS + '" style="background-color:' + this._predefinedColor[i].color + '"></i>' +
                        '<span class="' + ITEM_LABEL_CLASS + '">' + this._predefinedColor[i].name + '</span>' +
                      '</li>')
                        .data('info', this._predefinedColor[i])
                );
            }
        },


        /* EVENT HANDLERS */
        _item_click: function(event) {
            var liNode = event.target.nodeName.toUpperCase() !== 'LI' ? $(event.target).parent() : $(event.target);

            this._labelNode
                .empty()
                .append(
                    '<i class="' + PREVIEW_CLASS + '" style="background-color:' + liNode.data('info').color + '"></i>' +
                    '<span class="' + ITEM_LABEL_CLASS + '">' + liNode.data('info').name + '</span>'
                );
            this._host.emit('_set-value', liNode.data('info').color);

            if (this._options.updateMatAnim) {
                this._targetNode.parent().addClass(MAT_ANIM_FILLED_CLASS);
            }

            this._hide();
            event.stopPropagation();
        },

        _target_click: function(event) {
            event.stopPropagation();
            if (this._opened) {
                return;
            }

            this._show();

            $(document).one('click', function(event) {
                this._hide();
            }.bind(this));
        },

        /* PRIVATE */
        _hide: function() {
            this._dropdownNode.removeClass(SHOW_CLASS);
            this._opened = false;
        },

        _show: function() {
            this._opened = true;
            this._dropdownNode.addClass(SHOW_CLASS);
        }

    });

    HeO2.UI.ColorPicker = UIHost.extend({
        init: function(host, element) {
            this._super(host, element, [ColorPickerController, {constructor: ColorPickerView, options: {target: element}}]);
        }
    });
}(HeO2, jQuery));
