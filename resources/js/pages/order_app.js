/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2014-2019, Heliox - All Right Reserved
 */

(function(HeO2, $, location) {
    "use strict";

    const Host = HeO2.require('HeO2.Host');
    const Controller = HeO2.require('HeO2.Controller');
    const Gallery = HeO2.require('HeO2.UI.Widgets.Gallery');
    const View = HeO2.require('HeO2.View');
    const SubjectCode = HeO2.require('HeO2.lib.SubjectCode');
    const ChromaKey = HeO2.require('HeO2.effects.ChromaKey');
    const Dataset = HeO2.require('HeO2.utils.Dataset');
    const helpers = HeO2.require('HeO2.common.helpers');
    const domHelpers = HeO2.require('HeO2.common.domHelpers');
    const momentjs = HeO2.require('HeO2.vendor.momentjs');
    const sha1 = HeO2.require('HeO2.vendor.sha1');
    const logger = HeO2.require('HeO2.common.logger');
    const VK_CODES = HeO2.require('HeO2.CONST.VK_CODES');

    const ORDERAPP_LOCAL_STORAGE_KEY = 'order'; // Also defined in order_complete.js
    const ORDERAPP_LOCAL_STORAGE_VER = 3;
    const CHROMA_KEY_GREEN_THRESHOLD = 20;
    const CHROMA_KEY_COLOR_KEY = [
            {x: '1', y: '1'},
            {x: '1', y: '5%'},
            {x: '18%', y: '1'},
            {x: '20%', y: '1'},
            {x: '35%', y: '1'},
            {x: '50%', y: '1'},
            {x: '65%', y: '1'},
            {x: '80%', y: '1'},
            {x: '82%', y: '1'},
            {x: '99%', y: '1'},
            {x: '99%', y: '5%'}
        ];
    const CHROMA_KEY_TOLERANCE = {
        r: 55,
        g: 60,
        b: 60
    };

    /* CONTROLLER */
    const OrderAppController = Controller.extend({
        init: function(host, options) {
            this._super(host, {});
            this._products = Object.create(null);
            this._nothingToRestore = false;

            this._createStateCacheAndIndex();
        },

        _unusedPhotosToRemove: [],

        addCartItem: function(cartItem, reloadId) {
            let cartItemId = reloadId ? reloadId : sha1(`${JSON.stringify(cartItem)}${(new Date()).getTime()}`);
            let subtotal = 0;
            let photos = [];

            switch (cartItem.productId) {
                case 'touchup':
                    subtotal = Number(this._touchupPrice[0].toFixed(2));
                    break;
                case 'digital':
                    subtotal = Number(Number(this.calculateDigitalsPrice(cartItem.selection,
                        this.getDiscountEligibleSelection(cartItem.selection))).toFixed(2));
                    break;
                default:
                    subtotal = Number(Number(this.calculateItemSubtotal(this.products()[cartItem.productId], cartItem.selection.length, cartItem.quantity)).toFixed(2));
                    break;
            }

            if (!reloadId) {
                this.state().cart[cartItemId] = cartItem;
            }

            for (let photoId of Object.values(cartItem.selection)) {
                photos.push($(`#selected-photos [data-photo-id="${photoId}"]`).clone());
            }

            this.activeView().Cart.addItem(cartItemId, cartItem, photos, subtotal);
            this.activeView().Cart.updateSubtotal(this._calculateCartSubtotal());

            if (!reloadId && cartItem.productId !== 'digital') {
                this.updateDigitalItem();
            }

            if (Object.keys(this.state().cart).length > 0) {
                this.activeView().Cart.disableCompleteOrder(false);
            }
        },

        allowDigitalGroupPicture: function() {
            return this._allowDigitalGroupPicture;
        },

        buildYourOwn: function() {
            return this._buildYourOwn;
        },

        calculateItemDisplayedPrice: function(total, selectionCount, quantity) {
            return (total /
                (selectionCount > 0 ? selectionCount : 1) /
                (quantity > 0 ? quantity : 1)
            ).toFixed(2);
        },

        calculateDigitalsPrice: function(photoSelection, discountElegibleSelection) {
            let {digitalCount, groupDigitalCount, discountDigitalCount, discountGroupDigitalCount} =
                this.countDigitalCopyType(photoSelection, discountElegibleSelection);
            let price = 0;
            let groupPrice = 0;
            let discountPrice = 0;
            let discountGroupPrice = 0;

            let consideredDigitalCount = digitalCount + discountDigitalCount;
            if (consideredDigitalCount > 0) {
                let digitalPrices = this._digitalPrice.length < consideredDigitalCount
                    ? this._digitalPrice.concat(Array(consideredDigitalCount - this._digitalPrice.length).fill(this._digitalPrice.slice(-1)[0]))
                    : this._digitalPrice;
                price = digitalPrices.slice(0, consideredDigitalCount).reduce((sum, price) => sum + Number(price), 0);
            }

            let consideredGroupDigitalCount = groupDigitalCount + discountGroupDigitalCount;
            if (this._enableDigitalGroups && this._digitalGroupPicturePrices && consideredGroupDigitalCount > 0) {
                let groupDigitalPrices = this._digitalGroupPicturePrices.length < consideredGroupDigitalCount
                    ? this._digitalGroupPicturePrices.concat(Array(consideredGroupDigitalCount - this._digitalGroupPicturePrices.length).fill(this._digitalGroupPicturePrices.slice(-1)[0]))
                    : this._digitalGroupPicturePrices;

                groupPrice = groupDigitalPrices.slice(0, consideredGroupDigitalCount).reduce((sum, price) => sum + Number(price), 0);
            }

            if (this._discountPrices && discountDigitalCount > 0) {
                let discountPrices = this._discountPrices.length < discountDigitalCount
                    ? this._discountPrices.concat(Array(discountDigitalCount - this._discountPrices.length).fill(this._discountPrices.slice(-1)[0]))
                    : this._discountPrices;

                discountPrice = discountPrices.slice(0, discountDigitalCount).reduce((sum, price) => sum + Number(price), 0);
            }

            if (this._enableDigitalGroups && this._discountGroupPrices && discountGroupDigitalCount > 0) {
                let discountGroupPrices = this._discountGroupPrices.length < discountGroupDigitalCount
                    ? this._discountGroupPrices.concat(Array(discountGroupDigitalCount - this._discountGroupPrices.length).fill(this._discountGroupPrices.slice(-1)[0]))
                    : this._discountGroupPrices;

                discountGroupPrice = discountGroupPrices.slice(0, discountGroupDigitalCount).reduce((sum, price) => sum + Number(price), 0);
            }

            return (price +
                groupPrice -
                discountPrice -
                discountGroupPrice).toFixed(2);
        },

        calculateItemOptionDisplayedPrice: function(optionPrice, selectionCount) {
            return (optionPrice * selectionCount).toFixed(2);
        },

        calculateItemSubtotal: function(product, selectionCount, quantity) {
            let price;

            if (product.options.usePriceScale) {
                let totalProductCount = selectionCount * quantity;

                price = (totalProductCount <= product.options.priceScale.length ?
                        product.options.priceScale.slice(0, totalProductCount) :
                        product.options.priceScale.concat(
                            Array(totalProductCount - product.options.priceScale.length).fill(product.options.priceScale.slice(-1)[0]))
                ).reduce((sum, slidePrice) => sum + Number(slidePrice), 0);
            } else {
                price = (product.price * selectionCount * quantity);
            }

            return price.toFixed(2);
        },

        calculateTouchupSubtotal: function() {
            return this._touchupPrice[0];
        },

        clearSession: function() {
            localStorage[ORDERAPP_LOCAL_STORAGE_KEY] = null;
            location.reload();
        },

        completeOrder: function() {
            try {
                let order = {
                    sessionId: this.state().sessionId.__unwrap,
                    subjectCode: this.state().subjectCodes.__unwrap,
                    photoSelection: this.state().photoSelection.__unwrap,
                    cart: this.state().cart.__unwrap,
                    comment: ''
                };
                let form = $(`<form action="${orderCompleteUrl}" method="post">
                <input type="hidden" name="order" value="${JSON.stringify(order).replace(/"/g, '&quot;')}">
               </form>`);

                $('body').append(form);
                form.submit();
            } catch (e) {
                this.feedback($.i18n('ERROR_SERVER_UNKNOWN'), $.i18n('ERROR_TITLE'));
            }
        },

        countDigitalCopyType: function(photoSelection, discountEligibleSelection) {
            let orderSelection = this.state().photoSelection.__unwrap;
            let digitalCount = 0;
            let groupDigitalCount = 0;
            let discountDigitalCount = 0;
            let discountGroupDigitalCount = 0;

            for (let photoId of photoSelection) {
                let photo = orderSelection[photoId];

                if (!photo) {
                    continue;
                }

                if (photo.image && photo.image.groupId && discountEligibleSelection.includes(photoId)) {
                    ++discountGroupDigitalCount;
                } else if (photo.image && photo.image.groupId) {
                    ++groupDigitalCount;
                } else if (discountEligibleSelection.includes(photoId)) {
                    ++discountDigitalCount;
                } else {
                    ++digitalCount;
                }
            }

            return {digitalCount, groupDigitalCount, discountDigitalCount, discountGroupDigitalCount};
        },

        crosssell: function() {
            return this._crosssell;
        },

        digitalOverlap: function(selection) {
            const digitalItem = Object.values(this.state().cart.__unwrap).find(item => item.productId === 'digital');

            if (!digitalItem) {
                return false;
            }

            return digitalItem.selection.filter(photoId => selection.includes(photoId));
        },

        editCartItem: function(item) {
            this.state().cart[item.itemId] = item;
            this.activeView().clearCart();

            for (let cartItemId of Object.keys(this.state().cart)) {
                this.addCartItem(this.state().cart[cartItemId].__unwrap, cartItemId);
            }
        },

        filterPhotoSelectionForEligibleDiscount: function(selection) {
            if (!this._enableDigitalGroups) {
                return selection.filter(s => this.state().photoSelection[s].image.groupId === undefined);
            }

            return selection;
        },

        getDigitalCartItem: function() {
            let digitalCartItem = Object.entries(this.state().cart.__unwrap).find(([key, item]) => item.productId === 'digital');
            return digitalCartItem ? digitalCartItem : [];
        },

        getDigitalCartItemSelection: function() {
            let digitalCartItem = this.getDigitalCartItem();
            return digitalCartItem.length ? digitalCartItem[1].selection : [];
        },

        getDiscountEligibleSelection: function(selection, eligibleSelection = []) {
            let inCartDiscountProductSelection = [...Object.values(this.state().cart.__unwrap)
                .filter(item => this._discountProductIds?.includes(item.productId))
                .map(item => item.selection)
                .flat()
            , ...eligibleSelection];

            return selection.filter(photoId => inCartDiscountProductSelection.includes(photoId));
        },

        getDiscountEligibleSelectionFromProducts: function() {
            return Object.values(this.state().cart.__unwrap)
                .filter(item => this._discountProductIds?.includes(item.productId))
                .map(item => item.selection)
                .flat()
                .reduce((selection, id) => {
                    if (!selection.includes(id)) {
                        selection.push(id);
                    }
                    return selection;
                }, []);
        },

        getTouchupSelectedPhotos: function() {
            let photos = [];

            for (let item of Object.values(this.state().cart.__unwrap)) {
                if (item.productId === 'touchup') {
                    photos.push(item.selection[0]);
                }
            }

            return photos;
        },

        isDigitalGroupEnabled: function() {
            return this._enableDigitalGroups;
        },

        isProductDiscountEligible: function(productId) {
            if (!this._discountProductIds) {
                return false;
            }

            return this._discountProductIds.includes(productId);
        },

        isSubjectCodeAdded: function(subjectCode) {
            return Object.keys(this.state().subjectCodes).includes(subjectCode.trim());
        },

        listBackrounds: function(response, data, callback) {
            "server[url:static/backgrounds.json,method:get]";

            callback(response.categories, response.backgrounds, response.featured);
        },

        listSession: function(response, data, callback) {
            "server[url:api/listSession,method:get]";

            if (response.status === 'ok') {
                this._products = response.products.slice()
                    .reduce((acc, product) => {
                        acc[product.id] = product;
                        return acc;
                    }, Object.create(null));
                Object.freeze(this._products);

                this._buildYourOwn = response.buildYourOwn;
                Object.freeze(this._buildYourOwn);

                this._crosssell = response.crosssell;
                Object.freeze(this._crosssell);

                this._allowDigitalGroupPicture = response.allowDigitalGroupPicture;
                Object.freeze(this._allowDigitalGroupPicture);

                this._digitalPrice = response.digitalsPrice;
                Object.freeze(this._digitalPrice);

                this._touchupPrice = response.touchupPrice;
                Object.freeze(this._touchupPrice);

                this._enableDigitalGroups = response.enableDigitalGroups;
                this._digitalGroupPicturePrices = response.digitalsGroupPrice;
                Object.freeze(this._digitalGroupPicturePrices);

                if (response.enableDiscount) {
                    this._discountProductIds = response.discountProductIds;
                    this._discountPrices = response.discountPrices;
                    this._discountGroupPrices = response.discountGroupPrices;
                    Object.freeze(this._discountProductIds);
                    Object.freeze(this._discountPrices);
                    Object.freeze(this._discountGroupPrices);
                }

                this.activeView().Cart._options.products = this._products;

                this.host().emit('products-loaded');
                callback(response);
            } else {
                $('#loading-screen').hide();
                this.activeView().feedback($.i18n('ORDERAPP_ERROR_SESSION_PRODUCTS'));
            }
        },

        listSubjectCodePhotos: function(response, data, callback) {
            "server[url:api/listSubjectCodePhotos,method:get]";

            if (response.status === 'ok') {
                if (this.state().sessionId === undefined) {
                    this.state().sessionId = response.sessionId;
                    this.activeView().displayProducts(response.sessionId);
                } else if (Number(this.state().sessionId) !== Number(response.sessionId)) {
                    this.activeView().showUniqueSessionMessage();
                    return;
                }

                for (let i = 0, length = response.photos.length; i < length; ++i) {
                    response.photos[i] = serverUrl + response.photos[i];
                }

                if (response.groupPhotos) {
                    for (let i = 0, length = response.groupPhotos.length; i < length; ++i) {
                        response.groupPhotos[i] = serverUrl + response.groupPhotos[i];
                    }
                }

                //this.state().addedSubjectCodes.push(data.code);
                this.state().subjectCodes[data.code] = {
                    name: response.name,
                    photos: response.photos.map(url => ({url: url.slice(serverUrl.length - 1), subjectCode: data.code, subjectId: response.subjectId})),
                    group: response.group
                };
                if (response.group && response.groupPhotos) {
                    this.state().groups[response.group] = {
                        name: response.group,
                        photos: response.groupPhotos.map(url => ({url, groups: response.group, subjectCode: data.code, groupId: response.groupId}))
                    };
                }
                this._indexSubjectCodePhotos(this.state().subjectCodes[data.code]);
                this._indexGroupPhotos(this.state().groups[response.group]);

                this.activeView()
                    .addSubjectCodePhotos(response.photos, response.name, response.groupPhotos, response.group);
            }

            callback(response);
        },

        products: function() {
            return this._products;
        },

        removeCartItem: function(cartItemId) {
            if (!this.state().cart[cartItemId]) {
                return;
            }

            delete this.state().cart[cartItemId];

            this.updateDigitalItem();

            this.activeView().Cart.removeItem(cartItemId);
            this.activeView().Cart.updateSubtotal(this._calculateCartSubtotal());

            if (Object.keys(this.state().cart).length === 0) {
                this.activeView().Cart.disableCompleteOrder(true);
            }
        },

        updateCartItem: function(cartItemId) {
            if (!this.state().cart[cartItemId]) {
                return;
            }

            let cartItem = this.state().cart[cartItemId];
            let product = this.products()[cartItem.productId];
            let subTotal = this.calculateItemSubtotal(product, cartItem.selection.length, cartItem.quantity);

            this.activeView().Cart.updateItem(cartItemId, cartItem.quantity, subTotal);
            this.activeView().Cart.updateSubtotal(this._calculateCartSubtotal());
        },

        validateCartItems: function() {
            return this.validateTouchupSelection();
        },

        validateProceedCheckout: function() {
            if (this.validateCartItems()) {
                this.completeOrder();
                setTimeout(() => {
                    this.id['complete-order'].removeClass('activated');
                }, 10000);
            }
        },

        validateTouchupSelection: function() {
            let filteredCartItems = Object.values(this.state().cart.__unwrap).filter(i => i.productId !== 'touchup');
            let touchupPhotos = this.getTouchupSelectedPhotos();

            if (touchupPhotos.length === 0) {
                // No touchup photos, can continue
                return true;
            }

            if (filteredCartItems.length === 0) {
                // No other cart items, can't continue
                this.activeView().feedback($.i18n('ORDERAPP_ERROR_TOUCHUP_NO_PRODUCTS'));
                return false;
            }

            const photoUsedInCartItems = filteredCartItems.map(item => item.selection).flat();
            let unusedTouchupPhotosToRemove = [];
            let canProceed = true;

            for (const touchupPhoto of touchupPhotos) {
                if (!photoUsedInCartItems.includes(touchupPhoto)) {
                    // Touchup photo not used in any other cart item, can't continue
                    canProceed = false;
                    unusedTouchupPhotosToRemove.push(touchupPhoto);
                }
            }

            if (unusedTouchupPhotosToRemove.length > 0) {
                this._unusedPhotosToRemove = unusedTouchupPhotosToRemove;

                this.activeView().feedbackYesNo(
                    $.i18n('ORDERAPP_ERROR_TOUCHUP_PHOTO_NOT_IN_PRODUCTS') +
                    '<br><br>' +
                    $.i18n('ORDERAPP_ERROR_TOUCHUP_REVIEW_PHOTO_NOT_IN_PRODUCTS') +
                    '<div class="unused-touchups">' +
                    this._unusedPhotosToRemove.map(photoId => $(`#selected-photos [data-photo-id="${photoId}"]`).prop('outerHTML')).join('') +
                    '</div>',
                    null, null, (results) => {
                        if (results.status === 'ok') {
                            for (const touchupPhoto of this._unusedPhotosToRemove) {
                                this.unselectTouchup(touchupPhoto);
                            }

                            this.validateProceedCheckout();
                        } else {
                            this.activeView()._child('cart-overlay').toggle();
                        }
                    });
            } else {
                return canProceed;
            }
        },

        selectPhoto: function(url) {
            let basenameUrl = decodeURI(helpers.basename(url));

            if (this._index.subjectCodePhotos[basenameUrl]) {
                let subjectCodePhoto = this._index.subjectCodePhotos[basenameUrl];
                let chromaKey = this._createChromaKey(subjectCodePhoto.url);

                this.activeView().selectPhotoOverlayImg(basenameUrl);

                this._checkGreenScreen(chromaKey, (hasGreenScreen) => {
                    if (hasGreenScreen) {
                        this.activeView().triggerChooseGreenScreen(url, chromaKey, (background) => {
                            let photoId = sha1(`${subjectCodePhoto.url}${background.url}`);

                            if (this._isKeyedPhotoCached(url, background) !== undefined) {
                                this.activeView().feedback($.i18n('ORDERAPP_MESSAGE_IMG_BACK_COMB_EXIST'));
                            } else {
                                this._cacheKeyedPhoto(url, background, (dataUrl) => {
                                    this.state().photoSelection[photoId] = {
                                        image: Object.assign({}, subjectCodePhoto, {url: subjectCodePhoto.url}),
                                        background, basenameUrl,
                                        creation: Date.now()
                                    };
                                    this.activeView().addSelectedPhoto(
                                        dataUrl, photoId, subjectCodePhoto.subjectCode, null,
                                        this.state().photoSelection[photoId].creation, false);
                                });
                            }
                        });
                    } else {
                        let photoId = sha1(`${subjectCodePhoto.url}`);

                        if (Object.values(this.state().photoSelection.__unwrap)
                            .filter(i => i.image.url === subjectCodePhoto.url).length === 0) {
                            this.state().photoSelection[photoId] = {
                                image: Object.assign({}, subjectCodePhoto, {url: subjectCodePhoto.url}),
                                basenameUrl,
                                creation: Date.now()
                            };
                            this.activeView().addSelectedPhoto(
                                subjectCodePhoto.url, photoId, subjectCodePhoto.subjectCode, null,
                                this.state().photoSelection[photoId].creation, false);
                        } else {
                            if (!this.unselectPhoto(photoId)) {
                                this.activeView().feedback($.i18n('ORDERAPP_ERROR_CANT_REMOVE_PHOTO'));
                            }
                        }
                    }
                });
            }

            if (this._index.groupPhotos[basenameUrl]) {
                let groupPhoto = this._index.groupPhotos[basenameUrl];
                this.activeView().selectPhotoOverlayImg(basenameUrl);

                let photoId = sha1(`${groupPhoto.url}`);

                if (Object.values(this.state().photoSelection.__unwrap)
                    .filter(i => i.image.url === groupPhoto.url).length === 0) {
                    this.state().photoSelection[photoId] = {
                        image: Object.assign({}, groupPhoto, {url: groupPhoto.url.slice(serverUrl.length - 1)}),
                        basenameUrl,
                        creation: Date.now()
                    };
                    this.activeView().addSelectedPhoto(
                        groupPhoto.url, photoId, groupPhoto.groups, null,
                        this.state().photoSelection[photoId].creation, true);
                } else {
                    if (!this.unselectPhoto(photoId)) {
                        this.activeView().feedback($.i18n('ORDERAPP_ERROR_CANT_REMOVE_PHOTO'));
                    }
                }
            }
        },

        state: function() {
            return this._state.data;
        },

        unselectPhoto: function(photoId) {
            for (let item of Object.values(this.state().cart.__unwrap)) {
                if (item.selection.includes(photoId)) {
                    return false;
                }
            }

            if (this.state().photoSelection[photoId]) {
                let basenameUrl = this.state().photoSelection[photoId].basenameUrl;

                if (this.state().photoSelection[photoId].background !== undefined) {
                    let index = helpers.basename(this.state().photoSelection[photoId].image.url) + ' ' +
                        this.state().photoSelection[photoId].background.url;
                    delete this._cache.keyedSelectedPhotos[index];
                }

                delete this.state().photoSelection[photoId];

                this.activeView().removeSelectedPhoto(photoId, basenameUrl);
            }

            return true;
        },

        unselectTouchup: function(photoId) {
            const itemToRemove = Object.entries(this.state().cart.__unwrap).find(([key, item]) => item.selection.includes(photoId))[0];

            this.removeCartItem(itemToRemove);
            this.activeView().updateCartCounter();
        },

        updateDigitalItem: function() {
            let digitalCartItem = this.getDigitalCartItem();

            if (!digitalCartItem.length) {
                return;
            }

            this.editCartItem({
                itemId: digitalCartItem[0],
                ...digitalCartItem[1]
            });
        },

        /* LIFECYCLE */
        _ready: function() {
            momentjs.locale(HeO2.config.read('Config.language').substr(0, 2));
            if (this._nothingToRestore) {
                $('#loading-screen').hide();
            }
        },


        /* EVENT HANDLERS */
        _host_restoreState: function() {
            "on[restore-state]";

            // Restore subject codes
            for (let subjectCode of Object.keys(this.state().subjectCodes)) {
                let subjectCodeData = this.state().subjectCodes[subjectCode];
                let groupPhotos = subjectCodeData.group.__unwrap !== null
                    ? this.state().groups[subjectCodeData.group].photos.__unwrap.map(i => i.url)
                    : undefined;
                this.activeView().addSubjectCodePhotos(subjectCodeData.photos.map((item) => {return item.url}),
                    subjectCodeData.name,
                    groupPhotos,
                    subjectCodeData.group);
            }
            this._indexSubjectCodePhotos();
            this._indexGroupPhotos();

            // Restore cart
            if (this.state().cart !== undefined && Object.keys(this.state().cart).length) {
                // TODO: Should join events in Promise instead of whatever this is
                let eventReceived = 0;
                let restoreCart = () => {
                    setTimeout(() => {
                        for (let cartItemId of Object.keys(this.state().cart)) {
                            this.addCartItem(this.state().cart[cartItemId].__unwrap, cartItemId);
                        }

                        this.activeView().Cart.disableCompleteOrder(this.state().cart.length > 0);
                        this.activeView().Cart.updateSubtotal(this._calculateCartSubtotal());
                    }, 500);
                };

                this.host().one('products-loaded', () => {
                    if (++eventReceived === 2) {
                        restoreCart();
                    }
                });

                this.host().one('backgrounded-photo-loaded', () => {
                    if (++eventReceived === 2) {
                        restoreCart();
                    }
                });
            }

            // Restore selection photos
            let backgroundedPhotoCount = 0;
            let backgroundedPhotoProcessed = 0;

            if (Object.keys(this.state().photoSelection).length > 0) {
                $('#selected-photos').addClass('hide-photos');
            }
            for (let photoId of Object.keys(this.state().photoSelection)) {
                let photo = this.state().photoSelection[photoId].__unwrap;

                this.activeView().selectPhotoOverlayImg(helpers.basename(photo.image.url));
                if (photo.background) {
                    ++backgroundedPhotoCount;
                    this._cacheKeyedPhoto(photo.image.url, photo.background, (dataUrl) => {
                        this.activeView().addSelectedPhoto(dataUrl, photoId, photo.image.subjectCode,
                            () => {
                                if (++backgroundedPhotoProcessed === backgroundedPhotoCount) {
                                    $('#selected-photos').children().sort((a, b) => {
                                        return +a.dataset.creation - +b.dataset.creation;
                                    }).appendTo('#selected-photos');

                                    $('#selected-photos').removeClass('hide-photos');

                                    this.host().emit('backgrounded-photo-loaded');
                                }
                            }, photo.creation, false);
                    });
                } else {
                    const nameId = photo.image.subjectId !== undefined
                        ? photo.image.subjectCode
                        : photo.image.group;

                    $('#selected-photos').removeClass('hide-photos');
                    this.activeView().addSelectedPhoto(photo.image.url, photoId, nameId, null,
                        photo.creation, photo.image.groupId !== undefined);
                }
            }

            if (backgroundedPhotoCount === 0) {
                this.host().emit('backgrounded-photo-loaded');
            }

            // Restore products
            if (this.state().sessionId !== undefined) {
                this.activeView().displayProducts(this.state().sessionId.__unwrap);
            }
        },

        _host_serverError: function(error) {
            "on[server-error]";

            $('#loading-screen').hide();
            this.activeView().feedback($.i18n('ERROR_SERVER'));
        },

        _state_changed: function(event) {
            this._saveState();
        },


        /* PRIVATE */
        _cacheKeyedPhoto: function(imageUrl, background, callback) {
            if (!this._isKeyedPhotoCached(imageUrl, background)) {
                let chromaKey = this._createChromaKey(imageUrl);
                chromaKey.draw(serverUrl + 'pub/' + background.url).then((dataUrl) => {
                    this._cache.keyedSelectedPhotos[`${helpers.basename(imageUrl)} ${background.url}`] = dataUrl;
                    callback(dataUrl);
                })
            } else {
                callback(this._cache.keyedSelectedPhotos[`${imageUrl} ${background.url}`]);
            }
        },

        _calculateCartSubtotal: function() {
            return Object.keys(this.state().cart).reduce((subtotal, cartItemKey) => {
                let cartItem = this.state().cart[cartItemKey];
                let product = this.products()[cartItem.productId];

                switch (cartItem.productId.__unwrap) {
                case 'touchup':
                    return subtotal + Number(this.calculateTouchupSubtotal());
                case 'digital':
                    return subtotal + Number(this.calculateDigitalsPrice(cartItem.selection,
                        this.getDiscountEligibleSelectionFromProducts()));
                default:
                    return subtotal + Number(this.calculateItemSubtotal(product, cartItem.selection.length, cartItem.quantity));
                }
            }, 0);
        },

        _checkGreenScreen: function(chromaKey, callback) {
            chromaKey.getCalculatedColorKey()
                .then((colorPoints) => {
                    let hasGreenScreen = true;

                    for (let i = 0, length = colorPoints.colorKeyPoints.length; i < length; ++i) {
                        hasGreenScreen &= (colorPoints.colorKeyPoints[i].g - CHROMA_KEY_GREEN_THRESHOLD) >= colorPoints.colorKeyPoints[i].b &&
                            (colorPoints.colorKeyPoints[i].g - CHROMA_KEY_GREEN_THRESHOLD) >= colorPoints.colorKeyPoints[i].r;
                    }

                    callback(hasGreenScreen);
                })
                .catch((error) => {
                    logger.error(`OrderApp::_checkGreenScreen: ${error}`);
                });
        },

        _createChromaKey: function(imageUrl) {
            return new ChromaKey({image: imageUrl, colorKey: CHROMA_KEY_COLOR_KEY, tolerance: CHROMA_KEY_TOLERANCE});
        },

        _createStateCacheAndIndex: function() {
            this._index = Object.create(null);
            this._index.subjectCodePhotos = Object.create(null);
            this._index.groupPhotos = Object.create(null);

            this._cache = Object.create(null);
            this._cache.keyedSelectedPhotos = Object.create(null);

            this._state = new Dataset({
                backgrounds: {
                    favs: Object.create(null),
                    recents: Object.create(null)
                },
                photoSelection: Object.create(null),
                subjectCodes: Object.create(null),
                groups: Object.create(null),
                cart: Object.create(null)
            });
            this._state
                .on('deleted', this._state_changed.bind(this))
                .on('changed', this._state_changed.bind(this));

            if (localStorage[ORDERAPP_LOCAL_STORAGE_KEY] && localStorage[ORDERAPP_LOCAL_STORAGE_KEY] !== 'null') {
                let localStorageData = JSON.parse(localStorage[ORDERAPP_LOCAL_STORAGE_KEY]);
                let timestamp = new Date(localStorageData.timestamp);

                if (localStorageData.ver === ORDERAPP_LOCAL_STORAGE_VER && momentjs().subtract(31, 'days').isBefore(timestamp)) {
                    this.host().on('ready', () => {
                        this._state.import(localStorageData.state);
                        this.host().emit('restore-state');
                    });
                } else {
                    localStorage[ORDERAPP_LOCAL_STORAGE_KEY] = null;
                    this._nothingToRestore = true;
                }
            } else {
                this._nothingToRestore = true;
            }
        },

        _indexGroupPhotos: function(group) {
            let working;
            if (group && group.length !== undefined) {
                working = {0: group};
            } else {
                this._index.groupPhotos = Object.create(null);
                working = this.state().groups;
            }

            for (let i = 0, keys = Object.keys(working), length = keys.length, prop = keys[0]; i < length; prop = keys[++i]) {
                for (let photo of working[prop].photos) {
                    this._index.groupPhotos[helpers.basename(photo.url)] = photo;
                }
            }
        },

        _indexSubjectCodePhotos: function(subjectCode) {
            let working;
            if (subjectCode && subjectCode.length !== undefined) {
                working = {0: subjectCode};
            } else {
                this._index.subjectCodePhotos = Object.create(null);
                working = this.state().subjectCodes;
            }

            for (let i = 0, keys = Object.keys(working), length = keys.length, prop = keys[0]; i < length; prop = keys[++i]) {
                for (let photo of working[prop].photos) {
                    this._index.subjectCodePhotos[helpers.basename(photo.url)] = photo;
                }
            }
        },

        _isKeyedPhotoCached: function(imageUrl, background) {
            return this._cache.keyedSelectedPhotos[`${helpers.basename(imageUrl)} ${background.url}`];
        },

        _redrawCart: function() {

        },

        _saveState: function() {
            localStorage[ORDERAPP_LOCAL_STORAGE_KEY] = JSON.stringify({
                timestamp: new Date(),
                ver: ORDERAPP_LOCAL_STORAGE_VER,
                state: this._state.export()
            });
        },

        _updateCartItemTheme: function(itemId, theme) {
            this.state().cart[itemId]['theme'] = theme;
            this.updateCartItem(itemId);
        },

        _updateCartItemQuantity: function(itemId, step) {
            let quantity = parseInt(this.state().cart[itemId]["quantity"], 10);
            quantity += step;
            this.state().cart[itemId]["quantity"] = quantity;
            this.updateCartItem(itemId);
        }
    });


    /* VIEW */
    const ADD_PHOTO_SELECTOR = '#add-photo-button';
    const CART_BUTTON_SELECTOR = '#cart-button';
    const BACKGROUND_SELECTED_CLASS = 'selected';

    const OrderAppView = View.extend({
        NAME: 'default',
        _addToCartProductId: null,
        subjectCodeKeyupTimeOutId: null,

        init: function(host) {
            this._super(host, {
                target: '#order-app',
                components: [
                    'Sticky',
                    {
                        name: 'Forms',
                        options: {
                            targets: [
                                {selector: '#add-photo-overlay'}
                            ]
                        }
                    },
                    {
                        name: 'Cart'
                    }
                ]
            });

            if (HeO2.DEBUG) {
                HeO2._DEBUG.orderAppView = this;
            }

            this.Cart.on('cart-item-added', (data) => {
                this.updateCartCounter();
            });

            this.Cart.on('update-item-theme', (data) => {
                this.controller()._updateCartItemTheme(data.itemId, data.theme);
            });

            this.Cart.on('update-item-quantity', (data) => {
                this.controller()._updateCartItemQuantity(data.itemId, data.step);
            });

            this.Cart.on('remove-item', (itemId) => {
                this.controller().removeCartItem(itemId);

                this.updateCartCounter();

                if (Object.values(this.controller().state().cart).length === 0 ) {
                    this.feedbackYesNo($.i18n('ORDERAPP_MESSAGE_RESET_SESSION'), null, null, (results) => {
                        if (results.status === 'ok') {
                            this.controller().clearSession();
                        }
                    });
                }
            });

            this.Cart.on('edit-item', (itemId) => {
                switch (this.controller().state().cart[itemId].__unwrap.productId) {
                case 'touchup':
                    this.editTouchupCartItem(itemId);
                    break;

                case 'digital':
                    this.editDigitalCartItem(itemId);
                    break;

                default:
                    this.editCartItem(itemId);
                    break;
                }
            });

            this._gallery = new Gallery();
        },

        addSelectedPhoto: function(url, photoId, sessionCode, loadCallback, creation, isGroup) {
            let imgZoomNode = null;
            let group = isGroup ? 'data-group' : '';

            if (!url.startsWith(serverUrl) && !url.startsWith('data:')) {
                url = serverUrl + (url.startsWith('/') ? url.substring(1) : url);
            }

            this.id['selected-photos'].append(
                $(`<div class="selected-photo" data-creation="${creation}" ${group}>`).append([
                    $(`<img src="${url}" data-photo-id="${photoId}" data-subject-code="${sessionCode}" ${group}>`)
                        .load(loadCallback),

                    $(`<i class="fa fa-trash-o photo-remove"></i>`)
                ])
            );
        },

        addSubjectCode: function(subjectCode, openSubjectOverlay) {
            if (!this.controller().isSubjectCodeAdded(subjectCode)) {
                this.controller().listSubjectCodePhotos({code: subjectCode}, (response) => {
                    switch (response.status) {
                        case 'failed':
                            this.feedback($.i18n('ORDERAPP_ERROR_ADD_SUBJECT_CODE'));
                            break;
                    }
                });

                this.Forms.addPhotoOverlay.clear('subject-code');
                this._child('subject-name').text('', '-error');
            } else {
                let subjectCodeElement = this.Forms.addPhotoOverlay.ref('subject-code');

                this.feedback($.i18n('ORDERAPP_ERROR_SUBJECT_CODE_ADDED'), () => {
                    subjectCodeElement.focus();
                    subjectCodeElement.select();
                });
            }

            if (openSubjectOverlay) {
                this._addPhotoButton_click();
            }
        },

        addSubjectCodePhotos: function(photos, name, groupPhoto, group) {
            let photoGroupNode = $(`<div class="photo-group"></div>`)
                .append(`<h3>${name}</h3>`)
                .append($('<button class="gallery-trigger"><i class="fas fa-search-plus"></i></button>')
                    .click(this._subjectGallery_click.bind(this)));
            let photoContainer = $('<div class="subject-photo-container"></div>');

            photos.forEach((url) => {
                if (!url.startsWith(serverUrl) && !url.startsWith('data:')) {
                    url = serverUrl + url.startsWith('/') ? url.substring(1) : url;
                }

                photoContainer.append(
                    $(`<div class="img"><img src="${url}"></div>`).click(this._subjectCodePhoto_click.bind(this))
                );
            });

            let groupPhotoGroupNode = $(`<div class="photo-group"></div>`)
                .append(`<h3>${group}</h3>`)
                .append($('<button class="gallery-trigger"><i class="fas fa-search-plus"></i></button>')
                    .click(this._groupGallery_click.bind(this)));
            let groupPhotoContainer = $('<div class="group-photo-container"></div>');

            if (groupPhoto) {
                groupPhoto.forEach((url) => {
                    groupPhotoContainer.append(
                        $(`<div class="img"><img src="${url}"></div>`).click(this._groupPhoto_click.bind(this))
                    );
                });
            }

            photoGroupNode.append(photoContainer);
            groupPhotoGroupNode.append(groupPhotoContainer);
            this.id['photo-group-container'].append(photoGroupNode);
            if (groupPhoto) {
                this.id['photo-group-container'].append(groupPhotoGroupNode);
            }
        },

        clearCart: function() {
            $('#cart-items').empty();
        },

        displayProducts: function(sessionId) {
            this.controller().listSession({sessionId: sessionId}, (response) => {
                let productElements = [];
                let categories = [];
                let virtuals = [];
                let productIds = response.products.map(i => i.id);
                this._featuredProducts = response.crosssell !== 'false'
                    ? response.crosssell.products.filter(id => productIds.includes(id))
                    : false;

                if (response.enableTouchups || response.enableDigitals) {
                    virtuals.__category = 'virtual';
                    virtuals.__priority = -1;

                    if (response.enableTouchups) {
                        virtuals.push($(`<a class="add-to-cart-link">
                            <div class="product virtual" data-product-id="touchup">
                             <div class="images"><img src="img/touchups.webp"></div>
                             <div class="middle">
                              <h3>${$.i18n('ORDERAPP_TOUCHUP')}</h3>
                              <div class="price">$${response.touchupPrice}</div>
                             </div>
                            </div>
                           </a>`));
                    }

                    if (response.enableDigitals) {
                        virtuals.push($(`<a class="add-to-cart-link">
                            <div class="product virtual" data-product-id="digital">
                             <div class="images"><img src="img/digitals.webp"></div>
                             <div class="middle">
                              <h3>${$.i18n('ORDERAPP_DIGITAL')}</h3>
                              <div class="price">$${response.digitalsPrice[0]}</div>
                             </div>
                            </div>
                           </a>`));
                    }
                }

                for (let product of response.products) {
                    const customTemplate = this.controller()._buildYourOwn[product.custom_id];

                    if (product.type === 'custom' &&
                        (!customTemplate ||
                         !customTemplate.options ||
                         parseInt(customTemplate.options.choices_count, 10) < 1 ||
                         !Array.isArray(customTemplate.options.choices) ||
                         customTemplate.options.choices.length < 1)) {
                        continue;
                    }

                    let category = '';
                    let imageUrl = product.images
                        ? ((product.options.defaultImage
                            ? product.images[product.options.defaultImage]
                            : product.images[Object.keys(product.images)[0]]))
                        : 'img/missing_image.png';

                    if (product.category_id === undefined || product.category_id === '') {
                        category = 'other';
                    } else {
                        category = product.category_id;
                    }

                    if (productElements[category] === undefined) {
                        productElements[category] = [];
                        productElements[category].__category = category;
                        productElements[category].__priority =
                            category === 'other' ?
                                100 :
                                this._getCategoryId(category, response.categories).priority;
                    }

                    productElements[category].push(
                        $(`<a class="add-to-cart-link">
                            <div class="product" data-product-id="${product.id}">
                             <div class="images"><img src="${serverUrl}pub/${imageUrl}"></div>
                             <div class="middle">
                              <h3>${product.name.replaceAll('<', '&lt;').replaceAll('>', '&gt;')}</h3>
                              <div class="price">$${product.price}</div>
                             </div>
                            </div>
                           </a>`)
                    );
                }

                categories = productElements.map(i => i);
                if (Array.isArray(virtuals) && virtuals.length > 0) {
                    categories.push(virtuals);
                }
                if (productElements['other'] && productElements['other'].length > 0) {
                    categories.push(productElements['other']);
                }

                categories = categories.sort((a, b) => {
                    if (+a.__priority > +b.__priority) return 1;
                    if (+a.__priority < +b.__priority) return -1;
                    return 0;
                });

                $('.products')
                    .empty()
                for (let category of categories) {
                    if (category === undefined || category.length === 0) {
                        continue;
                    }

                    let categoryName = category.__category === 'other'
                        ? $.i18n('GENERIC_OTHER')
                        : category.__category === 'virtual'
                            ? '' //$.i18n('GENERIC_VIRTUAL')
                            : this._getCategoryId(category.__category, response.categories).name_locale;

                    $('.products')
                        .append(
                            $(`<div class="product-category ${category.__category === 'virtual' ? 'virtual' : ''}">
                                    <h3>${categoryName}</h3></div>`)
                                .append(category)
                        );
                }

                $('#loading-screen').hide();
            });
        },

        editCartItem: function(itemId) {
            this._editItemId = itemId;

            let cartItem = this.controller().state().cart[itemId].__unwrap;
            let productId = this._addToCartProductId = cartItem.productId;
            let product = this.controller().products()[productId];
            let defaultTheme = cartItem.theme;
            let imageUrl = product.options.defaultImage ?
                product.images[product.options.defaultImage] :
                product.images[Object.keys(product.images)[0]];

            if ($('#selected-photos').children().length === 0) {
                this.feedback($.i18n('ORDERAPP_MESSAGE_NO_PHOTOS'));
                return false;
            }

            if (product.type === 'custom') {
                this._showBuildYourOwnEditOverlay(product, imageUrl, cartItem);
            } else {
                this._showAddToCartEditOverlay(product, defaultTheme, imageUrl, cartItem);
            }
        },

        editDigitalCartItem: function(itemId) {
            this._editItemId = itemId;

            let cartItem = this.controller().state().cart[itemId].__unwrap;

            if ($('#selected-photos').children().length === 0) {
                this.feedback($.i18n('ORDERAPP_MESSAGE_NO_PHOTOS'));
                return false;
            }

            this._showAddToCartDigitalOverlay(cartItem);
        },

        editTouchupCartItem: function(itemId) {
            this._editItemId = itemId;

            let cartItem = this.controller().state().cart[itemId].__unwrap;

            if ($('#selected-photos').children().length === 0) {
                this.feedback($.i18n('ORDERAPP_MESSAGE_NO_PHOTOS'));
                return false;
            }

            this._showTouchupOverlay(cartItem);
        },

        selectPhotoOverlayImg: function(basenameUrl) {
            $('#add-photo-overlay').find(`[src$="${basenameUrl}"]`).addClass('selected');
        },

        triggerChooseGreenScreen: function(imageUrl, chromaKey, callback) {
            let backgroundSelection;
            let warningShown = false;

            this.id['greenscreen-ok'].prop('disabled', true);
            this._child('choose-green-screen-overlay').one('hide-request', () => {
                this._previewChromaKey = null;
                this._confirmChromaKey = null;
            });

            this.id['green-screen-preview'].attr('src', imageUrl);
            this._previewChromaKey = (background) => {
                if (!warningShown) {
                    warningShown = true;
                    this.id['greenscreen-warning'].addClass('show');
                    setImmediate(() => {
                        $('body').one('click', () => this.id['greenscreen-warning'].removeClass('show'));
                    });
                }

                backgroundSelection = background;
                return chromaKey.draw('pub/' + background.url);
            };
            this._confirmChromaKey = () => {
                this._child('choose-green-screen-overlay').hide();
                callback(backgroundSelection);
            };

            if (this.id['background-categories'].children().length === 0) {
                this._populateBackgroundCategories();
            }

            this._child('choose-green-screen-overlay').show();
        },

        removeSelectedPhoto: function(photoId, basenameUrl) {
            $('#selected-photos').find(`[data-photo-id="${photoId}"]`).parent().detach();
            $('#add-photo-overlay').find(`[src$="${basenameUrl}"]`).removeClass('selected');
        },

        showUniqueSessionMessage: function() {
            this._child('unique-session-overlay').show();
        },

        updateCartCounter: function() {
            const cartCount = Object.values(this.controller().state().cart).length;
            const counterElement = $('#cart-counter');
            if (cartCount === 0) {
                counterElement.hide();
            } else {
                counterElement.show();
                counterElement.text(Object.values(this.controller().state().cart).length);
            }

        },

        /* LIFE CYCLE */
        _attach: function() {
            this._super();

            this._createSubjectCode();

            $('#products').on('click', '.add-to-cart-link', this._addToCart_click.bind(this));
            $('#add-to-cart-selected-photos').on('click', 'img', this._addToCartSelectedPhotos_click.bind(this));
            $('#add-to-cart-selected-photos-pre').on('click', 'img', this._addToCartSelectedPhotosPre_click.bind(this));
            $('#digitals-add-to-cart-selected-photos').on('click', 'img', this._addToCartSelectedPhotosDigitals_click.bind(this));
            $('#digitals-selected-photos').on('click', 'img', this._digitalsSelectedPhotos_click.bind(this));
            $('#build-your-own-selected-photos').on('click', 'img', this._buildYourOwnSelectedPhotos_click.bind(this));
            $('#build-your-own-selected-photos-pre').on('click', 'img', this._buildYourOwnSelectedPhotosPre_click.bind(this));
            $('#touchups-selected-photos').on('click', 'img', this._touchupsSelectedPhotos_click.bind(this));
            $('#build-your-own-choices-body').on('click', 'input', this._byopOption_click.bind(this));

            this.id['selected-photos'].on('click', 'img', this._selectedPhotoRemove_click.bind(this));

            if (location.hash !== '') {
                let subjectCode = location.hash.substr(1);

                location.hash = '';

                let handler = () => {
                    if (this.Forms.addPhotoOverlay === undefined) {
                        setTimeout(handler, 1000);
                    } else {
                        this.addSubjectCode(subjectCode, true);
                    }
                }

                handler();
            }
        },


        /* EVENT HANDLERS */
        _addPhotoButton_click: function(event) {
            this._child('add-photo-overlay').toggle();
        },

        _addPhotoHelp_click: function(event) {
            $('#bubble-add-photo').addClass('show');
            $('#add-photo-help').removeClass('show');
        },

        _addPhotoHelpDismiss_click: function(event) {
            $('#bubble-add-photo').removeClass('show');
            $('#add-photo-help').addClass('show');
        },

        _addPhotoOverlayNext_click: function() {
            this._child('add-photo-overlay').hide();
        },

        _addToCart_click: function(event) {
            let productId = $(event.target).parents('.product').attr('data-product-id');

            switch (productId) {
            case 'touchup':
                this._showTouchupOverlay();
                break;

            case 'digital':
                this._showDigitalOverlay();
                break;

            default:
                this._showProductOverlay(productId);
            }
        },

        _addToCartButton_click: function(event) {
            let product = this.controller().products()[this._addToCartProductId];
            let selectionCount = $('#add-to-cart-selected-photos .selected').length;

            if ($('#themes-container [name="themes"]').val() === 'null') {
                this._showAddToCartThemesBubble();
                return;
            }

            if (selectionCount) {
                const theme = $('select[name="themes"]').val();

                this.controller().addCartItem({
                    productId: product.id,
                    quantity: $('select[name="quantity"]').val(),
                    themeLocale: (product.themes_map && Object.keys(product.themes_map).length > 0) ? product.themes_locale[$('select[name="themes"]').val()] : null,
                    themeId: product.themeSetId,
                    theme,
                    selection: $('#add-to-cart-selected-photos img.selected').toArray()
                        .reduce((acc, element) => {
                            acc.push(element.attributes['data-photo-id'].value);
                            return acc;
                        }, []),
                    comment: $('textarea[name="comment"]').val(),
                });

                if ($('#add-to-cart-digital-discount').prop('checked')) {
                    this._addDigitalDiscount($('#add-to-cart-selected-photos img.selected').toArray()
                        .reduce((acc, element) => {
                            acc.push(element.attributes['data-photo-id'].value);
                            return acc;
                        }, []));
                }

                this._child('add-to-cart-overlay').hide();
            } else {
                this._showAddToCartPhotoGuide('show');
            }
        },

        _addToCartDigitalButton_click: function(event) {
            let selectionCount = $('#digitals-add-to-cart-selected-photos .selected').length;

            if (selectionCount) {
                this.controller().addCartItem({
                    productId: 'digital',
                    quantity: 1,
                    theme: null,
                    selection: $('#digitals-add-to-cart-selected-photos img.selected').toArray()
                        .reduce((acc, element) => {
                            acc.push(element.attributes['data-photo-id'].value);
                            return acc;
                        }, []),
                });
                this._child('add-to-cart-digitals').hide();
            } else {
                this._showAddToCartPhotoGuide('show');
            }
        },

        _addToCartNext_click: function(event) {
            if ($('#add-to-cart-selected-photos img.selected').length === 0) {
                return;
            }

            $('#add-to-cart-selected-photos-pre').addClass('selected-photos-hidden');
            $('#add-to-cart-next').hide();

            this._updateDigitalDiscount(
                $('#add-to-cart-selected-photos img.selected').toArray().map(i => i.dataset.photoId));

            $('#add-to-cart-button').show();
        },

        _addToCartByopNext_click: function(event) {
            if ($('#build-your-own-selected-photos img.selected').length !== 1) {
                return;
            }

            $('#build-your-own-selected-photos-pre').addClass('selected-photos-hidden');
            $('#add-to-cart-byop-next').hide();

            this._updateDigitalDiscount(
                $('#build-your-own-selected-photos img.selected').toArray().map(i => i.dataset.photoId));

            $('#add-to-cart-byop-button').show();
        },

        _addToCartTouchupButton_click: function(event) {
            if ($('#add-to-cart-touchups textarea[name="comment"]').val().trim() === '') {
                $('#touchups-message').addClass('show');
                return;
            }
            this.controller().addCartItem({
                productId: 'touchup',
                quantity: 1,
                theme: null,
                comment: $('#add-to-cart-touchups textarea[name="comment"]').val(),
                selection: [$('#touchup-selection')[0].attributes['data-photo-id'].value],
            });

            this._child('add-to-cart-touchups').hide();
        },

        _addToCartTouchupsComment_keydown: function(event) {
            setImmediate(() => {
                if (event.target.value.trim() !== '') {
                    $('#touchups-message').removeClass('show');
                }
            });
        },

        _byopOption_click: function() {
            let product = this.controller().products()[this._addToCartProductId];
            let {customProductSelection} = this._verifyByop(product);
            let buttonDisabled = !(customProductSelection.every(i => i !== undefined));

            $('#add-to-cart-byop-button').prop('disabled', buttonDisabled);
            $('#add-to-cart-byop-edit').prop('disabled', buttonDisabled);

            $(`#build-your-own-choices-body .next-to-select`).toggleClass('next-to-select');

            $(`#build-your-own-choices-body [data-choice=${customProductSelection.findIndex(i => i === undefined) + 1}]`)
                .toggleClass('next-to-select');
            for (const selection of customProductSelection) {
                $(`#build-your-own-choices-body [data-choice=${customProductSelection.filter(i => i).findIndex(i => i === selection ) + 1}]`)
                    .toggleClass('no-selection', false);
            }

            let leftOffset = $(`#build-your-own-choices-body .next-to-select`)?.position()?.left;
            let scrollingPosition = (leftOffset ? (leftOffset  - ($(`#build-your-own-choices-body`).width() / 2) + 50) : $(`#build-your-own-choices-body`).width());

            document.getElementById('build-your-own-selection-section').scrollTo({ left: scrollingPosition, behavior: 'smooth' });
        },

        _addToCartBYOPButton_click: function(event) {
            let product = this.controller().products()[this._addToCartProductId];
            let {hasSelection, customProductSelection} = this._verifyByop(product);

            if (customProductSelection.some(i => i === undefined)) {
                this._showBYOPOptionBubble();
                return;
            }

            if (!hasSelection || $('#build-your-own-selected-photos .selected').attr('data-photo-id') === undefined) {
                event.preventDefault();
                return false;
            }

            this.controller().addCartItem({
                productId: product.id,
                quantity: 1,
                selection: [$('#build-your-own-selected-photos .selected')[0].attributes['data-photo-id'].value],
                comment: $('#build-your-own-overlay textarea[name="comment"]').val(),
                theme: null,
                customProductSelection,
            });

            this._child('build-your-own-overlay').hide();
        },

        _addToCartThemesWarningClose_click: function(event) {
            $('#themes-message').removeClass('show');
        },

        _addToCartTouchupsWarningClose_click: function(event) {
            $('#touchups-message').removeClass('show');
        },

        _addToCartEditButton_click: function(event) {
            let cartItem = this.controller().state().cart[this._editItemId].__unwrap;
            let product = this.controller().products()[this._addToCartProductId];
            let selectionCount = $('#add-to-cart-selected-photos .selected').length;

            if (selectionCount) {
                this.controller().editCartItem({
                    itemId: this._editItemId,
                    productId: product.id,
                    quantity: $('select[name="quantity"]').val(),
                    theme: product.themes_map ? $('select[name="themes"]').val() : null,
                    selection: $('#add-to-cart-selected-photos img.selected').toArray()
                        .reduce((acc, element) => {
                            acc.push(element.attributes['data-photo-id'].value);
                            return acc;
                        }, []),
                    comment: $('textarea[name="comment"]').val()
                });
                this._child('add-to-cart-overlay').hide();
            } else {
                this._showAddToCartPhotoGuide('show');
            }
        },

        _addToCartEditBYOPButton_click: function(event) {
            let cartItem = this.controller().state().cart[this._editItemId].__unwrap;
            let product = this.controller().products()[this._addToCartProductId];
            let {hasSelection, customProductSelection} = this._verifyByop(product);

            if (customProductSelection.some(i => i === undefined)) {
                this._showBYOPOptionBubble();
                return;
            }

            if (!hasSelection || $('#build-your-own-selected-photos .selected').attr('data-photo-id') === undefined) {
                event.preventDefault();
                return false;
            }

            this.controller().editCartItem({
                itemId: this._editItemId,
                productId: product.id,
                quantity: 1,
                selection: [$('#build-your-own-selected-photos .selected')[0].attributes['data-photo-id'].value],
                comment: $('#build-your-own-overlay textarea[name="comment"]').val(),
                theme: null,
                customProductSelection,
            });

            this._child('build-your-own-overlay').hide();
        },

        _addToCartEditDigitalButton_click: function(event) {
            let cartItem = this.controller().state().cart[this._editItemId].__unwrap;
            let selectionCount = $('#digitals-add-to-cart-selected-photos .selected').length;

            if (selectionCount) {
                this.controller().editCartItem({
                    itemId: this._editItemId,
                    productId: 'digital',
                    quantity: 1,
                    selection: $('#digitals-add-to-cart-selected-photos img.selected').toArray()
                        .reduce((acc, element) => {
                            acc.push(element.attributes['data-photo-id'].value);
                            return acc;
                        }, [])
                });
                this._child('add-to-cart-digitals').hide();
            } else {
                this._showAddToCartPhotoGuide('show');
            }
        },

        _addToCartEditTouchupButton_click: function(event) {
            let cartItem = this.controller().state().cart[this._editItemId].__unwrap;

            this.controller().editCartItem({
                itemId: this._editItemId,
                productId: 'touchup',
                quantity: 1,
                selection: [$('#touchup-selection')[0].attributes['data-photo-id'].value],
                comment: $('#add-to-cart-touchups textarea[name="comment"]').val()
            });

            this._child('add-to-cart-touchups').hide();
        },

        _addToCartProductImg_click: function(event) {
            $('#add-to-cart-product-img').toggleClass('zoom');
        },

        _addToCartQuantity_change: function(event) {
            this._addToCartUpdatePrice();
        },

        _addToCartSelectedPhotos_click: function(event) {
            let product = this.controller().products()[this._addToCartProductId];
            let targetNode = $(event.target);

            targetNode.toggleClass('selected');
            if (!product.options.allowMix) {
                let anySelected = $('#add-to-cart-selected-photos')
                    .children(`[data-subject-code='${targetNode.attr('data-subject-code')}']`).hasClass('selected');
                $('#add-to-cart-selected-photos')
                    .children(`:not([data-subject-code='${targetNode.attr('data-subject-code')}'])`)
                        .toggleClass('not-available', anySelected);
            }
            $('#extra-options').toggle(true);

            this._addToCartUpdatePrice();
            this._updateDigitalDiscount(
                $('#add-to-cart-selected-photos img.selected').toArray().map(i => i.dataset.photoId));
        },

        _addToCartSelectedPhotosPre_click: function(event) {
            let product = this.controller().products()[this._addToCartProductId];
            let targetNode = $(event.target);

            targetNode.toggleClass('selected');
            $('#add-to-cart-selected-photos').find(`img[data-photo-id=${event.target.dataset['photoId']}]`).toggleClass('selected');

            if (!product.options.allowMix) {
                let anySelected = $('#add-to-cart-selected-photos')
                    .children(`[data-subject-code='${targetNode.attr('data-subject-code')}']`).hasClass('selected');
                $('#add-to-cart-selected-photos')
                    .children(`:not([data-subject-code='${targetNode.attr('data-subject-code')}'])`)
                    .toggleClass('not-available', anySelected);
                $('#add-to-cart-selected-photos-pre')
                    .children(`:not([data-subject-code='${targetNode.attr('data-subject-code')}'])`)
                    .toggleClass('not-available', anySelected);
            }

            $('#add-to-cart-next').attr('disabled', $('#add-to-cart-selected-photos img.selected').length <= 0);

            this._addToCartUpdatePrice();
        },

        _addToCartSelectedPhotosDigitals_click: function(event) {
            $(event.target).toggleClass('selected');

            this._addToCartUpdateDigitalsPrice();
        },

        _buildYourOwnSelectedPhotos_click: function(event) {
            let targetNode = $(event.target);

            targetNode.toggleClass('selected');
            let isSelected = targetNode.hasClass('selected');

            $('#build-your-own-selected-photos')
                .children(`:not([data-photo-id="${targetNode.attr('data-photo-id')}"])`)
                .toggleClass('not-available', isSelected);
            $('#build-your-own-selected-photos-pre')
                .children(`:not([data-photo-id="${targetNode.attr('data-photo-id')}"])`)
                .toggleClass('not-available', isSelected);

            $('#add-to-cart-byop-button').attr('disabled', $('#build-your-own-selected-photos img.selected').length !== 1);
            $('#add-to-cart-byop-edit').attr('disabled', $('#build-your-own-selected-photos img.selected').length !== 1);
        },

        _buildYourOwnSelectedPhotosPre_click: function(event) {
            let targetNode = $(event.target);

            targetNode.toggleClass('selected');
            $('#build-your-own-selected-photos').find(`img[data-photo-id=${targetNode.attr('data-photo-id')}]`).toggleClass('selected');

            let isSelected = targetNode.hasClass('selected');

            $('#build-your-own-selected-photos')
                .children(`:not([data-photo-id="${targetNode.attr('data-photo-id')}"])`)
                .toggleClass('not-available', isSelected);
            $('#build-your-own-selected-photos-pre')
                .children(`:not([data-photo-id="${targetNode.attr('data-photo-id')}"])`)
                .toggleClass('not-available', isSelected);

            $('#add-to-cart-byop-next').attr('disabled', $('#build-your-own-selected-photos img.selected').length !== 1);
        },

        _addToCartThemes_change: function(event) {
            let targetNode = $(event.target);
            let product = this.controller().products()[this._addToCartProductId];

            $('#themes-container [name="themes"]').children('[value="null"]').detach();
            $('#add-to-cart-product-img').attr('src', `pub/${product.images[product.themes_map[targetNode.val()]]}`);
        },

        _backgroundCategory_click: function(event) {
            let targetNode = $(event.target);

            this.id['background-categories-sel'].find('li').removeClass('selected');
            targetNode.addClass('selected');

            this.id['backgrounds'].empty();
            for (let background of targetNode.data('backgrounds')) {
                this.id['backgrounds'].append(
                    $(`<img src="${serverUrl + 'pub/' + background.url}">`).click(this._background_click.bind(this))
                );
            }
        },

        _backgroundCategoryFavorites_click: function(event) {
            this.id['background-categories-sel'].find('li').removeClass('selected');
            this.id['fav-item'].addClass('selected');

            this._populateBackgrounds(
                Object.values(this.controller().state().backgrounds.favs.__unwrap)
            );
        },

        _backgroundCategoryRecent_click: function(event) {
            this.id['background-categories-sel'].find('li').removeClass('selected');
            this.id['recent-item'].addClass('selected');

            this._populateBackgrounds(
                Object.values(this.controller().state().backgrounds.recents.__unwrap)
            );
        },

        _backgroundCategoryFeatured_click: function(event) {
            this.id['background-categories-sel'].find('li').removeClass('selected');
            this.id['featured-item'].addClass('selected');

            this._populateBackgrounds(
                Object.values(this._featuredBackgrounds)
            );
        },

        _backgroundOk_click: function(event) {
            this._confirmChromaKey();
        },

        _cartButton_click: function(event) {
            this._child('cart-overlay').toggle();
            this.id['complete-order'].removeClass('activated');
        },

        _cartCompleteOrder_click: function(event) {
            this.id['complete-order'].addClass('activated');

            let cartItemIds = Object.values(this.controller().state().cart.__unwrap).map(i => i.productId);
            if (this.controller().crosssell() !== 'false' && this._flagCrosssell === undefined) {
                if (this._featuredProducts) {
                    let cartProductIds = Object.values(this.controller().products()).map(i => i.productId);
                    let featuredProducts = this._featuredProducts.filter(id => !cartItemIds.includes(id)).shuffle().slice(0, 3);

                    if (featuredProducts.length) {
                        for (let featuredProduct of featuredProducts) {
                            let product = this.controller().products()[featuredProduct];
                            let imageUrl = product.options.defaultImage ?
                                product.images[product.options.defaultImage] :
                                product.images[Object.keys(product.images)[0]];

                            $('#cross-sell-items').append(
                                $(`<ul data-id="${product.id}"><img src="${serverUrl + 'pub/' + imageUrl}"><h4>${product.name.replaceAll('<', '&lt;').replaceAll('>', '&gt;')}</h4><div class="price">$${product.price}</div></ul>`)
                                    .click(this._crosssell_click.bind(this))
                            );
                        }

                        this._child('cross-sell-overlay').show();
                        this._flagCrosssell = true;
                        this.id['complete-order'].removeClass('activated');

                        return;
                    }
                }
            }

            this.controller().validateProceedCheckout();
        },

        _clearSession_click: function(event) {
          this.controller().clearSession();
        },

        _crosssell_click: function(event) {
            let productId = $(event.currentTarget).attr('data-id');

            this._child('cross-sell-overlay').hide();

            $(`[data-product-id="${productId}"]`).children().first().click();
        },

        _crosssellCompleteOrder_click: function(event) {
            this.id['cross-sell-complete-order'].removeClass('activated');
            this.controller().validateProceedCheckout();
        },

        _extraOption_click: function(event) {
            this._addToCartUpdatePrice();
        },

        _extraByopOptions_click: function(event) {
           this._addToCartUpdateByopPrice();
        },

        /*_host_subjectCodeExist: function(event) {
            "on[subject-code-exist]";

            this.feedback($.i18n('ORDERAPP_ERROR_SUBJECT_CODE_ADDED', event.code));
        },*/

        _greenScreenWarningClose_click: function(event) {
            $('#greenscreen-warning').removeClass('show')
        },

        _groupGallery_click: function(event) {
            let imageContainer = $(event.currentTarget).parent('.photo-group').find('.group-photo-container');

            this._gallery.show(imageContainer);
        },

        _groupPhoto_click: function(event) {
            this.controller().selectPhoto(event.target.src.slice(serverUrl.length));
        },

        _selectedPhotoRemove_click: function(event) {
            if (!this.controller().unselectPhoto($(event.target).attr('data-photo-id'))) {
                this.feedback($.i18n('ORDERAPP_ERROR_CANT_REMOVE_PHOTO'));
            }
        },

        _showSubjectCodeOverlayButton_click: function(event) {
            this.Forms.addSubjectCodeOverlay.clear();
            this._child('subject-name').text('', '-error');
        },

        _subjectCodeAdd_click: function(event) {
            let subjectCode = ((event.target.id === 'subject-code-add-button-home' || event.target.id === 'subject-code-add-input-home') ?
                $('[name="subject-code-home"]').val() :
                $('[name="subject-code"]').val()).trim();

            this.addSubjectCode(subjectCode, event.target.id === 'subject-code-add-button-home');
        },

        _subjectCodePhoto_click: function(event) {
            this.controller().selectPhoto(event.target.src.slice(serverUrl.length));
        },

        _subjectCode_error: function() {
            this._child('subject-name').text($.i18n('ORDERAPP_SUBJECT_NAME_ERROR'), '+error');
            this._child('subject-name-home').text($.i18n('ORDERAPP_SUBJECT_NAME_ERROR'), '+error');
            this.id['subject-code-add-button-home'].prop('disabled', true);
            this.id['missing-code'].css('visibility', 'hidden');
            this.id['subject-code-add-input-home-spinner'].removeClass('searching');
            this.id['subject-code-add-input-spinner'].removeClass('searching');
        },

        _subjectCode_found: function(name) {
            this._child('subject-name').text(name, '-error');
            this._child('subject-name-home').text(name, '-error');
            this.id['subject-code-add-button'] .prop('disabled', false);
            this.id['subject-code-add-button-home'].prop('disabled', false);
            this.id['missing-code'].css('visibility', 'hidden');
            this.id['subject-code-add-input-home-spinner'].removeClass('searching');
            this.id['subject-code-add-input-spinner'].removeClass('searching');
        },

        _subjectCode_keyup: function(event) {
            if (this.subjectCodeKeyupTimeOutId) {
                clearTimeout(this.subjectCodeKeyupTimeOutId);
            }
            if ($(event.target).val() && event.keyCode !== VK_CODES.ENTER) {
                this.subjectCodeKeyupTimeOutId = setTimeout(() => {
                    this._subjectCode.validate($(event.target).val());
                }, 750);
            } else if (event.target.id === 'subject-code-add-input-home' && $(event.target).val() && event.keyCode === VK_CODES.ENTER) {
                $('#subject-code-add-button-home').click();
            }
        },

        _subjectCode_notFound: function() {
            this._child('subject-name').text($.i18n('ORDERAPP_SUBJECT_NAME_NOTFOUND'), '+error');
            this._child('subject-name-home').text($.i18n('ORDERAPP_SUBJECT_NAME_NOTFOUND'), '+error');
            this.id['subject-code-add-button'] .prop('disabled', true);
            this.id['subject-code-add-button-home'].prop('disabled', true);
            this.id['missing-code'].css('visibility', 'visible');
            this.id['subject-code-add-input-home-spinner'].removeClass('searching');
            this.id['subject-code-add-input-spinner'].removeClass('searching');
        },

        _subjectCode_searching: function() {
            this.id['subject-code-add-input-home-spinner'].addClass('searching');
            this.id['subject-code-add-input-spinner'].addClass('searching');
            this._child('subject-name').text('', '-error');
            this._child('subject-name-home').text('', '-error');
            this.id['subject-code-add-button-home'].prop('disabled', true);
            this.id['missing-code'].css('visibility', 'hidden');
        },

        _subjectGallery_click: function(event) {
           let imageContainer = $(event.currentTarget).parent('.photo-group').find('.subject-photo-container');

           this._gallery.show(imageContainer);
        },

        _digitalsSelectedPhotos_click: function(event) {
            $(event.target).toggleClass('selected');
            $('#digitals-add-to-cart-selected-photos').find(`img[data-photo-id=${event.target.dataset['photoId']}]`).toggleClass('selected');
            this._addToCartUpdateDigitalsPrice();
        },

        _touchupsSelectedPhotos_click: function(event) {
            $('#touchup-selection').attr('src', $(event.target).attr('src'));
            $('#touchup-selection').attr('data-photo-id', $(event.target).attr('data-photo-id'));
            $('#touchups-selected-photos').addClass('selected-photos-hidden');
        },

        _uniqueSessionClearSession_click: function(event) {
            this._child('unique-session-overlay').hide();
            this.feedbackYesNo($.i18n('ORDERAPP_CLEAR_SESSION_CONFIRM'), null, null, (results) => {
                if (results.status === 'ok') {
                    this.controller().clearSession();
                }
            });
        },

        _uniqueSessionOk_click: function(event) {
            this._child('unique-session-overlay').hide();
        },


        /* PRIVATE */
        _addDigitalDiscount: function(selection) {
            const digitalCartItem = this.controller().getDigitalCartItem();

            if (digitalCartItem.length === 0) {
                this.controller().addCartItem({
                    productId: 'digital',
                    quantity: 1,
                    theme: null,
                    selection,
                });
            } else {
                this.controller().editCartItem({
                    itemId: digitalCartItem[0],
                    productId: 'digital',
                    quantity: 1,
                    selection: [...selection, ...this.controller().getDigitalCartItemSelection()]
                        .reduce((selection, id) => {
                            if (!selection.includes(id)) {
                                selection.push(id);
                            }
                            return selection;
                        }, []),
                });
            }
        },

        _addToCartUpdatePrice: function() {
            let product = this.controller().products()[this._addToCartProductId];
            let selectionCount = $('#add-to-cart-selected-photos .selected').length;
            let quantity = $('select[name="quantity"]').val();

            let total = this.controller().calculateItemSubtotal(product, selectionCount, quantity);
            let totalNoOptions = total;

            this._child('add-to-cart-product-price').text(
                this.controller().calculateItemDisplayedPrice(totalNoOptions, selectionCount, quantity) > 0 ?
                    this.controller().calculateItemDisplayedPrice(totalNoOptions, selectionCount, quantity) :
                    product.price
            );

            this._child('add-to-cart-selection-quantity').text(selectionCount);
            this._child('add-to-cart-total-price').text(total);
        },

        _addToCartUpdateDigitalsPrice: function() {
            let selection = $('#digitals-add-to-cart-selected-photos .selected').toArray().map(i => i.dataset.photoId);
            let digitalPrice = this.controller().calculateDigitalsPrice(selection,
                this.controller().getDiscountEligibleSelection(selection));
            this._child('digitals-add-to-cart-price').text(digitalPrice > 0 ? digitalPrice : 0);
        },

        _addToCartUpdateByopPrice: function() {
            let product = this.controller().products()[this._addToCartProductId];
            let selectionCount = 1;
            let quantity = 1;

            this._child('add-to-cart-byop-price').text(
                this.controller().calculateItemSubtotal(product, selectionCount, quantity));
        },

        _createSubjectCode: function() {
            this._subjectCode = new SubjectCode()
                .on('error', this._subjectCode_error.bind(this))
                .on('found', this._subjectCode_found.bind(this))
                .on('searching', this._subjectCode_searching.bind(this))
                .on('not-found', this._subjectCode_notFound.bind(this));
        },

        _getCategoryId: function(id, categories) {
            let category;

            for (let c of categories) {
                if (+c.id === +id) {
                    category = c;
                }
            }

            if (!category) {
                throw new Error(`Category ${id} not found`);
            }

            return category;
        },

        _populateBackgroundCategories: function() {
            if (this.triggerChooseGreenScreen.loaded === undefined) {
                this.triggerChooseGreenScreen.loaded = true;

                this.controller().listBackrounds(null, (categories, backgrounds, featured) => {
                    let liNodes = [];

                    for (let i = 0, keys = Object.keys(backgrounds), length = keys.length, categoryId = keys[0]; i < length; categoryId = keys[++i]) {
                        liNodes.push(
                            $(`<li class="category">${categories[categoryId][HeO2.config.read('Config.language')]}</li>`)
                                .data('backgrounds', backgrounds[categoryId])
                                .click(
                                    (event) => {
                                        let targetNode = $(event.target);

                                        this.id['background-categories-sel'].find('li').removeClass('selected');
                                        targetNode.addClass('selected');

                                        this._populateBackgrounds(targetNode.data('backgrounds'));
                                    }
                                )
                        );
                    }

                    this._featuredBackgrounds = featured;
                    this.id['background-categories'].append(liNodes);
                    this.id['featured-item'].click();
                });
            }
        },

        _populateBackgrounds: function(backgrounds) {
            let selectedBackground = null;

            this.id['backgrounds'].empty();
            backgrounds.forEach((background) => {
                this.id['backgrounds'].append(
                    $('<div class="background-container"></div>').append([
                        $(`<i class="fav fa fa-heart ${this.controller().state().backgrounds.favs[background.url] ? 'selected' : ''}"></i>`)
                            .click(
                                (event) => {
                                    if (this.controller().state().backgrounds.favs[background.url]) {
                                        delete this.controller().state().backgrounds.favs[background.url];
                                        $(event.target).removeClass('selected');
                                    } else {
                                        this.controller().state().backgrounds.favs[background.url] = background;
                                        $(event.target).addClass('selected');
                                    }
                                }
                            ),
                        $(`<img src="${serverUrl + 'pub/' + background.url}" title="${background.locales[HeO2.config.read('Config.language')]}">`)
                            .click(
                                (event) => {
                                    this.id['backgrounds'].find('img').removeClass(BACKGROUND_SELECTED_CLASS);
                                    $(event.target).addClass(BACKGROUND_SELECTED_CLASS);

                                    if (this.controller().state().backgrounds.recents[background.url] === undefined) {
                                        this.controller().state().backgrounds.recents[background.url] = background;
                                    }

                                    this._previewChromaKey(background).then((dataUrl) => {
                                        this.id['green-screen-preview'].attr('src', dataUrl);
                                    });

                                    this.id['greenscreen-ok'].prop('disabled', false);
                                }
                            ),
                        $(`<span>${background.productionIdentifier}</span>`)
                    ])
                );
            });
        },

        _showAddToCartOverlay(product, defaultTheme, imageUrl) {
            $('select[name="themes"]').empty();

            if (defaultTheme) {
                $('#themes-container').css('display', 'block');
                $('select[name="themes"]')
                    .append(`<option value="null">(${$.i18n('ORDERAPP_CHOOSE_THEME')})</option>`)
                    .append(Object.keys(product.themes).reduce((acc, key) => {
                        acc.push(`<option value="${key}">${product.themes[key]}</option>`);
                        return acc;
                    }, []));
            } else {
                $('#themes-container').css('display', 'none');
            }

            $('#add-to-cart-product-img').attr('src', `${serverUrl}pub/${imageUrl}`);
            //$('#add-to-cart-button').attr('disabled', true);
            $('select[name="quantity"]').val(1);
            $('textarea[name="comment"]').val('');
            this._child('add-to-cart-product-name').text(product.name.replaceAll('<', '&lt;').replaceAll('>', '&gt;'));
            this._child('add-to-cart-desc').text(product.description);
            this._child('add-to-cart-product-price').text(product.price);
            this._child('add-to-cart-selection-quantity').text('0');
            this._child('add-to-cart-total-price').text('0');

            $('#digital-discount').toggle(this.controller().isProductDiscountEligible(product.id));
            $('#add-to-cart-digital-discount').prop('checked', false);

            if (product.options.groupPhotoAllow && !product.options.groupPictureOnly) {
                $('#add-to-cart-selected-photos')
                    .empty()
                    .append($('#selected-photos').children().find('img').clone());
                $('#add-to-cart-selected-photos-pre')
                    .empty()
                    .append($('#selected-photos').children().find('img').clone());
            } else if (product.options.groupPhotoAllow && product.options.groupPictureOnly) {
                $('#add-to-cart-selected-photos')
                    .empty()
                    .append($('#selected-photos').children('[data-group]').find('img').clone());
                $('#add-to-cart-selected-photos-pre')
                    .empty()
                    .append($('#selected-photos').children('[data-group]').find('img').clone());
            } else {
                $('#add-to-cart-selected-photos')
                    .empty()
                    .append($('#selected-photos').children(':not([data-group])').find('img').clone());
                $('#add-to-cart-selected-photos-pre')
                    .empty()
                    .append($('#selected-photos').children(':not([data-group])').find('img').clone());
            }

            $('#add-to-cart-selected-photos-pre').removeClass('selected-photos-hidden').show();

            $('#add-to-cart-next').removeClass('hidden').show().attr('disabled', true);
            $('#add-to-cart-button').hide();
            $('#add-to-cart-edit').hide();
            this._child('add-to-cart-overlay').show();
        },

        _showAddToCartEditOverlay(product, defaultTheme, imageUrl, cartItem) {
            this._addToCartProductId = product.id;

            if (defaultTheme) {
                $('#themes-container').css('display', 'block');
                $('select[name="themes"]')
                    .empty()
                    .append(Object.keys(product.themes).reduce((acc, key) => {
                        acc.push(`<option value="${key}" ${defaultTheme === key ? 'selected' : ''}>${product.themes[key]}</option>`);
                        return acc;
                    }, []));
            } else {
                $('#themes-container').css('display', 'none');
            }

            $('#digital-discount').hide();

            if (product.options.groupPhotoAllow && !product.options.groupPictureOnly) {
                $('#add-to-cart-selected-photos')
                    .empty()
                    .append($('#selected-photos').children().find('img').clone());
            } else if (product.options.groupPhotoAllow && product.options.groupPictureOnly) {
                $('#add-to-cart-selected-photos')
                    .empty()
                    .append($('#selected-photos').children('[data-group]').find('img').clone());
            } else {
                $('#add-to-cart-selected-photos')
                    .empty()
                    .append($('#selected-photos').children(':not([data-group])').find('img').clone());
            }
            $('#add-to-cart-selected-photos-pre').addClass('selected-photos-hidden').hide();

            $('#add-to-cart-product-img').attr('src', `${serverUrl}pub/${imageUrl}`);
            //$('#add-to-cart-button').attr('disabled', true);
            $('select[name="quantity"]').val(cartItem.quantity);
            $('textarea[name="comment"]').val(cartItem.comment ? cartItem.comment : '');

            if (cartItem.theme) {
                $('select[name="themes"]').val(cartItem.theme).change();
            }

            this._child('add-to-cart-product-name').text(product.name.replaceAll('<', '&lt;').replaceAll('>', '&gt;'));
            this._child('add-to-cart-desc').text(product.description);
            this._child('add-to-cart-total-price').text(this._addToCartUpdatePrice());

            let targetNode;
            for (let photoId of cartItem.selection) {
                targetNode = $('#add-to-cart-selected-photos')
                    .find(`[data-photo-id="${photoId}"]`)
                    .addClass('selected');
            }

            if (!product.options.allowMix) {
                let anySelected = $('#add-to-cart-selected-photos')
                    .children(`[data-subject-code='${targetNode.attr('data-subject-code')}']`).hasClass('selected');
                $('#add-to-cart-selected-photos')
                    .children(`:not([data-subject-code='${targetNode.attr('data-subject-code')}'])`)
                    .toggleClass('not-available', anySelected);
            }

            this._addToCartUpdatePrice();

            $('#add-to-cart-next').hide();
            $('#add-to-cart-button').hide();
            $('#add-to-cart-edit').show();
            this._child('add-to-cart-overlay').show();
        },

        _showAddToCartDigitalOverlay(cartItem) {
            const enableDigitalGroups = this.controller().isDigitalGroupEnabled();
            const cloneSelector = `img${!enableDigitalGroups ? ':not([data-group])' : ''}`;

            this._addToCartProductId = cartItem.productId;

            $('#digitals-add-to-cart-selected-photos')
                .empty()
                .append($('#selected-photos').children().find(cloneSelector).clone());
            $('#digitals-selected-photos')
                .empty()
                .append($('#selected-photos').children().find(cloneSelector).clone());

            this._child('digitals-add-to-cart-price').text(this._addToCartUpdateDigitalsPrice());

            for (let photoId of cartItem.selection) {
                $('#digitals-add-to-cart-selected-photos')
                    .find(`[data-photo-id="${photoId}"]`)
                    .addClass('selected');
                $('#digitals-selected-photos')
                    .find(`[data-photo-id="${photoId}"]`)
                    .addClass('selected');
            }

            this._addToCartUpdateDigitalsPrice();

            $('#add-to-cart-digitals-button').hide();
            $('#add-to-cart-digitals-edit').show();
            this._child('add-to-cart-digitals').show();
        },

        _showAddToCartThemesBubble() {
            $('#themes-message').addClass('show');

            setTimeout(() => {
                $('body').one('click', () => $('#themes-message').removeClass('show'));
            });
        },

        _showAddToCartPhotoGuide(show) {
            if (show === 'show') {
                this.feedback($.i18n('ORDERAPP_MESSAGE_NO_PHOTOS_SELECTED'));
            }
        },

        _showBuildYourOwnOverlay(product, imageUrl) {
            let buildYourOwn = this.controller().buildYourOwn()[product.custom_id];

            this._child('build-your-own-title').text(product.name.replaceAll('<', '&lt;').replaceAll('>', '&gt;'));
            this._child('add-to-cart-byop-description').text(product.description);

            $('#build-your-own-product-img').attr('src', `${serverUrl}pub/${imageUrl}`);

            if (product.options.groupPhotoAllow && !product.options.groupPictureOnly) {
                $('#build-your-own-selected-photos')
                    .empty()
                    .append($('#selected-photos').children().find('img').clone());
                $('#build-your-own-selected-photos-pre')
                    .empty()
                    .append($('#selected-photos').children().find('img').clone());
            } else if (product.options.groupPhotoAllow && product.options.groupPictureOnly) {
                $('#build-your-own-selected-photos')
                    .empty()
                    .append($('#selected-photos').children('[data-group]').find('img').clone());
                $('#build-your-own-selected-photos-pre')
                    .empty()
                    .append($('#selected-photos').children('[data-group]').find('img').clone());
            } else {
                $('#build-your-own-selected-photos')
                    .empty()
                    .append($('#selected-photos').children(':not([data-group])').find('img').clone());
                $('#build-your-own-selected-photos-pre')
                    .empty()
                    .append($('#selected-photos').children(':not([data-group])').find('img').clone());
            }

            $('#build-your-own-choices-head-tr')
                .children(':not(.choices-header)').remove();
            $('#build-your-own-choices-head-tr')
                .append(Array.from(Array(+buildYourOwn.options.choices_count), (_, i) => i + 1)
                                .reduce((a, column) => {return a + `<th>#${column}</th>`}, '')
                );

            $('#build-your-own-choices-body')
                .empty()
                .append(buildYourOwn.options.choices.map(choice => `<tr>
                        <td class="choice-label"><label>${choice}</label></td>
                        ${
                            Array.from(Array(+buildYourOwn.options.choices_count), (_, i) => i + 1)
                                .reduce((a, column) => {return a + `<td><label class="option no-selection" data-choice="${column}"><input type="radio" name="byop-${product.id}-${column}" value="${btoa(choice)}"></label></td>`}, '')
                        }
                     </tr>`)
                );

            $('#build-your-own-choices-body [data-choice=1]').toggleClass('next-to-select', true);

            this._child('add-to-cart-byop-price').text(
                this.controller().calculateItemSubtotal(product, 1, 1));

            $('#build-your-own-selected-photos-pre').removeClass('selected-photos-hidden').show();

            $('#add-to-cart-byop-next').removeClass('hidden').show().attr('disabled', true);
            $('#add-to-cart-byop-button').hide();
            $('#add-to-cart-byop-edit').hide();
            this._child('build-your-own-overlay').show();
        },

        _showBuildYourOwnEditOverlay(product, imageUrl, cartItem) {
            let buildYourOwn = this.controller().buildYourOwn()[product.custom_id];

            this._child('build-your-own-title').text(product.name.replaceAll('<', '&lt;').replaceAll('>', '&gt;'));
            this._child('add-to-cart-byop-description').text(product.description);

            $('#build-your-own-product-img').attr('src', `${serverUrl}pub/${imageUrl}`);

            if (product.options.groupPhotoAllow && !product.options.groupPictureOnly) {
                $('#build-your-own-selected-photos')
                    .empty()
                    .append($('#selected-photos').children().find('img').clone());
            } else if (product.options.groupPhotoAllow && product.options.groupPictureOnly) {
                $('#build-your-own-selected-photos')
                    .empty()
                    .append($('#selected-photos').children('[data-group]').find('img').clone());
            } else {
                $('#build-your-own-selected-photos')
                    .empty()
                    .append($('#selected-photos').children(':not([data-group])').find('img').clone());
            }

            $('#build-your-own-selected-photos')
                .find(`[data-photo-id="${cartItem.selection[0]}"]`)
                    .click();

            $('#build-your-own-choices-head-tr')
                .children(':not(.choices-header)').remove();
            $('#build-your-own-choices-head-tr')
                .append(Array.from(Array(+buildYourOwn.options.choices_count), (_, i) => i + 1)
                    .reduce((a, column) => {return a + `<th>#${column}</th>`}, '')
                );
            $('#build-your-own-choices-body')
                .empty()
                .append(buildYourOwn.options.choices.map(choice => `<tr>
                        <td class="choice-label"><label>${choice}</label></td>
                        ${
                        Array.from(Array(+buildYourOwn.options.choices_count), (_, i) => i + 1)
                            .reduce((a, column) => {return a + `<td><label class="option" data-choice="${column}"><input type="radio" name="byop-${product.id}-${column}" value="${btoa(choice)}"></label></td>`}, '')
                    }
                     </tr>`)
                );


            let column = 0;
            for (let selection of cartItem.customProductSelection) {
                $(`[name="byop-${product.id}-${++column}"][value="${btoa(selection)}"]`).prop('checked', true);
            }

            this._addToCartUpdateByopPrice();
            $('#build-your-own-selected-photos-pre').addClass('selected-photos-hidden').hide();

            $('#add-to-cart-byop-next').hide();
            $('#add-to-cart-byop-button').hide();
            $('#add-to-cart-byop-edit').show();

            this._child('build-your-own-overlay').show();
        },

        _showBYOPOptionBubble: function() {
            $('#byop-choices-remaining-warning').addClass('show');

            setTimeout(() => {
                $('body').one('click', () => this.id['byop-choices-remaining-warning'].removeClass('show'));
            });
        },

        _showProductOverlay: function(productId) {
            let product = this.controller().products()[productId];

            if (product === undefined) {
                return;
            }

            let swappedThemesMap = product.type === 'themed'
                ? Object.entries(product.themes_map).reduce((acc, [key, value]) => {
                        acc[value] = key;
                        return acc;
                    }, {})
                : null;
            let defaultTheme = product.type === 'themed' ?
                product.options.defaultImage ?
                    swappedThemesMap[product.options.defaultImage]
                    : swappedThemesMap[Object.keys(product.images)[0]]
                : null;
            let imageUrl = product.options.defaultImage ?
                product.images[product.options.defaultImage] :
                product.images[Object.keys(product.images)[0]];

            if ($('#selected-photos').children().length === 0) {
                this.feedback($.i18n('ORDERAPP_MESSAGE_NO_PHOTOS'));
                return false;
            } else {
                let onlyGroup = true;
                let onlySubject = true;

                for (let i = 0; i < $('#selected-photos').children().length; i++) {
                    if ($('#selected-photos').children()[i].getAttribute('data-group') !== null) {
                        onlySubject = false;
                        continue;
                    }
                    onlyGroup = false;
                }

                if (onlyGroup && !(product.options.groupPhotoAllow !== undefined)) {
                    this.feedback($.i18n('ORDERAPP_MESSAGE_ONLY_GROUP_NOT_ALLOWED'));
                    return false;
                }

                if (onlySubject && product.options.groupPictureOnly) {
                    this.feedback($.i18n('ORDERAPP_MESSAGE_ONLY_GROUP_ALLOWED'));
                    return false;
                }
            }

            this._addToCartProductId = productId;

            if (product.type === 'custom') {
                this._showBuildYourOwnOverlay(product, imageUrl);
            } else {
                this._showAddToCartOverlay(product, defaultTheme, imageUrl);
            }
        },

        _showDigitalOverlay: function() {
            const [cartItemId, cartItem] = this.controller().getDigitalCartItem();
            const enableDigitalGroups = this.controller().isDigitalGroupEnabled();
            const cloneSelector = `img${!enableDigitalGroups ? ':not([data-group])' : ''}`;

            if (cartItem) {
                this._editItemId = cartItemId;
                this._showAddToCartDigitalOverlay(cartItem);
                return;
            }

            if ($('#selected-photos').children().length === 0) {
                this.feedback($.i18n('ORDERAPP_MESSAGE_NO_PHOTOS'));
                return false;
            } else {
                $('#digitals-add-to-cart-selected-photos')
                    .empty()
                    .append($('#selected-photos').find(cloneSelector).clone());
                $('#digitals-selected-photos')
                    .empty()
                    .append($('#selected-photos').find(cloneSelector).clone());
                $('#digitals-selected-photos').removeClass('selected-photos-hidden');
                this._addToCartUpdateDigitalsPrice();
                $('#add-to-cart-digitals-button').show();
                $('#add-to-cart-digitals-edit').hide();
            }

            this._child('add-to-cart-digitals').show();
        },

        _showTouchupOverlay: function(cartItem) {
            if (cartItem && cartItem.selection.length === 1) {
                $('#touchup-selection').attr('src', $(`[data-photo-id="${cartItem.selection[0]}"]`).attr('src'));
                $('#touchup-selection').attr('data-photo-id', cartItem.selection[0]);
                $('#add-to-cart-touchups textarea[name="comment"]').val(cartItem.comment);
                $('#add-to-cart-touchups-button').hide();
                $('#add-to-cart-touchups-edit').show();
                $('#touchups-selected-photos').addClass('selected-photos-hidden');
            } else if ($('#selected-photos').children().length === 0) {
                this.feedback($.i18n('ORDERAPP_MESSAGE_NO_PHOTOS'));
                return false;
            } else {
                $('#touchup-selection').attr('src', '');
                $('#touchup-selection').attr('data-photo-id', '');
                $('#add-to-cart-touchups textarea[name="comment"]').val('');
                $('#touchups-selected-photos')
                    .empty()
                    .append($('#selected-photos').find('img').clone());

                let selectedPhotos = this.controller().getTouchupSelectedPhotos();

                for (let photo of selectedPhotos) {
                    $('#touchups-selected-photos')
                        .find(`[data-photo-id="${photo}"]`)
                        .wrap(`<div class="already-selected" data-text-after="${$.i18n('ORDERAPP_TOUCHUP_CHOSEN')}"></div>`);
                }

                $('#touchups-message').removeClass('show');
                $('#touchups-selected-photos').removeClass('selected-photos-hidden');
                $('#add-to-cart-touchups-button').show();
                $('#add-to-cart-touchups-edit').hide();
            }

            this._child('add-to-cart-touchup-price').text(this.controller().calculateTouchupSubtotal());
            this._child('add-to-cart-touchups').show();
        },

        _updateDigitalDiscount: function(itemSelection) {
            itemSelection = this.controller().filterPhotoSelectionForEligibleDiscount(itemSelection);
            let overlap = this.controller().digitalOverlap(itemSelection);
            let eligibleSelection = this.controller().getDiscountEligibleSelectionFromProducts();
            let fullPrice = this.controller().calculateDigitalsPrice([...itemSelection], []);
            let discountPrice = this.controller().calculateDigitalsPrice([...itemSelection],
                this.controller().getDiscountEligibleSelection(itemSelection, itemSelection).filter(i => !eligibleSelection.includes(i)));

            this.id['add-to-cart-digital-discount-no-overlap'].hide();
            this.id['add-to-cart-digital-discount-overlap'].hide();
            this.id['add-to-cart-digital-discount-full-overlap'].hide();

            if (fullPrice - discountPrice === 0) {
                this.id['digital-discount'].css('height', '0');
            } else if (Array.isArray(overlap) && itemSelection.some(i => !overlap.includes(i))) {
                this.id['digital-discount'].css('height', 'auto');
                this.id['add-to-cart-digital-discount-overlap'].show();
                this.id['add-to-cart-digital-discount-count'].text(
                    $.i18n('ORDERAPP_ADD_TO_CART_DIGITAL_DISCOUNT_OVERLAP_OPTION',
                        itemSelection.length - overlap.length,
                        (itemSelection.length - overlap.length) > 1 ? 's' : ''));
                this.id['add-to-cart-digital-discount-amount'].text(
                    $.i18n('ORDERAPP_ADD_TO_CART_DIGITAL_DISCOUNT_AMOUNT', fullPrice - discountPrice));
                this.id['add-to-cart-digital-discount-count'].show();
                this.id['add-to-cart-digital-discount-add-checkbox'].show();
                this.id['add-to-cart-eligible-for-discount'].hide();
            } else if (overlap === false || overlap.length === 0) {
                this.id['digital-discount'].css('height', 'auto');
                this.id['add-to-cart-digital-discount-no-overlap'].show();
                this.id['add-to-cart-digital-discount-count'].text(
                    $.i18n('ORDERAPP_ADD_TO_CART_DIGITAL_DISCOUNT_OVERLAP_OPTION',
                        itemSelection.length,
                        itemSelection.length > 1 ? 's' : ''));
                this.id['add-to-cart-digital-discount-amount'].text(
                    $.i18n('ORDERAPP_ADD_TO_CART_DIGITAL_DISCOUNT_AMOUNT', fullPrice - discountPrice));
                this.id['add-to-cart-digital-discount-count'].show();
                this.id['add-to-cart-digital-discount-add-checkbox'].show();
                this.id['add-to-cart-eligible-for-discount'].hide();
            } else {
                this.id['digital-discount'].css('height', 'auto');
                this.id['add-to-cart-eligible-for-discount'].text($.i18n('ORDERAPP_ADD_TO_CART_ELIGIBLE_DISCOUNT', fullPrice - discountPrice));
                this.id['add-to-cart-eligible-for-discount'].show();
                this.id['add-to-cart-digital-discount-full-overlap'].show();
                this.id['add-to-cart-digital-discount-add-checkbox'].hide();
                this.id['add-to-cart-digital-discount-count'].hide();
            }
        },

        _verifyByop: function(product) {
            let hasSelection = true;
            let customProductSelection = [];
            let i = 1;

            do {
                let elementName = `byop-${product.id}-${i}`;
                let input = $(`[name="${elementName}"]:checked`);

                if (input.length === 0) {
                    customProductSelection.push(undefined);
                    continue;
                }

                hasSelection = hasSelection && input.length > 0;
                customProductSelection.push(atob(input.val()));
            } while (++i, $(`[name="byop-${product.id}-${i}"]`).length > 0);

            return {hasSelection, customProductSelection};
        }
    });

    Host.create(OrderAppController, OrderAppView);
}(HeO2, jQuery, window.location));
