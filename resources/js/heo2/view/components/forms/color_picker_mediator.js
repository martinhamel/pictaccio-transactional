(function(mediators, $) {
    "use strict";

    mediators.ColorPicker = {
        capture: function(input) {
            let inputNode = $(input);
            return {
                val: function(value) {
                    if (value !== undefined) {
                        return;
                    }

                    return inputNode.data('ui-obj').val();
                }
            }
        },

        test: function(input) {
            return input.getAttribute('data-heo2-ui') === 'color-picker' ?
                'perfect' :
                null;
        }
    };
}(HeO2.__impl.Form.mediators, jQuery));
