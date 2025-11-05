(function (HeO2, $) {
    "use strict";

    const ViewCompoment = HeO2.require('HeO2.View.Component');
    const helpers = HeO2.require('HeO2.common.helpers');

    const CART_DEFAULTS = {
        complete: false,
        target: '#cart-items',
        products: []
    };

    const CHROMA_KEY_COLOR_KEY = [
        { x: 0, y: 0 },
        { x: '100%', y: 0 }
    ];
    const CHROMA_KEY_TOLERANCE = {
        r: 55,
        g: 60,
        b: 60
    };

    const CartComponent = ViewCompoment.extend({
        init: function (host, options) {
            this._super(host, {});

            this._options = helpers.merge(CART_DEFAULTS, options);
        },
        _attach: function () {
            $(this._options.target).on('click', '.edit-item', this._editItem_click.bind(this));
            $(this._options.target).on('click', '.remove-item', this._removeItem_click.bind(this));
            $(this._options.target).on('click', '.confirm-removal', this._confirmRemoval_click.bind(this));
            $(this._options.target).on('click', '.cancel-removal', this._cancelRemoval_click.bind(this));
            $(this._options.target).on('click', '.substract-item', this._substractItem_click.bind(this));
            $(this._options.target).on('change', '.product-theme', this._updateItemTheme_change.bind(this));
            $(this._options.target).on('click', '.add-item', this._addItem_click.bind(this));
        },

        addItem: function (cartItemId, cartItem, photos, subtotal) {
            switch (cartItem.productId) {
            case 'digital':
                this.addDigitalItem(cartItemId, cartItem, photos, subtotal);
                break;

            case 'touchup':
                this.addTouchupItem(cartItemId, cartItem, photos, subtotal);
                break;

            default:
                this.addDbItem(cartItemId, cartItem, photos, subtotal);
                break;
            }
        },

        addDigitalItem: function (cartItemId, cartItem, photos, subtotal) {
            let productName = `${$.i18n('ORDERAPP_DIGITAL_COPY')}`;

            let itemElement = $(`
                <li class="cart-item digitals" data-cart-item-id="${cartItemId}" style="--product-lenght: -${productName.length}ch">
                    <h3 class="cart-item-header">
                        <span class="product-name">${productName}</span>
                        <span class="item-price">$${subtotal}</span>
                    </h3>
                    <div class="cart-item-details">
                        <ul>
                            <li class="product-image"><img src="${serverUrl}img/digitals.webp"</li>
                            <li class="selected-photos"></li>
                            <li class="item-actions">
                                <i class="fas fa-edit edit-item"></i>
                                <i class="fas fa-trash remove-item"></i>
                            </li>
                            <li class="confirm-removal-panel">
                                <button class="btn-red confirm-removal">${$.i18n('ORDERAPP_REMOVE_CART_ITEM')}</button>
                                <a class="cancel-removal" href="javascript:;">${$.i18n('ORDERAPP_CANCEL_REMOVAL')}</a>
                            </li>
                        </ul>
                    </div>                      
                </li>
            `);

            itemElement.find('.selected-photos').append(photos);

            $(this._options.target).append(itemElement);

            this.emit('cart-item-added', { cartItemId: cartItemId, product: 'virtual-digital', cartItem: cartItem });
        },

        addTouchupItem: function (cartItemId, cartItem, photos, subtotal) {
            let productName = `${$.i18n('ORDERAPP_TOUCHUPS')}`;

            let itemElement = $(`
                <li class="cart-item touchups" data-cart-item-id="${cartItemId}" style="--product-lenght: -${productName.length}ch">
                    <h3 class="cart-item-header">
                        <span class="product-name">${productName}</span>
                        <span class="extra">
                            ${cartItem.comment ? `<span class="product-comment" data-product-comment="${cartItem.comment}"><i class="fas fa-comment-dots"></i></span>` : ''}
                        </span>
                        <span class="item-price">$${subtotal}</span>
                    </h3>
                    <div class="cart-item-details">
                        <ul>
                            <li class="product-image"><img src="${serverUrl}img/touchups.webp"</li>
                            <li class="selected-photos"></li>
                            <li class="item-actions">
                                <i class="fas fa-edit edit-item"></i>
                                <i class="fas fa-trash remove-item"></i>
                            </li>
                            <li class="confirm-removal-panel">
                                <button class="btn-red confirm-removal">${$.i18n('ORDERAPP_REMOVE_CART_ITEM')}</button>
                                <a class="cancel-removal" href="javascript:;">${$.i18n('ORDERAPP_CANCEL_REMOVAL')}</a>
                            </li>
                        </ul>
                    </div>                      
                </li>
            `);

            itemElement.find('.selected-photos').append(photos);

            $(this._options.target).append(itemElement);

            this.emit('cart-item-added', { cartItemId: cartItemId, product: 'virtual-touchup', cartItem: cartItem });
        },

        addDbItem: function (cartItemId, cartItem, photos, subtotal) {
            let product = this._options.products[cartItem.productId];
            let themeOption = Object.entries(product.themes).filter(i => i[0] === cartItem.theme).map(i => i[1])[0];

            let imageUrl = cartItem.theme === null
                    ? product.options.default_image !== undefined
                        ? product.images[product.options.default_image]
                        : product.images[Object.keys(product.images)[0]]
                    : product.images[product.themes_map[cartItem.theme]];
            let productName = `${product.name} ${themeOption !== undefined ? `- ${themeOption}` : ''}` +
                `${cartItem.digitalImage || cartItem.touchups ? $.i18n('GENERIC_WITH').toLowerCase() : ''} ` +
                `${cartItem.digitalImage ? $.i18n('ORDERAPP_DIGITAL_COPY') : ''}` +
                `${cartItem.digitalImage && cartItem.touchups ? ' & ' : ''}` +
                `${cartItem.touchups ? $.i18n('ORDERAPP_TOUCHUPS') : ''}`;
            let extraOptions = `${cartItem.digitalImage ? $.i18n('ORDERAPP_DIGITAL_COPY') : ''}` +
                               `${cartItem.digitalImage && cartItem.touchups ? ' & ' : ''}` +
                               `${cartItem.touchups ? $.i18n('ORDERAPP_TOUCHUPS') : ''}` +
                               `${cartItem.customProductSelection && cartItem.digitalImage ? '\n' 
                               : cartItem.customProductSelection && cartItem.touchups ? '\n' 
                               : ''}` +
                               `${cartItem.customProductSelection ? 'Options: ' + cartItem.customProductSelection.join(',  ').replaceAll('"', '&quot;') : ''}`;

            let itemElement = $(`
                    <li class="cart-item" data-cart-item-id="${cartItemId}" style="--product-lenght: -${productName.length}ch">
                        <h3 class="cart-item-header">
                            <span class="product-name">${productName}</span>
                            <span class="qty">x ${cartItem.quantity}</span>
                            <span class="extra">
                                ${cartItem.comment ? `<span class="product-comment" data-product-comment="${cartItem.comment}"><i class="fas fa-comment-dots"></i></span>` : ''}
                                ${extraOptions ? `<span class="product-extra" data-product-extra="${extraOptions}"><i class="fas fa-ballot-check"></i></span>` : ''}
                            </span>
                            <span class="item-price">$${subtotal}</span>
                        </h3>
                        <div class="cart-item-details">
                            <ul>
                                <li class="product-image"><img src="${serverUrl}pub/${imageUrl}"</li>
                                <li class="selected-photos"></li>
                                <li class="item-actions">
                                    <i class="fas fa-edit edit-item"></i>
                                    <i class="fas fa-trash remove-item"></i>
                                </li>
                                <li class="confirm-removal-panel">
                                    <button class="btn-red confirm-removal">${$.i18n('ORDERAPP_REMOVE_CART_ITEM')}</button>
                                    <a class="cancel-removal" href="javascript:;">${$.i18n('ORDERAPP_CANCEL_REMOVAL')}</a>
                                </li>
                            </ul>
                        </div>                      
                    </li>
                `);

            $(this._options.target).append(itemElement);

            let productCommentElement = $('.product-comment');
            let extraOptionsElement = $('.product-extra');
            if (productCommentElement.attr('data-product-comment') === '') {
                productCommentElement.hide();
            }
            if (extraOptionsElement.attr('data-product-extra') === '') {
                extraOptionsElement.hide();
            }

            itemElement.find('.selected-photos').append(photos);

            this.emit('cart-item-added', { cartItemId: cartItemId, product: product, cartItem: cartItem });
        },

        updateSubtotal: function (subtotal) {
            this._view._child('cart-subtotal').text(Number(subtotal).toFixed(2));
        },

        disableCompleteOrder: function (disable) {
            $('#complete-order').prop('disabled', disable);
        },

        updateItem: function (cartItemId, quantity, subTotal) {
            let cartItemElement = $(this._options.target).find(`[data-cart-item-id="${cartItemId}"]`);
            cartItemElement.find(".quantity").text(quantity);
            cartItemElement.find(".product-subtotal").text("$" + subTotal);
            if (quantity == 1) {
                cartItemElement.find(".substract-item")[0].setAttribute("disabled", "disabled");
            } else {
                cartItemElement.find(".substract-item")[0].removeAttribute("disabled");
            }
        },

        removeItem: function (cartItemId) {
            $(this._options.target).find(`[data-cart-item-id="${cartItemId}"]`).detach();
        },


        /* PRIVATE */
        _substractItem_click: function (event) {
            let cartItemElement = $(event.target).parents('.cart-item');
            let cartItemId = cartItemElement.attr('data-cart-item-id');
            this.emit('update-item-quantity', { itemId: cartItemId, step: -1 });
        },

        _updateItemTheme_change: function (event) {
            let cartItemElement = $(event.target).parents('.cart-item');
            let cartItemId = cartItemElement.attr('data-cart-item-id');
            this.emit('update-item-theme', { itemId: cartItemId, theme: event.currentTarget.value });
        },

        _addItem_click: function (event) {
            let itemElement = $(event.target).parents('.cart-item');
            let cartItemId = itemElement.attr('data-cart-item-id');
            this.emit('update-item-quantity', { itemId: cartItemId, step: 1 });
        },

        _confirmRemoval_click: function (event) {
            let itemElement = $(event.target).parents('.cart-item');
            let cartItemId = itemElement.attr('data-cart-item-id');
            this.emit('remove-item', cartItemId);
        },

        _editItem_click: function (event) {
            let itemElement = $(event.target).parents('.cart-item');
            let cartItemId = itemElement.attr('data-cart-item-id');
            this.emit('edit-item', cartItemId);
            $(event.target).parents('.confirm-removal-panel').removeClass('show');
        },

        _removeItem_click: function (event) {
            let itemElement = $(event.target).closest('.cart-item');
            $(itemElement).find('.confirm-removal-panel').addClass('show');
        },

        _cancelRemoval_click: function (event) {
            $(event.target).parents('.confirm-removal-panel').removeClass('show');
        },

    });

    ViewCompoment.add('Cart', CartComponent);
}(HeO2, jQuery));
