/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2014-2019, Heliox - All Right Reserved
 */

(function (HeO2, $, redirect) {
    "use strict";

    const Host = HeO2.require('HeO2.Host');
    const Controller = HeO2.require('HeO2.Controller');
    const View = HeO2.require('HeO2.View');
    const ChromaKey = HeO2.require('HeO2.effects.ChromaKey');
    const sha1 = HeO2.require('HeO2.vendor.sha1');
    const CashRegister = HeO2.require('HeO2.utils.CashRegister');
    const VK_CODES = HeO2.require('HeO2.CONST.VK_CODES');
    const config = HeO2.require('HeO2.config');
    const helpers = HeO2.require('HeO2.common.helpers');
    const momentjs = HeO2.require('HeO2.vendor.momentjs');

    const ORDERAPP_LOCAL_STORAGE_KEY = 'order'; // Also defined in order_app.js
    const ORDERAPP_LOCAL_STORAGE_VER = 3;

    const CHROMA_KEY_COLOR_KEY = [
        { x: 0, y: 0 },
        { x: '100%', y: 0 }
    ];
    const CHROMA_KEY_TOLERANCE = {
        r: 55,
        g: 60,
        b: 60
    };

    const OrderPaymentController = Controller.extend({
        _SERVER_CONFIG: {
        },

        init: function (host, options) {
            this._super(host, {});

            this._deliveryOptions = Object.create(null);
            this._products = Object.create(null);
        },

        applyPromo: function(code, amount) {
            this._promoCode = code;
            this._cashRegister.promo = amount;
            this.activeView().activatePlaceOrder(false);
            this.activeView().refreshPriceReview(this._cashRegister);
            this.activeView().setPromoOrder(+this._cashRegister.total.substring(1) <= 0);
        },

        calculateShipping: function(response, data, callback) {
            "server[url:api/calculateShipping,method:get]";

            if (response.status === 'ok') {
                this._deliveryOptions = response.deliveryOptions.reduce(
                    (deliveryOptions, item) => {
                        deliveryOptions[item.id] = item;
                        return deliveryOptions;
                    }, Object.create(null));

                this.activeView().refreshDeliveryOptions(this._deliveryOptions);

                if (typeof callback === 'function') {
                    callback(response);
                }
            } else if (response.status === 'not-found') {
                this.activeView().feedback($.i18n('ERROR_SESSION_NOT_FOUND'), $.i18n('ERROR_TITLE'));
            } else {
                this.activeView().feedback($.i18n('ERROR_SERVER_COMM_FAILED'), $.i18n('ERROR_TITLE'));
            }
        },

        calculateShipping_complete: function() {
            this.activeView().calculateShippingFeedback(false);
        },

        getSubtotal: function() {
            return this._cashRegister.orderSubtotal;
        },

        payWithCC: function(response, data, callback) {
            "server[url:api/processCcPayment,method:post]";

            switch (response.status) {
                case 'approved':
                    localStorage[ORDERAPP_LOCAL_STORAGE_KEY] = null;
                    setTimeout(() => {
                        redirect(serverUrl + config.read('URL.confirmPaymentSuccessConverge'));
                    }, 500);
                    break;

                case 'declined':
                    this.activeView().feedback($.i18n('MESSAGE_PAYMENT_DECLINED'), $.i18n('ERROR_TITLE'));
                    break;

                case 'failed':
                    this.activeView().feedback($.i18n('MESSAGE_PAYMENT_FAILED'), $.i18n('ERROR_TITLE'));
                    break;

                case 'already-paid':
                    this.activeView().feedback($.i18n('MESSAGE_PAYMENT_ALREADY_MADE'), $.i18n('ERROR_TITLE'));
                    break;

                case 'server-error':
                case 'no-response':
                    this.activeView().feedback($.i18n('ERROR_PAYMENT_SERVER_FAILED', config.read('Contacts.phoneNumber')), $.i18n('ERROR_TITLE'));
                    break;

                case 'not-found':
                    this.activeView().feedback($.i18n('ERROR_SESSION_NOT_FOUND'), $.i18n('ERROR_TITLE'));
                    break;

                case undefined:
                default:
                    this.activeView().feedback($.i18n('ERROR_SERVER_COMM_FAILED'), $.i18n('ERROR_TITLE'));
            }
        },
        payWithCC_beforeSend: function (request) {
            if (this._deliveryOptionId === undefined) {
                request.cancel = true;
                this.activeView().paymentFeedback(false);
            } else {
                if (this._promoCode !== undefined) {
                    request.data['promoCode'] = this._promoCode;
                }
                request.data['comment'] = $('#comment').val();
                request.data['shippingId'] = this._deliveryOptionId;
            }
        },
        payWithCC_complete: function () {
            this.activeView().paymentFeedback(false);
        },

        payWithStripe: function(response, data, callback) {
            "server[url:api/preprocessStripe,method:post]";

            if (response.status === 'not-found') {
                this.activeView().feedback($.i18n('ERROR_SESSION_NOT_FOUND'), $.i18n('ERROR_TITLE'));
                return;
            }

            if (typeof callback === 'function') {
                callback(response);
            }
        },
        payWithStripe_beforeSend: function(request) {
            if (this._deliveryOptionId === undefined && !virtualOnly) {
                request.cancel = true;
                this.activeView().stripePaymentFeedback(false);
            } else {
                if (this._promoCode !== undefined) {
                    request.data['promoCode'] = this._promoCode;
                }
                request.data['comment'] = $('#comment').val();
                request.data['shippingId'] = this._deliveryOptionId;
                request.data['promoCode'] = this._promoCode;
            }
        },
        payWithStripe_error: function() {
            this.activeView().stripePaymentFeedback(false);
            this.activeView().feedback($.i18n('ERROR_SERVER'), $.i18n('ERROR_TITLE'));
        },

        payWithPaypal: function (response, data, callback) {
            "server[url:api/preprocessPaypal,method:post]";

            if (response.status === 'not-found') {
                this.activeView().feedback($.i18n('ERROR_SESSION_NOT_FOUND'), $.i18n('ERROR_TITLE'));
                return;
            }

            if (typeof callback === 'function') {
                callback(data);
            }
        },
        payWithPaypal_beforeSend: function (request) {
            if (this._deliveryOptionId === undefined && !virtualOnly) {
                request.cancel = true;
                this.activeView().paypalPaymentFeedback(false);
            } else {
                if (this._promoCode !== undefined) {
                    request.data['promoCode'] = this._promoCode;
                }
                request.data['comment'] = $('#comment').val();
                request.data['shippingId'] = this._deliveryOptionId;
            }
        },
        payWithPaypal_complete: function () {
            this.activeView().paypalPaymentFeedback(false);
        },

        processPromo: function(response, data, callback) {
            "server[url:api/processPromo,method:post]";

            if (response.status === 'ok') {
                localStorage[ORDERAPP_LOCAL_STORAGE_KEY] = null;
                setTimeout(() => {
                    redirect(serverUrl + config.read('URL.confirmPaymentSuccessConverge'));
                }, 500);
            } else if (response.status === 'not-found') {
                this.activeView().feedback($.i18n('ERROR_SESSION_NOT_FOUND'), $.i18n('ERROR_TITLE'));
            }
        },
        /*processPromo_beforeSend: function (request) {
            if (this._promoCode !== undefined) {
                request.data['promoCode'] = this._promoCode;
            }
            request.data['comment'] = $('#comment').val();
            request.data['shippingId'] = this._deliveryOptionId;
        },*/
        processPromo_complete: function() {
            this.activeView().paymentFeedback(false);
        },

        promo: function (response, data, callback) {
            "server[url:api/promo,method:get]";

            if (response.status === 'not-found') {
                this.activeView().feedback($.i18n('ORDER_COMPLETE_PROMO_NOT_FOUND'), $.i18n('GENERIC_ERROR'));
                return;
            }

            if (typeof callback === 'function') {
                callback(response);
            }
        },
        promo_complete: function() {
            this.activeView().togglePromoSpinner(false);
        },

        updateComment: function (response, data, callback) {
            "server[url:api/updateComment,method:post]";
        },

        updateContact: function (response, data, callback) {
            "server[url:api/updateContact,method:post]";

            if (response.status !== 'error') {
                let validated = this.activeView().reportContactFeedback(response.fields);

                if (virtualOnly) {
                    this.activeView().updatePaymentSectionVisibility(validated)
                }

                if (response.status === 'ok' && validated) {
                    this.host().emit('progress-info', {shippingAndContactInfo: 'ok'});

                    if (!virtualOnly) {
                        this.calculateShipping(null, callback);
                    } else if (typeof callback === 'function') {
                        callback();
                    }
                } else {
                    this.host().emit('progress-info', {shippingAndContactInfo: 'fail', shippingOption: 'fail'});
                    this.activeView().calculateShippingFeedback(false);
                    this.activeView().paymentFeedback(false);
                }
            }
        },
        updateContact_error: function() {
            this.activeView().paymentFeedback(false);
        },
        updateContact_complete: function() {

        },

        updateShipping: function (deliveryOptionId) {
            if (this._deliveryOptions[deliveryOptionId] === undefined) {
                throw new Error(`OrderComplete::updateShipping: Unknown deliveryOptionId '${deliveryOptionId}'`);
            }

            this._deliveryOptionId = deliveryOptionId;

            if (this.activeView()._shippingConfig.enabled && this._cashRegister.orderSubtotal.substr(1) < this.activeView()._shippingConfig.threshold ||
                !this.activeView()._shippingConfig.enabled) {
                this._cashRegister.shipping = +this._deliveryOptions[deliveryOptionId].price;
            }

            if (this._deliveryOptions[deliveryOptionId].isLate) {
                this._cashRegister.late = Number(this._deliveryOptions[deliveryOptionId].priceLate);
                this.activeView().showLateBreakdown();
            } else {
                this._cashRegister.late = 0;
            }

            this.activeView().refreshPriceReview(this._cashRegister);
            this.activeView().setPromoOrder(this._cashRegister.total.substr(1) <= 0);
            this.activeView().updateSpecialOrderButtonStatus(deliveryOptionId === undefined);
        },

        /* LIFE CYCLE */
        _ready: function () {
            this._createCashRegister();
        },

        /* EVENT HANDLERS */
        _cashRegister_change: function () {
            this.activeView().refreshPriceReview(this._cashRegister);
        },

        _host_contactInfoChanged: function () {
            "on[contact-info-changed]";

            this.host().emit('progress-info', {shippingOption: 'fail', shippingAndContactInfo: 'fail'});
        },

        _host_progressInfo: function(progress) {
            "on[progress-info]";

            this._progressTracker = helpers.merge(this._progressTracker, progress);

            this.activeView().activatePlaceOrder(
                this._progressTracker.shippingAndContactInfo === 'ok' &&
                this._progressTracker.shippingOption === 'ok'
            );

            if (this._progressTracker.shippingOption === 'fail') {
                this.activeView().emptyDeliveryOptions();
            }
            if (this._progressTracker.shippingOption === 'reset') {
                this._cashRegister.shipping = 0;
                this.activeView().resetDeliveryOptions();
            }
        },


        /* PRIVATE */
        _createCashRegister: function () {
            this._cashRegister = new CashRegister(
                JSON.parse($('#DATA-cashregister').text() || '{}')
            );
            this._cashRegister.orderSubtotal = +($('#DATA-orderSubtotal').text() || 0);
            this._cashRegister.on('change', this._cashRegister_change.bind(this));
        },
     });


    /* VIEW */
    const OrderPaymentView = View.extend({
        NAME: 'default',

        init: function (host) {
            this._super(host, {
                target: '#complete',
                components: [
                    'Sticky',
                    {
                        name: 'Forms',
                        options: {
                            targets: [
                                { selector: '#shipping-info' },
                                { selector: '#contact-info' },
                                { selector: '#convergeapi-payment-form' }
                            ]
                        }
                    }, {
                        name: 'CreditCard',
                        options: {
                            icon: { use: true }
                        }
                    },
                    {
                        name: 'Cart',
                        options: {
                            complete: true
                        }
                    }
                ]
            });

            if (HeO2.DEBUG) {
                HeO2._DEBUG.orderComplete = this;
            }
        },

        activatePlaceOrder: function(active) {
            $('#place-order').prop('disabled', !active);
            $('#place-order-special').prop('disabled', !active);

            if (activeCcProcessor === 'Stripe' && !active) {
                $('#stripe-payment-form').empty().append('<div id="stripe-payment-element"></div>');
                $('#pay-with-cc-radio').prop('checked', false);
            }

            if (!active) {
                this.updatePaymentSectionVisibility(false);
            }
        },

        calculateShippingFeedback: function(active) {
            $('#calculate-shipping-button')
                .css('color', active ? 'transparent' : '')
                .prop('disabled', active);
            $('#calculate-shipping-spinner').toggle(active);
        },

        paymentFeedback: function(active) {
            $('#place-order')
                .css('color', active ? 'transparent' : '')
                .attr('disabled', active);
            $('#place-order-special')
                .css('color', active ? 'transparent' : '')
                .attr('disabled', active);
            $('#payment-spinner').toggle(active);
            $('#cross-sell-complete-order-spinner').toggle(active);
        },

        emptyDeliveryOptions: function() {
            if (this.id['shipping-methods']) {
                this.id['shipping-methods'].empty();
            }
        },

        paypalPaymentFeedback: function(active) {
            this.paymentFeedback(active);
        },

        stripePaymentFeedback: function(active) {
            $('#stripe-spinner').toggle(active);
        },

        refreshDeliveryOptions: function(deliveryOptions) {
            let lang = config.read('Config.language').substring(0, 2);
            let freeShippingEligible = this._shippingConfig.enabled && this.controller()._cashRegister.orderSubtotal.substring(1).replaceAll(',', '') >= this._shippingConfig.threshold;
            momentjs.locale(lang);
            $('#shipping-methods')
                .empty()
                .append(Object.values(deliveryOptions).reduce((elements, option) => {
                    const price = freeShippingEligible ? $.i18n('GENERIC_FREE') : '$' + (option.price + (option.isLate ? option.priceLate : 0));

                    elements.push($(`
                        <li>
                            <label>
                                <input type="radio" value="${option.id}" name="delivery-options">
                                <span>${option.name} - ${momentjs(option.eta * 1000).format(lang === 'en' ? 'dddd, MMMM Do YYYY' : 'dddd, Do MMMM YYYY')} - ${price}</span>
                            </label>
                        </li>`));
                    return elements;
                }, []));
        },

        refreshPriceReview: function(cashRegister) {
            if (this._shippingConfig.enabled && cashRegister.orderSubtotal.substr(1).replaceAll(',', '') >= this._shippingConfig.threshold) {
                this._child('shipping').text($.i18n('GENERIC_FREE'));
            } else {
                this._child('shipping').text(cashRegister.shipping);
            }

            let taxes = this._getTaxes();

            this._child('order-subtotal').text(cashRegister.orderSubtotal);
            this._child('subtotal').text(cashRegister.subtotalPromo);
            this._child('late').text(cashRegister.late);
            this._child('promo').text(cashRegister.promo);
            if (taxes.includes('gst')) {
                this._child('gst').text(cashRegister.gst);
            }
            if (taxes.includes('qst')) {
                this._child('qst').text(cashRegister.qst);
            }
            if (taxes.includes('pst')) {
                this._child('pst').text(cashRegister.pst);
            }
            if (taxes.includes('hst')) {
                this._child('hst').text(cashRegister.hst);
            }
            this._child('total').text(cashRegister.total);
        },

        reportContactFeedback: function (fields) {
            let invalid = false;

            $('#contact-info').find('.input-container').removeClass('invalid');
            $('#shipping-info').find('.input-container').removeClass('invalid');
            $('#shipping-info-step-title').removeClass('invalid');
            $('#contact-info-step-title').removeClass('invalid');
            $('#order-complete-warning').removeClass('visible');

            if (fields['first-name'] === false) {
                $('[name="first-name"]').parent().addClass('invalid');
                $('#shipping-info-step-title').addClass('invalid');
                invalid = true;
            }
            if (fields['last-name'] === false) {
                $('[name="last-name"]').parent().addClass('invalid');
                $('#shipping-info-step-title').addClass('invalid');
                invalid = true;
            }
            if (fields['street-address-1'] === false) {
                $('[name="street-address-1"]').parent().addClass('invalid');
                $('#shipping-info-step-title').addClass('invalid');
                invalid = true;
            }
            if (fields['city'] === false) {
                $('[name="city"]').parent().addClass('invalid');
                $('#shipping-info-step-title').addClass('invalid');
                invalid = true;
            }
            if (fields['region'] === false) {
                $('[name="region"]').parent().addClass('invalid');
                $('#shipping-info-step-title').addClass('invalid');
                invalid = true;
            }
            if (fields['postal_code'] === false) {
                $('[name="postal-code"]').parent().addClass('invalid');
                $('#shipping-info-step-title').addClass('invalid');
                invalid = true;
            }
            if (fields['country'] === false) {
                $('[name="country"]').parent().addClass('invalid');
                $('#shipping-info-step-title').addClass('invalid');
                invalid = true;
            }
            if (fields['phone'] === false) {
                $('[name="phone"]').parent().addClass('invalid');
                $('#contact-info-step-title').addClass('invalid');
                invalid = true;
            }
            if (fields['email'] === false) {
                $('[name="email"]').parent().addClass('invalid');
                $('#contact-info-step-title').addClass('invalid');
                invalid = true;
            }

            if (invalid) {
                $('#order-complete-warning').addClass('visible');
                setTimeout(function() {
                    $('#order-complete-warning').removeClass('visible');
                }, 10000);
            }

            return !invalid;
        },

        resetDeliveryOptions: function() {
            $('#place-order').prop('disabled', true);
        },

        setPromoOrder: function(promo) {
            this._promoOrder = promo;
            $('#proceed-special').toggleClass('show', promo);
            if (promo) {
                $('#pay-with-paypal').toggle(promo);
                $('#payment-method-paypal').toggle(promo);
                $('#place-order').toggle(promo);
                $('#shipping-step').toggle(promo && !virtualOnly);
                $('#place-order-special').attr('disabled', !virtualOnly);
            }
        },

        showLateBreakdown: function() {
            this.id['breakdown-late'].show();
        },

        togglePromoSpinner: function(active) {
            $('#apply-promo')
                .css('color', active ? 'transparent' : '')
                .attr('disabled', active);
            $('#apply-promo-spinner').toggle(active);
        },

        updatePaymentSectionVisibility: function(validated) {
            if (validated) {
                $('#payment-methods-container').find('input[disabled]').prop('disabled', false);
            } else {
                $('#payment-methods-container').find('input[name="payment-method"]')
                    .prop('checked', false)
                    .prop('disabled', true);
            }
        },

        updateSpecialOrderButtonStatus: function(disabled) {
            $('#place-order-special').attr('disabled', disabled);
        },

        /* LIFE CYCLE */
        _attach: function () {
            this._super();

            $('#shipping-methods').change('input', this._deliveryOption_change.bind(this));
            $('#shipping-info, #contact-info').change('input, select', this._shippingAndContactInfo_change.bind(this));
            $('#payment-paypal-ec-form').submit(this._paypal_submit.bind(this));

            this._applyGreenscreen();
            this._shippingConfig = JSON.parse($('#DATA-freeShipping').html());
        },


        /* EVENT HANDLERS */
        _calculateShipping_click: function(event) {
            this._processInfo();
            if (virtualOnly) {
                this.host().emit('progress-info', {shippingOption: 'ok'});
            } else {
                this.host().emit('progress-info', {shippingOption: 'reset'});
            }
        },

        _cartReview_click: function(event) {
            let checked = $(event.target).prop('checked');
            $('#shipping-info-step, #contact-info-step')
                .find('input, select, textarea')
                .prop('disabled', !checked);
            if (checked) {
                this.host().emit('progress-info', {cartReview: 'ok'});
                $('#cart-review-step').addClass('cart-checked');
                $('#cart-review-checkbox').prop('disabled', true);
                $('#cart-review-container').addClass('cart-checked');
            } else {
                this.host().emit('progress-info', {shippingOption: 'fail'});
            }
        },

        _ccCardHolderName_keyup: function(event) {
            let len = $(event.target).val().length;
            if (len >= 20) {
                $('#bubble-cc-cardholder-name').addClass('show');
            }
        },

        _comment_change: function () {
           this.controller().updateComment({
               comment: $('#comment').val()
           });
        },

        _contactInfo_change: function () {
            this.host().emit('contact-info-changed');
        },

        _deliveryOption_change: function(event) {
            this.host().emit('progress-info', {shippingOption: 'reset'});
            this.controller().updateShipping($(event.target).val());
            $('#payment-methods-container [disabled]').prop('disabled', false);
            $('#expiry-date-container').removeClass('disabled');
            $('#error-paypal').hide();
        },

        _clearInput_focus: function(event) {
            $(event.currentTarget).parent().removeClass('invalid');

            if (!($('#shipping-info').find('.invalid').length)) {
                $('#shipping-info-step-title').removeClass('invalid');
            }

            if (!($('#contact-info').find('.invalid').length)) {
                $('#contact-info-step-title').removeClass('invalid');
            }

            if (!($('#promo-section').find('.invalid').length)) {
                $('#promo-section-title').removeClass('invalid');
            }

            if (!($('#payment-methods-container').find('.invalid').length)) {
                $('#payment-step-title').removeClass('invalid');
            }
        },

        _paymentExpiryMonth_keydown: function (event) {
            let keyCode = event.which || event.keyCode;

            this._expiryMonthRightSignal =
                event.which === VK_CODES['RIGHT'] &&
                this.id.paymentCcMonth[0].selectionStart === this.id.paymentCcMonth.val().length;

            if (this.id.paymentCcMonth.val().length === 0 &&
                ((keyCode >= VK_CODES['2'] && keyCode <= VK_CODES['9']) ||
                    (keyCode >= VK_CODES['NUMPAD2'] && keyCode <= VK_CODES['NUMPAD9']))) {
                event.preventDefault();
                this.id.paymentCcMonth.val('0' + helpers.fromKeyCode(keyCode));
            }
        },

        _paymentExpiryMonth_keyup: function (event) {
            let val = this.id.paymentCcMonth.val();
            if ((val.length >= 2 && event.which >= (VK_CODES['0'] && event.which <= VK_CODES['9'] || VK_CODES['NUMPAD0'] && event.which <= VK_CODES['NUMPAD9'])) ||
                (val !== '0' && val !== '1' && val.length === 1) ||
                (event.which === VK_CODES['RIGHT'] && this.id.paymentCcMonth.get(0).selectionStart === val.length && this._expiryMonthRightSignal)) {
                this.id.paymentCcYear.focus();
            }
        },

        _paymentExpiryYear_keydown: function (event) {
            this._expiryYearLeftSignal =
                event.which === VK_CODES['LEFT'] &&
                this.id.paymentCcYear[0].selectionStart === 0;
        },

        _paymentExpiryYear_keyup: function (event) {
            let val = this.id.paymentCcYear.val();

            if (event.which === VK_CODES['LEFT'] && this.id.paymentCcYear[0].selectionStart === 0 && this._expiryYearLeftSignal) {
                this.id.paymentCcMonth.focus();
            }

            if (val.length === 2) {
                this.id.paymentCcCsc.focus();
            }
        },

        _paymentMethod_click: function (event) {
            $('#place-order').attr('disabled', false);

            if (activeCcProcessor === 'Stripe') {
                this._loadStripe();
            }
        },

        _paypal_submit: function (event) {
            if ($('#shipping-methods').find('input:checked').length === 0 && !virtualOnly) {
                $('#error-paypal').show();
                event.preventDefault();
                return false;
            }

            this.paypalPaymentFeedback(true);

            if (this._payWithPaypalCleared) {
                return true;
            }

            this.controller().payWithPaypal({
                comment: $('#comment').val()
            }, (response) => {
                this._payWithPaypalCleared = true;
                $('#payment-paypal-ec-form').submit();
            });

            event.preventDefault();
            return false;
        },

        _placeOrder_click: function () {
            if (this._promoOrder) {
                this._placePromoOrder();
                return;
            }

            const paymentMethod = $('#payment-methods-container').find('input[name="payment-method"].payment-method-radio:checked').attr('value');

            switch (paymentMethod) {
            case 'cc':
                switch (activeCcProcessor) {
                case 'Stripe':
                    $('#stripe-payment-form').submit();
                    break;

                case 'ConvergeAPI':
                    this._placeCCOrder();
                    break;
                }
                break;
            case 'paypal':
                $('#payment-paypal-ec-form').submit();
                break;
            }
        },

        _placeOrderSpecial_click: function() {
            if (virtualOnly && this._promoOrder) {
                this._processInfo();
            }

            if (this._promoOrder) {
                this._placePromoOrder();
            }
        },

        _promoApply_click: function(event) {
            let code = $('[name="promo"]').val().trim();

            if (code === '') {
                return;
            }

            this.togglePromoSpinner(true);

            this.controller().promo({code}, (response) => {
                if (response.status === 'ok') {
                    this._activePromoCode = $('#promo-code-input').val();
                    $('#promo-code-input').val('');
                    this.host().emit('progress-info', {shippingOption: 'reset'});
                    $('#shipping-methods input').prop('checked', false);
                    this.id['breakdown-promo'].show();
                    this.controller().applyPromo(code, response.amount, response.options);
                    this.feedback($.i18n('ORDER_COMPLETE_PROMO_APPLIED'), $.i18n('GENERIC_SUCCESS'));
                }
            });
        },

        _shippingAndContactInfo_change: function(event) {
            this.host().emit('contact-info-changed');
        },

        _stripePaymentForm_submit: function(event) {
            event.preventDefault();
            this.paymentFeedback(true);

            this._stripe.confirmPayment({
                elements: this._stripePaymentElement,
                confirmParams: {
                    return_url: serverUrl + config.read('URL.confirmPaymentSuccessStripe')
                },
            })
                .then(({error}) => {
                    this.paymentFeedback(false);

                    if (error.type === "card_error" || error.type === "validation_error") {
                        this.feedback($.i18n('ERROR_STRIPE_PAYMENT_FAILED'), $.i18n('ERROR_TITLE'));
                    } else {
                        this.feedback($.i18n('ERROR_SERVER'), $.i18n('ERROR_TITLE'));
                    }
                });
        },

        /* PRIVATE */
        _applyGreenscreen: function() {
            $('[data-background-url!=""][data-background-url]').each((index, element) => {
                let chromaKey = this._createChromaKey(element.src);

                chromaKey.draw($(element).attr('data-background-url')).then((image) => {
                    $(element).attr('src', image);
                });
            });
        },

        _createChromaKey: function(imageUrl) {
            return new ChromaKey({image: imageUrl, colorKey: CHROMA_KEY_COLOR_KEY, tolerance: CHROMA_KEY_TOLERANCE});
        },

        _getTaxes() {
            return JSON.parse($('#DATA-taxes').text());
        },

        _loadStripe: function() {
            $('#stripe-payment-element').empty();
            this.stripePaymentFeedback(true);

            if (!this._stripe) {
                this._stripe = Stripe(stripePublishableKey);
            }

            this.controller().payWithStripe({
                comment: $('#comment').val()
            }, (response) => {
                if (response.status !== 'ok') {
                    this.stripePaymentFeedback(false);
                    this.feedback($.i18n('ERROR_STRIPE_LOAD_ELEMENT'), $.i18n('ERROR_TITLE'));
                }

                this._stripePaymentElement = this._stripe.elements({
                    clientSecret: response.clientSecret,
                    appearance: {
                        theme: 'stripe'
                    }
                });

                const paymentElement = this._stripePaymentElement.create('payment', {
                    layout: 'tabs'
                });

                paymentElement.on('ready', () => {
                    $('#stripe-payment-form').show();
                    this.stripePaymentFeedback(false);
                });
                paymentElement.mount('#stripe-payment-element');
            });
        },

        _placeCCOrder: function() {
            let invalid = false;

            let form = this.Forms.paymentForm.list();
            if (form['expiry-month'].length === 1) {
                form['expiry-month'] = '0' + form['expiry-month'];
            }

            $('#order-complete-warning').removeClass('visible');

            if (!this.CreditCard.isValid() ||
                !$('#convergeapi-payment-form').find('[name="cardholder-name"]')[0].checkValidity() ||
                !$('#expiry-date-container').find('[name="expiry-month"]')[0].checkValidity() ||
                !$('#expiry-date-container').find('[name="expiry-year"]')[0].checkValidity() ||
                !$('#convergeapi-payment-form').find('[name="csc"]')[0].checkValidity()) {
                    $('#payment-step-title').addClass('invalid');

                    if (!this.CreditCard.isValid()) {
                        $('#convergeapi-payment-form').find('[name="cc-number"]').addClass('invalid');
                        invalid = true;
                    } else {
                        $('#convergeapi-payment-form').find('[name="cc-number"]').removeClass('invalid');
                    }

                    if (!$('#convergeapi-payment-form').find('[name="cardholder-name"]')[0].checkValidity()) {
                        $('#convergeapi-payment-form').find('[name="cardholder-name"]').addClass('invalid');
                        invalid = true;
                    } else {
                        $('#convergeapi-payment-form').find('[name="cardholder-name"]').removeClass('invalid');
                    }

                    if (!$('#expiry-date-container').find('[name="expiry-month"]')[0].checkValidity() ||
                    !$('#expiry-date-container').find('[name="expiry-year"]')[0].checkValidity()) {
                        $('#expiry-date-container').addClass('invalid');
                        invalid = true;
                    } else {
                        $('#expiry-date-container').removeClass('invalid');
                    }

                    if (!$('#convergeapi-payment-form').find('[name="csc"]')[0].checkValidity()) {
                        $('#convergeapi-payment-form').find('[name="csc"]').addClass('invalid');
                        invalid = true;
                    } else {
                        $('#convergeapi-payment-form').find('[name="csc"]').removeClass('invalid');
                    }
            } else {
                $('#payment-step-title').removeClass('invalid');
                $('#convergeapi-payment-form').find('[name="cc-number"]').removeClass('invalid');
                $('#convergeapi-payment-form').find('[name="cardholder-name"]').removeClass('invalid');
                $('#expiry-date-container').removeClass('invalid');
                $('#convergeapi-payment-form').find('[name="csc"]').removeClass('invalid');
            }

            this.paymentFeedback(true);
            this.controller().payWithCC(form);

            if (invalid) {
                $('#order-complete-warning').addClass('visible');
                return;
            }
        },

        _placePromoOrder: function() {
            this.paymentFeedback(true);
            this._processInfo(() => {
                this.controller().processPromo({
                    promoCode: this._activePromoCode,
                    comment: $('#comment').val()
                });
            });
        },

        _processInfo: function(callback) {
            let form = helpers.merge(
                this.Forms.shippingInfo.list(),
                this.Forms.contactInfo.list()
            );

            if (!virtualOnly) {
                this.calculateShippingFeedback(true);
            }
            this.controller().updateContact(form, callback);
        }
    });

    Host.create(OrderPaymentController, OrderPaymentView);
}(HeO2, jQuery, href => { window.location.href = href; }));
