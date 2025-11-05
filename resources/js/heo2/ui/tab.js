(function(HeO2, $) {
    "use strict";

    const UIHost = HeO2.require('HeO2.UIHost');
    const helpers = HeO2.require('HeO2.common.helpers');
    const logger = HeO2.require('HeO2.common.logger');

    const TabController = UIHost.Controller.extend({
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
    const TabView = UIHost.View.extend({
        NAME: 'default',

        init: function(host, options) {
            this._super(host);
            this._options = helpers.merge(true, VIEW_DEFAULT_OPTIONS, options, this._options);

            this._tabs = [];
        },


        /* LIFECYCLE */
        _attach: function() {
            this._targetNode = $(this._options.target);
            this._indexTabs();
            this._renderTabs();

            this._super();
        },


        /* EVENT HANDLERS */
        _tab_click: function(event) {
            let targetNode = $(event.target);
            this._targetNode
                .children('div')
                    .css('display', 'none')
                    .end()
                .children('.tab-buttons')
                    .children().removeClass('selected');

            targetNode.addClass('selected');

            targetNode.data('tab-data').node.css('display', 'block');
        },

        /* PRIVATE */
        _indexTabs: function() {
            this._targetNode.children().each((index, element) => {
                let node = $(element);
                let firstChildNode = node.children().first();

                if (firstChildNode.is(':header')) {
                    firstChildNode.css('display', 'none');
                    this._tabs.push({
                        title: firstChildNode.text().trim(),
                        node
                    });
                }
            });
        },

        _renderTabs: function() {
            let tabs = [];
            for (let tab of this._tabs) {
                tabs.push(
                    $(`<li class="tab-button">${tab.title}</li>`)
                        .click(this._tab_click.bind(this))
                        .data('tab-data', tab)
                );
            }

            this._targetNode.prepend(
                $('<ul class="tab-buttons"></ul>').append(tabs)
            );

            setImmediate(() => {
                this._targetNode.children('.tab-buttons').children().first().click();
            });
        }
    });

    HeO2.UI.Tab = UIHost.extend({
        init: function(host, element) {
            this._super(host, element, [TabController, {constructor: TabView, options: {target: element}}]);
        }
    });
}(HeO2, jQuery));
