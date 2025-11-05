(function(HeO2) {
    "use strict";

    const EventingClass = HeO2.require('HeO2.EventingClass');
    const helpers = HeO2.require('HeO2.common.helpers');

    const DEFAULT_OPTIONS = {
        caseSensitive: false,
        filterCallback: () => {return true}
    };

    HeO2.utils.AutoComplete = EventingClass.extend({
        init: function(options) {
            this._super();

            this._options = helpers.merge(DEFAULT_OPTIONS, options);
        },

        handleInputEvent: function(event) {
            switch (event.type) {
            case 'keydown':
                this._handleKeyDown(event);
                break;

            case 'keypress':
                this._handleKeyPress(event);
                break;

            case 'keyup':
                this._handleKeyUp(event);
                break;
            }
        },

        try: function(stub) {
            if (this._options.caseSensitive === false) {
                stub = stub.toLowerCase();
            }

            for (let i = 0, length = this._dataSource.length; i < length; ++i) {
                let string = this._dataSource[i];

                if (this._options.filterCallback(string)) {
                    if (this._options.caseSensitive === false) {
                        string = string.toLowerCase();
                    }

                    if (string.startsWith(stub)) {
                        return this._dataSource[i];
                    }
                }
            }
        },

        setDataSource: function(dataSource) {
            this._dataSource = dataSource;
        },


        /* PRIVATE */
        _handleKeyDown: function(event) {
        },

        _handleKeyPress: function(event) {
            if (event.which > 0) {
                let start = event.target.selectionStart, end = event.target.selectionEnd;
                let value = event.target.value.substr(0, start) + String.fromCharCode(event.which) + event.target.value.substr(end);
                let autocomplete = this.try(value);

                if (autocomplete) {
                    event.target.value = value + autocomplete.substr(start + 1);
                    event.target.setSelectionRange(start + 1, event.target.value.length);
                    event.preventDefault();
                } else {
                    //debugger;
                }
            }
        },

        _handleKeyUp: function(event) {

        }
    });
}(HeO2));
