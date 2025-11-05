/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2014-2019, Heliox - All Right Reserved
 */

(function(HeO2, $, location) {
    "use strict";

    const Host = HeO2.require('HeO2.Host');
    const Controller = HeO2.require('HeO2.Controller');
    const View = HeO2.require('HeO2.View');

    const CodeRequestController = Controller.extend({

        /* PRIVATE */

    });


    /* VIEW */

    const CodeRequestView = View.extend({
        NAME: 'default',

        init: function(host) {
            this._super(host, {
                    target: '#code-request'
                });
        },

        /* LIFE CYCLE */
        _attach: function() {
            this._super();
        },

        /* EVENT HANDLERS */
        _input_change: function(event) {
            let inputFilled = true;
            inputFilled &= $('#parent-name').val() !== '';
            inputFilled &= $('#subject-name').val() !== '';
            inputFilled &= $('#email').val() !== '';
            inputFilled &= $('#phone').val() !== '';
            inputFilled &= $('#school').val() !== '';

            $('#code-submit').prop('disabled', !inputFilled || !window._recaptcha_success);
        }
        /* PRIVATE */

    });

    window.codeRequest = Host.create(CodeRequestController, CodeRequestView);
}(HeO2, jQuery, window.location));

function recaptcha_success() {
    window._recaptcha_success = true;
    window.codeRequest.views().default._input_change();
}
