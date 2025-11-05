(function (HeO2, $) {
    "use strict";

    const EventingClass = HeO2.require('HeO2.EventingClass');
    const Server = HeO2.require('HeO2.Server');
    const helpers = HeO2.require('HeO2.common.helpers');
    const annotations = HeO2.require('HeO2.common.annotations');
    const logger = HeO2.require('HeO2.common.logger');

    const SERVER_ACTION_REGEX = /^(?!^init$|^_.*).*$/;
    const SERVER_ANNOTATION_FLAG = 'server';
    const SERVER_COMM_ERROR_TITLE = 'SERVER_ERROR_TITLE';
    const SERVER_COMM_ERROR_MESSAGE = 'SERVER_ERROR_MESSAGE';
    const LISTENERS_REGEX = /^_.*$/;
    const LISTENERS_ANNOTATION_FLAG = 'on';

    const DEFAULT_OPTIONS = {
        components: [],
        serverEmitGeneric: true
    };

    HeO2.Controller = EventingClass.extend({
        /* FIELDS */


        /* PUBLIC */
        init: function(host, options) {
            this._super();
            this._makeServerConfig();

            this._host = host;
            this._controllerOptions = helpers.merge(true, DEFAULT_OPTIONS, options);

            this._processOptions();
            this._autoListenHostEvents();
            this._heedReadiness();
        },

        activeView: function() {
            return this._host.views()['default'];
        },

        attachView: function(view) {
            //TODO: Implement
        },

        host: function() {
            return this._host;
        },


        /* LIFE CYCLE */
        /**
         * Called after the dom becomes ready and all views have attached
         * @private
         */
        _ready: function() {

        },

        /* PRIVATE */
        _autoListenHostEvents: function() {
            helpers.getMethods(this, {filter: LISTENERS_REGEX}, (method, name) => {
                let methodAnnotations = annotations.read(method);

                if (methodAnnotations[LISTENERS_ANNOTATION_FLAG] !== undefined) {
                    let props = Object.keys(methodAnnotations[LISTENERS_ANNOTATION_FLAG]);

                    if (props.length !== 1) {
                        throw new Error(`Invalid host listener annotation for method '${name}'`);
                    }

                    this._host.on(props[0], method.bind(this));
                }
            });
        },

        _decorateServerMethod: function(name, func) {
            func = func.bind(this);

            this[name] = (data, callback) => {
                this._server[name](data, {
                    beforeSend: (events, xhr) => {
                        let event = {cancel: undefined, data};

                        if (typeof this[`${name}_beforeSend`] === 'function') {
                            this[`${name}_beforeSend`](event);

                            if (event.cancel) {
                                return false;
                            }
                        }

                        this._host.emit('server-start.' + name, event);
                        if (event.emitGeneric || (!event.emitGeneric && this._controllerOptions.serverEmitGeneric)) {
                            this._host.emit('server-start', helpers.merge(event, {callName: name}));
                        }

                        if (event.data && !(xhr.data instanceof FormData)) {
                            xhr.data = $.param(event.data);
                        }
                    },

                    success: (response) => {
                        let event = {response: response};
                        this._host.emit('server-response.' + name, event);
                        if (event.emitGeneric || (!event.emitGeneric && this._controllerOptions.serverEmitGeneric)) {
                            this._host.emit('server-response', event);
                        }
                        if (!event.cancel) {
                            func(response, data, callback);
                        }
                    },

                    error: (error) => {
                        this._host.emit('server-error.' + name, error);
                        if (error.emitGeneric || (!error.emitGeneric && this._controllerOptions.serverEmitGeneric)) {
                            this._host.emit('server-error', error);
                        }

                        if (typeof this[`${name}_error`] === 'function') {
                            this[`${name}_error`](error);
                        }
                    },

                    complete: () => {
                        let event = {};
                        this._host.emit('server-end.' + name, event);
                        if (event.emitGeneric || (!event.emitGeneric && this._controllerOptions.serverEmitGeneric)) {
                            this._host.emit('server-end', {callName: name});
                        }

                        if (typeof this[`${name}_complete`] === 'function') {
                            this[`${name}_complete`](event);
                        }
                    }
                });
            };
        },

        _heedReadiness: function() {
            this._host.on('ready', () => {
                this._ready();
            });
        },

        _importComponents: function() {
            for (let i = 0, length = this._controllerOptions.components.length; i < length; ++i) {
                let componentName = typeof this._controllerOptions.components[i] === 'string' ?
                    this._controllerOptions.components[i] :
                    this._controllerOptions.components[i].name;
                let componentOptions = typeof this._controllerOptions.components[i] === 'string' ?
                    {} :
                    this._controllerOptions.components[i].options;
                let component = HeO2.Controller.Component.get(componentName);
                if (component) {
                    if (this[componentName] === undefined) {
                        this[componentName] = new component(this, componentOptions);
                    } else {
                        logger.warn('Controller: This View already has a property \'' + componentName + '\' defined, component cannot be loaded.');
                    }
                } else {
                    logger.warn('Controller: Component name \'' + componentName + '\' not found.')
                }
            }
        },

        _makeServerConfig: function() {
            let serverConfig = Object.create(null);
            helpers.getMethods(this, {filter: SERVER_ACTION_REGEX}, (method, name) => {
                let methodAnnotations = annotations.read(method);
                if (methodAnnotations[SERVER_ANNOTATION_FLAG] !== undefined) {
                    serverConfig[name] = {
                        method: methodAnnotations.server.method,
                        url: methodAnnotations.server.url,
                        //headers: JSON.parse(methodAnnotations.headers),
                        error: {
                            title: methodAnnotations.server.errorTitle,
                            message: methodAnnotations.server.errorMessage
                        }
                    };

                    this._decorateServerMethod(name, method);
                }
            });

            this._server = new Server(serverConfig);
        },

        _processOptions: function() {
            if (Array.isArray(this._controllerOptions.components) && this._controllerOptions.components.length) {
                //this._importComponents();
            }
        }
    });

    HeO2.Controller.CLASS = 'Controller';
}(HeO2, jQuery));
