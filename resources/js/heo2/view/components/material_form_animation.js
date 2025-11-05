(function(HeO2, $) {
    "use strict";

    const ViewCompoment = HeO2.require('HeO2.View.Component');

    const MATERIAL_ANIM_SELECTOR = '.input-set-mat-anim';
    const AFFECTED_INPUT_SELECTOR = 'input[type="text"],input[type="password"],input[type="email"],input[type="url"],input[type="tel"],input[type="number"],input[type="date"],input[type="datetime"],input[type="month"],input[type="time"],input[type="week"]';
    const FOCUSED_CSS_CLASS = 'focused';
    const FILLED_CSS_CLASS = 'filled';

    const MaterialFormAnimationComponent = ViewCompoment.extend({
        attachBehaviour: function(topLevelNode) {
            if (topLevelNode.is(MATERIAL_ANIM_SELECTOR)) {
                topLevelNode.find(AFFECTED_INPUT_SELECTOR)
                    .focus(this._input_focus.bind(this))
                    .blur(this._input_blur_change.bind(this))
                    .change(this._input_blur_change.bind(this));
            } else {
                topLevelNode.find(MATERIAL_ANIM_SELECTOR).find(AFFECTED_INPUT_SELECTOR)
                    .focus(this._input_focus.bind(this))
                    .blur(this._input_blur_change.bind(this))
                    .change(this._input_blur_change.bind(this));
            }
        },

        /* LIFE CYCLE */
        _attach: function() {
            this.attachBehaviour(this._view.target());
        },


        /* EVENT HANDLERS */
        _input_focus: function(event) {
            $(event.target).parents(MATERIAL_ANIM_SELECTOR).addClass(FOCUSED_CSS_CLASS);
        },

        _input_blur_change: function(event) {
            var $target = $(event.target);
            if ($target.val() === '') {
                $target.parents(MATERIAL_ANIM_SELECTOR).removeClass(FOCUSED_CSS_CLASS + ' ' + FILLED_CSS_CLASS);
            } else {
                $target.parents(MATERIAL_ANIM_SELECTOR)
                    .addClass(FILLED_CSS_CLASS)
                    .removeClass(FOCUSED_CSS_CLASS);
            }
        },


        /* PRIVATE */
    });


    ViewCompoment.add('MaterialFormAnimation', MaterialFormAnimationComponent);
}(HeO2, jQuery));
