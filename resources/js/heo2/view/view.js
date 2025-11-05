(function (HeO2, $) {
    "use strict";

    const EventingClass = HeO2.require('HeO2.EventingClass');
    const inflector = HeO2.require('HeO2.common.inflector');
    const annotations = HeO2.require('HeO2.common.annotations');
    const helpers = HeO2.require('HeO2.common.helpers');
    const logger = HeO2.require('HeO2.common.logger');

    const LISTENERS_REGEX = /^_.*$/;
    const LISTENERS_ANNOTATION_FLAG = 'on';
    const VALIDATE_ID_REGEX = /[a-z0-9-_]*/i;
    const DATA_ATTRIBUTE_UI_NAME = 'data-heo2-name';
    const DATA_ATTRIBUTE_UI_OPTIONS = 'data-heo2-options';
    const DATA_ATTRIBUTE_UI_TYPE = 'data-heo2-ui';
    const DATA_ATTRIBUTE_UI_TYPE_SELECTOR = '[' + DATA_ATTRIBUTE_UI_TYPE + ']';
    const DATA_ATTRIBUTE_UI_HOST_TYPE_SELECTOR = '[data-heo2-host]';
    const DATA_ATTACH_ATTRIBUTE = 'data-heo2-attach';
    const DATA_ATTACH_ATTRIBUTE_SELECTOR = '[' + DATA_ATTACH_ATTRIBUTE + ']';
    const ATTACH_OPTIONS_SEPARATOR = ';';
    const ATTACH_NAME_VALUE_DELIMITER = ':';
    const ATTACH_EVENT_CHAR = '@';
    const ATTACH_DATA_CHAR = '+';
    const DEFAULT_OPTIONS = {
        target: null,
        components: []
    };

    HeO2.View = EventingClass.extend({
        init: function (host, options) {
            if (!host instanceof HeO2.require('HeO2.Host')) {
                throw new Error('View: Must be given a reference to a Host.');
            }

            this._super();

            this._host = host.host;
            this._readyPromise = host.readyPromise;
            this._parentAttachExecFlag = false;
            this._viewOptions = helpers.merge(true, DEFAULT_OPTIONS, options);
            this._targetNode = null;
            this._childUIs = Object.create(null);
            this._childUIs.__unnamed = [];
            this.id = Object.create(null);

            this._processOptions();

            setImmediate(() => {
                this._initiateAttachLifecycle();
            });
        },

        controller: function() {
            return this.host().controller();
        },

        feedback: function(message, title, icon, callback) {
            if (typeof title === 'function') {
                callback = title;
                title = undefined;
            }
            if (typeof icon === 'function') {
                callback = icon;
                icon = undefined;
            }

            this._createFeedbackOverlay((feedbackOverlay) => {
                feedbackOverlay.showMessage(message, title, icon, 'ok', callback);
            });
        },

        feedbackYesNo: function(message, title, icon, callback) {
            if (typeof title === 'function') {
                callback = title;
                title = undefined;
            }
            if (typeof icon === 'function') {
                callback = icon;
                icon = undefined;
            }

            this._createFeedbackOverlay((feedbackOverlay) => {
                feedbackOverlay.showMessage(message, title, icon, 'yesno', callback);
            });
        },

        host: function() {
            return this._host;
        },

        target: function() {
            if (!this._targetNode) {
                this._targetNode = $(this._viewOptions.target);
            }
            return this._targetNode || undefined;
        },

        /* LIFECYCLE */
        _attach: function() {
            this._parentAttachExecFlag = true;
        },

        _componentsLoaded: function() {

        },


        /* PROTECTED */
        _child: function(name) {
            if (!(name in this._childUIs)) {
                throw new Error(`View: Cannot find child UI '${name}'.`);
            }

            return this._childUIs[name];
        },

        _createUiElement: function(element, type, name, options) {
            if (!type) {
                logger.error('View: Creating UI element without type.');
                return false;
            }

            if (typeof options === 'object') {
                options = Object.keys(options).reduce(function(accumulator, current) {
                    return (accumulator ? accumulator + ';' : '') +
                        current.toString() + ':"' + options[current].toString() + '"';
                }, null);
            } else if (typeof options !== 'string') {
                logger.warn('View: Options given to create UI element are invalid.');
                options = null;
            }

            element.setAttribute(DATA_ATTRIBUTE_UI_TYPE, type);
            if (name) {
                element.setAttribute(DATA_ATTRIBUTE_UI_NAME, name);
            }
            if (options) {
                element.setAttribute(DATA_ATTRIBUTE_UI_OPTIONS, options);
            }
            return this._createChildUI(element);
        },

        _loadComponent: function(name, options) {
            let component = HeO2.View.Component.get(name);
            if (!component) {
                logger.warn('View: Component name \'' + name + '\' not found.');
                return;
            }

            return new component(this, options);
        },


        /* PRIVATE */
        _autoAttach: function() {
            if (this._viewOptions.target) {
                $(this.target()).find(DATA_ATTACH_ATTRIBUTE_SELECTOR).each((index, element) => {
                    this._autoAttachElement(element);
                });
            }
        },

        _autoAttachElement: function(element) {
            let elementNode = $(element);
            let attachStrings = elementNode.attr(DATA_ATTACH_ATTRIBUTE).split(ATTACH_OPTIONS_SEPARATOR);
            let options = Object.create(null);

            for (let i = 0, length = attachStrings.length; i < length; ++i) {
                if (attachStrings[i].indexOf(ATTACH_NAME_VALUE_DELIMITER) !== -1) {
                    let name = attachStrings[i].substr(0, attachStrings[i].indexOf(ATTACH_NAME_VALUE_DELIMITER));
                    let value = attachStrings[i].substr(attachStrings[i].indexOf(ATTACH_NAME_VALUE_DELIMITER) + 1);
                    options[name] = value;

                    switch (name[0]) {
                    case ATTACH_EVENT_CHAR:
                        this._autoAttachEvent(elementNode, name.substr(1), value);
                        break;

                    case ATTACH_DATA_CHAR:
                        elementNode.data(name.substr(1), value);
                        break;
                    }
                }
            }

            $(element).data('attach-options', options);
        },

        _autoAttachEvent: function(elementNode, eventName, emitAs) {
            if (elementNode.attr('data-heo2-name') && this._childUIs[elementNode.attr('data-heo2-name')]) {
                if (typeof this[emitAs] === 'function') {
                    this._childUIs[elementNode.attr('data-heo2-name')].on(eventName, this[emitAs].bind(this));
                } else {
                    logger.warn(`View: Attempting to auto attach event '${eventName}' on element '${elementNode.attr('data-heo2-name')}' but method '${emitAs}' isn't implemented`);
                }
            } else {
                elementNode.on(eventName,
                    typeof this[emitAs] === 'function' && helpers.isIdentifier(emitAs) ?
                        this[emitAs].bind(this) :
                        function() {
                            this.emit.apply(this, [emitAs].concat(arguments));
                        }.bind(this)
                );
            }
        },

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

        _createChildUI: function(element) {
            let $element = $(element);
            let uiElementType = inflector.camelize($element.attr(DATA_ATTRIBUTE_UI_TYPE), false);
            if (HeO2.UI[uiElementType]) {
                let uiElementName = $element.attr(DATA_ATTRIBUTE_UI_NAME);

                if (this._childUIs[uiElementName] === undefined) {
                    let ui = new HeO2.UI[uiElementType](this, element);
                    if (uiElementName) {
                        this._childUIs[uiElementName] = ui;
                    } else {
                        this._childUIs.__unnamed.push(ui);
                    }

                    return ui;
                } else {
                    logger.warn('Host: Reserved or duplicate element name \'' + uiElementName + '\'');
                    logger.log(element);
                }
            } else {
                throw new Error('Host: Invalid element');
            }

            return false;
        },

        _createFeedbackOverlay: function(callback) {
            if (this._feedbackOverlay === undefined) {
                let Overlay = HeO2.require('HeO2.UI.Overlay');

                this._feedbackOverlayTarget =
                    $('<div class="overlay overlay-default overlay-feedback" data-heo2-options="close:true;modal:true"></div>')
                        .css('position', 'fixed');
                this._targetNode.append(this._feedbackOverlayTarget);
                this._feedbackOverlay = new Overlay(this, this._feedbackOverlayTarget)
                    .on('ready', () => {callback(this._feedbackOverlay);});
            } else {
                callback(this._feedbackOverlay);
            }
        },

        _createHostedChildUIs: function() {
            if (this._viewOptions.target) {
                let potentialChildUI = $(this.target()).find(DATA_ATTRIBUTE_UI_TYPE_SELECTOR);
                for (let i = 0, nodeLength = potentialChildUI.length; i < nodeLength; ++i) {
                    if (potentialChildUI.eq(i).parentsUntil(this.target(), DATA_ATTRIBUTE_UI_HOST_TYPE_SELECTOR).length === 0) {
                        this._createChildUI(potentialChildUI[i]);
                    }
                }
            }
        },

        _importComponents: function() {
            for (let i = 0, length = this._viewOptions.components.length; i < length; ++i) {
                let name = typeof this._viewOptions.components[i] === 'string' ?
                    this._viewOptions.components[i] :
                    this._viewOptions.components[i].name;
                let refName = typeof this._viewOptions.components[i] !== 'string' ?
                        this._viewOptions.components[i].ref || name : name;
                let options = typeof this._viewOptions.components[i] === 'string' ?
                    {} :
                    this._viewOptions.components[i].options;

                if (this[refName] === undefined) {
                    this[refName] = this._loadComponent(name, options);
                    if (typeof this['_configure' + refName] === 'function') {
                        this['_configure' + refName]();
                    }
                } else {
                    logger.warn('View: This View already has a property \'' + refName + '\' defined, component cannot be loaded.');
                }
            }

            //TODO: Call when all components have attached
            //this._componentsLoaded();
        },

        _indexId: function() {
            this.target().find('[id]').each((index, element) => {
                if (VALIDATE_ID_REGEX.test(element.id)) {
                    this.id[element.id] = $(element);
                }
            });
        },

        _initiateAttachLifecycle: function () {
            $().ready(() => {
                this._indexId();
                this._createHostedChildUIs();
                this._autoAttach();
                this._autoListenHostEvents();
                this._attach();

                if (!this._parentAttachExecFlag) {
                    logger.warn('View: Child attach lifecycle did not call parent.');
                }

                this._readyPromise.resolve();
            });
        },

        _processOptions: function() {
            if (Array.isArray(this._viewOptions.components) && this._viewOptions.components.length) {
                this._importComponents();
            }
        }
    });

    HeO2.View.CLASS = 'View';
}(HeO2, jQuery));
