/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2014-2019, Heliox - All Right Reserved
 */

(function(HeO2, $, window) {
	"use strict";

	new (HeO2.Class.extend({
		/** FIELDS */
		_BACKGROUND_PATH: 'img/backgrounds/',
		_BACKGROUND_IMAGES: [
				'1.jpg',
				'2.jpg',
				'3.jpg',
				'4.jpg',
				'5.jpg'
			],
		_CHANGE_INTERVAL: 6000,

		_$hero: null,
		_$heroImg: null,
		_currentImage: null,
		_images: [], // [{img: <html img>, next: <next item>}, ...]
		_heroLineParallax: null,
		_timerId: null,

		/** ALIAS */
		_getWindowHeight: $().height.bind($(window)),


		/** PUBLIC */
		init: function() {
			this._attach();
			this._preload();
			this._updateHeroContainer();
			this._startHeroLineParallax();

			setInterval(this._timer_tick.bind(this), this._CHANGE_INTERVAL);
		},


		/** EVENT HANDLERS */
		_timer_tick: function() {
			this._$heroImg.css('background-image', 'url("' + this._currentImage.img.src + '")');
			this._currentImage = this._currentImage.next;
		},

		_window_resize: function(event) {
			this._updateHeroContainer();
		},


		/** PRIVATE */
		_attach: function() {
			this._$hero = $('#hero');
			this._$heroImg = $('#hero-img')
				.css('transition', 'all 1s ease-out');

			$(window).resize(this._window_resize.bind(this));
		},

		_preload: function() {
			var i = this._BACKGROUND_IMAGES.length;
			while (this._BACKGROUND_IMAGES[--i]) {
				var temp = new Image();
				temp.src = this._BACKGROUND_PATH + this._BACKGROUND_IMAGES[i];
				this._images.push({
					img: temp,
					next: this._images.length ? this._images[this._images.length - 1] : null
				});
			}

			this._images[0].next = this._images[this._images.length - 1];
			this._currentImage = this._images[this._images.length - 2];
		},

		_startHeroLineParallax: function() {
			this._heroLineParallax = new HeO2.Parallax({
				target: '#who-we-are',
				amplitude: 5,
				limits: {
					top: '50%',
					bottom: '20%'
				}
			});
		},

		_updateHeroContainer: function() {
			this._$hero.height(this._getWindowHeight());
		}
	}));
})(HeO2, jQuery, window);
