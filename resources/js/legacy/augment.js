!function(t, e) {
    "use strict";
    e(t.document).ready(function() {
        e('select[name="lang"]').change(function() {
            e.ajax({
                method: "POST",
                url: t.serverUrl + "api/config/lang",
                data: {lang: e(this).val()},
                success: function() {
                    location.reload()
                }
            })
        })
    })
}(window, jQuery), function(t, e, o) {
    t.AugmmentCodeForm = t.Client.extend({
        _NOT_FOUND_TIMEOUT: 1500,
        _ORDER_LINK_ID: "#layout-order-link",
        _SERVER_CONFIG: {validateCode: {url: "api/validateCode", method: "get"}},
        _$codeTextInput: null,
        _$submit: null,
        _code: null,
        _codeFormOverlay: null,
        _template: null,
        _timeoutId: null,
        init: function() {
            this._super(), this._template = t.Template.create({html: ["<p>((lang::MESSAGE_ONLINE_FEES))</p>", '<div id="code-form-short-terms">((lang::MESSAGE_SHORT_TERMS_AND_CONDITIONS_BEFORE))<a href="' + serverUrl + t.config.get("URL.termsAndConditions").substring(1) + '">((lang::MESSAGE_SHORT_TERMS_AND_CONDITIONS_LINK))</a>((lang::MESSAGE_SHORT_TERMS_AND_CONDITIONS_AFTER))</div>', '<p style="margin-top: 20px;">', '<input type="text" id="order-code-layout-text" />', '<input type="button" id="order-code-layout-button" class="ui-button disabled" value="((lang::GENERIC_ACCEPT_BEGIN))" disabled="disabled" />', "</p>", '<p id="code-form-status" class="center" style="margin-bottom: 0;">((state::status ready|MESSAGE_ENTER_CODE search|MESSAGE_CODE_VALIDATING found|MESSAGE_CODE_VALIDATED notfound|MESSAGE_CODE_NOT_FOUND))&nbsp;<span id="code-form-subject"></span><br><a href="' + serverUrl + 'code_request" style="display: inline-block; font-size: smaller; margin-top: 8px;">((lang::CODE_REQUEST_MESSAGE_NEED))</a></p>']}), this._attach()
        },
        _begin_click: function(t) {
            this._code && o(serverUrl + "order/" + this._code)
        },
        _code_keyup: function(o) {
            this._resetNotFoundTimeout(), o.keyCode == t.CONST.VK_CODES.ENTER ? this._$submit.click() : this._server.validateCode(e(o.target).val(), {
                success: function(t) {
                    "found" === t.status ? (this._resetNotFoundTimeout(!0), this._template.state("status", "found"), e("#code-form-subject").text(" " + t.data.display_name), e("#order-code-layout-button").removeClass("disabled").prop("disabled", !1), this._code = t.data.code) : (this._template.state("status", "search"), e("#code-form-subject").text(""), e("#order-code-layout-button").addClass("disabled"))
                }.bind(this), error: function(t) {
                    this._talk("modal-message", {
                        title: e.i18n("ERROR_TITLE"),
                        text: e.i18n("ERROR_SERVER_COMM_FAILED")
                    })
                }.bind(this)
            })
        },
        _orderLink_click: function(t) {
            return this._codeFormOverlay.show(), this._$codeTextInput.focus(), !1
        },
        _attach: function() {
            e(this._ORDER_LINK_ID).click(this._orderLink_click.bind(this)).length && (this._createCodeFormOverlay(), this._$codeTextInput = e("#order-code-layout-text").keyup(this._code_keyup.bind(this)), this._$submit = e("#order-code-layout-button").click(this._begin_click.bind(this)))
        },
        _createCodeFormOverlay: function() {
            this._codeFormOverlay = new t.UI.ModalOverlay({
                width: "fra" === t.config.get("Config.language") ? "640px" : "630px",
                height: "auto",
                css: 'dialog-overlay-legacy',
                callbacks: {
                    contentDraw: function(t) {
                        t.empty().append(this._template.render())
                    }.bind(this)
                }
            })
        },
        _resetNotFoundTimeout: function(t) {
            this._timeoutId && clearTimeout(this._timeoutId), t || (this._timeoutId = setTimeout(function() {
                this._template.state("status", "notfound")
            }.bind(this), this._NOT_FOUND_TIMEOUT))
        }
    })
}(HeO2_legacy, jQuery, function(t) {
    window.location.href = t
});
