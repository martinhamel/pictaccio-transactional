(function (HeO2, $) {
    "use strict";

    const ViewComponent = HeO2.require('HeO2.View.Component');
    const inflector = HeO2.require('HeO2.common.inflector');
    const helpers = HeO2.require('HeO2.common.helpers');
    const logger = HeO2.require('HeO2.common.logger');

    const DEFAULT_OPTIONS = {
        icon: {
            use: false,
            classes: {
                'ccUnknown': 'cc-default',
                'ccMastercard': 'cc-mastercard',
                'ccVisa': 'cc-visa',
                'ccVisa-electron': 'cc-visa',
                'ccAmex': 'cc-amex',
                'ccDiscover': 'cc-discover',
                'ccDiners': 'cc-diners',
                'ccDiners-carteblanche': 'cc-diners',
                'ccJcb': 'cc-jcb'
            }
        }
    };

    const CREDITCARD_TYPES = {
        'cc-mastercard': /^5[1-5]/,
        'cc-visa-electron': /^(4026|417500|4508|4844|491(3|7))/,
        'cc-visa': /^4/,
        'cc-amex': /^3[47]/,
        'cc-discover': /^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)/,
        'cc-diners': /^(30[6-9]|36|38)/,
        'cc-diners-carteblanche': /^30[0-5]/,
        'cc-jcb': /^35(2[89]|[3-8][0-9])/
    };

    const CC_FRIENDLY_NAMES = {
        'cc-mastercard': 'MasterCard',
        'cc-visa': 'Visa',
        'cc-visa-electron': 'Visa Electron',
        'cc-amex': 'American Express',
        'cc-discover': 'Discover',
        'cc-diners': 'Diners Club',
        'cc-diners-carteblanche': 'Diners Club - Carte Blanche',
        'cc-jcb': 'JCB'
    };

    const CREDIT_CARD_INPUT_SELECTOR = 'input[autocomplete="cc-number"]';

    /**
     * @options {
     *  icon: {
     *   use: {boolean} Whether to attach to an element to display an icon of the credit card type. Set element data cc-icon to a selector pointing to the element to use.
     *   classes: {
     *    cc-unknown: {string}
     *    cc-mastercard: {string}
     *    cc-visa: {string}
     *    cc-visa-electron: {string}
     *    cc-amex: {string}
     *    cc-discover: {string}
     *    cc-diners: {string}
     *    cc-diners-carteblanche: {string}
     *    cc-jcb: {string}
     *   }
     *  }
     * }
     *
     * @event type-change Emitted when the type of credit card changes {
     *  target: {HTMLInputElement} A reference to the element that triggered the event
     *  newType: {string} A string representing the new type
     * }
     *
     * @type {CreditCardComponent}
     */
    const CreditCardComponent = ViewComponent.extend({
        _$target: null,
        _$iconTarget: null,
        _creditCardConstraint: null,
        _detectedType: 'cc-unknown',
        _options: null,

        friendlyName: function(ccCode) {
            if (ccCode === 'cc-unknown') {
                return '<unknown credit card>';
            }
            if (CC_FRIENDLY_NAMES[ccCode] === undefined) {
                logger.warn('CreditCardComponent: Unknown ccCode \'' + ccCode + '\'');
            }

            return CC_FRIENDLY_NAMES[ccCode];
        },

        isValid: function() {
            return this._creditCardConstraint.isCCValid();
        },


        /* LIFE CYCLE */
        _prepareOptions: function(options) {
            return helpers.merge(true, this._options || DEFAULT_OPTIONS, options)
        },

        _initialize: function() {
            this._targetNodes = [];
            this._creditCardConstraint = this._view._loadComponent('InputConstraint', {
                constraint: 'mask',
                mask: 'cc-mastercard'})
                .on('masked-changed', this._creditCardMasked_changed.bind(this))
                .on('masked-keydown', this._creditCardMasked_keydown.bind(this));
        },

        _attach: function() {
            this._targetNodes = $(CREDIT_CARD_INPUT_SELECTOR);
            if (this._options.icon.use) {
                this._prepareIcons();
            }
            this._creditCardConstraint.addTargets(this._targetNodes);
            this._creditCardConstraint.changeMask('cc-unknown');
        },


        /* EVENT HANDLERS */
        _creditCardMasked_changed: function(event) {
            let targetNode = $(event.target);
            let newType = this._checkType(event.newValue);

            this._updateTypeIcon(targetNode, newType);
        },

        _creditCardMasked_keydown: function(event) {
            let targetNode = $(event.target);
            let newType = this._checkType(event.newValue);

            this._updateTypeIcon(targetNode, newType);
        },


        /* PRIVATE */
        _checkType: function(cardNumber) {
            for (let type in CREDITCARD_TYPES) {
                if (CREDITCARD_TYPES.hasOwnProperty(type)) {
                    if (CREDITCARD_TYPES[type].test(cardNumber)) {
                        return type;
                    }
                }
            }

            return 'cc-unknown';
        },

        _prepareIcons: function() {
            this._targetNodes.each(function(index, target) {
                let targetNode = $(target);

                if (targetNode.data('cc-icon')) {
                    targetNode.data({
                        'cc-icon-node': $(targetNode.data('cc-icon')),
                        'cc-icon-type-class': this._options.icon.classes.ccUnknown
                    });
                    $(targetNode.data('cc-icon'))
                        .addClass(this._options.icon.classes.ccUnknown);
                }
            }.bind(this));
        },

        _emitTypeChange: function(newType, input) {
            let event = {
                input: input,
                newType: newType
            };

            this.emit('creditcard-type-change', event);
        },

        _updateTypeIcon: function(targetNode, newType) {
            if (newType !== null && newType !== targetNode.data('cc-type')) {
                this._emitTypeChange(newType, targetNode);
                this._creditCardConstraint.changeMask(newType, targetNode);
                targetNode.data('cc-type', newType);

                if (this._options.icon.use) {
                    let ccClass = this._options.icon.classes[inflector.camelize(newType)];

                    targetNode
                        .data('cc-icon-node')
                        .removeClass(targetNode.data('cc-icon-type-class'))
                        .addClass(ccClass);
                    targetNode.data('cc-icon-type-class', ccClass);
                }
            }
        }
    });

    ViewComponent.add('CreditCard', CreditCardComponent);
})(HeO2, jQuery);
