(function(mediators, $) {
    "use strict";

    mediators.CheckBox = {
        capture: function(input) {
            let $input = $(input);
            return {
                val: function(value) {
                    if (value !== undefined) {
                        return $input.prop('checked', value === 'true' || value === true);
                    }

                    return $input.prop('checked');
                }
            }
        },

        test: function(input) {
            return input.nodeName.toUpperCase() === 'INPUT' && input.attributes.type && input.attributes.type.value.toLowerCase() === 'checkbox' ?
                'perfect' :
                null;
        }
    };
}(HeO2.__impl.Form.mediators, jQuery));
