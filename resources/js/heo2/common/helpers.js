(function (HeO2) {
	"use strict";

	const VK_CODES = HeO2.require('HeO2.CONST.VK_CODES');

    const DEFAULT_MERGE_RECURSE_LEVEL = 10;
    const NUMERIC_TEST_REGEX = /^(?:0.)?[1-9.+-]?[0-9]*\.?[0-9]+$/;
    const ESCAPE_REGEX = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g;
    const IDENTIFIER_REGEX = /^[a-z_][a-z0-9_]*$/i;
    const ALPHA_REGEX = /^[a-z]*$/i;
    const DEFAULT_TRIM_REGEX = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
    const MAX_INT32 = 0x7FFFFFFF;

	let _currencyFormat = '${#}';

    function _merge_recurse(destination, source, recurseLevel) {
        --recurseLevel;

        for (let prop in source) {
            if (typeof source.hasOwnProperty !== 'function' || source.hasOwnProperty(prop)) {
                let sourceProp = source[prop];
                if (sourceProp instanceof Array) {
                    _merge_recurse(destination[prop] = [], sourceProp, recurseLevel);
                } else if (sourceProp && sourceProp instanceof RegExp) {
                    destination[prop] = sourceProp;
                } else if (sourceProp && sourceProp instanceof Date) {
                    destination[prop] = new Date(sourceProp);
                } else if (sourceProp && typeof sourceProp === 'object' && (sourceProp.constructor === undefined || sourceProp.constructor.name === 'Object') ) {
                    destination[prop] = recurseLevel > 0 ?
                        _merge_recurse(typeof destination[prop] !== 'object' || destination[prop] == null ?
                            Object.create(null) :
                            destination[prop], sourceProp, recurseLevel) :
                        Object.create(null);
                } else {
                    destination[prop] = sourceProp;
                }
            }
        }

        return destination;
    }

	HeO2.common.helpers = {
    	basename: function(path) {
    	    return path.substr(path.lastIndexOf('/') + 1);
        },

        clone: function(obj) {
            return HeO2.common.helpers.merge(true, obj);
        },

        combine: function(keys, values) {
            let object = Object.create(null);
            for (let i = 0, length = keys.length; i < length; ++i) {
                object[keys[i]] = values[i];
            }
            return object;
        },

		concatUnique: function() {
			let firstIsNewArray = typeof arguments[0] === 'boolean',
				newArray = firstIsNewArray ? (arguments[0] && arguments[+firstIsNewArray] instanceof Array) : !(arguments[+firstIsNewArray] instanceof Array),
				arrays = Array.prototype.slice.call(arguments, +firstIsNewArray + +!newArray),
				concat = newArray ? [] : arguments[+firstIsNewArray];

			for (let i = 0, lengthI = arrays.length; i < lengthI; ++i) {
				if (arrays[i] instanceof Array) {
					for (let j = 0, lengthJ = arrays[i].length; j < lengthJ; ++j) {
						if (concat.indexOf(arrays[i][j]) === -1) {
							concat.push(arrays[i][j]);
						}
					}
				} else {
					if (concat.indexOf(arrays[i]) === -1) {
						concat.push(arrays[i]);
					}
				}
			}

			return concat;
		},

		currency: function(value) {
			if (!HeO2.common.helpers.isNumeric(value)) {
				return null;
			}

			return _currencyFormat.replace('{#}', (+value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','));
		},

        escapeForHtml: function(str) {
            return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        },

        escapeForRegexp: function(str) {
            return str && str.replace(ESCAPE_REGEX, '\\$&');
        },

		fromKeyCode: function(keyCode) {
			if (keyCode >= HeO2.CONST.VK_CODES['NUMPAD0'] && keyCode <= HeO2.CONST.VK_CODES['NUMPAD9']) {
				keyCode -= 48;
			}
			return String.fromCharCode(keyCode);
		},

		getLastInt: function(str) {
            let int = '';
            let marker = str.length;

            while (--marker) {
                if (HeO2.common.helpers.isNumeric(str[marker])) {
                    int += str[marker]
                } else {
                    break;
                }
            }

            return int;
        },

		getMethods: function(obj, options, iterator) {
			let methods = [];
			let current;

			options = options || {};
			if (typeof options === 'function') {
				iterator = options;
				options = {};
			}
			if (options.filter && !(options.filter instanceof RegExp)) {
				throw new Error('getMethods: options.filter must be of type RegExp');
			}

			for (let prop in obj) {
				if (typeof obj[prop] === 'function' && (!options.own || Object.hasOwnProperty.call(obj, prop)) &&
						(options.filter ? options.filter.test(prop) : true)) {
					current = {
						name: prop,
						ref: obj[prop]
					};

					if (typeof iterator === 'function') {
						iterator(current.ref, current.name, obj);
					} else {
						methods.push(current);
					}
				}
			}

			return iterator ? undefined : methods;
		},

        isAlpha: function(value) {
            return ALPHA_REGEX.test(value);
        },

		isEmpty: function(obj) {
			if (obj == null || obj === '') {
				return true;
			}
			if (obj.length !== undefined) {
				return obj.length === 0;
			}

			for (let prop in obj) {
				return false;
			}

			return typeof obj === 'object';
		},

        isFloat: function(value) {
            return Number(value) === value && value % 1 !== 0;
        },

        isIdentifier: function(value) {
            return IDENTIFIER_REGEX.test(value);
        },

        isInteger: function(value) {
            return Number.isInteger(value);
        },

        isInt64: function(value) {
            return Number.isInteger(value) && value > MAX_INT32;
        },


        isKeycodeAlpha: function(keyCode) {
            if (typeof keyCode === 'string') {
                keyCode = keyCode.charCodeAt(0);
            }
            return (keyCode >= VK_CODES['A'] && keyCode <= VK_CODES['Z']);
        },

        isKeycodeAlphaNumeric: function(keyCode) {
            if (typeof keyCode === 'string') {
                keyCode = keyCode.charCodeAt(0);
            }
            return HeO2.common.helpers.isKeycodeAlpha(keyCode) || HeO2.common.helpers.isKeycodeNumeric(keyCode);
        },

        isKeycodeDigit: function(keyCode) {
            if (typeof keyCode === 'string') {
                keyCode = keyCode.charCodeAt(0);
            }
            return (keyCode >= VK_CODES['0'] && keyCode <= VK_CODES['9']) ||
                (keyCode >= VK_CODES['NUMPAD0'] && keyCode <= VK_CODES['NUMPAD9']);
        },

        isKeycodeNumeric: function(keyCode) {
            if (typeof keyCode === 'string') {
                keyCode = keyCode.charCodeAt(0);
            }
            return HeO2.common.helpers.isKeycodeDigit(keyCode) ||
                keyCode === VK_CODES['NUMPAD_SUBSTRACT'] ||
                keyCode === VK_CODES['DASH'] ||
                keyCode === VK_CODES['PERIOD'] ||
                keyCode === VK_CODES['NUMPAD_DECIMAL'];
        },

        isNumeric: function(value) {
            return NUMERIC_TEST_REGEX.test(value);
        },

        isObject: function(obj) {
    	    return obj !== null && typeof obj === 'object';
        },

        promisify: function(original) {
    	    return (...args) => {
    	        return new Promise((resolve, reject) => {
    	            try {
    	                original.apply(null, [...args, resolve]); // Not checking err here...
    	            } catch (e) {
                        reject(e);
                    }
                });
            }
        },

        queryString: function(obj) {
    	    return Object.keys(obj).map(key => `${key}=${obj[key]}`).join('&');
        },

		merge: function() {
			let deep = typeof arguments[0] === 'boolean' && arguments[0],
				levelDefined = deep && typeof arguments[1] === 'number',
				recurseLevel = +!deep || (levelDefined ? arguments[1] : DEFAULT_MERGE_RECURSE_LEVEL),
				objects = Array.prototype.slice.call(arguments, +deep + +levelDefined),
				combine = HeO2.common.helpers.isEmpty(objects[0]) ? objects[0] || Object.create(null) : (Array.isArray(objects[0]) ? [] : Object.create(null));

			for (let i = 0, length = objects.length; i < length; ++i) {
				_merge_recurse(combine, objects[i], recurseLevel);
			}

			return combine;
		},

        parseUrl: function(url) {
            return JSON.parse(JSON.stringify((new Url()).parse(url)));
        },

        swapKeyValue: function(obj) {
            return Object.assign({}, ...Object.entries(obj).map(([a, b]) => ({[b]: a})));
        },

        uniqueId: function() {
            return Date.now() + Math.floor(Math.random() * 1000000);
        },

        unwrapProxy: function(proxy) {
    	    let val;

    	    try {
                val = Object.assign({}, proxy);
            } catch (e) {
    	        val = proxy + '';
    	        if (HeO2.common.helpers.isNumeric(val)) {
    	            val = +proxy;
                }
            }

    	    for (let prop of Object.keys(val)) {
    	        if (typeof val[prop] === 'object') {
    	            let unwrapped = HeO2.common.helpers.unwrapProxy(val[prop]);
    	            delete val[prop];
    	            val[prop] = unwrapped;
                }
            }

            return val;
        },

        trim: function(string, characters) {
            let trimRegex = characters ?
                (characters = characters.replace(/([\/\\\-\.\*])/, '\\$1'), new RegExp('^[' + characters + ']+|[' + characters + ']+$', 'g')) : //jshint ignore:line
                DEFAULT_TRIM_REGEX;

            if (Array.isArray(string)) {
                for (let i = 0, length = string.length; i < length; ++i) {
                    string[i] = string[i].replace(trimRegex, '');
                }
                return string;
            }

            return string.replace(trimRegex, '');
        }
	};

	HeO2.common.helpers.currency.format = function(format) {
		let oldFormat = _currencyFormat;
		if (format !== undefined) {
			_currencyFormat = format;
		}
		return oldFormat;
	};
}(HeO2));
