/*
 * HeO2_Old - Proprietary RAD Web Framework
 * Copyright © 2015-2019, Heliox - All Right Reserved
 */

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

            filter: function(response, data, callback) {
                "server[url:+=filter,method:post]";

                if (response.status === 'ok') {
                    this.activeView().renderOrderTable(response.orders);
                }
            },
            filter_complete: function() {
                $('#loading-spinner').hide();
            }

            /* PRIVATE */
        });


        /* VIEW */
        const AdminOrderView = View.extend({
            NAME: 'default',

            init: function(host) {
                this._super(host, {
                    target: '#admin-orders',
                    components: [
                        {
                            name: 'Forms',
                            options: {
                                targets: [{selector: '#filters'}]
                            }
                        }
                    ]
                });

                if (HeO2.DEBUG) {
                    HeO2._DEBUG.adminView = this;
                }
            },

            renderOrderTable: function(orders) {
                let rowElements = [];
                let lastId = null;

                this._child('result-count').text(orders.length);
                
                for (let i = 0, length = orders.length; i < length; ++i) {
                    if (orders[i]['Order']['id'] !== lastId) {
                        rowElements.push($('<tr data-id="' + orders[i]['Order']['id'] + '"><td class="order-check"><input type="checkbox"></td>' +
                            '<td class="order-id">' + orders[i]['Order']['id'] + '</td>' +
                            '<td class="order-name">' + this._filterTableItem(orders[i]['Contact']['name']) + '</td>' +
                            '<td class="order-total">' + orders[i]['Order']['total_cost'] + '</td>' +
                            '<td class="order-date">' + orders[i]['Order']['created'] + '</td>' +
                            '<td class="order-session">' + orders[i]['Session']['name_locale'] + '</td>' +
                            '<td class="order-delivery-option">' + orders[i]['DeliveryOption']['name_locale'] + '</td>' +
                            '<td class="order-transaction-code">' +
                            this._filterTableItem(orders[i]['Transaction'].length ? orders[i]['Transaction'][orders[i]['Transaction'].length - 1]['transaction_code'] : null) + '</td></tr>'
                            )
                        );
                        lastId = orders[i]['Order']['id'];
                    }
                }

                $('#orders-table tbody').empty().append(rowElements);
            },


            /* LIFECYCLE */
            _attach: function() {
                this._super();

                $('#orders-table').on('click', 'tbody td:not(.order-check)', this._row_click.bind(this));
                $('#orders-table').on('change', 'input[type="checkbox"]', this._select_change.bind(this));
                $('#orders-table th').on('click', this._sortColumn_click.bind(this));

                this._child('delivery-options').setDataSource(this._readDeliveryOptions());
                this._child('sessions').setDataSource(this._readSessions());
            },


            /* EVENT HANDLERS */
            _applyFilter_click: function(event) {
                $('#loading-spinner').show();
                this.controller().filter(this.Forms.filters.list());
            },

            _checkAll_change: function(event) {
                let checked = 0;
                let checkboxes = $('#orders-table tbody input[type="checkbox"]');
                let checking = false;

                checkboxes.each(function(index, element) {
                    if ($(element).prop('checked')) {
                        ++checked;
                    }
                });

                checking = checkboxes.length / 2 > checked;
                checkboxes.prop('checked', checking).change();
                $('#check-all').prop('checked', checking);
            },

            _exportContacts_click: function(event) {
                let ids = this._getCheckboxes();

                if (ids.length) {
                    $('#export-contacts-form input[name="selection"]').val(JSON.stringify(ids));
                    $('#export-contacts-form').submit();
                }
            },

            _printLabels_click: function(event) {
                let ids = this._getCheckboxes();

                if (ids.length) {
                    $('#print-labels-form input[name="selection"]').val(JSON.stringify(ids));
                    $('#print-labels-form').submit();
                }
            },

            _printSelection_click: function(event) {
                let ids = this._getCheckboxes();

                if (ids.length) {
                    $('#print-selection-form input[name="selection"]').val(JSON.stringify(ids));
                    $('#print-selection-form').submit();
                }
            },

            _sortColumn_click: function(event) {
                let target = $(event.target);
                let columnId;

                if (target[0].nodeName !== 'TH') {
                    columnId = target.parents('th').attr('id');
                } else {
                    columnId = target.attr('id');
                }

                if (['order-check', 'order-transaction-code'].includes(columnId)) {
                    return;
                }

                if (columnId !== $('#sort-column').val()) {
                    $('#orders-table th i').css('visibility', 'hidden');
                    $(`#${columnId} i`)
                        .removeClass('fa-chevron-down')
                        .addClass('fa-chevron-up')
                        .css('visibility', 'visible');
                    $('#sort-column').val(columnId);
                    $('#sort-direction').val('asc');
                } else {
                    if ($('#sort-direction').val() === 'asc') {
                        $('#sort-direction').val('desc');
                        $(`#${columnId} i`)
                            .removeClass('fa-chevron-up')
                            .addClass('fa-chevron-down');
                    } else {
                        $('#sort-direction').val('asc');
                        $(`#${columnId} i`)
                            .removeClass('fa-chevron-down')
                            .addClass('fa-chevron-up');
                    }
                }

                this._applyFilter_click();
            },

            _row_click: function(event) {
                location.href = location.protocol + '//' + location.host + '/' +
                    (serverUrl[0] === '/' ? serverUrl.substring(1) : serverUrl) + 'admin/b839b495-33a6-4e69-b2bd-9132006f59bd/view/' +
                    $(event.currentTarget).parents('tr').attr('data-id');
            },

            _select_change: function(event) {
                let checkbox = $(event.currentTarget);

                checkbox.parents('tr').toggleClass('selected', checkbox.prop('checked'));
            },


            /* PRIVATE */
            _getCheckboxes: function() {
                let checkboxes = $('#orders-table tbody input[type="checkbox"]');
                let ids = [];

                checkboxes.each(function(index, element) {
                    element = $(element);
                    if (element.prop('checked')) {
                        ids.push(parseInt(element.parents('tr').attr('data-id'), 10));
                    }
                });

                return ids;
            },

            _filterTableItem: function(string) {
                if (string === 'null' || string === null || string === 'n/a' || string === undefined) {
                    return '--';
                }

                return string;
            },

            _readDeliveryOptions: function() {
                return JSON.parse($('#DATA-delivery-options').text() || '[]');
            },

            _readSessions: function() {
                return JSON.parse($('#DATA-sessions').text() || '[]');
            }
        });

        Host.create(AdminOrderController, AdminOrderView);
    });
}(HeO2, jQuery, window.location));
