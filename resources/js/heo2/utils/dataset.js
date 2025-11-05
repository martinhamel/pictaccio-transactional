(function(HeO2) {
    "use strict";

    const EventingClass = HeO2.require('HeO2.EventingClass');
    const helpers = HeO2.require('HeO2.common.helpers');

    const DEFAULT_OPTIONS = {
        undefinedAsEmptyObject: false
    };

    HeO2.utils.Dataset = EventingClass.extend({
        init: function(data, options) {
            this._super();

            this._options = helpers.merge(DEFAULT_OPTIONS, options);

            this._data = data || Object.create(null);
            this._makeDataField();
        },

        export: function() {
            return this._data;
        },

        import: function(data) {
            this._data = data;
            this._makeDataField();
        },

        view: function(viewTraps) {
            if (typeof viewTraps.set === 'function') {
                delete viewTraps.set;
            }

            return new Proxy(this._data, viewTraps);
        },


        /* PRIVATE */
        _makeDataField: function() {
            const traps = {
                deleteProperty: (target, prop) => {
                    delete target.data[prop];
                    this.emit('deleted', {path: target.path});
                    return true;
                },

                getOwnPropertyDescriptor: () => {
                    return {
                        enumerable: true,
                        configurable: true
                    };
                },

                has: (target, prop) => {
                    return prop in target.data;
                },

                get: (target, prop, receiver) => {
                    if (prop === Symbol.toPrimitive) {
                        return () => target.data;
                    }
                    if (prop === '__unwrap') {
                        return target.data;
                    }
                    if (prop === Symbol.iterator) {
                        if (target.data[Symbol.iterator] === undefined) {
                            throw new Error('Target is not iterable');
                        }
                        return target.data[Symbol.iterator].bind(target.data);
                    }
                    if (typeof target.data[prop] === 'function') {
                        return target.data[prop];
                    }
                    if (!Object.prototype.hasOwnProperty.call(target.data, prop)) {
                        if (this._options.undefinedAsEmptyObject) {
                            target.data[prop] = Object.create(null);
                        } else {
                            return undefined;
                        }
                    }

                    return new Proxy({data: target.data[prop], path: target.path.concat([prop])}, traps);
                },

                set: (target, prop, value, receiver) => {
                    let oldValue = target.data[prop];

                    target.data[prop] = value;

                    this.emit('changed', {path: target.path, oldValue, newValue: value});

                    return true;
                },

                ownKeys: (target) => {
                    return Reflect.ownKeys(target.data);
                }
            };

            this.data = new Proxy({data: this._data, path: []}, traps);
        }
    });
}(HeO2));
