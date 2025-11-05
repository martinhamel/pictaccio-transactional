(function(HeO2) {
    "use strict";

    const Host = HeO2.require('HeO2.Host');
    const helpers = HeO2.require('HeO2.common.helpers');
    const annotations = HeO2.require('HeO2.common.annotations');
    const logger = HeO2.require('HeO2.common.logger');

    const EXPORT_ANNOTATION_FLAG = 'export';

    HeO2.UIHost = Host.extend({
        init: function(host, element, objArray, options) {
            // UIController and UIViews that are created through the parent will need these
            //TODO: Probably need to look into this and refactor to remove this dependency.
            this._host = host;
            this._element = element;

            this._super(objArray, options);
            this._heedReadiness();
        },

        element: function() {
            return this._element;
        },


        /* PROTECTED */
        _controllerRegistered: function() {
            this._exportControllerPublicMethod();
        },


        /* PRIVATE */
        _exportControllerPublicMethod: function() {
            helpers.getMethods(this._controller, (method, name) => {
                let methodAnnotations = annotations.read(method);
                if (Object.prototype.hasOwnProperty.call(methodAnnotations, EXPORT_ANNOTATION_FLAG)) {
                    this._forwardCallToControllerAction(name, method);
                }
            });
        },

        _forwardCallToControllerAction: function(name, action) {
            if (this[name] === undefined) {
                this[name] = function() {
                    let ret = action.apply(this._controller, arguments);
                    return ret === this._controller ? this : ret;
                }.bind(this);
            } else {
                logger.warn('UiHost: Setting forward to controller action by a property named \'' + name + '\' already exist on the host.');
            }
        },

        _heedReadiness: function() {
            this.on('ready', () => {
                /*if (this._controller) {
                   this._exportControllerPublicMethod();
                }*/
            });
        }
    });
}(HeO2));
