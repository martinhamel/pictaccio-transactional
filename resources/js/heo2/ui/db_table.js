(function(HeO2, $) {
    "use strict";

    const UIHost = HeO2.require('HeO2.UIHost');
    const Dataset = HeO2.require('HeO2.utils.Dataset');
    const helpers = HeO2.require('HeO2.common.helpers');
    const logger = HeO2.require('HeO2.common.logger');

    const DbTableController = UIHost.Controller.extend({
        init: function(host, options) {
            this._super(host);

            this._currentLocation = location.origin + location.pathname;
            this._sortHelpers = {};
            this._filterHelpers = [];

            this._ready = false;
            this._heedReadiness();
        },

        columnFriendlyName: function(column) {
            return column in this.data().friendlyNames ? this.data().friendlyNames[column] : column;
        },

        data: function() {
            return this._data.data;
        },

        dataset: function() {
            "export";

            return this._data;
        },

        findId: function(id) {
            for (let row of this.data().rows) {
                if (+row.id === id) {
                    return row;
                }
            }

            return undefined;
        },

        refreshRows: function() {
            "export";

            let rows;

            rows = this.data().__unwrap.rows.filter(
                i => this._filterHelpers.reduce((a, h) => h(i) && a, true));
            this.activeView().renderRows(rows);

            this.host().emit('data-ready');
        },

        /**
         * Register a field render helper
         * @param helper {function} (name, value) => {}
         */
        registerFieldRenderHelpers: function(helpers) {
            "export";

            if (arguments.length > 1) {
                helpers = arguments;
            }
            if (typeof helpers[Symbol.iterator] !== 'function') {
                helpers = [helpers];
            }

            for (let helper of helpers) {
                this.activeView().fieldRenderHelperUnshift(helper);
            }

            return this;
        },

        registerFieldSortHelper: function(column, helper) {
            "export";

            if (this._sortHelpers[column] !== undefined) {
                throw new Error(`Sort helper for column '${column}' already exist`);
            }

            this._sortHelpers[column] = helper;

            return this;
        },

        registerFilterHelper: function(helper) {
            "export";

            this._filterHelpers.push(helper);
        },

        setUrl: function(url) {
            if (url) {
                this._url = this._resolveUrl(url);
            }
        },

        sort(column, direction) {
            this._data._data.rows.sort((a, b) => {
                let aValue, bValue;

                if (helpers.isNumeric(a[column]) && helpers.isNumeric(b[column])) {
                    aValue = +a[column];
                    bValue = +b[column];
                } else {
                    aValue = a[column];
                    bValue = b[column];
                }

                if (this._sortHelpers[column] !== undefined) {
                    [aValue, bValue] = this._sortHelpers[column](aValue, bValue);
                }

                if (aValue == bValue) {
                    return 0;
                } else if (aValue < bValue) {
                    return direction === 'asc' ? -1 : 1;
                } else if (bValue < aValue) {
                    return direction === 'asc' ? 1 : -1;
                }
            });

            this.refreshRows();
        },

        triggerAddRow: function() {
            if (this._url) {
                this.host().emit('add-row', (data) => {
                    if (data) {
                        this._postOperation(data, 'add', (row) => {
                            this.data().rows.push(row);
                            this.activeView().insertRow(row);
                        });
                    }
                });
            } else {
                logger.warn('DbTable: No add url set');
            }
        },

        triggerEditRow: function(id) {
            if (this._url) {
                let editRow = this.findId(id);

                this.host().emit('edit-row', editRow, (data) => {
                    data.id = data.id || +editRow.id;
                    this._postOperation(data, 'edit', (row) => {
                        for (const dataRow of this.data().rows.__unwrap) {
                            if (dataRow.id == editRow.id) {
                                Object.keys(row).forEach(fieldName => {dataRow[fieldName] = row[fieldName]});
                                break;
                            }
                        }
                        this.activeView().refresh();
                    });
                });
            }
        },


        /* PRIVATE */
        _heedReadiness: function() {
            this.host().on('ready', () => {
                if (!this._ready && this._readData()) {
                    this._ready = true;
                    this.activeView().renderTableFrame();
                    this.refreshRows();
                }
            });
        },

        _postOperation: function(data, operation, callback) {
            let postForm = new FormData();
            postForm.append('__operation', operation);

            for (let prop of Object.keys(data)) {
                if (data[prop] instanceof File) {
                    postForm.append(`${prop}_file`, data[prop], data[prop].name);
                    postForm.append(`fields[${prop}]`, `___file___|${data[prop]._heo2_id}`);
                } else if (Array.isArray(data[prop]) && data[prop][0] instanceof File) {
                    for (let i = 0, length = data[prop].length; i < length; ++i) {
                        postForm.append(`${prop}_file_${i}`, data[prop][i], data[prop][i].name);
                        postForm.append(`fields[${prop}][${i}]`, `___file___|${data[prop][i]._heo2_id}`);
                    }
                } else {
                    postForm.append(`fields[${prop}]`, this._prepareFormValue(data[prop]));
                }
            }

            $.ajax({
                method: 'post',
                url: this._url,
                processData: false,
                contentType: false,
                cache: false,
                data: postForm,
                success: (response) => {
                    if (response.status === 'ok') {
                        let row = Object.keys(response.results).reduce(
                            (acc, field) => {
                                acc[field] = field.endsWith('_json') && typeof response.results[field] === 'string' ?
                                    JSON.parse(response.results[field]) :
                                    response.results[field];
                                return acc;
                            }, Object.create(null)
                        );

                        if (typeof callback === 'function') {
                            callback(row);
                        }
                    } else if (response.status === 'failed') {
                        this.activeView().feedback($.i18n('ERROR_SERVER_COMM_FAILED') +
                            `<br>${response.message || $.i18n('ERROR_SERVER_UNKNOWN')}`);
                    }
                },
                error: (error) => {
                    console.log(`DbTable: Error inserting row: ${error.responseText}`);
                }
            });
        },

        _prepareFormValue: function(value) {
            switch (typeof value) {
            case 'boolean':
                return value ? 'true' : false;

            case 'number':
            case 'string':
                return value;

            default:
                return JSON.stringify(value);
            }
        },

        _readData: function() {
            let data = this.activeView()._targetNode.find('script').text();
            let hide = (this.activeView().options()['hide'] || '').split(',');

            if (data === '') {
                logger.error('DbTable: No data found');
                return false;
            }

            data = JSON.parse(data);
            for (let hideColumn of hide) {
                delete data.columns[hideColumn];
            }

            this._data = new Dataset(data);
            return true;
        },

        _resolveUrl: function(url) {
            if (url &&	/^\+=/.test(url)) {
                url = this._currentLocation + (url[2] !== '/' ? '/' : '') + url.substr(2);
            } else {
                url = serverUrl + url;
            }

            return url;
        },
    });

    const VIEW_DEFAULT_OPTIONS = {
        target: null
    };
    const DbTableView = UIHost.View.extend({
        NAME: 'default',

        init: function(host, options) {
            this._super(host);
            this._options = helpers.merge(true, VIEW_DEFAULT_OPTIONS, options, this._options);
            this._prepareFieldRenderHelpers();
            this._registerCommonFieldSortHelpers();

            this._sortColumn = 'id';
            this._sortDirection = 'asc';
        },

        fieldRenderHelperUnshift: function(helper) {
            this._fieldRenderHelpers.unshift(helper);
        },

        insertRow: function(row) {
            let idData = row.id ? ` data-dbtable-id="${row.id}"` : '';
            let actions = this._renderField('__actions');
            let rowNode = $(`<tr${idData}></tr>`)
                .append(
                    this._options.edit ? $(`<td class="row-actions"><i class="far fa-edit" data-id="${row.id}"></i></td>`).append(actions.html) : ''
                )
                .append(
                    Object.keys(this.controller().data().columns).reduce((acc, fieldName) => {
                        let fieldRender = this._renderField(fieldName, row[fieldName]);

                        acc.push(
                            $(`<td class="field_${fieldName}"></td>`)
                                .append(fieldRender.html)
                                .data('edit-func', fieldRender.edit)
                        );
                        return acc;
                    }, [])
                );

            row.__rowNode = rowNode;
            this._tableNode.append(rowNode);
        },

        refresh: function() {
            this._targetNode.find('.db-table-container').detach();
            this.renderTableFrame();
            this.renderRows();
        },

        refreshRows: function() {
            this._targetNode.find('tr:not(:first-child)').detach();
            this.renderRows();
        },

        renderTableFrame: function() {
            let containerNode = $('<div class="db-table-container"></div>');
            let columns = this.controller().data().columns;
            let tableNode = $('<table></table>')
                .append($('<tr></tr>')
                    .on('click', 'th', this._header_click.bind(this))
                    .append(
                        this._options.edit ? '<th></th>' : ''
                    )
                    .append(
                        Object.keys(columns).reduce((acc, column) => {
                            acc.push($(
                                `<th name="${column}">${this.controller().columnFriendlyName(column)}<i class="fa fa-chevron-up ${column === 'id' ? 'visible' : ''}"></i></th>`));
                            return acc;
                        }, [])
                    ));

            containerNode.append(
                $('<div class="controls"></div>')
                    .append([
                        $('<button class="add-row"><i class="fa fa-plus"></i></button>').click(this._addRowButton_click.bind(this))
                    ])

                );
            containerNode.append(tableNode);

            this._targetNode.append(containerNode);
            this._tableNode = tableNode
                .on('click', 'td.row-actions i:first-child', this._editRow_click.bind(this));

            return this;
        },

        renderRows: function(rows = this.controller().data().rows) {
            this._targetNode.find('tr[data-dbtable-id]').detach();

            for (let row of rows) {
                this.insertRow(row);
            }

            return this;
        },


        /* LIFECYCLE */
        _attach: function() {
            this.controller().setUrl(this._options.url);
            this._targetNode = $(this._options.target);

            this._super();
        },


        /* EVENT HANDLERS */
        _addRowButton_click: function() {
            this.controller().triggerAddRow();
        },

        _editRow_click: function(event) {
            if (event.target.attributes['data-id'] === undefined) {
                logger.error('Missing attribute data-id');
                logger.log(event.target);
                return;
            }

            let id = +event.target.attributes['data-id'].value;
            if (isNaN(id) && this.controller().data().rows[id] === undefined) {
                logger.error('ID non-existant or invalid');
                logger.log(event.target);
                return;
            }

            this.controller().triggerEditRow(id);
        },

        _header_click: function(event) {
            let target = $(event.target);
            let columnId;

            if (target[0].nodeName !== 'TH') {
                columnId = target.parents('th').attr('name');
            } else {
                columnId = target.attr('name');
            }

            if (columnId !== this._sortColumn) {
                this._targetNode.find('th i').removeClass('visible');
                $(`[name="${columnId}"] i`)
                    .removeClass('fa-chevron-down')
                    .addClass('fa-chevron-up')
                    .addClass('visible');
                this._sortColumn = columnId;
                this._sortDirection = 'asc';
            } else {
                if (this._sortDirection === 'asc') {
                    this._sortDirection = 'desc';
                    $(`[name="${columnId}"] i`)
                        .removeClass('fa-chevron-up')
                        .addClass('fa-chevron-down');
                } else {
                    this._sortDirection = 'asc';
                    $(`[name="${columnId}"] i`)
                        .removeClass('fa-chevron-down')
                        .addClass('fa-chevron-up');
                }
            }

            this.controller().sort(this._sortColumn, this._sortDirection);
        },

        /* PRIVATE */
        _prepareFieldRenderHelpers: function() {
            this._fieldRenderHelpers = [
                // _locale_json
                (name, value) => {
                    if (name.endsWith('_locale_json')) {
                        /*if (typeof value === 'string') {
                            value = JSON.parse(value);
                        }*/

                        return {
                            html: Object.keys(value).reduce((acc, langCode) => {
                                acc.append(`<li><span style="opacity: .6">${langCode}</span> ${value[langCode]}</li>`);
                                return acc;
                            }, $('<ul></ul>')),
                            edit: () => {

                            }
                        }
                    }
                },

                // _json
                (name, value) => {
                    if (name.endsWith('_json') && helpers.isObject(value)) {
                        return {
                            html: this._renderJson(value),
                            edit: () => {}
                        }
                    }
                }
            ];
        },

        _registerCommonFieldSortHelpers: function() {
            this.controller().registerFieldSortHelper('name_locale_json', (a, b) => {
                return [a[HeO2.config.read('Config.language')], b[HeO2.config.read('Config.language')]];
            });
            this.controller().registerFieldSortHelper('description_locale_json', (a, b) => {
                return [a[HeO2.config.read('Config.language')], b[HeO2.config.read('Config.language')]];
            });
        },

        _renderJson: function(json) {
            if (typeof json === 'string') {
                json = JSON.parse(json);
            }

            if (Array.isArray(json)) {
                json = json.map((item) => {
                    if (typeof item === 'object') {
                        return this._renderJson(item);
                    }
                    return item;
                });
                return json.join(', ');
            } else {
                return Object.keys(json).reduce((acc, key) => {
                    acc += `<span>${key}</span>${json[key]}`;
                    return acc;
                }, '');
            }
        },

        _renderField: function(name, value) {
            for (let helper of this._fieldRenderHelpers) {
                let result = helper(name, value);
                if (result) {
                    return result;
                }
            }

            return {
                html: value,
                edit: () => {

                }
            }
        },

        _sort: function() {

        }
    });

    HeO2.UI.DbTable = UIHost.extend({
        init: function(host, element) {
            this._super(host, element, [DbTableController, {constructor: DbTableView, options: {target: element}}]);
        }
    });
}(HeO2, jQuery));
