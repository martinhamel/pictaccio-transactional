(function (HeO2, $) {
    "use strict";

    const EventingClass = HeO2.require('HeO2.EventingClass');
    const helpers = HeO2.require('HeO2.common.helpers');
    const domHelpers = HeO2.require('HeO2.common.domHelpers');
    const CONST = HeO2.require('HeO2.CONST');

    const MENU_VIEWPORT_PADDING = 10;

    const DEFAULT_OPTIONS = {
        cssClass: 'widgets-context-menu',
        items: [],
        position: 'below',
        trigger: ''
    };

    /**
     * items: [
     *  {id: {string}, text: {string}},
     *  [...]
     * ]
     *
     */
    const ContextMenu = EventingClass.extend({
        init: function(options) {
            this._super();

            this._shown = false;

            this._options = helpers.merge(true, DEFAULT_OPTIONS, options);
            this._attach();
        },

        hide: function() {
            this._menuNode.hide();
            this._shown = false;
        },

        show: function() {
            if (!this._shown) {
                var triggerRect = domHelpers.getPageBoundingRect(this._triggerNode[0]);
                var menuRect = {
                    width: this._menuNode.width(),
                    height: this._menuNode.height()
                };

                switch (this._options.position) {
                case 'below':
                    menuRect.left = triggerRect.left;
                    menuRect.top = triggerRect.bottom;
                    break;
                }

                if (menuRect.left <= document.documentElement.scrollLeft + MENU_VIEWPORT_PADDING) {
                    menuRect.left = document.documentElement.scrollLeft + MENU_VIEWPORT_PADDING;
                }
                if (menuRect.top <= document.documentElement.scrollTop + MENU_VIEWPORT_PADDING) {
                    menuRect.top = document.documentElement + MENU_VIEWPORT_PADDING;
                }
                if (menuRect.left + menuRect.width >= document.documentElement.scrollLeft + document.documentElement.clientWidth - MENU_VIEWPORT_PADDING) {
                    menuRect.left = document.documentElement.scrollLeft + document.documentElement.clientWidth - menuRect.width - MENU_VIEWPORT_PADDING;
                }
                if (menuRect.top + menuRect.height >= document.documentElement.scrollTop + document.documentElement.clientHeight - MENU_VIEWPORT_PADDING) {
                    menuRect.top = document.documentElement.scrollTop + document.documentElement.clientHeight - menuRect.height - MENU_VIEWPORT_PADDING;
                }
                this._menuNode
                    .css({
                        left: menuRect.left,
                        top: menuRect.top
                    })
                    .show();

                this._shown = true;
            }
        },


        /* EVENT HANDLERS */
        _item_click: function() {
            this._emitSelect($(event.target).data('_context-menu_item-id'));
        },

        _trigger_click: function() {
            this.show();

            setImmediate(function() {
                $('body')
                    .one('click', function() {
                        this.hide();
                    }.bind(this))
                    .one('keydown', function(event) {
                        if (event.which === CONST.VK_CODES.ESCAPE) {
                            this.hide();
                        }
                    }.bind(this));
            }.bind(this));
        },


        /* PRIVATE */
        _attach: function() {
            if (this._options.trigger) {
                this._triggerNode = $(this._options.trigger).click(this._trigger_click.bind(this));
            }

            this._createMenu();
        },

        _createMenu: function() {
            this._menuNode = $('<ul></ul>')
                .addClass(this._options.cssClass)
                .on('click', 'li', this._item_click.bind(this));

            for (var i = 0, length = this._options.items.length; i < length; ++i) {
                this._menuNode.append(
                    $('<li></li>')
                        .data('_context-menu_item-id', this._options.items[i].id)
                        .html(this._options.items[i].text)
                );
            }


            $('body').append(this._menuNode);
        },

        _emitSelect: function(id) {
            var event = {
                id: id
            };

            this.emit('select', event);
        }
    });

    HeO2.UI.Widgets.ContextMenu = {
        create: function(options) {
            return new ContextMenu(options);
        }
    };
}(HeO2, jQuery));
