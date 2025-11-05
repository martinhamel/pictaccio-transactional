(function(HeO2, $) {
    "use strict";

    const EventingClass = HeO2.require('HeO2.EventingClass');
    const Hash = HeO2.require('HeO2.Hash');
    const Promise = HeO2.require('HeO2.Promise');
    const helpers = HeO2.require('HeO2.common.helpers');
    const logger = HeO2.require('HeO2.common.logger');

    const DEFAULT_OPTIONS = {
    };

    HeO2.Host = EventingClass.extend({
        init: function(objArray, options) {
            this._super();

            this._document = new Hash();
            this._controller = null;
            this._views = Object.create(null);
            this._readyPromises = [];
            this._options = helpers.merge(true, DEFAULT_OPTIONS, options);

            if (this._options.target) {
                this.addTarget(this._options.target);
            }

            for (let i = 0, length = objArray.length; i < length; ++i) {
                this._registerVCObject(objArray[i]);
            }
            this._signalReady();
        },

        addTarget: function(target) {
            $(document).ready(function() {
                let targetObj = $(target)[0];
                if (targetObj) {
                    this._targetNodes.push(targetObj);
                } else {
                    console.warn('Host: Target not found: \'' + target + '\'');
                }
            }.bind(this));
        },

        controller: function() {
            return this._controller;
        },

        document: function() {
            return this._document;
        },

        options: function() {
            return this._options;
        },

        uiElements: function() {
            return this._childUIs;
        },

        views: function() {
            return this._views;
        },


        /* PROTECTED */
        _controllerRegistered: function() {

        },


        /* PRIVATE */
        _registerVCObject: function(obj) {
            let constructor = (obj.constructor && obj.constructor.CLASS !== undefined) ? obj.constructor : obj;

            switch (constructor.CLASS) {
            case 'Controller':
                if (!this._controller) {
                    this._controller = new constructor(this, obj.options);
                    this._controllerRegistered();
                } else {
                    throw new Error('Host: This Host already has a controller.');
                }
                return;

            case 'View':
                let promise = new Promise();
                this._readyPromises.push(promise);
                let view = new constructor({host: this, readyPromise: promise}, obj.options);
                if (view.NAME && this._views[view.NAME] === undefined) {
                    this._views[view.NAME] = view;
                } else {
                    logger.error('Host: Views must have a unique names');
                    logger.log(obj);
                }
                return;
            }

            logger.warn('Host: Unknown VC object');
            logger.log(obj);
        },

        _signalReady: function() {
            let heo2Ready = new Promise();
            HeO2.ready(() => heo2Ready.resolve());
            this._readyPromises.push(heo2Ready);

            Promise.when(this._readyPromises, {
                success: function() {
                    if (this._controller) {
                        for (let i = 0, length = this._views.length; i < length; ++i) {
                            this._controller.attachView(this._views[i]);
                        }

                        this.emit('ready');
                    } else {
                        logger.error('Host: All views are ready but no controller object was given.');
                    }

                }.bind(this),

                fail: function(error) {
                    logger.error('Host: An hosted object could not initialize');
                    logger.error(error);
                }.bind(this)
            });
        }
    });

    HeO2.Host.create = function() {
        let objArray;
        let options;

        if (Array.isArray(arguments[0])) {
            objArray = arguments[0];
            options = arguments[1];
        } else {
            if (arguments[arguments.length - 1].CLASS || (arguments[arguments.length - 1].constructor && arguments[arguments.length - 1].constructor.CLASS)) {
                objArray = Array.prototype.slice.call(arguments);
            } else {
                objArray = Array.prototype.slice.call(arguments, 0, -1);
                options = arguments[arguments.length - 1];
            }
        }

        return new HeO2.Host(objArray, options);
    }
}(HeO2, jQuery));
