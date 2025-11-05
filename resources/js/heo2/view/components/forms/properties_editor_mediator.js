(function(mediators, $) {
    "use strict";

    mediators.PropertiesEditor = {
        capture: function(input) {
            let editor = $(input).data(HeO2.UI.PropertiesEditor.DATA_ID);
            if (!(editor instanceof HeO2.UI.PropertiesEditor)) {
                throw new ReferenceError('Cannot retrieve the properties editor object');
            }
            return {
                val: function(value) {
                    if (value !== undefined) {
                        editor.restore(value);
                    } else {
                        return editor.list();
                    }
                }
            }
        },

        test: function(input) {
            return input.className.indexOf(HeO2.CONST.UI_CLASSES.PROPERTIES_EDITOR_INPUT) !== -1 ?
                'perfect' :
                null;
        }
    };
}(HeO2.__impl.Form.mediators, jQuery));
