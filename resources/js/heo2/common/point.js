/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2014-2019, Heliox - All Right Reserved
 */

(function (HeO2) {
	"use strict";

	const Class = HeO2.require('HeO2.Class');

	/**
	 * @namespace HeO2
	 */
	/**
	 * Represent a point
	 * @constructor
	 * @param x
	 * @param y
	 */
	HeO2.Point = Class.extend({
		/* FIELDS */
		_x: null,
		_y: null,

		/* PUBLIC */
		init: function (x, y) {
			this._x = x;
			this._y = y;
		},


		/* GETTERS/SETTERS */
		x: function(value) {
			if (value) {
				this._x = value;
			}
			return this._x;
		},

		y: function(value) {
			if (value) {
				this._y = value;
			}
			return this._y;
		}
	});
})(HeO2);
