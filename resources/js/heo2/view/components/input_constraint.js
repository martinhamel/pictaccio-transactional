(function (HeO2, $) {
    "use strict";

    const ViewComponent = HeO2.require('HeO2.View.Component');
    const helpers = HeO2.require('HeO2.common.helpers');
    const logger = HeO2.require('HeO2.common.logger');
    const VK_CODES = HeO2.require('HeO2.CONST.VK_CODES');

    const DEFAULT_OPTIONS = {
        targets: [
        ]
    };
    const PREDEFINED_CONSTRAINT = {
        alpha: 'aAabBcCdDeEfFgGhHiIkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ',
        alphanumeric: 'aAabBcCdDeEfFgGhHiIkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ0123456789.-',
        alphanumericEx: 'aAabBcCdDeEfFgGhHiIkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ0123456789.-, ',
        digits: '0123456789',
        numeric: '0123456789.-',
        numericEx: '0123456789.-, ',
    };
    const PREDEFINED_FORMAT_MASKS = {
        'cc-unknown': 'DDDD DDDD DDDD DDDD',
        'cc-mastercard': 'DDDD DDDD DDDD DDDD',
        'cc-visa': 'DDDD DDDD DDDD DDDD',
        'cc-visa-electron': 'DDDD DDDD DDDD DDDD',
        'cc-discover': 'DDDD DDDD DDDD DDDD',
        'cc-jcb': 'DDDD DDDD DDDD DDDD',
        'cc-amex': 'DDDD DDDDDD DDDDD',
        'cc-diners': 'DDDD DDDD DDDD DD',
        'cc-diners-carteblanche': 'DDDD DDDD DDDD DD'
    };
    const DEFAULT_CONSTRAINT = 'alphanumeric';
    const DEFAULT_MASK = null;

    /**
     * Options:
     * {
     *  targets: [
     *   {string|HTMLInputElement|jQuery}, ...
     *
     *   OR
     *
     *   {
     *    selector: {string|HTMLInputElement|jQuery} Required, the element to apply constraints and mask on
     *    constraint: {string} Optional, the constraint to apply
     *    mask: {string} Optional, the mask to apply
     *   },
     *   ...
     *  ]
     * }
     *
     * Note:
     * constraint: Limit the characters that can be written. Possible values: alpha, alphanumeric, alphanumericEx, digits, numeric, numericEx, mask (apply mask)
     * mask: When constraint is set to mask, controls the visual arrangement and the characters that can appear at each position. Possible values: cc-mastercard, cc-visa, cc-amex
     *
     * @type {InputConstraint}
     */
    const InputConstraint = ViewComponent.extend({
        _$target: null,
        _applyMaskToPastedValue: false,
        _constraint: null,
        _options: null,
        _mask: null,
        _maskCallsTable: null,

        addTargets: function(targets) {
            if (!Array.isArray(targets)) {
                targets = [targets];
            }

            this._attachTargets(targets);
        },

        changeConstraint: function(constraint, selector) {
            this._set(constraint, null, selector);
        },

        changeMask: function(mask, selector) {
            this._set('mask', mask, selector);
        },

        isCCValid: function() {
            let mask = this._targetNodes[0].data('mask');
            let value = this._targetNodes[0].val();
            let android = navigator.userAgent.toLowerCase().includes('android');

            for (let i = 0, j = 0, length = mask.length; i <= length; ++i, ++j) {
                if (mask[i] === 'D' && !/\d/.test(value[j])) {
                    return false;
                }
                if (mask[i] === ' ' && value[j] !== ' ') {
                    if (android) {
                        --j;
                    } else {
                        return false;
                    }
            }
        }

            return true;
        },

        /* LIFE CYCLE */
        _prepareOptions: function(options) {
            return helpers.merge(true, DEFAULT_OPTIONS, options);
        },

        _initialize: function() {
            this._targetNodes = [];
            this._maskCallsTable = {
                D: helpers.isKeycodeDigit,
                A: helpers.isKeycodeAlpha,
                X: helpers.isKeycodeAlphaNumeric,
                N: helpers.isKeycodeNumeric
            };
        },

        _attach: function() {
            this.addTargets(this._options.targets);
        },


        /* EVENT HANDLER */
        _target_change: function(event) {
            this._formatAll();

            setImmediate(function () {
                this._emitMaskChanged(event, event.target.value);
            }.bind(this));
        },

        _target_keydown: function(event) {
            let targetNode = $(event.target);
            let keyCode = event.which || event.keyCode;
            let constraint = targetNode.data('constraint');

            if (constraint === 'mask') {
                if (     helpers.isKeycodeAlphaNumeric(keyCode) ||
                        [   VK_CODES['DELETE'], VK_CODES['BACKSPACE'], VK_CODES['TAB'],
                            VK_CODES['LEFT'], VK_CODES['RIGHT']].indexOf(keyCode) !== -1 ) {
                    // Pasting?
                    if (event.metaKey || event.ctrlKey && event.keyCode === VK_CODES['V']) {
                        setTimeout(function () {
                            this._applyMaskToPastedValue = true;
                        }.bind(this), 0);
                    }

                    // Tabbing, moving caret with arrows?
                    else if (keyCode === VK_CODES['TAB'] || keyCode === VK_CODES['LEFT'] || keyCode === VK_CODES['RIGHT']) {
                        return;
                    }

                    // Anything else
                    else {
                        let inputElement = event.target;
                        let rangeStart = inputElement.selectionStart, rangeEnd = inputElement.selectionEnd;
                        let normalizedRangeStart = Math.min(rangeStart, rangeEnd),
                            normalizedRangeEnd   = Math.max(rangeStart, rangeEnd);
                        let hasSelection = normalizedRangeStart !== normalizedRangeEnd;
                        let caret = rangeStart;
                        let value = inputElement.value;
                        let mask = targetNode.data('mask');

                        event.preventDefault();

                        if (helpers.isKeycodeAlphaNumeric(keyCode)) {
                            if (this._maskCallsTable[mask[caret]] === undefined) {
                                value = this._format(value, caret, mask).str;
                                caret += 1;
                            }
                            if (this._maskCallsTable[mask[caret]] !== undefined) {
                                if (this._maskCallsTable[mask[caret]](keyCode)) {
                                    let formatResult;

                                    value = value.slice(0, normalizedRangeStart) + helpers.fromKeyCode(keyCode) + value.slice(normalizedRangeEnd);
                                    formatResult = this._format(value, caret + 1, mask);
                                    inputElement.value = formatResult.str;
                                    caret += formatResult.caretHasDecoration ? 2 : 1;
                                    inputElement.setSelectionRange(caret, caret);
                                }
                            }
                        }

                        if (keyCode === VK_CODES['BACKSPACE']) {
                            let back = (hasSelection ? 0 : (this._isDecorationCharacterAt(caret - 1, mask) ? 2 : 1));
                            value = value.slice(0, normalizedRangeStart - back) + value.slice(normalizedRangeEnd);
                            caret = normalizedRangeStart - back;

                            if (this._isDecorationCharacterAt(caret - 1, mask)) {
                                value = value.slice(0, caret - 1) + value.slice(caret);
                                caret -= 1;
                            }

                            inputElement.value = this._format(value, caret, mask, {skipDecorationAtCaret: true}).str;
                            inputElement.setSelectionRange(caret, caret);
                        }

                        if (keyCode === VK_CODES['DELETE']) {
                            let forward = (hasSelection ? 0 : (this._isDecorationCharacterAt(caret + 1, mask) ? 2 : 1));
                            value = value.slice(0, normalizedRangeStart) + value.slice(normalizedRangeEnd + forward);
                            caret = normalizedRangeEnd + Math.max(forward - 1, 0);

                            if (this._isDecorationCharacterAt(caret + 1, mask)) {
                                value = value.slice(0, caret) + value.slice(caret + 1);
                                if (value[caret + 1] !== undefined) {
                                    caret += 1;
                                }
                            }

                            inputElement.value = this._format(value, caret, mask).str;
                            inputElement.setSelectionRange(caret, caret);
                        }

                        setImmediate(function () {
                            this._emitMaskKeydown(event, value);
                        }.bind(this));

                        return false;
                    }
                } else {
                    event.preventDefault();
                    return false;
                }
            } else if (constraint !== undefined) {
                //TODO: Add support for contraining input only to characters in constraint
            }
        },

        _target_keyup: function(event) {
            if (this._applyMaskToPastedValue) {
                this._formatAll();
            }
        },

        _target_input: function(event) {
            let targetNode = $(event.target);
            if (targetNode.data('_input_constraint_input_seen') === undefined) {
                if (targetNode.val().length > 1) {
                    this._formatAll();
                }

                targetNode.data('_input_constraint_input_seen', true);
            }
        },


        /* PRIVATE */
        _attachTargets: function(targets) {
            for (let i = 0, length = targets.length; i < length; ++i) {
                let targetNode = null;
                let mask = DEFAULT_MASK;
                let constraint = DEFAULT_CONSTRAINT;

                if ('selector' in targets[i]) {
                    targetNode = $(targets[i].selector);

                    if ('mask' in targets[i]) {
                        mask = targets[i].mask;
                        if (!Array.isArray(mask)) {
                            mask = [mask];
                        }
                        for (let j = 0, length = mask.length, temp = mask, mask = []; j < length; ++j) {
                            mask.push({
                                length: temp[j].length,
                                mask: temp[j]
                            });
                        }
                    }
                    if ('constraint' in targets[i]) {
                        constraint = targets[i].constraint;
                    }
                } else {
                    targetNode = $(targets[i]);
                }

                if (targetNode.length) {
                    targetNode
                        .data({
                            constraint: constraint,
                            mask: mask
                        })
                        .change(this._target_change.bind(this))
                        .keydown(this._target_keydown.bind(this))
                        .keyup(this._target_keyup.bind(this))
                        .on('input', this._target_input.bind(this));

                    this._targetNodes.push(targetNode);
                }
            }
        },

        _calculateLength: function(value, selectionStart, selectionEnd, keyCode) {
            let length = value.length;
            let printable = keyCode >= 40; //TODO: better printable character detection
            return (selectionStart === selectionEnd ? length  : length - (selectionEnd - selectionStart)) +
                (printable ? 1 : 0);
        },

        _checkConstraint: function(event, caret) {
            let constraint = $(event.target).data('constraint');

            if (constraint === 'mask') {
                throw new Error('InputConstraintComponent: Invalid operation checkConstraint on mask');
            }

            return constraint.indexOf(event.key) === -1;
        },

        _emitMaskChanged: function(event, newValue) {
            this.emit('masked-changed', helpers.merge(true, event, {newValue: newValue}));
        },

        _emitMaskKeydown: function(event, newValue) {
            this.emit('masked-keydown', helpers.merge(true, event, {newValue: newValue}));
        },

        _format: function(str, caret, mask, options) {
            let formatted = '';
            let cursor = 0;
            let strLength = str.length;
            let caretHasDecoration = false;

            options = options || {
                skipDecorationAtCaret: false
            };

            for (let i = 0, length = mask.length; i < length; ++i) {
                if (i > formatted.length) {
                    break;
                }

                if (this._maskCallsTable[mask[i]] !== undefined) {
                    if (cursor >= strLength) {
                        break;
                    }

                    while (!this._maskCallsTable[mask[i]](str[cursor])) {
                        ++cursor;
                        if (cursor >= strLength) {
                            break;
                        }
                    }
                    if (str[cursor] !== undefined) {
                        formatted += str[cursor++];
                    }
                } else {
                    if (!(options.skipDecorationAtCaret === true && i === caret)) {
                        formatted += mask[i];
                    }
                    if (i === caret) {
                        caretHasDecoration = true;
                    }
                }
            }

            return {
                caretHasDecoration: caretHasDecoration,
                str: formatted
            };
        },

        _formatAll: function() {
            let targetNode = $(event.target);
            let constraint = targetNode.data('constraint');

            if (constraint === 'mask') {
                let inputElement = event.target;
                let caret = inputElement.selectionStart;
                let value = inputElement.value;
                let mask = targetNode.data('mask');

                inputElement.value = value = this._format(value, caret, mask).str;
                inputElement.setSelectionRange(value.length, value.length);
            }
        },

        _isAlpha: function(keyCode) {
            if (typeof keyCode === 'string') {
                keyCode = keyCode.charCodeAt(0);
            }
            return (keyCode >= VK_CODES['A'] && keyCode <= VK_CODES['Z']);
        },

        _isAlphaNumeric: function(keyCode) {
            if (typeof keyCode === 'string') {
                keyCode = keyCode.charCodeAt(0);
            }
            return this._isAlpha(keyCode) || this._isNumeric(keyCode);
        },

        _isDigit: function(keyCode) {
            if (typeof keyCode === 'string') {
                keyCode = keyCode.charCodeAt(0);
            }
            return 	(keyCode >= VK_CODES['0'] && keyCode <= VK_CODES['9']) ||
                (keyCode >= VK_CODES['NUMPAD0'] && keyCode <= VK_CODES['NUMPAD9']);
        },

        _isDecorationCharacterAt: function(pos, mask) {
            return this._maskCallsTable[mask[pos]] === undefined;
        },

        _isNumeric: function(keyCode) {
            if (typeof keyCode === 'string') {
                keyCode = keyCode.charCodeAt(0);
            }
            return 	this._isDigit(keyCode) ||
                keyCode === VK_CODES['NUMPAD_SUBSTRACT'] ||
                keyCode === VK_CODES['DASH'] ||
                keyCode === VK_CODES['PERIOD'] ||
                keyCode === VK_CODES['NUMPAD_DECIMAL'];
        },

        _reflow: function(input, mask) {
            let caret = Math.min(input.selectionStart, input.selectionEnd)

            setImmediate(function () {
                let format = this._format(input.value, caret + 1, mask);
                let caretMove = format.caretHasDecoration ? 1 : 0;
                input.value = format.str;
                input.setSelectionRange(caret + caretMove, caret + caretMove);
            }.bind(this));
        },

        _set: function(constraint, mask, selector) {
            constraint = PREDEFINED_CONSTRAINT[constraint] ? PREDEFINED_CONSTRAINT[constraint] : constraint;
            mask = PREDEFINED_FORMAT_MASKS[mask] ? PREDEFINED_FORMAT_MASKS[mask] : mask;
            selector = selector || '*';

            for (let i = 0, length = this._targetNodes.length; i < length; ++i) {
                if (this._targetNodes[i].is(selector)) {
                    this._targetNodes[i].data('constraint', constraint);
                    this._targetNodes[i].data('mask', mask);

                    if (mask) {
                        this._reflow(this._targetNodes[i][0], mask);
                    }
                }
            }
        }
    });

    ViewComponent.add('InputConstraint', InputConstraint);
})(HeO2, jQuery);
