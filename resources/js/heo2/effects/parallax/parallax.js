/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2014-2019, Heliox - All Right Reserved
 */

(function(HeO2, $, window) {
    HeO2.Parallax = HeO2.EventingClass.extend({
        /** FIELDS */
        _DEFAULTS: {
            amplitude: 1,
            limits: 0,
            orientation: 'backward', /* [forward, backward] */
            trackRange: 0,
            target: null,
            tracks: document
        },

        _$target: null,
        _$tracking: null,
        _options: null,
        _targetDom: null,

        /** ALIAS */
        _trackingScroll: null,
        _bindedTrackScroll: null,

        /** PUBLIC */
        init: function(options) {
            this._bindedTrackScroll = this._track_scroll.bind(this);
            this.setOptions(options);
            this._attach();
        },

        setOptions: function(options) {
            this._options = $.extend({}, this._options || this._DEFAULTS, options);

            this._attach();
            this._options.limits = this._computeLimits(this._options.limits);
            this._options.trackRange = this._computeLimits(this._options.trackRange);

            this._track_scroll(null);
        },


        /** EVENT HANDLERS */
        _track_scroll: function(event) {
            var track = this._getScrollTrack();
            if (track.scrollTop > this._options.trackRange.top.px && track.scrollTop < this._options.trackRange.bottom.px) {
                var position =
                    track.scrollTop * this._options.amplitude
                    / track.scrollHeight
                    * (this._options.limits.bottom.pc - this._options.limits.top.pc)
                    +  this._options.limits.top.pc;
                /*this._$target.css('backgroundPositionY',
                    '0 ' + this._options.orientation === 'backward' ? 100 - position  + '%' : position  + '%');*/
                this._targetDom.style['background-position'] = '0 ' +
                    (this._options.orientation === 'backward' ? 100 - position  + '%' : position  + '%');
            }
        },


        /** PRIVATE */
        _attach: function() {
            if (this._$tracking) {
                this._$tracking.off('scroll', this._bindedTrackScroll);
            }

            //TODO: Looks like _$target isn't needed at all, consider removing it
            this._$target = $(this._options.target);
            this._targetDom = this._$target[0];
            this._$tracking = $(this._options.tracks);

            this._$target.css({
                transition: 'none',
                visibility: 'visible'
            });
            this._$tracking.scroll(this._bindedTrackScroll);
        },

        _computeLimits: function(limits) {
            if (typeof limits !== 'object') {
                limits = {
                    top: limits,
                    bottom: limits
                }
            }
            if (!('top' in limits || 'bottom' in limits)) {
                console.warn('Parallax | Missing properties [top, bottom] on limits or trackRange option');
            }

            for (var prop in limits) {
                if (limits.hasOwnProperty(prop)) {
                    var tokens = String(limits[prop]).match(/^(\d+(?:\.\d+)?)(.*)$/);
                    limits[prop] = this._parseLimit(tokens[1], tokens[2], prop);
                }
            }

            return limits;
        },

        _getScrollTrack: function() {
            if ((this._$tracking[0] === window || this._$tracking[0] === document)) {
                if (window.document.body === null) {
                    return {scrollTop: 0, scrollHeight: 0};
                }
                return window.document.body.scrollTop ? window.document.body : window.document.documentElement;
            } else {
                return this._$tracking[0];
            }
        },

        _parseLimit: function(limit, type, reference /*[top, bottom]*/ ) {
            var pixels = limit,
                track = this._getScrollTrack();
            if (type === '%') {
                pixels = track.scrollHeight * parseInt(limit) / 100;
            }

            pixels = parseInt(reference === 'bottom' ?
                track.scrollHeight - pixels :
                pixels);
            return {
                px: pixels,
                pc: pixels / track.scrollHeight * 100
            };
        }
    });
}(HeO2, jQuery, window));
