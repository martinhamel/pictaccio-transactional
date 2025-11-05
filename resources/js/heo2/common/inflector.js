(function(HeO2) {
    "use strict";

    const SPLIT_NOT_LETTER_REGEX = /[^a-z]+/i;
    const SPLIT_LOWER_UPPER_REGEX = /([a-z])([A-Z])/;
    const IS_SLUG_WORTHY_REGEX = /[a-z0-9_-]/i;

    function separate(input) {
        return input.replace(SPLIT_LOWER_UPPER_REGEX, '$1 $2').split(SPLIT_NOT_LETTER_REGEX);
    }

    HeO2.common.inflector = {
        camelize: function(input, firstLowerCase) {
            firstLowerCase = firstLowerCase !== undefined ? firstLowerCase : true;

            var parts = separate(input);
            var output = '';

            for (var i = 0, length = parts.length; i < length; ++i) {
                if (parts[i].length) {
                    output += (firstLowerCase && !i ? parts[i][0].toLowerCase() : parts[i][0].toUpperCase()) + parts[i].substr(1).toLowerCase();
                }
            }

            return output;
        },

        dasherize: function(input) {
            var parts = separate(input);
            var output = '';

            for (var i = 0, length = parts.length; i < length; ++i) {
                output += parts[i].toLowerCase() + (i < length - 1 ? '-' : '');
            }

            return output;
        },

        humanize: function(input) {
            const i18n = use('common/i18n/i18n.js');
            var parts = separate(input);
            var output = '';

            for (var i = 0, length = parts.length; i < length; ++i) {
                output += (i18n.shouldCapitalizeTitle(parts[i]) ? parts[i][0].toUpperCase() : parts[i][0]) +
                    parts[i].substr(1).toLowerCase() + (i < length - 1 ? ' ' : '');
            }

            return output;
        },

        plurialize: function(input) {
            return input + 's';
        },

        slug: function(input, underscore) {
            underscore = underscore || false;

            var output = '';

            for (var i = 0, length = input.length; i < length; ++i) {
                if (IS_SLUG_WORTHY_REGEX.test(input[i])) {
                    output += input[i];
                } else if (output[output.length - 1] !== ' ') {
                    output += ' ';
                }

            }

            return underscore ?
                module.exports.underscore(output) :
                module.exports.dasherize(output);
        },

        underscore: function(input) {
            var parts = separate(input);
            var output = '';

            for (var i = 0, length = parts.length; i < length; ++i) {
                output += parts[i].toLowerCase() + (i < length - 1 ? '_' : '');
            }

            return output;
        }
    };
}(HeO2));
