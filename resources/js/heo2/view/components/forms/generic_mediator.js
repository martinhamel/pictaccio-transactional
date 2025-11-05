(function(mediators, $) {
    "use strict";

    mediators.Generic = {
        capture: function(input) {
            let inputNode = $(input);
            return {
                val: function(value) {
                    if (value === undefined) {
                        return inputNode.val();
                    }

                    let ret = inputNode.val(value);
                    inputNode.change();
                    return ret;
                }
            }
        },

        test: function(input) {
            return 'low';
        }
    };
}(HeO2.__impl.Form.mediators, jQuery));
