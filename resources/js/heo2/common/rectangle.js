/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2014-2019, Heliox - All Right Reserved
 */

(function(HeO2) {
	"use strict";

	/**
	 * @namespace HeO2
	 */
	/**
	 * Represent a rectangle
	 * @constructor
	 * @param {number} left Left coordinate
	 * @param {number} top Top coordinate
	 * @param {number} right/width If size is true, specifies the width of the rectangle, otherwise it represent the right coordinate
	 * @param {number} bottom/height If size is true, specifies the height of the rectangle, otherwise it represent the bottom coordinate
	 * @param {boolean} size __[Optional]__ Specify if the size is given instead of the bottom right coordinates
	 */
	HeO2.Rectangle = HeO2.Class.extend({
		/* FIELDS */
		_left: null,
		_top: null,
		_right: null,
		_bottom: null,

		/* PUBLIC */
		init: function(left, top, right, bottom, size) {
			size = size || false;
			this._left = left;
			this._top = top;
			this._right = size ? left + right : right;
			this._bottom = size ? top + bottom : bottom;
		},

		/**
		 * Get rectangle as a set of coordinates and size
		 * @returns {{point: Window.HeO2.Point, size: {width: *, height: *}}}
		 */
		toPointAndSize: function() {
			return {
				point: new HeO2.Point(this._left, this._top),
				size: {
					width: this.width,
					height: this.height
				}
			};
		},

		/**
		 * Get rectangle as two opposing corner points
		 * @returns {{topLeft: Window.HeO2.Point, bottomRight: Window.HeO2.Point}}
		 */
		toPoints: function() {
			return {
				topLeft: new HeO2.Point(this._left, this._top),
				bottomRight: new HeO2.Point(this._right, this._bottom)
			};
		},

		/* GETTERS/SETTERS */
		left: function(value) {
			if (value) {
				this._left = value;
				return this;
			}
			return this._left;
		},

		top: function(value) {
			if (value) {
				this._top = value;
				return this;
			}
			return this._top;
		},

		right: function(value) {
			if (value) {
				this._right = value;
				return this;
			}
			return this._right;
		},

		bottom: function(value) {
			if (value) {
				this._bottom = value;
				return this;
			}
			return this._bottom;
		},

		height: function(value) {
			if (value) {
				this._bottom = this._top + value;
				return this;
			}
			return Math.abs(this._bottom - this._top);
		},

		width: function(value) {
			if (value) {
				this._right = this._left + value;
				return this;
			}
			return Math.abs(this._right - this._left);
		}
	});
})(HeO2);
