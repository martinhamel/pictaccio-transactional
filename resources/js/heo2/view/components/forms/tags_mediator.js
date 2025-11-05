(function(mediators, $) {
    "use strict";

    mediators.Tags = {
        capture: function(input) {
            return {
                val: function() {return input.__heo2_ref.val.call(input.__heo2_ref, ...arguments);}
            }
        },

        test: function(input) {
            return $(input).attr('data-heo2-ui') === 'tags' ?
                'perfect' :
                null;
        }
    };
}(HeO2.__impl.Form.mediators, jQuery));
