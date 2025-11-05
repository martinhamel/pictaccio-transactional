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

        const AdminPromoController = Controller.extend({
            init: function(host, options) {
                this._super(host, {});
            },

            shippingSave: function(response, data, callback) {
                "server[url:+=shipping_save,method:post]";

                debugger;
            },

            /* PRIVATE */
        });


        /* VIEW */
        const AdminPromoView = View.extend({
            NAME: 'default',

            init: function(host) {
                this._super(host, {
                    target: '#admin-promo',
                    components: [
                        {
                            name: 'Forms',
                            options: {
                                targets: [{selector: '#promo-code-campaign-overlay'}, {selector: '#promo-shipping-form'}]
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

                this._child('promo-code-campaign-table')
                    .registerFieldRenderHelpers(
                        (name, value) => {
                            if (name === '__actions') {
                                return {
                                    html: $('<i class="far fa-ellipsis-h">').on('click', this._details_click.bind(this)),
                                    edit: () => {}
                                }
                            }
                        }
                    );

            },


            /* EVENT HANDLERS */
            _details_click: function(event) {
                let id = $(event.target).parents('[data-dbtable-id]').attr('data-dbtable-id');
                location.href = `${campaignUrl}/${id}`
            },

            _productCodeCampaign_addRow: function(callback) {
                this.Forms.promoCodeCampaignOverlay.clear();

                this._child('promo-code-campaign-overlay')
                    .activateGroup('add')
                    .show((result) => {
                        if (result.status === 'ok') {
                            callback({
                                internal_name: this.Forms.promoCodeCampaignOverlay.val('internal-name'),
                                code_prefix: this.Forms.promoCodeCampaignOverlay.val('code-prefix'),
                                options_json: {
                                    amount: this.Forms.promoCodeCampaignOverlay.val('amount')
                                }
                            });
                        }
                    });
            },

            _productCodeCampaign_editRow: function(row, callback) {
                this.Forms.promoCodeCampaignOverlay.clear();

                this.Forms.promoCodeCampaignOverlay.val('internal-name', row.internal_name);
                this.Forms.promoCodeCampaignOverlay.val('code-prefix', row.code_prefix);
                this.Forms.promoCodeCampaignOverlay.val('amount', row.options_json.amount);

                this._child('promo-code-campaign-overlay')
                    .activateGroup('edit')
                    .show((result) => {
                        if (result.status === 'ok') {
                            callback({
                                internal_name: this.Forms.promoCodeCampaignOverlay.val('internal-name'),
                                code_prefix: this.Forms.promoCodeCampaignOverlay.val('code-prefix'),
                                options_json: {
                                    amount: this.Forms.promoCodeCampaignOverlay.val('amount')
                                }
                            });
                        }
                    });
            },

            _shippingSave_click: function(event) {
                event.preventDefault();

                this.controller().shippingSave({
                    enabled: this.Forms.promoShippingForm.val('enabled') == true,
                    threshold_amount: this.Forms.promoShippingForm.val('threshold-amount')
                });
            },
            
            /* PRIVATE */
            
        });
        Host.create(AdminPromoController, AdminPromoView);
    });
}(HeO2, jQuery, window.location));

