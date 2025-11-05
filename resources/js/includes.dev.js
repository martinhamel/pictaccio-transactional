var btJsIncludes = {
	jquery: [
		'./jquery/jquery.js',
		'./jquery/jquery-ui.js',
        './jquery/parallax.min.js',

		'./jquery/i18n/jquery.i18n.js',
		'./jquery/i18n/jquery.i18n.emitter.js',
		'./jquery/i18n/jquery.i18n.fallbacks.js',
		'./jquery/i18n/jquery.i18n.language.js',
		'./jquery/i18n/jquery.i18n.messagestore.js',
		'./jquery/i18n/jquery.i18n.parser.js',
	],

    heo2: [
        './heo2/heo2.js',
        './heo2/common/constants.js',
        './heo2/common/common.js',
        './vendor/vendor.js',
        './vendor/momentjs/moment.js',
        './vendor/sha1.js/sha1.js',

        './heo2/common/noop.js',
        './heo2/common/logger.js',

        './heo2/shims/create.js',
        './heo2/shims/bind.js',
        './heo2/shims/keys.js',
        './heo2/shims/check_validity.js',
        './heo2/shims/is_integer.js',
        './heo2/shims/set_selection_range.js',
        './heo2/shims/set_immediate.js',
        './heo2/shims/string_includes.js',

        './heo2/common/class.js',
        './heo2/common/eventing.js',
        './heo2/common/helpers.js',
        './heo2/common/dom_helpers.js',

        './heo2/common/promise.js',
        './heo2/common/config.js',
        './heo2/common/pubsub.js',
        './heo2/common/sprintf.js',
        './heo2/common/delayed_asset.js',
        './heo2/common/hash.js',
        './heo2/common/get_immediate_text.js',
        './heo2/common/shuffle.js',
        './heo2/common/annotations.js',
        './heo2/common/inflector.js',

        './heo2/utils/utils.js',
        './heo2/utils/random_string.js',
        './heo2/utils/goal/goal_manager.js',
        './heo2/utils/goal/event_object_event_type.js',
        './heo2/utils/goal/dom_event_type.js',
        './heo2/utils/goal/time_event_type.js',
        './heo2/utils/breakpoint_observer.js',
        './heo2/utils/dataset.js',
        './heo2/utils/autocomplete.js',

        './heo2/comm/server.js',
        './heo2/controller/controller.js',
        './heo2/view/view.js',
        './heo2/controller/host.js',
        './heo2/controller/controller_component.js',

        './heo2/ui/ui.js',
        './heo2/controller/ui_host.js',
        './heo2/controller/ui_controller.js',
        './heo2/view/ui_view.js',
        './heo2/ui/breadcrumb.js',
        './heo2/ui/color_picker.js',
        './heo2/ui/list.js',
        './heo2/ui/dropdown.js',
        './heo2/ui/overlay.js',
        './heo2/ui/tab.js',
        './heo2/ui/db_table.js',
        './heo2/ui/tags.js',

        './heo2/ui/widgets/widgets.js',
        './heo2/ui/widgets/bubble.js',
        './heo2/ui/widgets/context_menu.js',
        './heo2/ui/widgets/label.js',
        './heo2/ui/widgets/gallery.js',

        './heo2/view/view_component.js',
        './heo2/view/components/material_form_animation.js',
        './heo2/view/components/template.js',
        './heo2/view/components/uploads.js',
        './heo2/view/components/input_constraint.js',
        './heo2/view/components/credit_card.js',
        './heo2/view/components/sticky.js',
        './heo2/view/components/google_maps.js',
        './heo2/view/components/forms/validator.js',
        './heo2/view/components/forms/base_validator.js',
        './heo2/view/components/forms/not_blank_validator.js',
        './heo2/view/components/forms/phone_validator.js',
        './heo2/view/components/forms/money_validator.js',
        './heo2/view/components/forms/numeric_validator.js',
        './heo2/view/components/forms/email_validator.js',
        './heo2/view/components/forms/regex_validator.js',
        './heo2/view/components/forms/str_length_validator.js',
        './heo2/view/components/forms/form.js',
        './heo2/view/components/forms/generic_mediator.js',
        './heo2/view/components/forms/single_select_mediator.js',
        './heo2/view/components/forms/multi_select_mediator.js',
        './heo2/view/components/forms/properties_editor_mediator.js',
        './heo2/view/components/forms/tags_mediator.js',
        './heo2/view/components/forms/checkbox_mediator.js',
        './heo2/view/components/forms/color_picker_mediator.js',
        './heo2/view/components/forms.js',

        './heo2/effects/effects.js',
        './heo2/effects/chroma_key.js',

        './pages/layout.js',
        './pages/cart.js'
    ],

    chromaKeyWorker: [
        './heo2/effects/chroma_key_worker.js',
    ],

    orderApp: [
        './lib/subject_code.js',
        './pages/order_app.js'
    ],

    orderComplete: [
        './heo2/utils/cash_register.js',
        './pages/order_complete.js'
    ],

    codeRequest: [
        './pages/code_request.js'
    ],

    // LEGACY STUFF
    heo2_legacy: [
        './legacy/heo2.js',
        './legacy/ui.js',
        './legacy/grid.js',
        './legacy/forms.js',
        './legacy/effects.js',
        './legacy/augment.js',
        './legacy/effects.js',
        './legacy/home.js',
        './legacy/template.js'
    ],

    bootstrap: [
        './bootstrap.js'
    ],

    includes: [
        './legacy/includes.js'
    ]
};

if (typeof exports !== 'undefined') {
	exports.includes = btJsIncludes;
}
