/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2015-2019, Heliox - All Right Reserved
 */

(function(HeO2, $) {
    "use strict";

    HeO2.ready(() => {
        const Host = HeO2.require('HeO2.Host');
        const Controller = HeO2.require('HeO2.Controller');
        const View = HeO2.require('HeO2.View');
        const helpers = HeO2.require('HeO2.common.helpers');
        const config = HeO2.require('HeO2.config');

        const AdminBackgroundController = Controller.extend({
            init: function(host, options) {
                this._super(host, {});
            },

            update: function(response, data, callback) {
                "server[url:+=update,method:get]";
            }

            /* PRIVATE */
        });


        /* VIEW */
        const AdminBackgroundView = View.extend({
            NAME: 'default',

            init: function(host) {
                this._super(host, {
                    target: '#admin-build-your-own',
                    components: [
                        {
                            name: 'Forms',
                            options: {
                                targets: [{selector: '#build-your-own-overlay'}]
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

                this._child('build-your-own-table')
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
            _buildYourOwn_addRow: function(callback) {
                this.Forms.buildYourOwnOverlay.clear();

                this._child('build-your-own-overlay')
                    .activateGroup('add')
                    .show((result) => {
                        if (result.status === 'ok') {
                            callback({
                                internal_name: this.Forms.buildYourOwnOverlay.val('internal-name'),
                                options_json: {
                                    choices: this.Forms.buildYourOwnOverlay.val('choices').split('\n'),
                                    choices_count: this.Forms.buildYourOwnOverlay.val('choices-count')
                                }
                            });
                        }
                    });
            },

            _buildYourOwn_editRow: function(row, callback) {
                this.Forms.buildYourOwnOverlay.clear();

                this.Forms.buildYourOwnOverlay.val('internal-name', row.internal_name);
                this.Forms.buildYourOwnOverlay.val('choices', row.options_json.choices.join('\n'));
                this.Forms.buildYourOwnOverlay.val('choices-count', row.options_json.choices_count);

                this._child('build-your-own-overlay')
                    .activateGroup('edit')
                    .show((result) => {
                        if (result.status === 'ok') {
                            callback({
                                internal_name: this.Forms.buildYourOwnOverlay.val('internal-name'),
                                options_json: {
                                    choices: this.Forms.buildYourOwnOverlay.val('choices').split('\n'),
                                    choices_count: this.Forms.buildYourOwnOverlay.val('choices-count')
                                }
                            });
                            //setTimeout(() => {document.location.reload()}, 500);
                        }
                    });
            },

            _updateBackgroundStaticButton_click: function() {
                this.controller().update();
            },


            /* PRIVATE */
            _categoriesToId: function(categories) {
                let ids = [];

                for (let category of categories) {
                    for (let row of this._child('background-category-table').dataset().data.rows) {
                        if (category.toLowerCase() === row.name_locale_json.fra.toLowerCase() || category.toLowerCase() === row.name_locale_json.eng.toLowerCase()) {
                            ids.push(+row.id);
                            break;
                        }
                    }
                }

                return ids;
            },

            _idToCategories: function(ids) {
                let categories = this._child('background-category-table').dataset().data.rows;

                return categories.__unwrap
                    .filter(item => ids.includes(+item.id))
                    .map(item => {return {id: item.id, text: item.name_locale_json[config.read('Config.language')]}});
            }
        });

        Host.create(AdminBackgroundController, AdminBackgroundView);
    });
}(HeO2, jQuery));

