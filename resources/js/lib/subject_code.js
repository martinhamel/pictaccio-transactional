(function (HeO2, $) {
    "use strict";

    const Server = HeO2.require('HeO2.Server');

    const NOT_FOUND_TIMEOUT = 1000;

    HeO2.lib.SubjectCode = Server.extend({
        init: function() {
            this._super({
                validateCode: {url: 'api/validateCode', method: 'get'}
            });

            this._found = false;
            this._name = '';
        },

        found: function() {
            return this._found;
        },

        name: function() {
            return this._name;
        },

        validate: function(code) {
            this.emit('searching');
            // this._resetNotFoundTimeout(false);

            this.validateCode(code.trim(), {
                success: function(response) {
                    if (response.status === 'found') {
                        // this._resetNotFoundTimeout(true);

                        this._name = response.data.display_name;
                        this._found = true;
                        this.emit('found', this._name);
                    } else if (response.status === 'not found') {
                        this._name = '';
                        this._found = false;
                        this.emit('not-found');
                    } else {
                        this._name = '';
                        this._found = false;
                    }
                }.bind(this),
                error: function(error) {
                    this._found = false;
                    this.emit('error', error);
                }.bind(this)
            });
        },

        /* PRIVATE */
        _resetNotFoundTimeout: function(found) {
            this.emit('searching');

            if (this._timeoutId) {
                clearTimeout(this._timeoutId);
            }
            if (!found) {
                this._timeoutId = setTimeout(function () {
                    this.emit('not-found');
                }.bind(this), NOT_FOUND_TIMEOUT);
            }
        }
    });
}(HeO2, jQuery));
