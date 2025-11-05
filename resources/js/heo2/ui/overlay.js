/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2014-2019, Heliox - All Right Reserved
 */

(function(HeO2, $) {
    "use strict";

    const UIHost = HeO2.require('HeO2.UIHost');
    const helpers = HeO2.require('HeO2.common.helpers');
    const logger = HeO2.require('HeO2.common.logger');
    const VK_CODES = HeO2.require('HeO2.CONST.VK_CODES');

    /* CONTROLLER */
    const OverlayController = UIHost.Controller.extend({
        init: function(host, options) {
            this._super(host);

            this._heedReadiness();

            if(navigator.userAgent.match(/SAMSUNG|Samsung|SGH-[I|N|T]|GT-[I|N]|SM-[A|N|P|T|Z]|SHV-E|SCH-[I|J|R|S]|SPH-L|sdk_gphone/i)) {
                document.body.classList.add("SAMSUNG")
                // your code for Samsung Smartphones goes here...
            } else if(navigator.userAgent.match(/"ALP-"|"AMN-"|"ANA-"|"ANE-"|"ANG-"|"AQM-"|"ARS-"|"ART-"|"ATU-"|"BAC-"|"BLA-"|"BRQ-"|"CAG-"|"CAM-"|"CAN-"|"CAZ-"|"CDL-"|"CDY-"|"CLT-"|"CRO-"|"CUN-"|"DIG-"|"DRA-"|"DUA-"|"DUB-"|"DVC-"|"ELE-"|"ELS-"|"EML-"|"EVA-"|"EVR-"|"FIG-"|"FLA-"|"FRL-"|"GLK-"|"HMA-"|"HW-"|"HWI-"|"INE-"|"JAT-"|"JEF-"|"JER-"|"JKM-"|"JNY-"|"JSC-"|"LDN-"|"LIO-"|"LON-"|"LUA-"|"LYA-"|"LYO-"|"MAR-"|"MED-"|"MHA-"|"MLA-"|"MRD-"|"MYA-"|"NCE-"|"NEO-"|"NOH-"|"NOP-"|"OCE-"|"PAR-"|"PIC-"|"POT-"|"PPA-"|"PRA-"|"RNE-"|"SEA-"|"SLA-"|"SNE-"|"SPN-"|"STK-"|"TAH-"|"TAS-"|"TET-"|"TRT-"|"VCE-"|"VIE-"|"VKY-"|"VNS-"|"VOG-"|"VTR-"|"WAS-"|"WKG-"|"WLZ-"|"YAL"/i)) {
                document.body.classList.add("HUAWEI")
                // your code for Huawei Smartphones goes here...
            };
        },

        activeGroup() {
            return this._activeGroup;
        },

        activateGroup: function(group) {
            "export";

            this._activeGroup = group;
            this.activeView().activateGroup(group);
            return this;
        },

        disable: function(disable) {
            "export";

            this.activeView().disable(disable);
        },

        hide: function() {
            "export";

            this.host().emit('hide-request');
            return this;
        },

        show: function(callback) {
            "export";

            this.host().emit('show-request');

            if (callback) {
                this.activeView().attachOnce(callback);
            }

            return this;
        },

        showMessage: function(message, title, icon, buttons, callback) {
            "export";

            this.activeView().showMessage(message, title, icon, buttons);

            if (callback) {
                this.activeView().attachOnce(callback);
            }

            return this;
        },

        toggle: function() {
            "export";

            this.host().emit('toggle-request', null);
            return this;
        },

        /* PRIVATE */
        _heedReadiness: function() {
            this.host().on('ready', () => {

            });
        }
    });


    /* VIEW */
    const SHADE_ID = '__modal-shade__';
    const SHADE_ID_SELECTOR = `#${SHADE_ID}`;
    const SHADE_CLASS = 'overlay-shade';
    const VIEW_DEFAULT_OPTIONS = {
        group: false,
        groupPrefix: 'group-',
        target: null
    };

    let visibleOverlayCount = 1000000;
    let modalShadeZIndexStack = [];
    let modalCount = 0;

    const OverlayView = UIHost.View.extend({
        NAME: 'default',

        init: function(host, options) {
            this._super(host);
            this._options = helpers.merge(true, VIEW_DEFAULT_OPTIONS, options, this._options);
            this._visible = false;
        },

        attachOnce: function(callback) {
            let okListener = () => {
                this.host().off('hide-request', hideListener);
                callback({
                    status: 'ok'
                });

                setImmediate(() => this.host().emit('hide-request'))
            };
            let hideListener = () => {
                okButton.off('click', okListener);
                callback({
                    status: 'cancel'
                });
            };
            let okButton = this._targetNode.find('button[ok]');
            if (okButton.length === 0) {
                okButton = this._targetNode.find(`button[${this.controller().activeGroup()}]`);
            }

            okButton.one('click', okListener);
            this.host().one('hide-request', hideListener);
        },

        activateGroup: function(group) {
            this._groupCacheNodes.hide();
            this._targetNode.find('.' + this._options.groupPrefix + group).show();
        },

        disable: function(disable) {
            this._targetNode.find('button[ok]:visible').prop('disabled', disable);
        },

        showMessage: function(message, title, icon, buttons) {
            "on[show-message-request]";

            let buttonsHtml = '';
            switch (buttons) {
            case 'ok':
                buttonsHtml = `<button class="ui-button" ok>${$.i18n('GENERIC_OK')}</button>`;
                break;

            case 'yesno':
                buttonsHtml = `<button class="ui-button" ok>${$.i18n('GENERIC_YES')}</button>` +
                              `<button class="ui-button" cancel>${$.i18n('GENERIC_NO')}</button>`;
                break;
            }

            if (this._targetNode.children('.feedback-content').length === 0) {
                this._targetNode.append('<div class="feedback-content"></div>');
            }

            this._targetNode.children('.feedback-content')
                .empty()
                .append(`<h2>${title || ''}</h2>`)
                .append(`<p>${message}</p>`)
                .append($(`<div class="buttons"></div>`)
                    .append(buttonsHtml)
                    .on('click', () => this.host().emit('hide-request'))
                );

            this._host_toggleRequest(true);
        },

        /* LIFECYCLE */
        _attach: function() {
            this._targetNode = $(this._options.target)
                .keyup(this._targetNode_keyup.bind(this));

            if (this._options.close === true) {
                this._addCloseButton();
            }

            if (this._options.group) {
                this._cacheGroups();
            }

            if (this._options.dismissable) {
                $('body').click((event) => {
                    let targetNode = $(event.target);
                    if (this._visible &&
                            !targetNode.hasClass('overlay') && !targetNode.hasClass(SHADE_CLASS) &&
                            targetNode.parents('.overlay').length === 0) {
                        this.controller().hide();
                    }
                });
                $(this._targetNode).click(event => {event.stopPropagation()});
            }

            this._super();
        },


        /* EVENT HANDLERS */
        _host_hideRequest: function() {
            "on[hide-request]";

            this._host_toggleRequest(false);
        },

        _host_showRequest: function() {
            "on[show-request]";

            this._host_toggleRequest(true);
        },

        _host_toggleRequest: function(visible) {
            "on[toggle-request]";

            this._targetNode.toggle(visible !== null ? Boolean(visible) : undefined);
            this._targetNode.css('animation-play-state', 'running');

            if (this._targetNode.is(':visible')) {
                let autofocusInputNode = this._targetNode.find('[autofocus]');

                if (autofocusInputNode.length === 1) {
                    autofocusInputNode.focus();
                }

                visibleOverlayCount += 25;
                this._targetNode.css('z-index', visibleOverlayCount);
            } else {
                --visibleOverlayCount;
            }

            if (this._options.modal === true) {
                this._toggleModalShade(this._targetNode.is(':visible'));
            }

            setTimeout(() => {this._visible = this._targetNode.is(':visible')}, 200);
        },

        _targetNode_keyup: function(event) {
            if (this._targetNode.find('button[ok]:visible').prop('disabled') === false && event.keyCode == VK_CODES.ENTER) {
                this._targetNode.find('button[ok]:visible').click();
            }
        },

        /* PRIVATE */
        _addCloseButton: function() {
            this._targetNode.prepend(
                $('<i class="close"></i>')
                    .click(() => this.host().emit('hide-request'))
            );
        },

        _cacheGroups: function() {
            this._groupCacheNodes =
                this._targetNode.find(
                    "[class^='" + this._options.groupPrefix + "']," +
                    "[class*=' " + this._options.groupPrefix + "']"
                );
        },

        _toggleModalShade: function(visible) {
            visible = Boolean(visible);
            let shadeNode = $(SHADE_ID_SELECTOR);
            let shadeZIndex = +getComputedStyle(this._targetNode[0])['z-index'] - 1;

            if (shadeNode.length === 0) {
                shadeNode = $(`<div id="${SHADE_ID}" class="${SHADE_CLASS}"></div>`)
                $('body').prepend(shadeNode);
            }

            modalCount += visible ? 1 : -1;
            if (visible) {
                modalShadeZIndexStack.push(shadeZIndex);
                shadeNode.css('z-index', shadeZIndex);
                shadeNode.toggle(true);
            } else if (!visible && modalCount > 0) {
                modalShadeZIndexStack.pop()
                shadeNode.css('z-index', modalShadeZIndexStack[modalShadeZIndexStack.length - 1]);
            } else {
                shadeNode.toggle(visible);
            }
        }
    });

    HeO2.UI.Overlay = UIHost.extend({
        init: function(host, element) {
            this._super(host, element, [OverlayController, {constructor: OverlayView, options: {target: element}}]);
        }
    });
}(HeO2, jQuery));
