/*
 * HeO2_legacy - Proprietary RAD Web Framework
 * Copyright © 2015-2019, Heliox - All Right Reserved
 */

function admin_loaded() {
    "use strict";

    (function(global, HeO2_legacy, $) {
        new (HeO2_legacy.Client.extend({
            _SERVER_CONFIG: {
                addDelivery: {},
                editDelivery: {},
                removeDelivery: {},
                addGroup: {},
                editGroup: {},
                removeGroup: {}
            },


            _deliveryActionGroups: null,
            _deliveryForm: null,
            _deliveryGrid: null,
            _deliveryOptionsProps: null,
            _deliveryOverlay: null,
            _deliveryProperties: null,
            _editing: {
                id: null,
                row: null
            },
            _groupActionGroups: null,
            _groupForm: null,
            _groupGrid: null,
            _groupOverlay: null,

            init: function() {
                this._super();

                this._retrieveDeliveryOptionsProps();
                this._attach();
                this._createDeliveryGrid();
                this._createAddEditOverlay();
                this._createGroupGrid();
                this._createGroupOverlay();
            },


            /* EVENT HANDLERS */
            _addDelivery_click: function(event) {
                this._deliveryOverlay.close();
                this._server.execute('addDelivery', this._deliveryForm.list());
            },

            _addGroup_click: function(event) {
                this._groupOverlay.close();
                this._server.execute('addGroup', this._groupForm.list());
            },

            _edit_click: function(id, current, row, event) {
                this._deliveryActionGroups.show('edit');

                this._deliveryForm.val('method', current[4].value);
                $('#method').change();

                this._deliveryForm.val('name-fra', current[1].meta.original.fra);
                this._deliveryForm.val('name-eng', current[1].meta.original.eng);
                this._deliveryForm.val('lead-time', current[2].value);
                this._deliveryForm.val('base-price', current[3].value);
                this._deliveryForm.val('delivery-option-properties', current[5].meta.original);

                this._deliveryOverlay.show();
                this._editing.id = id;
                this._editing.row = row;
            },

            _editGroup_click: function(id, current, row, event) {
                this._groupActionGroups.show('edit');
                this._groupForm.val('group-name-fra', current[1].meta.original.fra);
                this._groupForm.val('group-name-eng', current[1].meta.original.eng);
                this._groupForm.val('delivery-options', current[2].value.split(','));
                this._groupOverlay.show();
                this._editing.id = id;
                this._editing.row = row;
            },

            _editDelivery_click: function(event) {
                var values = this._deliveryForm.list();
                values.id = this._editing.id;
                this._server.execute('editDelivery', values, null, {row: this._editing.row});
                this._deliveryOverlay.close();
            },

            _editGroupButton_click: function(event) {
                var values = this._groupForm.list();
                values.id = this._editing.id;
                this._server.execute('editGroup', values, null, {row: this._editing.row});
                this._groupOverlay.close();
            },

            _method_change: function(event) {
                this._deliveryProperties.setOptions({
                    properties: this._deliveryOptionsProps[$(event.target).val()]
                });
                this._deliveryProperties.toggle('general');
            },

            _openAddDelivery_click: function(event) {
                this._deliveryActionGroups.show('add');
                this._deliveryForm.clear();
                this._deliveryOverlay.show();
            },

            _openAddGroup_click: function(event) {
                this._groupActionGroups.show('add');
                this._groupForm.clear();
                this._groupOverlay.show();
            },

            _remove_click: function(id, row, event) {
                this._talk('modal-message', {
                    title: $.i18n('GENERIC_CONFIRM'),
                    text: $.i18n('MESSAGE_CONFIRM_DELETE'),
                    buttons: 'yesno',
                    close: function(event) {
                        if (event.result === 'yes') {
                            this._server.execute('removeDelivery', {
                                id: id,
                                row: row
                            }, null, {row: row});
                        }
                    }.bind(this)
                });
            },

            _removeGroup_click: function(id, row, event) {
                this._talk('modal-message', {
                    title: $.i18n('GENERIC_CONFIRM'),
                    text: $.i18n('MESSAGE_CONFIRM_DELETE'),
                    buttons: 'yesno',
                    close: function(event) {
                        if (event.result === 'yes') {
                            this._server.execute('removeGroup', {
                                id: id,
                                row: row
                            }, null, {row: row});
                        }
                    }.bind(this)
                });
            },

            _server_addSuccess: function(event) {
                var doc = this._deliveryGrid.getDocument();
                var lastIndex = doc.getSize().height();
                doc.changeRow([event.responseData.id,
                    'Francais: ' + event.requestData['name-fra'] + ' | ' +
                    'English: ' + event.requestData['name-eng'],
                    event.requestData['lead-time'],
                    event.requestData['base-price'],
                    event.requestData.method], lastIndex);

                global.location.reload();
            },

            _server_addGroupSuccess: function(event) {
                var doc = this._groupGrid.getDocument();
                var lastIndex = doc.getSize().height();
                doc.changeRow([event.responseData.id,
                    'Francais: ' + event.requestData['group-name-fra'] + ' | ' +
                    'English: ' + event.requestData['group-name-eng']], lastIndex);

                global.location.reload();
            },

            _server_editSuccess: function(event) {
                this._deliveryGrid.getDocument()
                    .changeRow([
                        'Francais: ' + event.requestData['name-fra'] + ' | ' +
                        'English: ' + event.requestData['name-eng'],
                        event.requestData['lead-time'],
                        event.requestData['base-price'],
                        event.requestData.method], event.custom.row, 1);

                global.location.reload();
            },

            _server_editGroupSuccess: function(event) {
                this._groupGrid.getDocument()
                    .changeRow([
                        'Francais: ' + event.requestData['group-name-fra'] + ' | ' +
                        'English: ' + event.requestData['group-name-eng']], event.custom.row, 1);
                global.location.reload();
            },

            _server_removeSuccess: function(event) {
                this._deliveryGrid.getDocument().deleteRow(event.requestData.row);
            },

            _server_removeGroupSuccess: function(event) {
                this._groupGrid.getDocument().deleteRow(event.requestData.row);
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
                    .on('addDelivery-success', this._server_addSuccess.bind(this))
                    .on('addDelivery-error', this._server_error.bind(this))
                    .on('editDelivery-success', this._server_editSuccess.bind(this))
                    .on('editDelivery-error', this._server_error.bind(this))
                    .on('removeDelivery-success', this._server_removeSuccess.bind(this))
                    .on('removeDelivery-error', this._server_error.bind(this))
                    .on('addGroup-success', this._server_addGroupSuccess.bind(this))
                    .on('addGroup-error', this._server_error.bind(this))
                    .on('editGroup-success', this._server_editGroupSuccess.bind(this))
                    .on('editGroup-error', this._server_error.bind(this))
                    .on('removeGroup-success', this._server_removeGroupSuccess.bind(this))
                    .on('removeGroup-error', this._server_error.bind(this));

                $('#open-add-delivery-options-overlay-button').click(this._openAddDelivery_click.bind(this));
                $('#add-delivery-options-button').click(this._addDelivery_click.bind(this));
                $('#edit-delivery-options-button').click(this._editDelivery_click.bind(this));
                $('#open-add-group-overlay-button').click(this._openAddGroup_click.bind(this));
                $('#add-group-button').click(this._addGroup_click.bind(this));
                $('#edit-group-button').click(this._editGroupButton_click.bind(this));
                var $method = $('#method').change(this._method_change.bind(this));
                Object.keys(this._deliveryOptionsProps).forEach(function(option) {
                    $method.append(
                        $('<option></option>')
                            .text(option)
                            .attr('value', option)
                    );
                });
            },

            _createAddEditOverlay: function() {
                this._deliveryOverlay = new HeO2_legacy.UI.ModalOverlay({
                    width: '500px',
                    height: '580px',
                    callbacks: {
                        contentDraw: function($context) {
                            $context.append($('#delivery-options-overlay').show());
                        }
                    }
                });
                this._deliveryActionGroups = HeO2_legacy.UI.Group.create({target: '#delivery-options-overlay'});
                this._deliveryProperties = HeO2_legacy.UI.PropertiesEditor.create({target: '#delivery-option-properties'});
                this._deliveryForm = HeO2_legacy.Form.create({target: '#delivery-options-overlay'});
            },

            _createGroupOverlay: function() {
                this._groupOverlay = new HeO2_legacy.UI.ModalOverlay({
                    width: '500px',
                    height: '360px',
                    callbacks: {
                        contentDraw: function($context) {
                            $context.append($('#group-overlay').show());
                        }
                    }
                });
                this._groupActionGroups = new HeO2_legacy.UI.Group({target: '#group-overlay'});
                this._groupForm = new HeO2_legacy.Form({target: '#group-overlay'});
            },

            _createDeliveryGrid: function() {
                this._deliveryGrid = new HeO2_legacy.Grid({debug: HeO2_legacy.CONST.DEBUG});
                this._deliveryGrid
                    .addView('main', 'custom-static', {
                        target: '#delivery-options-grid',
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
                    .open(this._retrieveDeliveryTableData(), 'application/cakephp-records');
            },

            _createGroupGrid: function() {
                this._groupGrid = new HeO2_legacy.Grid({debug: HeO2_legacy.CONST.DEBUG});
                this._groupGrid
                    .addView('main', 'custom-static', {
                        target: '#group-grid',
                        callbacks: {
                            beforeRow: function(params) {
                                params.$tr
                                    .append(
                                        $('<td></td>')
                                            .append(
                                                $('<a></a>')
                                                    .addClass('action-link')
                                                    .text($.i18n('GENERIC_CHANGE'))
                                                    .click(this._editGroup_click.bind(
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
                                                    .click(this._removeGroup_click.bind(this, params.rowData[0].value, params.row))
                                            )
                                    );
                            }.bind(this)
                        }
                    })
                    .open(this._retrieveGroupTableData(), 'application/cakephp-records');
            },

            _retrieveDeliveryTableData: function() {
                return $('#DATA-deliveryOptionsTable').text() || '{}';
            },

            _retrieveDeliveryOptionsProps: function() {
                this._deliveryOptionsProps =
                    JSON.parse($('#DATA-deliveryOptionProps').text() || '{}');
            },

            _retrieveGroupTableData: function() {
                return $('#DATA-groupTable').text() || '{}';
            }
        }));
    }(window, HeO2_legacy, jQuery));
}
