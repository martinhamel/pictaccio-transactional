(function(HeO2) {
	"use strict";

	const helpers = HeO2.require('HeO2.common.helpers');

    const ALPHA_LOWER = 'abcdefghijklmnopqrstuvwxyz';
    const ALPHA_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const NUMERIC = '1234567890';
	const DEFAULT_OPTIONS = {
        length: 8,
            include: {
            alpha: true,
                numbers: true,
                symbols: '',
                lower: true,
                upper: true
        }
    };

    function buildAvailableString(options) {
        var characters = '';
        if (options.include.alpha) {
            if (options.include.lower) {
                characters += ALPHA_LOWER;
            }
            if (options.include.upper) {
                characters += ALPHA_UPPER;
            }
        }
        if (options.include.numbers) {
            characters += NUMERIC;
        }

        return characters + options.include.symbols;
    }

    function generate(options) {
        var available = buildAvailableString(options);
        var generated = '';
        var length = event.length;

        while (--length >= 0) {
            generated += available.charAt(Math.floor(Math.random() * (available.length - 1)));
        }

        return generated;
    }

	HeO2.utils.randomString = {
        /**
         * @param options {object} {
         *   length: <string length>
         *   format: <string format e.g. x#x #x# to produce G0F 3D6> [not implemented]
         *   include: {
         *     characters: bool,
         *     numbers: bool,
         *     symbols: string <a string containing the desired symbols>,
         *     lower: bool,
         *     upper: bool
         *   }
         * }
         */
		generate: function(options) {
            return generate(helpers.merge(true, DEFAULT_OPTIONS, option));
        }
	};
}(HeO2));
