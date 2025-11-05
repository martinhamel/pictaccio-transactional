/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2014-2019, Heliox - All Right Reserved
 */

(function(HeO2) {
	"use strict";

	const Promise = HeO2.require('HeO2.Promise');

	HeO2.DelayedAsset = Promise.extend({
		_blob: null,
		_reader: null,

		init: function(blob) {
			this._super();

			this._blob = blob;
			this._reader = new FileReader();
			this._reader.onload = this._reader_load.bind(this);
			this._reader.onerror = this._reader_error.bind(this);
		},

		arrayBuffer: function() {
			this._reader.readAsArrayBuffer(this._blob);
			return this;
		},

		binaryString: function() {
			this._reader.readAsBinaryString(this._blob);
			return this;
		},

		dataUrl: function() {
			this._reader.readAsDataURL(this._blob);
			return this;
		},

		text: function() {
			this._reader.readAsText(this._blob);
			return this;
		},


		/* EVENT HANDLERS */
		_reader_error: function(event) {
			this.reject();
		},

		_reader_load: function(event) {
			this.resolve({
				result: event.target.result
			})
		}
	});

	HeO2.DelayedAsset.create = function(file) {
		return new HeO2.DelayedAsset(file);
	}
}(HeO2));
