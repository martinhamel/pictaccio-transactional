/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2015-2019, Heliox - All Right Reserved
 */

(function (HeO2, $) {
    "use strict";

    HeO2.ready(() => {
        const Host = HeO2.require('HeO2.Host');
        const Controller = HeO2.require('HeO2.Controller');
        const View = HeO2.require('HeO2.View');
        const helpers = HeO2.require('HeO2.common.helpers');
        const config = HeO2.require('HeO2.config');

        const AdminCrossSellController = Controller.extend({
            init: function (host, options) {
                this._super(host, {});
            },

            listProducts: function (response, data, callback) {
                "server[url:+=listProducts,method:get]";

                if (response.status === 'ok') {
                    callback(response.results);
                }
            }

            /* PRIVATE */
        });


        /* VIEW */
        const AdminCrossSellView = View.extend({
            NAME: 'default',

            init: function (host) {
                this._super(host, {
                    target: '#admin-cross-sell',
                    components: [
                        {
                            name: 'Forms',
                            options: {
                                targets: [{ selector: '#cross-sell-overlay' }]
                            }
                        },
                    ]
                });

                if (HeO2.DEBUG) {
                    HeO2._DEBUG.adminView = this;
                }
            },


            /* LIFECYCLE */
            _attach: function () {
                this._super();

                this._child('cross-sell-table')
                    .registerFieldRenderHelpers(
                        (name, value) => {
                            if (name === 'tags_json') {
                                let ids = typeof value === 'string' ? value.split(',') : value;
                                let text = '';

                                if (Array.isArray(ids)) {
                                    for (let id of ids) {
                                        if (text !== '') {
                                            text += ', ';
                                        }
                                        text += this._child('background-category-table').dataset()
                                            .data.rows.find((row) => row.id == id).name_locale_json[HeO2.config.read('Config.language')];
                                    }

                                    return {
                                        html: text,
                                        edit: () => {
                                        }
                                    };
                                }
                            }
                        }
                    );
            },




            /* EVENT HANDLERS */
            _crossSell_addRow: function (callback) {
                this.Forms.crossSellOverlay.clear();

                this.controller().listProducts(null, (products) => {
                    $('#products-available')
                        .empty();
                    $('#products-selected')
                        .empty();
                    for (let product of products) {
                        $('#products-available').append(
                            `<option value="${product.id}">${product.id} - ${product.text}</option>`);
                    }

                    this._child('cross-sell-overlay')
                        .activateGroup('add')
                        .show((result) => {
                            if (result.status === 'ok') {
                                callback({
                                    internal_name: this.Forms.crossSellOverlay.val('internal-name'),
                                    options_json: {
                                        products: $('#cross-sell-overlay').find('[name="products-selected"] > option').toArray().map(
                                            element => +element.getAttribute('value')
                                        )
                                    }
                                });
                            }
                        });
                });
            },

            _crossSell_editRow: function (row, callback) {
                this.Forms.crossSellOverlay.clear();

                this.Forms.crossSellOverlay.val('internal-name', row.internal_name);

                this.controller().listProducts(null, (products) => {
                    $('#products-available')
                        .empty();
                    for (let product of products) {
                        if (!row.options_json.products.includes(+product.id)) {
                            $('#products-available').append(
                                `<option value="${product.id}">${product.id} - ${product.text}</option>`);
                        }
                    }

                    $('#products-selected')
                        .empty();
                    for (let product of row.options_json.products) {
                        $('#products-selected').append(
                            `<option value="${product}">${product} - ${this._getProductText(products, product)}</option>`);
                    }

                    this._child('cross-sell-overlay')
                        .activateGroup('edit')
                        .show((result) => {
                            if (result.status === 'ok') {
                                callback({
                                    internal_name: this.Forms.crossSellOverlay.val('internal-name'),
                                    options_json: {
                                        products: $('#cross-sell-overlay').find('[name="products-selected"] > option').toArray().map(
                                            element => +element.getAttribute('value')
                                        )
                                    }
                                });
                                //setTimeout(() => {document.location.reload()}, 500);
                            }
                        });
                });
            },

            _productAvailable_dblclick: function (event) {
                if (event.target.nodeName === 'OPTION') {
                    $('#cross-sell-overlay').find('[name="products-selected"]').append(
                        $(event.target).prop('selected', false));
                }
            },

            _productSelected_dblclick: function (event) {
                if (event.target.nodeName === 'OPTION') {
                    $('#cross-sell-overlay').find('[name="products-available"]').append(
                        $(event.target).prop('selected', false));
                }
            },


            /* PRIVATE */
            _getProductText: function (products, id) {
                for (let product of products) {
                    if (+product.id === +id) {
                        return product.text;
                    }
                }

                return false;
            }
        });

        Host.create(AdminCrossSellController, AdminCrossSellView);
    });
}(HeO2, jQuery));

