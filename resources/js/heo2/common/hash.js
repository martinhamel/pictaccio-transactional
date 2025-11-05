(function (HeO2) {
    "use strict";

    const EventingClass = HeO2.require('HeO2.EventingClass');

    HeO2.Hash = EventingClass.extend({
        init: function() {
            this._super();

            this._nil = Object.create(null);
            this._hash = Object.create(null);
        },

        /**
         * Test whether the hash contains <key>.
         * @param key {string} A dot delimited path to the value to test.
         * @returns {boolean} True if the hash contains <key>, false otherwise.
         */
        check: function(key) {
            return this._findNode(key.split('.')) !== this._nil;
        },

        /**
         * Returns the value at <key>
         * @param key A dot delimited path to the value to read.
         * @returns {mixed} The value located at <key>. Will return {undefined} if <key> isn't found.
         */
        read: function(key) {
            var value = this._findNode(key.split('.'));
            var event = this._emitReading(key, value);

            if (!event.cancel) {
                if (key !== event.key) {
                    key = event.key;
                    value = this._findNode(key.split('.'));
                }
                this._emitRead(key, value);
                return value !== this._nil ? value : undefined;
            }

            return undefined;
        },

        /**
         * Write <value> at <key>
         * @param key A dot delimited path to the value to write. If <key> doesn't exist it is created otherwise it is overwritten.
         * @param value The value to write at <key>.
         */
        write: function(key, value) {
            var event = this._emitWriting(key, this._findNode(key.split('.')), value);

            if (!event.cancel) {
                key = key.split('.');
                this._findNode(key, true)[key[key.length - 1]] = value;
                this._emitWritten(key, value);
                return true;
            }
            return false;
        },


        /* PRIVATE */
        _emitReading: function(key, value) {
            var event = {
                cancel: undefined,
                key: key,
                value: value
            };

            this.emit('reading', event);
            return event;
        },

        _emitRead: function(key, value) {
            var event = {
                key: key,
                value: value
            };

            this.emit('read', event);
        },

        _emitWriting: function(key, oldValue, newValue) {
            var event = {
                cancel: undefined,
                key: key,
                oldValue: oldValue,
                value: newValue
            };

            this.emit('writing', event);

            return event;
        },

        _emitWritten: function(key, value) {
            var event = {
                key: key,
                value: value
            };

            this.emit('written', event);
            this.emit('written.' + key, event);
            return event;
        },

        _findNode: function(key, write) {
            write = write || false;

            var hash = this._hash;
            for (var i = 0, length = key.length - (write ? 1 : 0); i < length; ++i) {
                if (Object.prototype.hasOwnProperty.call(hash, key[i])) {
                    hash = hash[key[i]];
                } else if (write) {
                    hash[key[i]] = Object.create(null);
                    hash = hash[key[i]];
                } else {
                    return this._nil;
                }
            }

            return hash;
        }
    });
}(HeO2));
