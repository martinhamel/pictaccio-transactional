/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2014-2019, Heliox - All Right Reserved
 */

(function(HeO2, $, location) {
	"use strict";

	const EventingClass = HeO2.require('HeO2.EventingClass');
	const helpers = HeO2.require('HeO2.common.helpers');

	HeO2.Server = EventingClass.extend({
		/* FIELDS */
		_serverConfig: null,
		_currentLocation: location.origin + location.pathname,


		/* PUBLIC */
		init: function(serverConfig) {
			this._super();

			if (serverConfig) {
				this._setServerConfig(serverConfig);
			}
		},

		call: function(action, data, callbacks, custom) {
			let postForm = new FormData();
			let hasFiles = false;

			callbacks = callbacks || {};
			if (typeof data !== 'object') {
				data = [data];
			}

			if (data !== null) {
				for (let prop of Object.keys(data)) {
					if (data[prop] instanceof File) {
						postForm.append(data[prop].name, data[prop], data[prop].name);
						hasFiles = true;
					} else {
						postForm.append(prop, data[prop]);
					}
				}
			}

			if (this._serverConfig[action]) {
				return $.ajax(
                    helpers.merge(true,
						this._serverConfig[action],
						{
							data: hasFiles ? postForm : data,
							processData: !hasFiles,
							contentType: hasFiles ? false : undefined,
							cache: !hasFiles,
							beforeSend: callbacks.beforeSend || this._ajax_beforeSend.bind(this, action, data, custom),
							error: callbacks.error || this._ajax_error.bind(this, action, data, custom),
							success: callbacks.success || this._ajax_success.bind(this, action, data, custom),
							complete: callbacks.complete || this._ajax_complete.bind(this, action, data, custom)
						},
						this._serverConfig[action].method === 'get' && !helpers.isEmpty(data) ? (data instanceof Array ?
								{url: this._serverConfig[action].url + '/' + data.join('/'), data: null} :
								{url: this._serverConfig[action].url + '?' + helpers.queryString(data)}
							) : null
					)
				);
			} else {
				throw new Error('Server RPC | Unknown action \'' + action + '\'');
			}
		},


		/* PROTECTED */
		_setServerConfig: function(serverConfig) {
            this._serverConfig = serverConfig || Object.create(null);
            this._normalizeConfig();
		},


		/* EVENT HANDLERS */
		_ajax_beforeSend: function(action, requestData, custom, xhr, status) {
			this.emit(action + '-beforeSend', {
				custom: custom,
				requestData: requestData,
				status: status,
				xhr: xhr
			});
		},

		_ajax_complete: function(action, requestData, custom, xhr, status) {
			this.emit(action + '-complete', {
				custom: custom,
				requestData: requestData,
				status: status,
				xhr: xhr
			});
		},

		_ajax_error: function(action, requestData, custom, xhr, status, httpStatus) {
			this.emit(action + '-error', {
				custom: custom,
				httpStatus: httpStatus,
				status: status,
				xhr: xhr
			});
		},

		_ajax_success: function(action, requestData, custom, data, status, xhr) {
			this.emit(action + '-success', {
				custom: custom,
				responseData: data,
				requestData: requestData,
				status: status,
				xhr: xhr
			});
		},


		/* PRIVATE */
		_normalizeConfig: function() {
			for (var action in this._serverConfig) {
				if (this._serverConfig.hasOwnProperty === undefined || this._serverConfig.hasOwnProperty(action)) {
					this._resolveUrl(action, this._serverConfig[action]);
					this._setDefaults(this._serverConfig[action]);
					if (this[action] === undefined) {
						this[action] = this.call.bind(this, action);
					}
				}
			}
		},

		_resolveUrl: function(actionName, actionConfig) {
			actionConfig.url = actionConfig.url || ('+=/' + actionName);

			if (actionConfig.url &&	/^\+=/.test(actionConfig.url)) {
				let addSlash = this._currentLocation[this._currentLocation.length - 1] !== '/' && actionConfig.url[2] !== '/';
				actionConfig.url = this._currentLocation + (addSlash ? '/' : '') + actionConfig.url.substr(2);
			} else if (actionConfig.url && /^\/=/.test(actionConfig.url)) {
				actionConfig.url = window.location.origin + actionConfig.url.substr(2);
			} else {
				actionConfig.url = serverUrl + actionConfig.url;
			}
		},

		_setDefaults: function(actionConfig) {
			actionConfig.method = actionConfig.method || 'post';
			actionConfig.headers = actionConfig.headers || HeO2.CONST.AJAX_HEADER_JSON;
		}
	});

	HeO2.Server.create = function(serverConfig) {
		return new HeO2.Server(serverConfig);
	}
}(HeO2, jQuery, window.location));
