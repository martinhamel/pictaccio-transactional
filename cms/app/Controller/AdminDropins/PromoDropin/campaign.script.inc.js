/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2015-2019, Heliox - All Right Reserved
 */

(function(HeO2, $, location) {
    "use strict";

    HeO2.ready(() => {
        const Host = HeO2.require('HeO2.Host');
        const Controller = HeO2.require('HeO2.Controller');
        const View = HeO2.require('HeO2.View');
        const helpers = HeO2.require('HeO2.common.helpers');
        const config = HeO2.require('HeO2.config');

        const AdminPromoCodeController = Controller.extend({
            init: function(host, options) {
                this._super(host, {});
            },

            createSeries: function(response, data, callback) {
                "server[url:/=/admin/5f080cda-d297-11eb-b8bc-0242ac130003/createSeries,method:post]";

            },

            setCategory: function(response, data, callback) {
                "server[url:/=/admin/5f080cda-d297-11eb-b8bc-0242ac130003/setCategory,method:post]";

            }

            /* PRIVATE */
        });


        /* VIEW */
        const AdminPromoCodeView = View.extend({
            NAME: 'default',

            init: function(host) {
                this._super(host, {
                    target: '#admin-promo-codes',
                    components: [
                        {
                            name: 'Forms',
                            options: {
                                targets: [{selector: '#create-series-overlay'}]
                            }
                        }
                    ]
                });

                if (HeO2.DEBUG) {
                    HeO2._DEBUG.adminView = this;
                }
            },


            /* LIFECYCLE */
            _attach: function() {
                this._super();

                $('#hide-used').prop('checked', document.location.href.endsWith('/hide'));
            },


            /* EVENT HANDLERS */
            _categories_change: function(event) {
                this.controller().setCategory({
                    id: campaignId,
                    'category-id': $(event.target).val()
                });
            },

            _createSeries_click: function(event) {
                this.Forms.createSeriesOverlay.clear();

                this._child('create-series-overlay')
                    .show();
            },

            _createSeriesOk_click: function(event) {
                this._child('create-series-overlay').hide();

                this.controller().createSeries({
                        campaign_id: campaignId,
                        count: this.Forms.createSeriesOverlay.val('count')
                    }, (response) => {
                        debugger;
                    });
            },

            _hideUsed_change: function(event) {
                let shouldHide = $(event.currentTarget).is(':checked');
                let hidden = document.location.href.endsWith('/hide');

                if (shouldHide && hidden) {
                    // Do nothing
                } else if (shouldHide) {
                    document.location.href += '/hide';
                } else if (!shouldHide && !hidden) {
                    // Do nothing
                } else if (hidden) {
                    document.location.href = document.location.href.substr(0, document.location.href.length - 5);
                }
            }

            /* PRIVATE */

        });
        Host.create(AdminPromoCodeController, AdminPromoCodeView);
    });
}(HeO2, jQuery, window.location));

