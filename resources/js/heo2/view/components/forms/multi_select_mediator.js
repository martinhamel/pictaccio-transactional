(function(mediators, $) {
    "use strict";

    mediators.MultiSelect = {
        capture: function(input) {
            let $input = $(input);
            return {
                val: function(value) {
                    if (value === '') {
                        value = [];
                    }
                    if (value !== undefined) {
                        if (value instanceof Array) {
                            $input.append(value.map(item => `<option>${item}</option>`));
                        } else {
                            if ($input.attr('data-valFormat') === 'object') {
                                Object.keys(value).forEach(function (optionValue) {
                                    let $option = $input
                                        .children('option[value="' + optionValue + '"]')
                                        .prop('selected', ['on', 'true'].indexOf(value[optionValue].state) !== -1);
                                    $.each($option[0].attributes,
                                        function (index, attr) {
                                            if (attr.nodeName.indexOf('data-value-')) {
                                                $option.removeAttr('data-value-' + attr);
                                            }
                                        });
                                    Object.keys(value[optionValue]).forEach(function (dataValName) {
                                        if (dataValName !== 'state') {
                                            $option.attr('data-value-' + dataValName, value[optionValue][dataValName]);
                                        }
                                    });
                                });

                                return $input;
                            } else {
                                throw new TypeError('Form/MultiSelect | Cannot handle format');
                            }
                        }
                    } else if ($input.attr('data-valFormat') === 'object') {
                        let values = {};
                        $input.children('option').each(function (index, option) {
                            let $option = $(option),
                                value = Object.create(null);

                            value.state = $option.is(':selected');
                            $.each(option.attributes, (index, attr) => {
                                if (attr.nodeName.indexOf('data-value-') === 0) {
                                    value[attr.nodeName.substr(11)] = attr.nodeValue;
                                }
                            });

                            values[$option.attr('value')] = value;
                        });

                        return values;
                    } else if ($input.attr('data-valFormat') === 'array') {
                        let values = [];
                        $input.children('option').each((index, option) => {
                            values.push(option.innerText);
                        });

                        return values;
                    } else {
                        return $input.val();
                    }
                }
            }
        },

        test: function(input) {
            return (input.nodeName === 'SELECT' && input.attributes['multiple'] !== undefined) ?
                'perfect' :
                null;
        }

    };
}(HeO2.__impl.Form.mediators, jQuery));
