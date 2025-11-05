(function(HeO2, $) {
    "use strict";

    const ViewComponent = HeO2.require('HeO2.View.Component');
    const breakpointObserver = HeO2.require('HeO2.utils.breakpointObserver');
    const domHelpers = HeO2.require('HeO2.common.domHelpers');
    const helpers = HeO2.require('HeO2.common.helpers');

    const STICKY_ATTRIBUTE_NAME = 'data-heo2-sticky';
    const STICKY_NODE_SELECTOR = '[' + STICKY_ATTRIBUTE_NAME + ']';
    const STICKY_DELIMITER = ',';

    /**
     *
     * @event sticky AND sticky-{id} Emitted when an element becomes sticky
     * Note: the -{id} version is only emitted if the element has an id
     * {
     *   id: {string}
     *   elementNode: {jQuery}
     *   pageOffset: {rect}
     * }
     *
     * @event normal AND normal-{id} Emitted when an element becomes normal
     * Note: the -{id} version is only emitted if the element has an id
     * {
     *   id: {string}
     *   element: {HTMLElement}
     *   pageOffset: {rect}
     * }
     *
     * @type {StickyComponent}
     */
    const StickyComponent = ViewComponent.extend({
        /* LIFE CYCLE */
        _prepareOptions: function(options) {

        },

        _initialize: function() {
            this._stickyNodes = [];
            this._createMutationObserver();
        },

        _attach: function() {
            $(STICKY_NODE_SELECTOR)
                .each(function(index, element) {
                    let elementNode = $(element);
                    let params = this._parseParamString(elementNode.attr(STICKY_ATTRIBUTE_NAME));

                    for (let i = 0, keys = Object.keys(params), length = keys.length; i < length; ++i) {
                        let value = params[keys[i]].split(STICKY_DELIMITER);

                        //TODO: Make future proof
                        if (keys[i] === 'exclude-breakpoint') {
                            params[keys[i]] = value;
                        } else {
                            params[keys[i]] = helpers.isNumeric(value) ?
                                parseInt(value, 10) :
                                value;
                        }
                    }

                    this._mutationObserver.observe(elementNode[0], {attributes: true, attributeFilter: ['style']});
                    this._stickyNodes.push({
                        element: elementNode[0],
                        params: params
                    });
                }.bind(this));

            $(window).scroll(this._window_scroll.bind(this));
            breakpointObserver.on('changed', this._breakpoint_changed.bind(this));
        },


        /* EVENT HANDLERS */
        _breakpoint_changed: function(event) {
            this._process();
        },

        _window_scroll: function(event) {
            this._process();
        },


        /* PRIVATE */
        _createMutationObserver: function() {
            this._mutationObserver = new MutationObserver((mutations) => {
                this._process();
            });
        },

        _emitNormal: function(element, pageOffset) {
            let event = {
                id: element.id,
                element: element,
                pageOffset: pageOffset
            };

            this.emit('normal', event);
            if (element.id) {
                this.emit('normal-' + element.id, event);
            }
        },

        _emitSticky: function(element, pageOffset) {
            let event = {
                id: element.id,
                element: element,
                pageOffset: pageOffset
            };

            this.emit('sticky', event);
            if (element.id) {
                this.emit('sticky-' + element.id, event);
            }
        },

        _getViewportPosition: function(element) {
            let viewportPosition = Object.create(null);

            viewportPosition.top = viewportPosition;
        },

        _process: function() {
            for (let i = 0, length = this._stickyNodes.length; i < length; ++i) {
                let element = this._stickyNodes[i].element;
                let pageOffset = element.__heo2_sticky ? element.__heo2_sticky_pageOffset : domHelpers.getPageBoundingRect(element);
                let topViewportPercent = (pageOffset.top - document.documentElement.scrollTop) / document.documentElement.clientHeight * 100;
                let bottomViewportPercent = (pageOffset.bottom - document.documentElement.scrollTop) / document.documentElement.clientHeight * 100;

                if (window.getComputedStyle(element).getPropertyValue('display') === 'none') {
                    continue;
                }

                if (!element.__heo2_sticky && this._stickyNodes[i].params['viewport-x'][0] > topViewportPercent &&
                    ( (this._stickyNodes[i].params['exclude-breakpoint'] &&
                        this._stickyNodes[i].params['exclude-breakpoint'].indexOf(breakpointObserver.current()) === -1)
                        || !this._stickyNodes[i].params['exclude-breakpoint']) ) {
                    element.__heo2_sticky_originals = {
                        left: element.style.left,
                        top: element.style.top,
                        width: element.style.width
                    };

                    element.style.position = 'fixed';
                    element.style.left = pageOffset.left + 'px';
                    element.style.top = '0';
                    element.style.top = this._stickyNodes[i].params['viewport-x'][0] + 'vh';
                    element.style.width = pageOffset.width + 'px';
                    element.__heo2_sticky = true;
                    element.__heo2_sticky_pageOffset = pageOffset;

                    if (this._stickyNodes[i].params['stick']) {
                        for (let j = 0, stickLength = this._stickyNodes[i].params['stick'].length; j < stickLength; ++j) {
                            switch (this._stickyNodes[i].params['stick'][j]) {
                            case 'left':
                                element.style.right = 'auto';
                                element.style.left = 0;
                                break;

                            case 'top':
                                element.style.bottom = 'auto';
                                element.style.top = 0;
                                break;

                            case 'right':
                                element.style.left = 'auto';
                                element.style.right = 0;
                                break;

                            case 'bottom':
                                element.style.top = 'auto';
                                element.style.bottom = 0;
                                break;
                            }
                        }
                    }

                    if (element.__heo2_sticky_placeholder) {
                        element.__heo2_sticky_placeholder.style.display = 'block';
                    } else {
                        element.__heo2_sticky_placeholder = document.createElement('div');
                        element.__heo2_sticky_placeholder.style.height = pageOffset.height + 'px';
                        element.parentNode.insertBefore(element.__heo2_sticky_placeholder, element);
                    }

                    this._emitSticky(element, pageOffset);
                } else if (element.__heo2_sticky && (this._stickyNodes[i].params['viewport-x'][0] <= topViewportPercent ||
                            (this._stickyNodes[i].params['exclude-breakpoints'] &&
                                this._stickyNodes[i].params['exclude-breakpoints'].indexOf(breakpointObserver.current()) !== -1))) {
                    element.style.position = '';
                    element.style.top = '';
                    element.__heo2_sticky = false;
                    element.__heo2_sticky_placeholder.style.display = 'none';
                    element.style.left = element.__heo2_sticky_originals.left;
                    element.style.top = element.__heo2_sticky_originals.top;
                    element.style.width = element.__heo2_sticky_originals.width;

                    this._emitNormal(element, pageOffset);
                }
            }
        }
    });

    ViewComponent.add('Sticky', StickyComponent);
}(HeO2, jQuery));
