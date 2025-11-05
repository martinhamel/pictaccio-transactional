/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2014-2019, Heliox - All Right Reserved
 */

(function (HeO2, $, redirect) {
	HeO2.AugmmentCodeForm = HeO2.Client.extend({
		_NOT_FOUND_TIMEOUT: 1500,
		_ORDER_LINK_ID: '#layout-order-link',
		_SERVER_CONFIG: {
			validateCode: {url: 'api/validateCode', method: 'get'}
		},

		_$codeTextInput: null,
		_$submit: null,
		_code: null,
		_codeFormOverlay: null,
		_template: null,
		_timeoutId: null,

		init: function() {
			this._super();

			this._template = HeO2.Template.create({
				html: [
					'<p>((lang::MESSAGE_ONLINE_FEES))</p>',
					'<div id="code-form-short-terms">((lang::MESSAGE_SHORT_TERMS_AND_CONDITIONS_BEFORE))<a href="' + serverUrl + HeO2.config.get('URL.termsAndConditions').substring(1) + '">((lang::MESSAGE_SHORT_TERMS_AND_CONDITIONS_LINK))</a>((lang::MESSAGE_SHORT_TERMS_AND_CONDITIONS_AFTER))</div>',
					'<p style="margin-top: 20px;">',
					'<input type="text" id="order-code-layout-text" />',
					'<input type="button" id="order-code-layout-button" class="ui-button disabled" value="((lang::GENERIC_ACCEPT_BEGIN))" disabled="disabled" />',
					'</p>',
					'<p id="code-form-status" class="center" style="margin-bottom: 0;">((state::status ready|MESSAGE_ENTER_CODE search|MESSAGE_CODE_VALIDATING found|MESSAGE_CODE_VALIDATED notfound|MESSAGE_CODE_NOT_FOUND))&nbsp;<span id="code-form-subject"></span><br><a href="' + serverUrl + 'code_request" style="display: inline-block; font-size: smaller; margin-top: 8px;">((lang::CODE_REQUEST_MESSAGE_NEED))</a></p>'
				]});

			this._attach();
		},


		/* EVENT HANDLERS */
		_begin_click: function(event) {
			if (this._code) {
				redirect(serverUrl + 'order/choose/' + this._code);
			}
		},

		_code_keyup: function(event) {
			this._resetNotFoundTimeout();
			if (event.keyCode == HeO2.CONST.VK_CODES.ENTER) {
				this._$submit.click();
			} else {
				this._server.validateCode($(event.target).val(), {
					success: function (response) {
						if (response.status === 'found') {
							this._resetNotFoundTimeout(true);
							this._template.state('status', 'found');
							$('#code-form-subject').text(' ' + response.data.display_name);
							$('#order-code-layout-button')
								.removeClass('disabled')
								.prop('disabled', false);
							this._code = response.data.code;
						} else {
							this._template.state('status', 'search');
							$('#code-form-subject').text('');
							$('#order-code-layout-button')
								.addClass('disabled');
						}
					}.bind(this),
					error: function (error) {
						this._talk('modal-message', {
							title: $.i18n('ERROR_TITLE'),
							text: $.i18n('ERROR_SERVER_COMM_FAILED')
						});
					}.bind(this)
				});
			}
		},

		_orderLink_click: function(event) {
			this._codeFormOverlay.show();
			this._$codeTextInput.focus();
			return false;
		},


		/* PRIVATE */
		_attach: function() {
			if ($(this._ORDER_LINK_ID).click(this._orderLink_click.bind(this)).length) {
				this._createCodeFormOverlay();
				this._$codeTextInput = $('#order-code-layout-text').keyup(this._code_keyup.bind(this));
				this._$submit = $('#order-code-layout-button').click(this._begin_click.bind(this));
			}
		},

		_createCodeFormOverlay: function() {
			this._codeFormOverlay = new HeO2.UI.ModalOverlay({
				callbacks: {
					contentDraw: function ($context) {
						$context.empty().append(this._template.render());
					}.bind(this)
				}
			});
		},

		_resetNotFoundTimeout: function(found) {
			if (this._timeoutId) {
				clearTimeout(this._timeoutId);
			}
			if (!found) {
				this._timeoutId = setTimeout(function () {
					this._template.state('status', 'notfound');
				}.bind(this), this._NOT_FOUND_TIMEOUT);
			}
		}
	});
}(HeO2, jQuery, function(href) {window.location.href = href;}));
