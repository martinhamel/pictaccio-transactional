/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2014-2019, Heliox - All Right Reserved
 */
/* Simple JavaScript Inheritance for ES 5.1 ( includes polyfill for IE < 9 )
 * based on http://ejohn.org/blog/simple-javascript-inheritance/ (inspired by base2 and Prototype)
 * MIT Licensed.
 */

(function(HeO2) {
	"use strict";

	/* Private */
	var _fnTest = /xyz/.test(function() {xyz;}) ? /\b_super\b/ : /.*/;
	var _listeners = Object.create(null);
	var _components = Object.create(null);
	function _BaseClass() {}

	/* Type methods */
	_BaseClass.extend = function(props) {
		var _super = this.prototype;
		var proto = Object.create(_super);

		if (typeof props.init !== 'function') {
		    props.init = function() {
		        this._super.apply(this, arguments);
            }
        }

		for (var name in props) {
			proto[name] = typeof props[name] === "function" &&
			typeof _super[name] === "function" && _fnTest.test(props[name]) ?
				(function(name, fn) {
					return function() {
						var tmp = this._super;

						if (this === HeO2) {
							throw new Error('Instance has no context, did you forget new?');
						}

						this._super = _super[name];
						var ret = fn.apply(this, arguments);
						return ret;
					};
				})(name, props[name]) :
				props[name];
		}

		var newClass = typeof proto.init === "function" ? proto.init : function() {};
		newClass.prototype = proto;
		proto.constructor = newClass;
		newClass.extend = _BaseClass.extend;
		newClass.CLASS = this.CLASS;
        return newClass;
	};

	_BaseClass.registerComponent = function(name, components) {
		if (_components[name]) {
			console.warn('Class | Component \'' + name + '\' is already registered');
			return false;
		}

		_components[name] = components;
	};

	HeO2.Class = _BaseClass;
}(HeO2));
