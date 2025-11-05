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
        const sha1 = HeO2.require('HeO2.vendor.sha1');
        const helpers = HeO2.require('HeO2.common.helpers');

        const ProductController = Controller.extend({
            init: function(host, options) {
                this._super(host, {});
            },

            listBYOPInternalNames: function(response, data, callback) {
                "server[url:+=listBYOPInternalNames,method:get]";

                if (response.status === 'ok') {
                    callback(response.results);
                }
            },

            listCategoryInternalNames: function(response, data, callback) {
                "server[url:+=listCategoryInternalNames,method:get]";

                if (response.status === 'ok') {
                    callback(response.results);
                }
            }
        });


        const SLIDING_PRICE_REGEX = /^(?:\d+(?:\.\d{1,2}){0,1}(?:,|$))+/;

        /* VIEW */
        const ProductView = View.extend({
            NAME: 'default',

            init: function(host) {
                this._super(host, {
                    target: '#admin-products',
                    components: [
                        {
                            name: 'Forms',
                            options: {
                                targets: [{selector: '#product-overlay'},
                                          {selector: '#product-group-overlay'},
                                          {selector: '#product-category-overlay'}]
                            }
                        },
                        {
                            name: 'Uploads',
                            ref: 'ProductUploads',
                            options: {
                                accept: 'image/*',
                                drophint: '#product-img-container',
                                trigger: '#product-browse-trigger'
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

                this._child('product-table')
                    .registerFieldRenderHelpers(
                        (name, value) => {
                            if (name === 'price') {
                                return {
                                    html: `$${parseFloat(value).toFixed(2)}`,
                                    edit: () => {}
                                };
                            }
                        },
                        (name, value) => {
                            if (name === 'images_json') {
                                return {
                                    html: value && Object.keys(value).reduce((acc, id) => {
                                        acc += `<img src="${serverUrl + value[id]}">`;
                                        return acc;
                                    }, ''),
                                    edit: () => {}
                                }
                            }
                        },
                        (name, value) => {
                            if (name === 'themes') {
                                try {
                                    value = Object.values(JSON.parse(value));
                                    return {
                                        html: value.reduce((acc, theme) => {
                                            acc += `${acc !== '' ? '<br>' : ''}${theme.replace(/ /g, '&nbsp;')}`;
                                            return acc;
                                        }, ''),
                                        edit: () => {
                                        }
                                    }
                                } catch (e) {

                                }
                            }
                        }
                    );

                this._child('product-table').registerFilterHelper(
                    (item) => {
                        return $('[name="categories"]').val() === '' ?
                            true :
                            +$('[name="categories"]').val() === +item.options_json.category;
                    }
                )
                this._child('product-table').registerFilterHelper(
                    (item) => {
                        const val = this._child('product-tags-filter').val();
                        return val.length === 0 ?
                            true :
                            !Array.isArray(item.options_json.product_tags) ?
                                false :
                                val.reduce((a, i) => item.options_json.product_tags.includes(i) && a, true);
                    }
                )

                this._child('product-table').on('data-ready', () => {
                    this._child('product-tags').setDataSource(
                        this._child('product-table').dataset().view({
                            get: (target, prop) => {
                                const arrayify = () => {
                                    return target.rows.reduce((array, row) => {
                                        if (!helpers.isEmpty(row.options_json.product_tags) &&
                                                Array.isArray(row.options_json.product_tags)) {
                                            array = array.concat(
                                                row.options_json.product_tags.filter(
                                                    i => !array.includes(i)
                                                ));
                                        }

                                        return array;
                                    }, []);
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

                    this._child('product-tags-filter').setDataSource(
                        this._child('product-table').dataset().view({
                            get: (target, prop) => {
                                const arrayify = () => {
                                    return target.rows.reduce((array, row) => {
                                        if (!helpers.isEmpty(row.options_json.product_tags) &&
                                            Array.isArray(row.options_json.product_tags)) {
                                            array = array.concat(
                                                row.options_json.product_tags.filter(
                                                    i => !array.includes(i)
                                                ));
                                        }

                                        return array;
                                    }, []);
                                };

                                if (prop === 'includes') {
                                    let arr = arrayify();
                                    return arr.includes.bind(arr);
                                }

                                if (prop === 'length') {
                                    return arrayify().length;
                                }
                                if (prop === 'reduce') {
                                    let arr = arrayify();
                                    return arr.reduce.bind(arr);
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


                $('[name="products-selected"]')
                    .mousemove(this._selectedProduct_mousemove.bind(this))
                    .on('mousedown', 'option', this._selectedProduct_mousedown.bind(this))
                    .mouseup(this._selectedProduct_mouseup.bind(this));
                $('#drag-hint').mouseup(this._selectedProduct_mouseup.bind(this));
            },

            _configureProductUploads: function() {
                this.ProductUploads.on('adding-file', (event) => {
                    event.keep(event.senderId);
                });

                this.ProductUploads.on('render-gallery-icon', (event) => {
                        if (typeof event.file === 'string') {
                            event.render($(`<div><img src="${serverUrl + event.file}"></div>`)
                                    .append($(`<input type="radio" name="default" value="${event.fileId}" />`))
                                    .append($(`<select class="__theme_selects" data-id="${event.fileId}"></select>`).change(this._themeSelects_change.bind(this)))
                                , '#product-img-container');
                        } else {
                            this.ProductUploads.asDataUrl(event.file, (dataUrl) => {
                                event.render(
                                    $(`<div><img src="${dataUrl}"></div>`)
                                        .append($(`<input type="radio" name="default" value="${event.fileId}" />`))
                                        .append($(`<select class="__theme_selects" data-id="${event.fileId}"></select>`).change(this._themeSelects_change.bind(this)))
                                    , '#product-img-container');

                                setImmediate(() => {
                                    this._updateThemeSelects();
                                });
                            });
                        }
                    })
                    .callbacks({
                        renderIcon: (icon, gallery) => {
                            $(gallery).find('.placeholder').before(icon);
                        }
                    });
            },


            /* EVENT HANDLERS */
            _applyFilter_click: function(event) {
                this._child('product-table').refreshRows();
            },

            _buildYourOwn_click: function(event) {
                let enable = $(event.target).prop('checked');

                $('#build-your-own-package-ref').prop('disabled', !enable);
                $('#allow-mix').prop('disabled', enable);
                $('#sliding-price').prop('disabled', enable);
            },

            _digitalImageCheckbox_click: function(event) {
                $('#digital-image-price').prop('disabled', !$(event.target).prop('checked'));
            },

            _touchupsCheckbox_click: function(event) {
                $('#touchups-price').prop('disabled', !$(event.target).prop('checked'));
            },

            _product_addRow: function(callback) {
                this.Forms.productOverlay.clear();
                this.ProductUploads.clear();
                $('#product-img-container').children('div:not(.placeholder)').detach();

                Promise.all([
                    helpers.promisify(this.controller().listCategoryInternalNames)(null),
                    helpers.promisify(this.controller().listBYOPInternalNames)(null)
                ]).then((test) => {
                    let byopInternalNames = test[1];
                    let categoryInternalNames = test[0];

                    $('#build-your-own-package-ref')
                        .empty()
                        .append('<option value="null"></option>');
                    for (let internalName of byopInternalNames) {
                        $('#build-your-own-package-ref').append(`<option value="${internalName.id}">${internalName.text}</option>`);
                    }

                    $('#product-category')
                        .empty()
                        .append('<option></option>');
                    for (let internalName of categoryInternalNames) {
                        $('#product-category').append(`<option value="${internalName.id}">${internalName.text}</option>`);
                    }

                    this._child('product-overlay')
                        .activateGroup('add')
                        .show((result) => {
                            if (result.status === 'ok') {
                                let price = this.Forms.productOverlay.val('price');
                                if (this.Forms.productOverlay.val('sliding-price')) {
                                    if (!SLIDING_PRICE_REGEX.test(price)) {
                                        alert('Price scale is invalid');
                                        return;
                                    }
                                    price = price.split(',')[0]
                                }

                                callback({
                                    name_locale_json: {
                                        fra: this.Forms.productOverlay.val('name-fra'),
                                        eng: this.Forms.productOverlay.val('name-eng')
                                    },
                                    description_locale_json: {
                                        fra: this.Forms.productOverlay.val('desc-fra'),
                                        eng: this.Forms.productOverlay.val('desc-eng')
                                    },
                                    weight: this.Forms.productOverlay.val('weight'),
                                    price,
                                    images_json: this.ProductUploads.files(),
                                    themes_json: this.Forms.productOverlay.val('themes').reduce((acc, item) => {
                                        acc[sha1(item)] = item;
                                        return acc;
                                    }, Object.create(null)),
                                    themes_map_json: this.Forms.productOverlay.val('themes-map'),
                                    options_json: {
                                        allow_mix: this.Forms.productOverlay.val('allow-mix'),
                                        use_price_scale: this.Forms.productOverlay.val('sliding-price'),
                                        allow_group_picture: this.Forms.productOverlay.val('allow-group-picture'),
                                        only_group_picture: (this.Forms.productOverlay.val('allow-group-picture') ? this.Forms.productOverlay.val('only-group-picture') : false),
                                        price_scale: this.Forms.productOverlay.val('price').split(','),
                                        default_image: $('#product-img-container').find('input:checked').length ?
                                            $('#product-img-container').find('input:checked').val() :
                                            $('#product-img-container').find('input:first').attr('value'),
                                        category: this.Forms.productOverlay.val('product-category'),
                                        buildYourOwn: this.Forms.productOverlay.val('build-your-own-package-ref'),
                                        digitalImage: this.Forms.productOverlay.val('digital-image-price') === true ?
                                            this.Forms.productOverlay.val('digital-image-price') :
                                            undefined,
                                        touchups: this.Forms.productOverlay.val('touchups-price') === true ?
                                            this.Forms.productOverlay.val('touchups-price') :
                                            undefined,
                                        product_tags: this.Forms.productOverlay.val('product-tags')
                                    }
                                });
                            }
                        });
                });
            },

            _product_editRow: function(row, callback) {
                this.Forms.productOverlay.clear();
                $('select[name="themes"]').empty();

                this.Forms.productOverlay.val('name-fra', row.name_locale_json.fra);
                this.Forms.productOverlay.val('name-eng', row.name_locale_json.eng);
                this.Forms.productOverlay.val('desc-fra', row.description_locale_json.fra);
                this.Forms.productOverlay.val('desc-eng', row.description_locale_json.eng);
                this.Forms.productOverlay.val('weight', row.weight);
                this.Forms.productOverlay.val('price', row.price);
                this.Forms.productOverlay.val('themes', Object.values(row.themes_json));
                this.Forms.productOverlay.val('themes_map', row.themes_map_json);
                this.Forms.productOverlay.val('allow-mix', row.options_json.allow_mix);
                this.Forms.productOverlay.val('allow-group-picture', row.options_json.allow_group_picture);
                this.Forms.productOverlay.val('only-group-picture', row.options_json.only_group_picture);
                this.Forms.productOverlay.val('sliding-price', row.options_json.use_price_scale);
                this.Forms.productOverlay.val('product-tags', row.options_json.product_tags);
                $('#build-your-own-package').prop('checked', false);
                if (row.options_json.buildYourOwn != 'null') {
                    $('#build-your-own-package').click();
                }

                if (row.options_json.use_price_scale) {
                    this.Forms.productOverlay.val('price', row.options_json.price_scale.join(', '));
                }

                if (row.options_json.digitalImage != undefined) {
                    $('#digital-image')
                        .click();
                    this.Forms.productOverlay.val('digital-image-price', row.options_json.digitalImage);
                }
                if (row.options_json.touchups != undefined) {
                    $('#touchups')
                        .click();
                    this.Forms.productOverlay.val('touchups-price', row.options_json.touchups);
                }

                this.ProductUploads.clear();
                $('#product-img-container').children('div:not(.placeholder)').detach();
                this.ProductUploads.restore(row.images_json);
                this._updateThemeSelects();

                let imageRadioElement = $('#product-img-container').find(`input[value="${row.options_json.default_image}"]`);
                if (imageRadioElement.length > 0) {
                    imageRadioElement.prop('checked', true);
                } else {
                    $('#product-img-container').find('input:first').prop('checked', true);
                }

                if (row.themes_map_json) {
                    Object.entries(row.themes_map_json).forEach(([imageId, themeId]) => {
                        $(`#product-img-container select[data-id="${imageId}"]`)
                            .find(`option[value="${themeId}"]`).prop('selected', true);
                    });
                }

                Promise.all([
                    helpers.promisify(this.controller().listCategoryInternalNames)(null),
                    helpers.promisify(this.controller().listBYOPInternalNames)(null)
                ]).then((test) => {
                    let byopInternalNames = test[1];
                    let categoryInternalNames = test[0];

                    $('#build-your-own-package-ref')
                        .empty()
                        .append('<option value="null"></option>');
                    for (let internalName of byopInternalNames) {
                        $('#build-your-own-package-ref').append(`<option value="${internalName.id}" ${internalName.id === row.options_json.category ? 'selected' : ''}>${internalName.text}</option>`);
                    }
                    this.Forms.productOverlay.val('build-your-own-package-ref', row.options_json.buildYourOwn);
                    
                    $('#product-category')
                        .empty()
                        .append('<option></option>');
                    for (let internalName of categoryInternalNames) {
                        $('#product-category').append(
                            `<option value="${internalName.id}" ${internalName.id === row.options_json.category ? 'selected' : ''}>${internalName.text}</option>`);
                    }

                    this._child('product-overlay')
                        .activateGroup('edit')
                        .show((result) => {
                            if (result.status === 'ok') {
                                let price = this.Forms.productOverlay.val('price');
                                if (this.Forms.productOverlay.val('sliding-price')) {
                                    if (!SLIDING_PRICE_REGEX.test(price)) {
                                        alert('Price scale is invalid');
                                        return;
                                    }
                                    price = price.split(',')[0]
                                }

                                callback({
                                    name_locale_json: {
                                        fra: this.Forms.productOverlay.val('name-fra'),
                                        eng: this.Forms.productOverlay.val('name-eng')
                                    },
                                    description_locale_json: {
                                        fra: this.Forms.productOverlay.val('desc-fra'),
                                        eng: this.Forms.productOverlay.val('desc-eng')
                                    },
                                    weight: this.Forms.productOverlay.val('weight'),
                                    price,
                                    images_json: this.ProductUploads.files(),
                                    themes_json: this.Forms.productOverlay.val('themes').reduce((acc, item) => {
                                        acc[sha1(item)] = item;
                                        return acc;
                                    }, Object.create(null)),
                                    themes_map_json: this.Forms.productOverlay.val('themes-map'),
                                    options_json: {
                                        allow_mix: this.Forms.productOverlay.val('allow-mix'),
                                        use_price_scale: this.Forms.productOverlay.val('sliding-price'),
                                        allow_group_picture: this.Forms.productOverlay.val('allow-group-picture'),
                                        only_group_picture: (this.Forms.productOverlay.val('allow-group-picture') ? this.Forms.productOverlay.val('only-group-picture') : false),
                                        price_scale: this.Forms.productOverlay.val('price').split(','),
                                        default_image: $('#product-img-container').find('input:checked').length ?
                                            $('#product-img-container').find('input:checked').val() :
                                            $('#product-img-container').find('input:first').attr('value'),
                                        category: this.Forms.productOverlay.val('product-category'),
                                        buildYourOwn: this.Forms.productOverlay.val('build-your-own-package-ref'),
                                        digitalImage: this.Forms.productOverlay.val('digital-image') === true ?
                                            this.Forms.productOverlay.val('digital-image-price') :
                                            null,
                                        touchups: this.Forms.productOverlay.val('touchups') === true ?
                                            this.Forms.productOverlay.val('touchups-price') :
                                            null,
                                        product_tags: this.Forms.productOverlay.val('product-tags')
                                    }
                                });
                            }
                        });
                });
            },

            _productCategories_addRow: function(callback) {
                this.Forms.productCategoryOverlay.clear();

                this._child('product-category-overlay')
                    .activateGroup('add')
                    .show((result) => {
                        if (result.status === 'ok') {
                            callback({
                                internal_name: this.Forms.productCategoryOverlay.val('internal-name'),
                                name_locale_json: {
                                    fra: this.Forms.productCategoryOverlay.val('name-fra'),
                                    eng: this.Forms.productCategoryOverlay.val('name-eng')
                                }
                            });
                        }
                    });
            },

            _productCategories_editRow: function(row, callback) {
                this.Forms.productCategoryOverlay.clear();

                this.Forms.productCategoryOverlay.val('internal-name', row.internal_name);
                this.Forms.productCategoryOverlay.val('name-fra', row.name_locale_json.fra);
                this.Forms.productCategoryOverlay.val('name-eng', row.name_locale_json.eng);

                this._child('product-category-overlay')
                    .activateGroup('edit')
                    .show((result) => {
                        if (result.status === 'ok') {
                            callback({
                                internal_name: this.Forms.productCategoryOverlay.val('internal-name'),
                                name_locale_json: {
                                    fra: this.Forms.productCategoryOverlay.val('name-fra'),
                                    eng: this.Forms.productCategoryOverlay.val('name-eng')
                                }
                            });
                        }
                    });
            },

            _productGroup_addRow: function(callback) {
                this.Forms.productGroupOverlay.clear();
                $('#product-group-overlay').find('[name="products-selected"]')
                    .empty();
                $('#product-group-overlay').find('[name="products-available"]')
                    .empty()
                    .append(
                        this._child('product-table').dataset().data.rows.__unwrap
                            .reduce((optionElements, product) => {
                                optionElements.push(
                                    $(`<option value="${product.id}">#${product.id} ${product.name_locale_json[HeO2.config.read('Config.language')]}</option>`));
                                return optionElements;
                            }, [])
                        );

                this._child('product-group-overlay')
                    .activateGroup('add')
                    .show((result) => {
                        if (result.status === 'ok') {
                            callback({
                                name_locale_json: {
                                    fra: this.Forms.productGroupOverlay.val('name-fra'),
                                    eng: this.Forms.productGroupOverlay.val('name-eng')
                                },
                                products_json: $('#product-group-overlay').find('[name="products-selected"] > option').toArray().map(
                                    element => +element.getAttribute('value')
                                )
                            });
                        }
                    });
            },

            _productGroup_editRow: function(row, callback) {
                let products = this._child('product-table').dataset().data.rows.__unwrap;

                this.Forms.productGroupOverlay.clear();
                $('#product-group-overlay').find('[name="products-available"]').empty();
                $('#product-group-overlay').find('[name="products-selected"]').empty();

                this.Forms.productGroupOverlay.val('name-fra', row.name_locale_json.fra);
                this.Forms.productGroupOverlay.val('name-eng', row.name_locale_json.eng);

                function makeOption(product) {
                    return $(`<option value="${product.id}">#${product.id} ${product.name_locale_json[HeO2.config.read('Config.language')]}</option>`);
                }

                row.products_json.forEach((productId) => {
                    $('#product-group-overlay').find('[name="products-selected"]').append(
                        makeOption(products.filter(product => product.id == productId)[0])
                    );
                });

                products.filter(product => !row.products_json.includes(+product.id)).forEach(product => {
                    $('#product-group-overlay').find('[name="products-available"]').append(makeOption(product));
                });

                this._child('product-group-overlay')
                    .activateGroup('edit')
                    .show((result) => {
                        if (result.status === 'ok') {
                            callback({
                                name_locale_json: {
                                    fra: this.Forms.productGroupOverlay.val('name-fra'),
                                    eng: this.Forms.productGroupOverlay.val('name-eng')
                                },
                                products_json: $('#product-group-overlay').find('[name="products-selected"] > option').toArray().map(
                                    element => +element.getAttribute('value')
                                )
                            });
                        }
                    });
            },

            _productGroupAvailable_dblclick: function(event) {
                if (event.target.nodeName !== 'OPTION') {
                    return;
                }

                $('#product-group-overlay').find('[name="products-selected"]').append(
                    $(event.target).prop('selected', false));
            },

            _productGroupSelected_dblclick: function(event) {
                if (event.target.nodeName !== 'OPTION') {
                    return;
                }

                $('#product-group-overlay').find('[name="products-available"]').append(
                    $(event.target).prop('selected', false));
            },

            _selectedProduct_mousedown: function(event) {
                this._productGroup_dragging = $(event.target);
                $('#drag-hint').css('top', `${this._productGroup_dragging[0].offsetTop}px`);
                $('#drag-hint').show();
            },

            _selectedProduct_mousemove: function(event) {
                if (this._productGroup_dragging) {
                    let targetElement = $(event.target);

                    if (targetElement.is('option') && targetElement.parent().is($('[name="products-selected"]'))) {
                        $('#drag-hint').css('top', `${targetElement[0].offsetTop}px`);
                        this._productGroup_before = targetElement;
                    } else if (targetElement.is($('[name="products-selected"]'))) {
                        let lastOptionElement = $('[name="products-selected"]').children().last();
                        $('#drag-hint').css('top', `${lastOptionElement[0].offsetTop + lastOptionElement[0].offsetHeight}px`);
                        this._productGroup_before = 'last';
                    }

                    event.preventDefault();
                }
            },

            _selectedProduct_mouseup: function(event) {
                if (this._productGroup_dragging) {
                    if (this._productGroup_before === 'last') {
                        let lastOptionElement = $('[name="products-selected"]').children().last();
                        this._productGroup_dragging.insertAfter(lastOptionElement);
                    } else {
                        this._productGroup_dragging.insertBefore(this._productGroup_before);
                    }

                    this._productGroup_dragging = undefined;
                    $('#drag-hint').hide();
                }
            },

            _slidingPriceCheckbox_click: function(event) {
                $('#price').attr('placeholder', this.Forms.productOverlay.val('sliding-price') ? '15,12,10,8' : '');
            },

            _themeAdd_click: function(event) {
                let themeName = `${prompt('Francais')} // ${prompt('English')}`;
                if (themeName) {
                    this._addThemeOptions(themeName);
                }
            },

            _themeList_click: function(event) {
                if (event.target.nodeName === 'OPTION' && event.offsetX > event.target.offsetWidth - 30) {
                    $(event.target).detach();
                    this._updateThemeSelects();
                }
            },

            /*_themeList_dblClick: function(event) {
                if (event.target.nodeName === 'OPTION') {
                    let themeName = prompt('', $(event.target).text());
                    if (themeName) {
                        $(event.target).text(themeName);
                        this._updateThemeSelects();
                    }
                }
            },*/

            _themeSelects_change: function(event) {
                let themeMapInput = $('input[name="themes-map"]');
                let themesMap = JSON.parse(themeMapInput.val() || '{}');

                themesMap[event.target.attributes['data-id'].value] = $(event.target).val();
                themeMapInput.val(JSON.stringify(themesMap));
            },


            /* PRIVATE */
            _addThemeOptions: function(themes) {
                if (!Array.isArray(themes)) {
                    themes = [themes];
                }

                for (let theme of themes) {
                    $(this.Forms.productOverlay.ref('themes')).append(`<option>${theme}</option>`);
                }

                this._updateThemeSelects();
            },

            _updateThemeSelects: function() {
                let options = this.Forms.productOverlay.val('themes').reduce((acc, theme) => {
                    acc.push(`<option value="${sha1(theme)}">${theme}</option>`);
                    return acc;
                }, ['<option value="none"></option>']);

                $('.__theme_selects')
                    .each((index, element) => {
                        element = $(element);
                        let val = element.val();
                        element.empty().append(options).val(val);
                    });
            }
        });

        Host.create(ProductController, ProductView);
    });
}(HeO2, jQuery));
