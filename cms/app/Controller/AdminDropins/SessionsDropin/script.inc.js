/*
 * HeO2_legacy - Proprietary RAD Web Framework
 * Copyright © 2015-2019, Heliox - All Right Reserved
 */

function admin_loaded() {
    "use strict";

    (function(HeO2_legacy, $, global) {
        new (HeO2_legacy.Client.extend({
            /* FIELDS */
            _SERVER_CONFIG: {
                add: {},
                edit: {},
                remove: {}
            },

            _$sessionOverlayGroupAdd: null,
            _$sessionOverlayGroupEdit: null,
            _$sessionTextFra: null,
            _$sessionTextEng: null,
            _sessionActionGroups: null,
            _sessionForm: null,
            _sessionOverlay: null,
            _sessionGrid: null,
            _editing: {
                id: null,
                row: null
            },

            /* PUBLIC */
            init: function() {
                this._super();

                this._createAddEditOverlay();
                this._createSessionGrid();
                this._attach();
            },


            /* EVENT HANDLERS */
            _addSession_click: function(event) {
                this._sessionOverlay.close();

                if (!/^#?[A-F0-9]{3,6}/i.test($('#color').val())) {
                    return false;
                }

                this._server.execute('add', this._sessionForm.list());
            },

            _category_change: function(event) {
                var $selected = $(event.target).children(':selected');
                if ($selected.length) {
                    var values = JSON.parse($selected.attr('data-values'));
                    this._sessionForm.val('product-groups', values.productGroups);
                    this._sessionForm.val('delivery-option-groups', values.deliveryOptionGroups);
                    $('#product-groups option').each(function(index, option) {
                        var $option = $(option);
                        this._setInherit($option, $option.is(':selected'));
                    }.bind(this));
                    $('#delivery-option-groups option').each(function(index, option) {
                        var $option = $(option);
                        this._setInherit($option, $option.is(':selected'));
                    }.bind(this));
                }
            },

            _color_keyup: function(event) {
                let color = $('#color').val();

                if (color[0] !== '#') {
                    color = '#' + color;
                }

                $('#session-color').css('background-color', color);
            },

            _edit_click: function(id, current, row, event) {
                this._sessionActionGroups.show('edit');
                this._sessionForm.clear();
                $('#session-color').css('background-color', 'transparent');

                this._sessionForm.val('name-fra', current[4].meta.original.fra);
                this._sessionForm.val('name-eng', current[4].meta.original.eng);
                this._sessionForm.val('date', current[2].value);
                this._sessionForm.val('expiration-date', current[3].value);
                this._sessionForm.val('categories', current[1].value);
                this._sessionForm.val('cross-sell', current[5].meta?.original?.crossSell)
                this._sessionForm.val('product-groups', current[5].meta?.original?.productGroups);
                this._sessionForm.val('delivery-option-groups', current[5].meta?.original?.deliveryOptionGroups);
                this._sessionForm.val('color', current[5].meta?.original?.color);
                $('#color').keyup();

                Object.keys(current[5].meta.original.productGroups).forEach(function(index) {
                    this._setInherit(
                        $('#product-groups').children('option[value="' + index + '"]'),
                        ['on', 'true'].indexOf(current[5].meta.original.productGroups[index].inherit) !== -1
                    );
                }.bind(this));
                Object.keys(current[5].meta.original.deliveryOptionGroups).forEach(function(index) {
                    this._setInherit(
                        $('#delivery-option-groups').children('option[value="' + index + '"]'),
                        ['on', 'true'].indexOf(current[5].meta.original.deliveryOptionGroups[index].inherit) !== -1
                    );
                }.bind(this));
                this._sessionOverlay.show();
                this._editing.id = id;
                this._editing.row = row;
            },

            _editSession_click: function(event) {
                var values = this._sessionForm.list();
                values.id = this._editing.id;

                if (!/^#?[A-F0-9]{3,6}/i.test($('#color').val())) {
                    return false;
                }

                this._server.execute('edit', values, null, {row: this._editing.row});
                this._sessionOverlay.close();
            },

            _inherit_click: function(event) {
                var $option = $(event.target);
                if (event.offsetX < 24) { // Click on before pseudo-element
                    this._setInherit($option, $option.attr('data-value-inherit') !== 'on');
                    event.preventDefault();
                } else {
                    this._setInherit($option, false);
                    //event.originalEvent.ctrlKey = true;
                }
            },

            _openAddSession_click: function(event) {
                this._sessionActionGroups.show('add');
                this._sessionForm.clear();
                $('#session-color').css('background-color', 'transparent');

                $('#product-groups option').each(function(index, option) {
                    this._setInherit($(option), false);
                }.bind(this));
                $('#delivery-option-groups option').each(function(index, option) {
                    this._setInherit($(option), false);
                }.bind(this));
                this._sessionOverlay.show();
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
                var doc = this._sessionGrid.getDocument();
                var lastIndex = doc.getSize().height();
                doc.changeRow([event.responseData.id, event.requestData['categories'],
                    'Francais: ' + event.requestData['name-fra'] + ' | ' +
                    'English: ' + event.requestData['name-eng'],
                    event.requestData['date']], lastIndex);

                global.location.reload();
            },

            _server_editSuccess: function(event) {
                this._sessionGrid.getDocument()
                    .changeCell(
                        'Francais: ' + event.requestData['name-fra'] + ' | ' +
                        'English: ' + event.requestData['name-eng'], null, event.custom.row, 2
                    )
                    .changeCell(event.requestData['date'], null, event.custom.row, 3);

                global.location.reload();
            },

            _server_removeSuccess: function(event) {
                this._sessionGrid.getDocument().deleteRow(event.requestData.row);
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

                $('#color').keyup(this._color_keyup.bind(this));
                $('#open-add-session-overlay-button').click(this._openAddSession_click.bind(this));
                $('#add-session-button').click(this._addSession_click.bind(this));
                $('#edit-session-button').click(this._editSession_click.bind(this));
                $('#categories').change(this._category_change.bind(this));
                $('#product-groups option')
                    .mousedown(this._inherit_click.bind(this))
                    .addClass('inherit-off');
                $('#delivery-option-groups option')
                    .mousedown(this._inherit_click.bind(this))
                    .addClass('inherit-off');

                this._$sessionOverlayGroupAdd = $('.group-add');
                this._$sessionOverlayGroupEdit = $('.group-edit');
                this._$sessionTextFra = $('#session-fra');
                this._$sessionTextEng = $('#session-eng');
            },

            _createAddEditOverlay: function() {
                this._sessionOverlay = new HeO2_legacy.UI.ModalOverlay({
                    width: '500px',
                    height: '475px',
                    callbacks: {
                        contentDraw: function($context) {
                            $context.append($('#session-overlay').show());
                        }
                    }
                });
                this._sessionActionGroups = new HeO2_legacy.UI.Group({target: '#session-overlay'});
                this._sessionForm = new HeO2_legacy.Form({target: '#session-overlay'});
            },

            _createSessionGrid: function() {
                this._sessionGrid = new HeO2_legacy.Grid({debug: HeO2_legacy.CONST.DEBUG});
                this._sessionGrid
                    .addView('main', 'custom-static', {
                        target: '#session-grid',
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
                                                    .css('color', '#aaa')
                                                    .click(this._remove_click.bind(this, params.rowData[0].value, params.row))
                                            )
                                    );
                            }.bind(this)
                        }
                    })
                    .open(this._retrieveSessionsTableData(), 'application/cakephp-records');
            },

            _retrieveSessionsTableData: function() {
                return $('#DATA-sessionsTable').text() || '{}';
            },

            _setInherit: function($option, inherit) {
                $option
                    .attr('data-value-inherit', inherit ? 'on' : 'off')
                    .addClass(inherit ? 'inherit-on' : 'inherit-off')
                    .removeClass(inherit ? 'inherit-off' : 'inherit-on');

            }
        }));
    }(HeO2_legacy, jQuery, window));
}
