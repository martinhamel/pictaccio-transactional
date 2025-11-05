(function(HeO2) {
    "use strict";

    const EventingClass = HeO2.require('HeO2.EventingClass');

    const DIV_OBSERVER_ID = '__breakpoint-observer';

    const breakpointObserver = new (EventingClass.extend({
            _breakpointObserverElement: null,
            _current: '',
            _loaded: false,


            init: function() {
                this._super();
                window.addEventListener('load', this._window_load.bind(this));
            },

            current: function() {
                return this._current;
            },

            loaded: function() {
                return this._loaded;
            },


            // EVENT HANDLERS
            _window_load: function() {
                this._breakpointObserverElement = document.getElementById(DIV_OBSERVER_ID);
                if (this._breakpointObserverElement !== null) {
                    let oldBreakpoint = this._getBreakpoint();

                    this._emitChange('', oldBreakpoint);

                    this._loaded = true;
                    this._current = oldBreakpoint;
                    this._breakpointObserverElement.addEventListener('transitionend', function() {
                        let breakpoint = this._getBreakpoint();

                        this._emitChange(oldBreakpoint, breakpoint);

                        this._current = breakpoint;
                        oldBreakpoint = breakpoint;

                    }.bind(this));
                }
            },


            // PRIVATE
            _emitChange: function(oldBreakpoint, newBreakpoint) {
                this.emit('changed', {
                    old: oldBreakpoint,
                    new: newBreakpoint
                });
            },

            _getBreakpoint: function() {
                let breakpoint = getComputedStyle(this._breakpointObserverElement).getPropertyValue('content');
                return breakpoint.replace(/"/g, '');
            }
        }
    ));

    HeO2.utils.breakpointObserver = breakpointObserver;
}(HeO2));
