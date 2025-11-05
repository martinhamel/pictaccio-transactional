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

        const AdminOrderController = Controller.extend({
            init: function(host, options) {
                this._super(host, {});
            },

            comment: function(response, data, callback) {
                "server[url:/=/admin/b839b495-33a6-4e69-b2bd-9132006f59bd/comment,method:post]";

                if (typeof callback === 'function') {
                    callback(response);
                }
            },

            upload: function(response, data, callback) {
                "server[url:/=/admin/b839b495-33a6-4e69-b2bd-9132006f59bd/upload,method:post]";

                if (typeof callback === 'function') {
                    callback(response);
                }
            },

            uploads_confirm: function(response, data, callback) {
                "server[url:/=/admin/b839b495-33a6-4e69-b2bd-9132006f59bd/uploads_confirm,method:post]";

                if (typeof callback === 'function') {
                    callback(response);
                }
            },

            uploads_delete: function(response, data, callback) {
                "server[url:/=/admin/b839b495-33a6-4e69-b2bd-9132006f59bd/uploads_delete,method:post]";

                if (typeof callback === 'function') {
                    callback(response);
                }
            },

            /* PRIVATE */
        });


        /* VIEW */
        const AdminOrderView = View.extend({
            NAME: 'default',

            init: function(host) {
                this._super(host, {
                    target: '#admin-orders-view',
                    components: [
                        {
                            name: 'Forms',
                            options: {
                                targets: [{selector: '#print-tags-product-selector'},  {selector: '#new-comment'}]
                            }
                        }, {
                            name: 'Uploads',
                            ref: 'OrderUploads',
                            options: {
                                accept: 'image/*',
                                drophint: '#upload',
                                trigger: '#order-browse-trigger',
                                multiple: true
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

                $('#predefined-to').change(this._predefinedTo_change.bind(this));
            },

            _configureOrderUploads: function() {
                this.OrderUploads.on('adding-file', (event) => {
                    event.keep(event.senderId);
                });

                this.OrderUploads.on('render-gallery-icon', (event) => {
                    if (typeof event.file === 'string') {
                        event.render($(`<div><img src="${serverUrl + event.file}"></div>`), '#upload-images');
                        $('#order-upload-trigger').addClass('uploadable');
                    } else {
                        this.OrderUploads.asDataUrl(event.file, (dataUrl) => {
                            event.render($(`<div><img src="${dataUrl}"></div>`) , '#upload-images');
                            $('#order-upload-trigger').addClass('uploadable');
                        });
                    }
                })
                    .callbacks({
                        renderIcon: (icon, gallery) => {
                            $(gallery).append(icon);
                        }
                    });
            },


            /* EVENT HANDLERS */
            _comment_click: function() {
                const comment = this.Forms.newComment.list();

                if (comment.name && comment.text) {
                    this.controller().comment({id: orderId, ...comment}, (response) => {
                        this.feedback($.i18n('GENERIC_SENT'), $.i18n('GENERIC_INFO'), 'check-circle');
                        window.location.reload();
                    });
                }
            },

            _delete_click: function(event) {
                this.controller().uploads_delete({order_id: orderId}, (response) => {
                    $('#upload').removeClass('state-has-uploads');
                    $('#upload-images').empty();
                    $('#order-upload-trigger').removeClass('uploadable');
                });
            },

            _predefinedTo_change: function(event) {
                const target = $(event.target);
                const to = $('[name="to"]');
                to.val(target.val());
            },

            _printTags: function() {
                const productIds = $('#print-tags-product-selector').find('input[type="checkbox"]').toArray()
                    .map(i => [$(i).attr('name'), $(i).prop('checked')])
                    .filter(([i, v]) => v)
                    .map(([i, v]) => i);
                window.location.href =
                    `/admin/b839b495-33a6-4e69-b2bd-9132006f59bd/print_product_label/${orderId}/${productIds.join(',')}`;
            },

            _sendConfirmation_click: function(event) {
                this.controller().uploads_confirm({order_id: orderId}, (response) => {
                    this.feedback($.i18n('GENERIC_SENT'), $.i18n('GENERIC_INFO'), 'check-circle');
                });
            },

            _showPrintTags_click: function() {
                $('#print-tags-product-selector').toggleClass('show');
            },

            _upload_click: function(event) {
                this.controller().upload({order_id: orderId, ...this.OrderUploads.files()}, (response) => {
                    $('#upload').addClass('state-has-uploads');
                });
            }

            /* PRIVATE */

        });

        Host.create(AdminOrderController, AdminOrderView);
    });
}(HeO2, jQuery, window.location));
