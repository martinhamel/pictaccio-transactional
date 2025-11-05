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
            },

            updateFeaturedStatus: function(response, data, callback) {
                "server[url:+=updateFeaturedStatus,method:post]";
            }

            /* PRIVATE */
        });


        /* VIEW */
        const AdminBackgroundView = View.extend({
            NAME: 'default',

            init: function(host) {
                this._super(host, {
                    target: '#admin-backgrounds',
                    components: [
                        {
                            name: 'Forms',
                            options: {
                                targets: [{selector: '#background-category-overlay'}, {selector: '#background-overlay'}]
                            }
                        },
                        {
                            name: 'Uploads',
                            ref: 'BackgroundUploads',
                            options: {
                                accept: 'image/*',
                                drophint: '.background-images-dropzone',
                                trigger: '#background-browse-trigger'
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

                this._child('background-table')
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
                        },
                        (name, value) => {
                            if (name === 'featured') {
                                return {
                                    html: $(`<input type="checkbox" ${value ? 'checked' : ''}>`)
                                        .change((event) => {
                                            let id = $(event.target).parents('[data-dbtable-id]').attr('data-dbtable-id');
                                            this.controller().updateFeaturedStatus({
                                                id: id,
                                                featured: Number($(event.target).prop('checked'))
                                            });
                                        }),
                                    edit: () => {
                                    }
                                };
                            }
                        },
                        (name, value) => {
                            if (name === 'image') {
                                return {
                                    html: `<img src="${serverUrl + value}">`,
                                    edit: () => {}
                                }
                            }
                        }
                    );

                this._child('background-category-table').on('data-ready', () => {
                        this._child('categories').setDataSource(
                            this._child('background-category-table').dataset().view({
                                get: (target, prop) => {
                                    let arrayify = () => {
                                        let arr = [];
                                        for (let row of target.rows) {
                                            arr.push(row.name_locale_json.fra);
                                            arr.push(row.name_locale_json.eng);
                                        }
                                        return arr;
                                    };

                                    if (prop === 'includes') {
                                        let arr = arrayify();
                                        return arr.includes.bind(arr);
                                    }

                                    if (prop === 'length') {
                                        return arrayify().length;
                                    }
                                    if (prop === Symbol.iterator) {
                                        let arr = arrayify();
                                        return arr[Symbol.iterator].bind(arr);
                                    }

                                    if (helpers.isNumeric(prop)) {
                                        return arrayify()[parseInt(prop, 10)];
                                    }
                                }
                            })
                        );
                    });
            },

            _configureBackgroundUploads: function() {
                this.BackgroundUploads.on('adding-file', (event) => {
                    this.BackgroundUploads.clear();
                    event.keep(event.senderId);
                });

                this.BackgroundUploads.on('render-gallery-icon', (event) => {
                    if (typeof event.file === 'string') {
                        event.render($('<img>').attr('src', serverUrl + event.file), '#background-img-container');
                    } else {
                        this.BackgroundUploads.asDataUrl(event.file, (dataUrl) => {
                            $('#background-img-container').empty();
                            event.render($('<img>').attr('src', dataUrl), '#background-img-container');
                        });
                    }
                })
                .callbacks({
                    renderIcon: (icon, gallery) => {
                        $('#background-img-container').empty().append(icon);
                    }
                });
            },


            /* EVENT HANDLERS */
            _background_addRow: function(callback) {
                this.Forms.backgroundOverlay.clear();
                this.BackgroundUploads.clear();
                this._child('background-overlay')
                    .activateGroup('add')
                    .show((result) => {
                        if (result.status === 'ok') {
                            callback({
                                number: this.Forms.backgroundOverlay.val('number'),
                                name_locale_json: {
                                    fra: this.Forms.backgroundOverlay.val('fra'),
                                    eng: this.Forms.backgroundOverlay.val('eng')
                                },
                                tags_json: this._categoriesToId(this.Forms.backgroundOverlay.val('categories')),
                                image: this.BackgroundUploads.files()[0]
                            });
                        }
                    });
            },

            _background_editRow: function(row, callback) {
                this.Forms.backgroundOverlay.clear();
                this.BackgroundUploads.clear();

                this.Forms.backgroundOverlay.val('number', row.number);
                this.Forms.backgroundOverlay.val('fra', row.name_locale_json.fra);
                this.Forms.backgroundOverlay.val('eng', row.name_locale_json.eng);
                this.Forms.backgroundOverlay.val('categories', this._idToCategories(row.tags_json));
                this.BackgroundUploads.restore(row.image);

                this._child('background-overlay')
                    .activateGroup('edit')
                    .show((result) => {
                        if (result.status === 'ok') {
                            callback({
                                number: this.Forms.backgroundOverlay.val('number'),
                                name_locale_json: {
                                    fra: this.Forms.backgroundOverlay.val('fra'),
                                    eng: this.Forms.backgroundOverlay.val('eng')
                                },
                                tags_json: this._categoriesToId(this.Forms.backgroundOverlay.val('categories')),
                                image: this.BackgroundUploads.files()[0]
                            });
                            //setTimeout(() => {document.location.reload()}, 500);
                        }
                    });
            },

            _backgroundCategories_addRow: function(callback) {
                this.Forms.backgroundCategoryOverlay.clear();
                this._child('background-category-overlay')
                    .activateGroup('add')
                    .show((result) => {
                        if (result.status === 'ok') {
                            callback({
                                name_locale_json: {
                                    fra: this.Forms.backgroundCategoryOverlay.val('fra'),
                                    eng: this.Forms.backgroundCategoryOverlay.val('eng')
                                }
                            });
                        }
                    });
            },

            _backgroundCategories_editRow: function(row, callback) {
                this.Forms.backgroundCategoryOverlay.clear();
                this.Forms.backgroundCategoryOverlay.val('fra', row.name_locale_json.fra);
                this.Forms.backgroundCategoryOverlay.val('eng', row.name_locale_json.eng);

                this._child('background-category-overlay')
                    .activateGroup('edit')
                    .show((result) => {
                        if (result.status === 'ok') {
                            callback({
                                name_locale_json: {
                                    fra: this.Forms.backgroundCategoryOverlay.val('fra'),
                                    eng: this.Forms.backgroundCategoryOverlay.val('eng')
                                }
                            });
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

