(function(HeO2, $) {
    "use strict";

    const UIHost = HeO2.require('HeO2.UIHost');
    const AutoComplete = HeO2.require('HeO2.utils.AutoComplete');
    const VK_CODES = HeO2.require('HeO2.CONST.VK_CODES');
    const helpers = HeO2.require('HeO2.common.helpers');
    const domHelpers = HeO2.require('HeO2.common.domHelpers');
    const logger = HeO2.require('HeO2.common.logger');

    /* CONTROLLER */
    const TagsController = UIHost.Controller.extend({
        init: function(host, options) {
            this._super(host);

            this._tags = [];

            this._createAutoComplete();
            this._heedReadiness();
        },

        addTag: function(text, id, create = false) {
            "export";

            if (typeof text === 'object' && 'text' in text && 'id' in text) {
                id = text.id;
                text = text.text;
            }

            if (!this._exists(text) && this._dataSourceExists(text) || create) {
                this._tags.push({text, id, badgeIndex: this.activeView().renderBadge(text)});
            }
        },

        clear: function() {
            "export";

            for (let i = this._tags.length - 1; i >= 0; --i) {
                this.removeTag(this._tags[i].text);
            }

            //this.activeView()._clear();
        },

        dataSource: function() {
            return this._dataSource;
        },

        handleAutoComplete: function(event) {
            this._autoComplete.handleInputEvent(event);
        },

        removeTag: function(text) {
            "export";

            text = text.toLowerCase();

            for (let i = 0, length = this._tags.length; i < length; ++i) {
                if (this._tags[i].text.toLowerCase() === text) {
                    this.activeView().removeBadge(this._tags[i].badgeIndex);
                    this._tags.splice(i, 1);
                    return;
                }
            }
        },

        setDataSource: function(dataSource) {
            "export";

            this._dataSource = dataSource;
            this._autoComplete.setDataSource(dataSource);
        },

        setValId: function() {
            this._valId = true;
        },

        val: function(tags) {
            "export";

            if (tags === undefined) {
                return this._tags.map((item) => item.id !== undefined && this._valId ? item.id : item.text);
            }

            if (tags !== '') {
                for (let tag of tags) {
                    this.addTag(tag);
                }
            } else {
                this.clear();
            }
        },

        /* PRIVATE */
        _createAutoComplete: function() {
            this._autoComplete = new AutoComplete({
                filterCallback: (text) => {
                    text = text.toLowerCase();
                    for (let tag of this._tags) {
                        if (tag.text.toLowerCase() === text) {
                            return false;
                        }
                    }
                    return true;
                }
            });
        },

        _dataSourceExists: function(text) {
            if (!this._dataSource) {
                return false;
            }

            text = text.toLowerCase();
            for (let data of this._dataSource) {
                if (typeof data === 'object' && 'text' in data) {
                    data = data.text;
                }

                if (text === data.toLowerCase()) {
                    return true;
                }
            }

            return false;
        },

        _exists: function(text) {
            text = text.toLowerCase();

            for (let tag of this._tags) {
                if (text === tag.text.toLowerCase()) {
                    return true;
                }
            }

            return false;
        },

        _heedReadiness: function() {
            this._host.on('ready', () => {

            });
        }
    });


    /* VIEW */
    const TAG_CONTAINER_CLASS = 'tags-container';
    const TAG_BADGE_CLASS = 'tag-badge';
    const TAG_HIGHLIGHT_BADGE_CLASS = 'highlight';
    const DROPDOWN_TRIGGER_CLASS = 'tags-trigger';
    const DROPDOWN_CLASS = 'tags-dropdown';
    const INPUT_HIDE_CARET = 'hide-caret';

    const VIEW_DEFAULT_OPTIONS = {
        target: null,
        dropdown: false,
        valId: false,
        create: false
    };

    const TagsView = UIHost.View.extend({
        NAME: 'default',

        init: function(host, options) {
            this._super(host);
            this._options = helpers.merge(true, VIEW_DEFAULT_OPTIONS, options, this._options);

            this._highlightBadgeIndex = null;
            this._nextTagId = 0;
            this._tagBadgeElements = [];
        },

        renderBadge: function(tag) {
            let id = this._nextTagId++;
            let tagBadgeNode = $(`<span class="${TAG_BADGE_CLASS}">${tag}</span>`)
                .click((event) => {
                    this.controller().removeTag(event.target.innerText);
                    setImmediate(() => this._inputContainer.find('input').focus());
                });

            if (this._inputContainer.children().hasClass(TAG_BADGE_CLASS)) {
                this._inputContainer.find(`.${TAG_BADGE_CLASS}`).last().after(tagBadgeNode);
            } else {
                this._inputContainer.prepend(tagBadgeNode);
            }
            this._tagBadgeElements[id] = tagBadgeNode[0];

            return id;
        },

        removeBadge: function(badgeIndex) {
            if (badgeIndex >= 0 && badgeIndex < this._tagBadgeElements.length) {
                $(this._tagBadgeElements[badgeIndex]).detach();
                delete this._tagBadgeElements[badgeIndex];

                if (badgeIndex === this._highlightBadgeIndex) {
                    let badgeLength = this._targetNode.find('span').length;

                    if (badgeLength) {
                        if (badgeIndex >= badgeLength) {
                            this._highlightBadge(badgeLength - 1);
                        } else {
                            this._highlightBadge(badgeIndex);
                        }
                    } else {
                        this._highlightBadge(null);
                        this._setCaretVisibility(true);
                    }
                }
            }
        },

        /* LIFECYCLE */
        _attach: function() {
            let elements = [];

            this._inputContainer = $('<div></div>')
                .append($(`<input type="text" autocomplete="disabled">`)
                    .blur(this._input_blur.bind(this))
                    .keydown(this._input_keydown.bind(this))
                    .keypress(this._input_keypress.bind(this))
                    .keyup(this._input_keyup.bind(this))
                    .mousedown(this._input_mousedown.bind(this)));

            elements.push(this._inputContainer);
            if (this._options.dropdown) {
                elements.push(
                    $(`<div class="${DROPDOWN_TRIGGER_CLASS}"><i class="fa fa-chevron-down"></i></div>`)
                        .click(this._trigger_click.bind(this))
                );
            }

            this._targetNode = $(this._options.target)
                .addClass(TAG_CONTAINER_CLASS)
                .append(elements);

            if (this._options.valId) {
                this.controller().setValId();
            }

            this._super();
        },


        /* EVENT HANDLERS */
        _input_blur: function(event) {
            this.controller().addTag(event.target.value);
            event.target.value = '';
        },

        _input_keydown: function(event) {
            event.code = event.code || event.keyCode;
            if (event.code === VK_CODES['SPACE']) {
                this.controller().addTag(event.target.value, null, this._options.create !== false);
                event.target.value = '';
                event.preventDefault();
            } else if (event.code === VK_CODES['LEFT'] || event.code === VK_CODES['RIGHT']) {
                let direction = event.code === VK_CODES['LEFT'] ? 'left' : 'right';

                if (event.target.selectionStart === 0) {
                    if (direction === 'right' && this._highlightBadgeIndex !== null) {
                        if (this._isLastBadgeIndex()) {
                            this._setCaretVisibility(true);
                            this._highlightBadge(null);
                        } else {
                            this._highlightBadge(this._calculateHighlightBadgeIndex('increment'));
                        }

                        event.preventDefault();
                    } else if (direction === 'left') {
                        this._setCaretVisibility(false);

                        if (this._highlightBadgeIndex === null) {
                            this._highlightBadge(this._calculateHighlightBadgeIndex('decrement'));
                        } else if (this._highlightBadgeIndex > 0) {
                            this._highlightBadge(this._calculateHighlightBadgeIndex('decrement'));
                        }

                        event.preventDefault();
                    }
                }
            } else if (event.code === VK_CODES['BACKSPACE']) {
                if (this._highlightBadgeIndex !== null) {
                    this.controller().removeTag(this._tagBadgeElements[this._highlightBadgeIndex].innerText);
                } else if (event.target.selectionStart === 0 && this._badgeCount() > 0) {
                    this.controller().removeTag(this._tagBadgeElements[this._calculateHighlightBadgeIndex('decrement')].innerText);
                }
            } else {
                this.controller().handleAutoComplete(event);
            }
        },

        _input_keypress: function(event) {
            this.controller().handleAutoComplete(event);
        },

        _input_keyup: function(event) {
            this.controller().handleAutoComplete(event);
        },

        _input_mousedown: function(event) {
            this._highlightBadge(null);
            this._setCaretVisibility(true);
        },

        _trigger_click: function(event) {
            let dropdownElement =
                    $(`<ul class="${DROPDOWN_CLASS}"></ul>`)
                        .append(this.controller().dataSource().reduce((ulElements, item) => {
                            let id = typeof item === 'object' && 'id' in item ? item.id : item.toString();
                            let text = typeof item === 'object' && 'text' in item ? item.text : item.toString();

                            ulElements.push(
                                $(`<li data-id="${id}">${text}</li>`)
                                    .click(this._dropdownItem_click.bind(this))
                            );
                            return ulElements;
                        }, []));

            this._targetNode.append(dropdownElement);

            event.stopPropagation();
            setTimeout(() => {
                $(document).one('click', ':not(.tags-container *)', () => {
                    this._closeDropdown()
                });
            }, 1);
        },

        _dropdownItem_click: function(event) {
            this.controller().addTag(event.target.innerText, $(event.target).attr('data-id'));
            this._closeDropdown();
        },

        /* PRIVATE */
        _badgeCount: function() {
            let count = 0;

            for (let badgeElement of this._tagBadgeElements) {
                if (badgeElement !== undefined) {
                    ++count;
                }
            }

            return count;
        },

        _calculateHighlightBadgeIndex: function(direction) {
            let decrement = (index) => {
                index = index || this._tagBadgeElements.length;
                while (true) {
                    if (this._tagBadgeElements[--index]) {
                        return index;
                    }

                    if (index < 0) {
                        return undefined;
                    }
                }
            };
            let increment = (index) => {
                while (true) {
                    if (this._tagBadgeElements[++index]) {
                        return index;
                    }

                    if (index > this._tagBadgeElements.length) {
                        return undefined;
                    }
                }
            };

            if (direction === 'decrement') {
                return decrement(this._highlightBadgeIndex);
            } else {
                return increment(this._highlightBadgeIndex);
            }
        },

        _clear: function() {
            this._targetNode.find('span').detach();
        },

        _closeDropdown: function() {
            this._targetNode.children('ul').detach();
        },

        _highlightBadge: function(index) {
            this._highlightBadgeIndex = index;

            this._targetNode.find('span').removeClass(TAG_HIGHLIGHT_BADGE_CLASS);

            if (index !== null) {
                $(this._tagBadgeElements[index]).addClass(TAG_HIGHLIGHT_BADGE_CLASS);
            }
        },

        _isLastBadgeIndex: function() {
            let index = this._tagBadgeElements.length - 1;
            if (this._tagBadgeElements[index]) {
                return this._highlightBadgeIndex === index;
            }

            return false;
        },

        _setCaretVisibility: function(visible) {
            this._targetNode.find('input').toggleClass(INPUT_HIDE_CARET, !visible);
        }
    });


    HeO2.UI.Tags = UIHost.extend({
        init: function(host, element) {
            this._super(host, element, [TagsController, {constructor: TagsView, options: {target: element}}]);
        }
    });
}(HeO2, jQuery));
