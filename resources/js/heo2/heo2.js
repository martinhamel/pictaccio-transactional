/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2014-2019, Heliox - All Right Reserved
 */

(function(global) {
	"use strict";

	if (!global.HeO2) {
	    let readyCallbacks = [];
	    let ready = false;

		global.HeO2 = Object.create(null);
		global.HeO2.lib = Object.create(null);

		global.HeO2.require = function(module) {
			let current = global;

			module = module.split('.');
			for (let i = 0, length = module.length; i < length; ++i) {
				if (Object.prototype.hasOwnProperty.call(current, module[i])) {
					current = current[module[i]];
				} else {
					throw new ReferenceError('HeO2.require: module \'' + module.join('.') + '\' not loaded.');
				}
			}

			return current;
		};

        global.HeO2.ready = function(callback) {
            if (ready) {
                callback();
            } else {
                readyCallbacks.push(callback);
            }
        };

        global.HeO2.__sendReady = function() {
            if (ready === false) {
                ready = true;
                for (let callback of readyCallbacks) {
                    callback();
                }
            }
        };
		global.HeO2.DEBUG = true;
	}
}(window));
