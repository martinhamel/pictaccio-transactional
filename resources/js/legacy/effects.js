!function(t, i, o) {
    "use strict";
    t.Parallax = t.EventingClass.extend({
        _DEFAULTS: {amplitude: 1, limits: 0, orientation: "backward", trackRange: 0, target: null, tracks: document},
        _$target: null,
        _$tracking: null,
        _options: null,
        _targetDom: null,
        _trackingScroll: null,
        _bindedTrackScroll: null,
        init: function(t) {
            this._bindedTrackScroll = this._track_scroll.bind(this), this.setOptions(t)
        },
        setOptions: function(t) {
            this._options = i.extend({}, this._options || this._DEFAULTS, t);
                this._attach(),
                this._options.limits = this._computeLimits(this._options.limits),
                this._options.trackRange = this._computeLimits(this._options.trackRange),
                this._track_scroll(null)
        },
        _track_scroll: function(t) {
            var i = this._getScrollTrack();
            if (i.scrollTop > this._options.trackRange.top.px && i.scrollTop < this._options.trackRange.bottom.px) {
                var o = i.scrollTop * this._options.amplitude / i.scrollHeight * (this._options.limits.bottom.pc - this._options.limits.top.pc) + this._options.limits.top.pc;
                this._targetDom.style["background-position"] = "0 " + ("backward" === this._options.orientation ? 100 - o + "%" : o + "%")
            }
        },
        _attach: function() {
            this._$tracking && this._$tracking.off("scroll", this._bindedTrackScroll), this._$target = i(this._options.target), this._targetDom = this._$target[0], this._$tracking = i(this._options.tracks), this._$target.css({
                transition: "none",
                visibility: "visible"
            }), this._$tracking.scroll(this._bindedTrackScroll)
        },
        _computeLimits: function(t) {
            "object" != typeof t && (t = {
                top: t,
                bottom: t
            }), "top" in t || "bottom" in t || console.warn("Parallax | Missing properties [top, bottom] on limits or trackRange option");
            for (var i in t) if (t.hasOwnProperty(i)) {
                var o = String(t[i]).match(/^(\d+(?:\.\d+)?)(.*)$/);
                t[i] = this._parseLimit(o[1], o[2], i)
            }
            return t
        },
        _getScrollTrack: function() {
            return this._$tracking[0] === o || this._$tracking[0] === document ? null === o.document.body ? {
                scrollTop: 0,
                scrollHeight: 0
            } : o.document.body.scrollTop ? o.document.body : o.document.documentElement : this._$tracking[0]
        },
        _parseLimit: function(t, i, o) {
            var s = t, n = this._getScrollTrack();
            return "%" === i && (s = n.scrollHeight * parseInt(t) / 100), s = parseInt("bottom" === o ? n.scrollHeight - s : s), {
                px: s,
                pc: s / n.scrollHeight * 100
            }
        }
    })
}(HeO2_legacy, jQuery, window);
