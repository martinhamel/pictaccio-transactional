(function(mediators, $) {
    "use strict";

    mediators.SingleSelect = {
        capture: function(input) {
            let $input = $(input);
            return {
                val: function(value) {
                    if (value === undefined) {
                        return $input.val();
                    } else {
                        $input.val('').children('option').removeAttr('selected').each(function (index, option) {
                            if ( (option.attributes['value'] !== undefined && option.attributes['value'].value == value) || option.innerHTML == value) { // Allow coercion
                                if (option.attributes['value'] !== undefined) {
                                    $input.val(option.attributes['value'].value);
                                } else {
                                    option.setAttribute('selected', 'selected');
                                }
                            }
                        });
                    }
                }
            }
        },

        test: function(input) {
            return (input.nodeName === 'SELECT' && (input.attributes['multiple'] === undefined || input.attributes['multiple'] === false)) ?
                'perfect' :
                null;
        }
    };
}(HeO2.__impl.Form.mediators, jQuery));
