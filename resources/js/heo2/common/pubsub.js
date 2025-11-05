/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2014-2019, Heliox - All Right Reserved
 */

(function(HeO2) {
	"use strict";

	function PubSubSingleton() {
		if (typeof PubSubSingleton.prototype.__instance === 'undefined') {
			PubSubSingleton.prototype.__instance = new (HeO2.EventingClass.extend());
		}

		return PubSubSingleton.prototype.__instance;
	}

	HeO2.Bus = PubSubSingleton;
}(HeO2));
