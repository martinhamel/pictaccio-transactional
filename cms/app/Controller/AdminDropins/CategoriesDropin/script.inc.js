/*
 * HeO2_legacy - Proprietary RAD Web Framework
 * Copyright © 2015-2019, Heliox - All Right Reserved
 */

function admin_loaded() {
    "use strict";

    (function(global, HeO2_legacy, $) {
        new (HeO2_legacy.Client.extend({
            /* FIELDS */
            _SERVER_CONFIG: {
                add: {},
                edit: {},
                remove: {}
            },

            _categoryActionGroups: null,
            _categoryForm: null,
            _categoryOverlay: null,
            _categoryGrid: null,
            _editing: {
                id: null,
                row: null
            },

            /* PUBLIC */
            init: function() {
                this._super();

                this._createAddEditOverlay();
                this._createBackgroundGrid();
                this._attach();
            },


            /* EVENT HANDLERS */
            _addBackground_click: function(event) {
                this._server.execute('add', this._categoryForm.list());
                this._categoryOverlay.close();
            },

            _edit_click: function(id, current, row, event) {
                this._categoryActionGroups.show('edit');
                this._categoryForm.val('fra', current[1].meta.original.fra);
                this._categoryForm.val('eng', current[1].meta.original.eng);
                this._categoryForm.val('product-groups', current[2].meta.original.productGroups);
                this._categoryForm.val('delivery-option-groups', current[2].meta.original.deliveryOptionGroups);
                this._categoryOverlay.show();
                this._editing.id = id;
                this._editing.row = row;
            },

            _editBackground_click: function(event) {
                var values = this._categoryForm.list();
                values.id = this._editing.id;
                this._server.execute('edit', values, null, {row: this._editing.row});
                this._categoryOverlay.close();
            },

            _openAddBackground_click: function(event) {
                this._categoryActionGroups.show('add');
                this._categoryForm.clear();
                this._categoryOverlay.show();
            },

            _remove_click: function(id, row, event) {
                this._talk('modal-message', {
                    title: $.i18n('GENERIC_CONFIRM'),
                    text: $.i18n('MESSAGE_CONFIRM_DELETE'),
                    buttons: 'yesno',
                    close: function(event) {
                        if (event.result === 'yes') {
                            this._server.execute('remove', {
                                id: id,
                                row: row
                            }, null, {row: row});
                        }
                    }.bind(this)
                });
            },

            _server_addSuccess: function(event) {
                var doc = this._categoryGrid.getDocument();
                var lastIndex = doc.getSize().height();
                doc.changeRow([event.responseData.id,
                    'Francais: ' + event.requestData.fra + ' | ' +
                    'English: ' + event.requestData.eng], lastIndex);

                global.location.reload();
            },

            _server_editSuccess: function(event) {
                this._categoryGrid.getDocument()
                    .changeCell(
                        'Francais: ' + event.requestData.fra + ' | ' +
                        'English: ' + event.requestData.eng, null, event.custom.row, 1)
                    .changeCell(null, {
                        original: {
                            productGroups: event.requestData['product-groups'],
                            deliveryOptionGroups: event.requestData['delivery-option-groups']
                        }
                    }, event.custom.row, 2);

                global.location.reload();
            },

            _server_removeSuccess: function(event) {
                this._categoryGrid.getDocument().deleteRow(event.requestData.row);
            },

            _server_error: function(event) {
                this._talk('modal-message', {
                    title: $.i18n('ERROR_TITLE'),
                    text: $.i18n('ERROR_SERVER_COMM_FAILED')
                });
            },


            /* PRIVATE */
            _attach: function() {
                this._server
                    .on('add-success', this._server_addSuccess.bind(this))
                    .on('add-error', this._server_error.bind(this))
                    .on('edit-success', this._server_editSuccess.bind(this))
                    .on('edit-error', this._server_error.bind(this))
                    .on('remove-success', this._server_removeSuccess.bind(this))
                    .on('remove-error', this._server_error.bind(this));

                $('#open-add-category-overlay-button').click(this._openAddBackground_click.bind(this));
                $('#add-category-button').click(this._addBackground_click.bind(this));
                $('#edit-category-button').click(this._editBackground_click.bind(this));
            },

            _createAddEditOverlay: function() {
                this._categoryOverlay = new HeO2_legacy.UI.ModalOverlay({
                    width: '500px',
                    height: '380px',
                    callbacks: {
                        contentDraw: function($context) {
                            $context.append($('#category-overlay').show());
                        }
                    }
                });

                this._categoryActionGroups = new HeO2_legacy.UI.Group({target: '#category-overlay'});
                this._categoryForm = new HeO2_legacy.Form({target: '#category-overlay'});
            },

            _createBackgroundGrid: function() {
                this._categoryGrid = new HeO2_legacy.Grid({debug: HeO2_legacy.CONST.DEBUG});
                this._categoryGrid
                    .addView('main', 'custom-static', {
                        target: '#categories-grid',
                        callbacks: {
                            beforeRow: function(params) {
                                params.$tr
                                    .append(
                                        $('<td></td>')
                                            .append(
                                                $('<a></a>')
                                                    .addClass('action-link')
                                                    .text($.i18n('GENERIC_CHANGE'))
                                                    .click(this._edit_click.bind(
                                                        this, params.rowData[0].value, params.rowData, params.row)
                                                    )
                                            )
                                    )
                                    .append(
                                        $('<td></td>')
                                            .append(
                                                $('<a></a>')
                                                    .addClass('action-link')
                                                    .text($.i18n('GENERIC_REMOVE'))
                                                    .click(this._remove_click.bind(this, params.rowData[0].value, params.row))
                                            )
                                    );
                            }.bind(this)
                        }
                    })
                    .open(this._retrieveCategoriesTableData(), 'application/cakephp-records');
            },

            _retrieveCategoriesTableData: function() {
                return $('#DATA-categoriesTable').text() || '{}';
            }
        }));
    }(window, HeO2_legacy, jQuery));
}
