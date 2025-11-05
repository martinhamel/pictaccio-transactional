!function(t, i, e) {
    "use strict";
    window.HeO2_legacy.home = () => {
        new (t.Class.extend({
            _BACKGROUND_PATH: "img/backgrounds/",
            _BACKGROUND_IMAGES: ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg"],
            _CHANGE_INTERVAL: 6e3,
            _$hero: null,
            _$heroImg: null,
            _currentImage: null,
            _images: [],
            _heroLineParallax: null,
            _timerId: null,
            _getWindowHeight: i().height.bind(i(e)),
            init: function() {
                jQuery(() => {
                    this._attach(), this._preload(), this._updateHeroContainer(), this._startHeroLineParallax(), setInterval(this._timer_tick.bind(this), this._CHANGE_INTERVAL)
                });
            },
            _timer_tick: function() {
                this._$heroImg.css("background-image", 'url("' + this._currentImage.img.src + '")'), this._currentImage = this._currentImage.next
            },
            _window_resize: function(t) {
                this._updateHeroContainer()
            },
            _attach: function() {
                this._$hero = i("#hero"), this._$heroImg = i("#hero-img").css("transition", "all 1s ease-out"), i(e).resize(this._window_resize.bind(this))
            },
            _preload: function() {
                for (var t = this._BACKGROUND_IMAGES.length; this._BACKGROUND_IMAGES[--t];) {
                    var i = new Image;
                    i.src = this._BACKGROUND_PATH + this._BACKGROUND_IMAGES[t], this._images.push({
                        img: i,
                        next: this._images.length ? this._images[this._images.length - 1] : null
                    })
                }
                this._images[0].next = this._images[this._images.length - 1], this._currentImage = this._images[this._images.length - 2]
            },
            _startHeroLineParallax: function() {
                this._heroLineParallax = new t.Parallax({
                    target: "#hero-line",
                    amplitude: 5,
                    limits: {top: "50%", bottom: "20%"}
                })
            },
            _updateHeroContainer: function() {
                this._$hero.height(this._getWindowHeight())
            }
        }))
    };
}(HeO2_legacy, jQuery, window);
