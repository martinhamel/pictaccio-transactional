!function(t) {
    "use strict";
    t.UI = t.UI || {}
}(HeO2_legacy), function(t, e) {
    "use strict";
    HeO2_legacy.UI.Group = HeO2_legacy.Class.extend({
        _DEFAULTS: {prefix: "group-", target: null},
        _$all: null,
        _$target: null,
        _options: null,
        init: function(t) {
            this._options = e.extend({}, this._DEFAULTS, t), this._attach(), this.setOptions(t)
        },
        setOptions: function(t) {
            return this._options = e.extend({}, this._options, t), this._cache(), this
        },
        show: function(t) {
            return this._$all.hide(), this._$target.find("." + this._options.prefix + t).show(), this
        },
        _attach: function() {
            this._$target = e(this._options.target)
        },
        _cache: function() {
            this._$all = this._$target.find("[class^='" + this._options.prefix + "'],[class*=' " + this._options.prefix + "']")
        }
    }), HeO2_legacy.UI.Group.create = function(t) {
        return new HeO2_legacy.UI.Group(t)
    }
}(HeO2_legacy, jQuery), function(t, e) {
    "use strict";
    t.UI.PropertiesEditor = t.EventingClass.extend({
        _DEFAULTS: {properties: null, target: null},
        _$target: null,
        _options: null,
        _properties: null,
        init: function(t) {
            this._super(), this._properties = Object.create(null), this.setOptions(t)
        },
        list: function() {
            return this._properties
        },
        restore: function(t) {
            if (this._$target) {
                var i = this._$target.attr("id");
                t && Object.keys(t).forEach(function(n) {
                    Object.keys(t[n]).forEach(function(s) {
                        e("#" + i + "-" + n + "-" + s).val(t[n][s]).change()
                    })
                })
            }
            return this
        },
        setOptions: function(t) {
            return t = t || Object.create(null), this._options = e.extend({}, this._options || this._DEFAULTS, t), "target" in t && this._attach(), "properties" in t && (this._properties = {}, this._render()), this
        },
        toggle: function(t) {
            if (this._$target) {
                var e = this._$target.find('div div:contains("' + t + '")');
                e.length && this._toggleGroup(e)
            }
            return this
        },
        _groupToggleCollapse_click: function(t) {
            this._toggleGroup(e(t.target))
        },
        _input_change: function(t) {
            var i = e(t.target);
            this._properties[i.data("group-id")][i.data("item-id")] = i.val()
        },
        _attach: function() {
            this._$target = e(this._options.target).data(t.UI.PropertiesEditor.DATA_ID, this).addClass(t.CONST.UI_CLASSES.CUSTOM_INPUT).addClass(t.CONST.UI_CLASSES.PROPERTIES_EDITOR_INPUT).css({overflow: "auto"})
        },
        _render: function() {
            var t = [], i = this._$target.attr("id");
            this._options.properties && (Object.keys(this._options.properties).forEach(function(n) {
                var s = this._options.properties[n], a = e("<table></table>").css("width", "100%"), o = {},
                    r = e("<div></div>").css({
                        width: "100%",
                        margin: "0",
                        overflow: "hidden"
                    }).append(e("<div></div>").css({
                        margin: "0",
                        padding: ".25em",
                        backgroundColor: "#eee",
                        cursor: "default"
                    }).append(e("<div></div>").css({
                        display: "inline-block",
                        margin: "0 5px 0 0",
                        padding: 0,
                        width: 0,
                        height: 0,
                        borderLeft: "7px solid transparent",
                        borderBottom: "7px solid #ddd"
                    })).append(n).click(this._groupToggleCollapse_click.bind(this))).append(a);
                Object.keys(s).forEach(function(t) {
                    var r = s[t];
                    if ("list" === r.type || "bool" === r.type) {
                        var h = [];
                        "bool" === r.type && (r.list = ["true", "false"]), r.list.forEach(function(t) {
                            h.push(e("<option></option>").attr("value", t))
                        }), e("body").append(e("<datalist></datalist>").attr("id", n + t).append(h)), r.type = void 0
                    }
                    a.append(e("<tr></tr>").append(e("<td></td>").css({
                        width: "50%",
                        paddingLeft: ".75em",
                        borderRight: "1px #eee solid",
                        borderBottom: "1px #eee solid"
                    }).text(t)).append(e("<td></td>").css({
                        width: "50%",
                        borderBottom: "1px #eee solid"
                    }).append(e("<input>").attr({
                        id: i + "-" + n + "-" + t,
                        type: r.type || "text",
                        maxlength: r.maxlength || void 0,
                        list: r.list ? n + t : void 0,
                        min: r.min || void 0,
                        max: r.max || void 0
                    }).data("group-id", n).data("item-id", t).css({
                        display: "inline-block",
                        margin: "0",
                        padding: "0",
                        width: "100%",
                        border: "none"
                    }).val(r.value || r["default"] || "").change(this._input_change.bind(this))))), o[t] = r.value || r["default"] || null
                }.bind(this)), this._properties[n] = o, t.push(r)
            }.bind(this)), this._$target.empty().append(t))
        },
        _toggleGroup: function(t) {
            var e = t, i = t.parent(), n = e.outerHeight() === i.height();
            i.css("height", n ? "auto" : e.outerHeight() + "px"), e.children().first().css({
                borderTop: n ? "none" : "5px solid transparent",
                borderBottom: n ? "7px solid #ddd" : "5px solid transparent",
                borderLeft: n ? "7px solid transparent" : "5px solid #ddd",
                marginLeft: n ? 0 : "2px"
            })
        }
    }), t.UI.PropertiesEditor.DATA_ID = "_propertiesEditorObject", t.UI.PropertiesEditor.create = function(e) {
        return new t.UI.PropertiesEditor(e)
    }
}(HeO2_legacy, jQuery), function(t, e) {
    "use strict";
    HeO2_legacy.UI.Table = HeO2_legacy.EventingClass.extend({
        _DEFAULTS: {headers: void 0, data: void 0}, init: function(t, i) {
            this.__clsLoadComponent("parseObject"), this._super(), this._$target = e(t), this._$thead = e("<thead><tr></tr></thead>"), this._$tbody = e("<tbody></tbody>"), this._$table = e("<table></table>"), this._options = e.extend({}, this._DEFAULTS, i), this._headerIndex = void 0, "undefined" != typeof this._options.headers ? this._setHeader() : this._options.headers = [], "undefined" != typeof this._options.data ? this._setData() : this._options.data = [], this._renderTable()
        }, appendData: function(t) {
            this._options.data = this._options.data.concat(t), this._setData()
        }, clear: function() {
            this._options.headerIndex = [], this._options.headers = [], this._options._data = [], this._$target.empty()
        }, setHeader: function(t) {
            this._options.headers = t, this._setHeader()
        }, _index: function(t) {
            var i = 0;
            this._headerIndex = [], e.each(t, function(t, e) {
                var n = "string" != typeof e && "string" == typeof e.key ? e.key : t;
                this._headerIndex[i++] = n
            }.bind(this))
        }, _renderData: function() {
            for (var t = this._options.data.length, i = this._headerIndex.length, n = [], s = 0; s < t; ++s) {
                for (var a = [], o = 0; o < i; ++o) {
                    var r = this.parseObject(this._headerIndex[o], this._options.data[s]);
                    "undefined" != typeof this._options.headers[o].decorate && (r = sprintf(this._options.headers[o].decorate, r)), void 0 !== r && a.push(e("<td></td>").html(r)[0])
                }
                n.push(e("<tr></tr>").append(a))
            }
            this._$tbody.empty().append(n)
        }, _renderHeader: function() {
            var t = [];
            e.each(this._options.headers, function(i, n) {
                var s = "object" == typeof n ? "string" == typeof n.text ? n.text : "" : "string" == typeof n ? n : "";
                t.push(e("<th></th>").html(s))
            }.bind(this)), this._$thead.first().append(t)
        }, _renderTable: function() {
            this._$target.append(this._$table.append(this._$thead).append(this._$tbody))
        }, _setData: function() {
            try {
                void 0 === this._headerIndex && this._index(this._options.data[0]), this._renderData()
            } catch (t) {
                console.warn("WARNING: Check data format, possibly incorrect")
            }
        }, _setHeader: function() {
            try {
                this._index(this._options.headers), this._renderHeader()
            } catch (t) {
                console.warn("WARNING: Check header format, possibly incorrect")
            }
        }
    })
}(window, jQuery), function(t, e) {
    "use strict";
    t.UI.List = t.EventingClass.extend({
        _DEFAULTS: {list: null, target: null},
        _$target: null,
        _options: null,
        _rendererName: null,
        init: function(t) {
            this._super(), this.setOptions(t)
        },
        refresh: function() {
            return this._render(), this
        },
        setOptions: function(t) {
            return this._options = e.extend({}, this._options || this._DEFAULTS, t), this._attach(), this._render(), this
        },
        setRenderer: function(e) {
            return t.UI.List.renderers[e] ? (this[e] = this._loadComponent(t.UI.List.renderers[e]), this._rendererName = e, this._render(), this) : (console.warn("List | Cannot find renderer"), this)
        },
        watch: function(t, e) {
            return t && "function" == typeof t.on && t.on(e, this._watch_trigger.bind(this)), this
        },
        _watch_trigger: function() {
            this._render()
        },
        _attach: function() {
            this._$target = e(this._options.target)
        },
        _render: function() {
            this._rendererName && this._$target && this._options.list && this[this._rendererName].render(this._$target, this._options.list)
        }
    }), t.UI.List.renderers = Object.create(null), t.UI.List.renderers.Image = {
        render: function(t, e) {
            var i = [];
            e.forEach(function(t) {
                if (t.image) {
                    var e = new Image;
                    t.__ImageRenderer_cache ? e = t.__ImageRenderer_cache : "string" == typeof t.image ? e.src = t.image : t.image.success && t.image.success(function(t) {
                        e.src = t.result
                    }), t.__ImageRenderer_cache = e, i.push(e)
                }
            }), t.empty().append(i)
        }
    }, t.UI.List.create = function(e) {
        return new t.UI.List(e)
    }
}(HeO2_legacy, jQuery), function(t, e) {
    "use strict";
    t.UI.Tabs = t.EventingClass.extend({
        _CSS_CLASS_UL: "tabbed-scriptable",
        _CSS_CLASS_CONTENT_AREA: "tabbed-scriptable-content-area",
        _SEARCH_SELECTOR: 'noscript[class="tabbed"]',
        _SELECTED_CSS_CLASS: "selected",
        _TAB_DATA_FIRST_DIV_KEY: "tabbed-data-first-div",
        _TAB_DATA_CONTENT_DIV_KEY: "tabbed-data-content-div",
        init: function() {
            this._$tabbedUls = void 0, this._findTabbedUl(), this._indexTabbedLi()
        },
        _tab_click: function(t) {
            var i = e(t.currentTarget);
            this._selectTab(i)
        },
        _attachToLi: function(t, e, i) {
            t.data(this._TAB_DATA_FIRST_DIV_KEY, i).click(this._tab_click.bind(this)), e.append(i.hide())
        },
        _attachUl: function(t, e, i) {
            e.data(this._TAB_DATA_CONTENT_DIV_KEY, i).addClass(this._CSS_CLASS_UL), t.append([e, i])
        },
        _createContentAreaDiv: function() {
            return e("<div></div>").addClass(this._CSS_CLASS_CONTENT_AREA)
        },
        _indexTabbedLi: function() {
            e.each(this._$tabbedUls, function(t, i) {
                var n = e(i), s = e(n.text()), a = this._createContentAreaDiv();
                e.each(s.children("li"), function(t, i) {
                    var n = e(i);
                    this._attachToLi(n, a, e(n.children("div").first()))
                }.bind(this)), this._removeUnwantedElements(s), this._attachUl(n.parent(), s, a), this._selectTab(s.children("li").first())
            }.bind(this))
        },
        _findTabbedUl: function() {
            this._$tabbedUls = e(this._SEARCH_SELECTOR)
        },
        _removeUnwantedElements: function(t) {
            t.children().children().not("h2").hide()
        },
        _selectTab: function(t) {
            t.parent().children("li").removeClass(this._SELECTED_CSS_CLASS).end().end().addClass(this._SELECTED_CSS_CLASS), t.parent().data(this._TAB_DATA_CONTENT_DIV_KEY).children().hide(), t.data(this._TAB_DATA_FIRST_DIV_KEY).show()
        }
    })
}(HeO2_legacy, jQuery), function(t, e) {
    "use strict";
    t.UI.ModalOverlay = t.EventingClass.extend({
        _DEFAULTS: {
            contentCSS: "content-dialog-overlay-legacy",
            dialogCSS: "dialog-overlay-legacy",
            dimmerCSS: "dialog-overlay-dimmer-legacy",
            easingIn: "easeOutExpo",
            easingOut: "easeInExpo",
            fadeInDuration: 250,
            fadeOutDuration: 250,
            width: "600px",
            height: "400px",
            scroll: {horizontal: !1, vertical: !1},
            callbacks: {contentDraw: null, open: null}
        }, init: function(t) {
            this._super(), this._$dialogOverlay = null, this._$dialogOverlayContent = null, this._$modalOverlay = null, this._options = null, this._bindedBodyKeydown = this._body_keyDown.bind(this), this.setOptions(t), this._create()
        }, close: function(t) {
            if (t = t || !1, !this._emitClosing(t) || t) return this._hide(), this.emit("closed"), this
        }, getContentContainer: function() {
            return this._$dialogOverlayContent
        }, setOptions: function(e) {
            return this._options = t.Helper.merge(!0, this._DEFAULTS, e), "function" != typeof this._options.callbacks.contentDraw && (console.warn("ModalOverlay | options.callbacks.contentDraw doesn't reference a function, dialog will be created empty"), this._options.callbacks.contentDraw = null), this._updateScroll(), this
        }, show: function() {
            return this._show(), this
        }, _body_keyDown: function(e) {
            e.keyCode === t.CONST.VK_CODES.ESCAPE && this.close()
        }, _dialog_close: function(t) {
            this.close()
        }, _create: function() {
            this._createDialog(), this._options.callbacks.contentDraw && this._options.callbacks.contentDraw(this._$dialogOverlayContent), e(document.body).prepend(this._$modalOverlay).append(this._$dialogOverlay)
        }, _createDialog: function() {
            this._$dialogOverlayContent = e("<div></div>").addClass(this._options.contentCSS), this._$dialogOverlay = e("<div></div>").addClass(this._options.dialogCSS).hide().append(e("<div></div>").addClass("close-dialog-overlay").click(this._dialog_close.bind(this))).append(this._$dialogOverlayContent), this._$modalOverlay = e("<div></div>").addClass(this._options.dimmerCSS).click(this._dialog_close.bind(this)).hide()
        }, _destroy: function() {
            this._$dialogOverlayContent.remove(), this._$dialogOverlay.remove(), this._$modalOverlay.remove()
        }, _emitClosing: function(t) {
            var e = {forced: t, cancel: null};
            return this.emit("closing", e), e.cancel
        }, _halve: function(t) {
            var e = t.match(/^(\d+(?:\.\d+)?)(.*)$/);
            return parseFloat(e[1]) / 2 + e[2]
        }, _hide: function() {
            this._$dialogOverlay.fadeOut(this._options.fadeOutDuration, this._options.easing), this._$modalOverlay.fadeOut(this._options.fadeOutDuration, this._options.easing, function() {
                this._$modalOverlay.hide()
            }.bind(this)), e("body").off("keydown", this._bindedBodyKeydown)
        }, _setSizeAndPosition: function() {
        }, _show: function() {
            this._$modalOverlay.fadeIn(this._options.fadeInDuration), this._$dialogOverlay.fadeIn(this._options.fadeInDuration), this._setSizeAndPosition(), e(":focus").blur(), e("body").keydown(this._bindedBodyKeydown)
        }, _updateScroll: function() {
            this._$dialogOverlayContent && this._$dialogOverlayContent.css({
                overflowX: this._options.scroll.horizontal ? "scroll" : "none",
                overflowY: this._options.scroll.vertical ? "scroll" : "none"
            })
        }
    }), t.UI.ModalOverlay.create = function(e) {
        return new t.UI.ModalOverlay(e)
    }
}(HeO2_legacy, jQuery), function(t, e) {
    "use strict";
    if (t.UI.ModalOverlay.Message = t.UI.ModalOverlay.extend({
        _MESSAGE_DEFAULTS: {
            css: {button: "ui-button"},
            buttons: "ok",
            title: "",
            text: "",
            width: "500px",
            height: "150px"
        }, _messageOptions: null, init: function(t) {
            this._messageOptions = e.extend({}, this._MESSAGE_DEFAULTS, t), this._super({
                width: this._messageOptions.width,
                height: this._messageOptions.height,
                callbacks: {contentDraw: this._dialog_uiDraw.bind(this)}
            })
        }, _button_click: function(t, e) {
            this.emit("close", {result: t}), this.close()
        }, _dialog_uiDraw: function(t) {
            t.css({textAlign: "center"}).append(e("<h3></h3>").html(this._messageOptions.title)).append(e("<p></p>").html(this._messageOptions.text)).append(this._makeButtons())
        }, _listener_modalMessage: function(e) {
            e.msgModal = new t.UI.ModalOverlay.Message(e), e.show = e.show || !0, e.close && e.msgModal.on("close", e.close), e.show, e.msgModal.show()
        }, _makeButtons: function() {
            switch (this._messageOptions.buttons) {
            case"okcancel":
                return [e("<button></button>").addClass(this._messageOptions.css.button).text(e.i18n("GENERIC_OK")).click(this._button_click.bind(this, "ok"))[0], e("<button></button>").addClass(this._messageOptions.css.button).text(e.i18n("GENERIC_CANCEL")).click(this._button_click.bind(this, "cancel"))[0]];
            case"yesno":
                return [e("<button></button>").addClass(this._messageOptions.css.button).text(e.i18n("GENERIC_YES")).click(this._button_click.bind(this, "yes"))[0], e("<button></button>").addClass(this._messageOptions.css.button).text(e.i18n("GENERIC_NO")).click(this._button_click.bind(this, "no"))[0]];
            case"yesnocancel":
                return [e("<button></button>").addClass(this._messageOptions.css.button).text(e.i18n("GENERIC_YES")).click(this._button_click.bind(this, "yes"))[0], e("<button></button>").addClass(this._messageOptions.css.button).text(e.i18n("GENERIC_NO")).click(this._button_click.bind(this, "no"))[0], e("<button></button>").addClass(this._messageOptions.css.button).text(e.i18n("GENERIC_CANCEL")).click(this._button_click.bind(this, "cancel"))[0]];
            default:
            case"ok":
                return e("<button></button>").addClass(this._messageOptions.css.button).text(e.i18n("GENERIC_OK")).click(this._button_click.bind(this, "ok"))
            }
        }
    }), !t.UI.ModalOverlay.Message.listener) {
        var i = new t.UI.ModalOverlay.Message;
        i._listen("modal-message", i._listener_modalMessage.bind(i)), t.UI.ModalOverlay.Message.listener = !0
    }
}(HeO2_legacy, jQuery), function(t) {
    "use strict";
    t.UI.Spinner = t.Class.extend({
        _DEFAULTS: {target: null, spinnerCss: "widget-spinner"}, init: function(t) {
            this._options = $.extend({}, this._DEFAULTS, t), this._$target = $(this._options.target)
        }, hide: function() {
            this._$target.removeClass(this._options.spinnerCss).hide()
        }, show: function(t) {
            this._$target.addClass(this._options.spinnerCss).show(), void 0 !== t && "function" == typeof t.always && t.always(function() {
                this.hide()
            }.bind(this))
        }
    })
}(HeO2_legacy), function(t) {
    "use strict";
    t.UI.Flasher = t.EventingClass.extend({
        _baseCss: "widget-flasher-",
        _DEFAULTS: {type: "message", timeout: 4e3, fadeIn: 0, fadeOut: 500},
        init: function(t, e, i) {
            this._super(), this._$target = $(t), this._defaults = $.extend({}, this._DEFAULTS, i), this._$target.css("display", "none"), void 0 !== e && this.flashMessage(e)
        },
        flashMessage: function(t, e) {
            var i = $.extend({}, this._defaults, e);
            this._applyCss(i), this._show(t, i)
        },
        _applyCss: function(t) {
            "undefined" == typeof t.css && (t.css = this._baseCss + t.type)
        },
        _hide: function(t) {
            this._$target.hide(t.fadeOut).removeClass(t.css)
        },
        _show: function(t, e) {
            this._$target.addClass(e.css).html(t).show(e.fadeIn), setTimeout(function() {
                this._hide(e)
            }.bind(this), e.timeout)
        }
    })
}(HeO2_legacy), function(t) {
    "use strict";
    var e = "function" == typeof moment, i = !!window.addEventListener, n = window.document, s = window.setTimeout,
        a = function(t, e, n, s) {
            i ? t.addEventListener(e, n, !!s) : t.attachEvent("on" + e, n)
        }, o = function(t, e, n, s) {
            i ? t.removeEventListener(e, n, !!s) : t.detachEvent("on" + e, n)
        }, r = function(t, e, i) {
            var s;
            n.createEvent ? (s = n.createEvent("HTMLEvents"), s.initEvent(e, !0, !1), s = b(s, i), t.dispatchEvent(s)) : n.createEventObject && (s = n.createEventObject(), s = b(s, i), t.fireEvent("on" + e, s))
        }, h = function(t) {
            return t.trim ? t.trim() : t.replace(/^\s+|\s+$/g, "")
        }, d = function(t, e) {
            return (" " + t.className + " ").indexOf(" " + e + " ") !== -1
        }, l = function(t, e) {
            d(t, e) || (t.className = "" === t.className ? e : t.className + " " + e)
        }, c = function(t, e) {
            t.className = h((" " + t.className + " ").replace(" " + e + " ", " "))
        }, u = function(t) {
            return /Array/.test(Object.prototype.toString.call(t))
        }, _ = function(t) {
            return /Date/.test(Object.prototype.toString.call(t)) && !isNaN(t.getTime())
        }, p = function(t) {
            var e = t.getDay();
            return 0 === e || 6 === e
        }, f = function(t) {
            return t % 4 === 0 && t % 100 !== 0 || t % 400 === 0
        }, g = function(t, e) {
            return [31, f(t) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][e]
        }, m = function(t) {
            _(t) && t.setHours(0, 0, 0, 0)
        }, v = function(t, e) {
            return t.getTime() === e.getTime()
        }, b = function(t, e, i) {
            var n, s;
            for (n in e) s = void 0 !== t[n], s && "object" == typeof e[n] && null !== e[n] && void 0 === e[n].nodeName ? _(e[n]) ? i && (t[n] = new Date(e[n].getTime())) : u(e[n]) ? i && (t[n] = e[n].slice(0)) : t[n] = b({}, e[n], i) : !i && s || (t[n] = e[n]);
            return t
        }, y = function(t) {
            return t.month < 0 && (t.year -= Math.ceil(Math.abs(t.month) / 12), t.month += 12), t.month > 11 && (t.year += Math.floor(Math.abs(t.month) / 12), t.month -= 12), t
        }, C = {
            target: null,
            bound: void 0,
            position: "bottom left",
            reposition: !0,
            format: "YYYY-MM-DD",
            defaultDate: null,
            setDefaultDate: !1,
            firstDay: 0,
            minDate: null,
            maxDate: null,
            yearRange: 10,
            showWeekNumber: !1,
            minYear: 0,
            maxYear: 9999,
            minMonth: void 0,
            maxMonth: void 0,
            startRange: null,
            endRange: null,
            isRTL: !1,
            yearSuffix: "",
            showMonthAfterYear: !1,
            numberOfMonths: 1,
            mainCalendar: "left",
            container: void 0,
            i18n: {
                previousMonth: "Previous Month",
                nextMonth: "Next Month",
                months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                weekdays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                weekdaysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
            },
            theme: null,
            onSelect: null,
            onOpen: null,
            onClose: null,
            onDraw: null
        }, D = function(t, e, i) {
            for (e += t.firstDay; e >= 7;) e -= 7;
            return i ? t.i18n.weekdaysShort[e] : t.i18n.weekdays[e]
        }, O = function(t) {
            if (t.isEmpty) return '<td class="is-empty"></td>';
            var e = [];
            return t.isDisabled && e.push("is-disabled"), t.isToday && e.push("is-today"), t.isSelected && e.push("is-selected"), t.isInRange && e.push("is-inrange"), t.isStartRange && e.push("is-startrange"), t.isEndRange && e.push("is-endrange"), '<td data-day="' + t.day + '" class="' + e.join(" ") + '"><button class="pika-button pika-day" type="button" data-pika-year="' + t.year + '" data-pika-month="' + t.month + '" data-pika-day="' + t.day + '">' + t.day + "</button></td>"
        }, S = function(t, e, i) {
            var n = new Date(i, 0, 1), s = Math.ceil(((new Date(i, e, t) - n) / 864e5 + n.getDay() + 1) / 7);
            return '<td class="pika-week">' + s + "</td>"
        }, T = function(t, e) {
            return "<tr>" + (e ? t.reverse() : t).join("") + "</tr>"
        }, E = function(t) {
            return "<tbody>" + t.join("") + "</tbody>"
        }, I = function(t) {
            var e, i = [];
            for (t.showWeekNumber && i.push("<th></th>"), e = 0; e < 7; e++) i.push('<th scope="col"><abbr title="' + D(t, e) + '">' + D(t, e, !0) + "</abbr></th>");
            return "<thead>" + (t.isRTL ? i.reverse() : i).join("") + "</thead>"
        }, w = function(t, e, i, n, s) {
            var a, o, r, h, d, l = t._o, c = i === l.minYear, _ = i === l.maxYear, p = '<div class="pika-title">', f = !0,
                g = !0;
            for (r = [], a = 0; a < 12; a++) r.push('<option value="' + (i === s ? a - e : 12 + a - e) + '"' + (a === n ? " selected" : "") + (c && a < l.minMonth || _ && a > l.maxMonth ? "disabled" : "") + ">" + l.i18n.months[a] + "</option>");
            for (h = '<div class="pika-label">' + l.i18n.months[n] + '<select class="pika-select pika-select-month" tabindex="-1">' + r.join("") + "</select></div>", u(l.yearRange) ? (a = l.yearRange[0], o = l.yearRange[1] + 1) : (a = i - l.yearRange, o = 1 + i + l.yearRange), r = []; a < o && a <= l.maxYear; a++) a >= l.minYear && r.push('<option value="' + a + '"' + (a === i ? " selected" : "") + ">" + a + "</option>");
            return d = '<div class="pika-label">' + i + l.yearSuffix + '<select class="pika-select pika-select-year" tabindex="-1">' + r.join("") + "</select></div>", p += l.showMonthAfterYear ? d + h : h + d, c && (0 === n || l.minMonth >= n) && (f = !1), _ && (11 === n || l.maxMonth <= n) && (g = !1), 0 === e && (p += '<button class="pika-prev' + (f ? "" : " is-disabled") + '" type="button">' + l.i18n.previousMonth + "</button>"), e === t._o.numberOfMonths - 1 && (p += '<button class="pika-next' + (g ? "" : " is-disabled") + '" type="button">' + l.i18n.nextMonth + "</button>"), p += "</div>"
        }, x = function(t, e) {
            return '<table cellpadding="0" cellspacing="0" class="pika-table">' + I(t) + E(e) + "</table>"
        };
    t.UI.Pikaday = function(t) {
        var o = this, r = o.config(t);
        o._onMouseDown = function(t) {
            if (o._v) {
                t = t || window.event;
                var e = t.target || t.srcElement;
                if (e) {
                    if (!d(e.parentNode, "is-disabled")) {
                        if (d(e, "pika-button") && !d(e, "is-empty")) return o.setDate(new Date(e.getAttribute("data-pika-year"), e.getAttribute("data-pika-month"), e.getAttribute("data-pika-day"))), void (r.bound && s(function() {
                            o.hide(), r.target && r.target.blur()
                        }, 100));
                        d(e, "pika-prev") ? o.prevMonth() : d(e, "pika-next") && o.nextMonth()
                    }
                    if (d(e, "pika-select")) o._c = !0; else {
                        if (!t.preventDefault) return t.returnValue = !1, !1;
                        t.preventDefault()
                    }
                }
            }
        }, o._onChange = function(t) {
            t = t || window.event;
            var e = t.target || t.srcElement;
            e && (d(e, "pika-select-month") ? o.gotoMonth(e.value) : d(e, "pika-select-year") && o.gotoYear(e.value))
        }, o._onInputChange = function(t) {
            var i;
            t.firedBy !== o && (e ? (i = moment(r.target.value, r.format), i = i && i.isValid() ? i.toDate() : null) : i = new Date(Date.parse(r.target.value)), _(i) && o.setDate(i), o._v || o.show())
        }, o._onInputFocus = function() {
            o.show()
        }, o._onInputClick = function() {
            o.show()
        }, o._onInputBlur = function() {
            var t = n.activeElement;
            do if (d(t, "pika-single")) return; while (t = t.parentNode);
            o._c || (o._b = s(function() {
                o.hide()
            }, 50)), o._c = !1
        }, o._onClick = function(t) {
            t = t || window.event;
            var e = t.target || t.srcElement, n = e;
            if (e) {
                !i && d(e, "pika-select") && (e.onchange || (e.setAttribute("onchange", "return;"), a(e, "change", o._onChange)));
                do if (d(n, "pika-single") || n === r.trigger) return; while (n = n.parentNode);
                o._v && e !== r.trigger && n !== r.trigger && o.hide()
            }
        }, o.el = n.createElement("div"), o.el.className = "pika-single" + (r.isRTL ? " is-rtl" : "") + (r.theme ? " " + r.theme : ""), a(o.el, "ontouchend" in n ? "touchend" : "mousedown", o._onMouseDown, !0), a(o.el, "change", o._onChange), r.target && (r.container ? r.container.appendChild(o.el) : r.bound ? n.body.appendChild(o.el) : r.target.parentNode.insertBefore(o.el, r.target.nextSibling), a(r.target, "change", o._onInputChange), r.defaultDate || (e && r.target.value ? r.defaultDate = moment(r.target.value, r.format).toDate() : r.defaultDate = new Date(Date.parse(r.target.value)), r.setDefaultDate = !0));
        var h = r.defaultDate;
        _(h) ? r.setDefaultDate ? o.setDate(h, !0) : o.gotoDate(h) : o.gotoDate(new Date), r.bound ? (this.hide(), o.el.className += " is-bound", a(r.trigger, "click", o._onInputClick), a(r.trigger, "focus", o._onInputFocus), a(r.trigger, "blur", o._onInputBlur)) : this.show()
    }, t.UI.Pikaday.prototype = {
        config: function(t) {
            this._o || (this._o = b({}, C, !0));
            var e = b(this._o, t, !0);
            e.isRTL = !!e.isRTL, e.target = e.target && e.target.nodeName ? e.target : null, e.theme = "string" == typeof e.theme && e.theme ? e.theme : null, e.bound = !!(void 0 !== e.bound ? e.target && e.bound : e.target), e.trigger = e.trigger && e.trigger.nodeName ? e.trigger : e.target, e.disableWeekends = !!e.disableWeekends, e.disableDayFn = "function" == typeof e.disableDayFn ? e.disableDayFn : null;
            var i = parseInt(e.numberOfMonths, 10) || 1;
            if (e.numberOfMonths = i > 4 ? 4 : i, _(e.minDate) || (e.minDate = !1), _(e.maxDate) || (e.maxDate = !1), e.minDate && e.maxDate && e.maxDate < e.minDate && (e.maxDate = e.minDate = !1), e.minDate && this.setMinDate(e.minDate), e.maxDate && (m(e.maxDate), e.maxYear = e.maxDate.getFullYear(), e.maxMonth = e.maxDate.getMonth()), u(e.yearRange)) {
                var n = (new Date).getFullYear() - 10;
                e.yearRange[0] = parseInt(e.yearRange[0], 10) || n, e.yearRange[1] = parseInt(e.yearRange[1], 10) || n
            } else e.yearRange = Math.abs(parseInt(e.yearRange, 10)) || C.yearRange, e.yearRange > 100 && (e.yearRange = 100);
            return e
        }, toString: function(t) {
            return _(this._d) ? e ? moment(this._d).format(t || this._o.format) : this._d.toDateString() : ""
        }, getMoment: function() {
            return e ? moment(this._d) : null
        }, setMoment: function(t, i) {
            e && moment.isMoment(t) && this.setDate(t.toDate(), i)
        }, getDate: function() {
            return _(this._d) ? new Date(this._d.getTime()) : null
        }, setDate: function(t, e) {
            if (!t) return this._d = null, this._o.target && (this._o.target.value = "", r(this._o.target, "change", {firedBy: this})), this.draw();
            if ("string" == typeof t && (t = new Date(Date.parse(t))), _(t)) {
                var i = this._o.minDate, n = this._o.maxDate;
                _(i) && t < i ? t = i : _(n) && t > n && (t = n), this._d = new Date(t.getTime()), m(this._d), this.gotoDate(this._d), this._o.target && (this._o.target.value = this.toString(), r(this._o.target, "change", {firedBy: this})), e || "function" != typeof this._o.onSelect || this._o.onSelect.call(this, this.getDate())
            }
        }, gotoDate: function(t) {
            var e = !0;
            if (_(t)) {
                if (this.calendars) {
                    var i = new Date(this.calendars[0].year, this.calendars[0].month, 1),
                        n = new Date(this.calendars[this.calendars.length - 1].year, this.calendars[this.calendars.length - 1].month, 1),
                        s = t.getTime();
                    n.setMonth(n.getMonth() + 1), n.setDate(n.getDate() - 1), e = s < i.getTime() || n.getTime() < s
                }
                e && (this.calendars = [{
                    month: t.getMonth(),
                    year: t.getFullYear()
                }], "right" === this._o.mainCalendar && (this.calendars[0].month += 1 - this._o.numberOfMonths)), this.adjustCalendars()
            }
        }, adjustCalendars: function() {
            this.calendars[0] = y(this.calendars[0]);
            for (var t = 1; t < this._o.numberOfMonths; t++) this.calendars[t] = y({
                month: this.calendars[0].month + t,
                year: this.calendars[0].year
            });
            this.draw()
        }, gotoToday: function() {
            this.gotoDate(new Date)
        }, gotoMonth: function(t) {
            isNaN(t) || (this.calendars[0].month = parseInt(t, 10), this.adjustCalendars())
        }, nextMonth: function() {
            this.calendars[0].month++, this.adjustCalendars()
        }, prevMonth: function() {
            this.calendars[0].month--, this.adjustCalendars()
        }, gotoYear: function(t) {
            isNaN(t) || (this.calendars[0].year = parseInt(t, 10), this.adjustCalendars())
        }, setMinDate: function(t) {
            m(t), this._o.minDate = t, this._o.minYear = t.getFullYear(), this._o.minMonth = t.getMonth()
        }, setMaxDate: function(t) {
            this._o.maxDate = t
        }, setStartRange: function(t) {
            this._o.startRange = t
        }, setEndRange: function(t) {
            this._o.endRange = t
        }, draw: function(t) {
            if (this._v || t) {
                var e = this._o, i = e.minYear, n = e.maxYear, a = e.minMonth, o = e.maxMonth, r = "";
                this._y <= i && (this._y = i, !isNaN(a) && this._m < a && (this._m = a)), this._y >= n && (this._y = n, !isNaN(o) && this._m > o && (this._m = o));
                for (var h = 0; h < e.numberOfMonths; h++) r += '<div class="pika-lendar">' + w(this, h, this.calendars[h].year, this.calendars[h].month, this.calendars[0].year) + this.render(this.calendars[h].year, this.calendars[h].month) + "</div>";
                if (this.el.innerHTML = r, e.bound && "hidden" !== e.target.type && s(function() {
                    e.trigger.focus()
                }, 1), "function" == typeof this._o.onDraw) {
                    var d = this;
                    s(function() {
                        d._o.onDraw.call(d)
                    }, 0)
                }
            }
        }, adjustPosition: function() {
            var t, e, i, s, a, o, r, h, d, l;
            if (!this._o.container) {
                if (this.el.style.position = "absolute", t = this._o.trigger, e = t, i = this.el.offsetWidth, s = this.el.offsetHeight, a = window.innerWidth || n.documentElement.clientWidth, o = window.innerHeight || n.documentElement.clientHeight, r = window.pageYOffset || n.body.scrollTop || n.documentElement.scrollTop, "function" == typeof t.getBoundingClientRect) l = t.getBoundingClientRect(), h = l.left + window.pageXOffset, d = l.bottom + window.pageYOffset; else for (h = e.offsetLeft, d = e.offsetTop + e.offsetHeight; e = e.offsetParent;) h += e.offsetLeft, d += e.offsetTop;
                (this._o.reposition && h + i > a || this._o.position.indexOf("right") > -1 && h - i + t.offsetWidth > 0) && (h = h - i + t.offsetWidth), (this._o.reposition && d + s > o + r || this._o.position.indexOf("top") > -1 && d - s - t.offsetHeight > 0) && (d = d - s - t.offsetHeight), this.el.style.left = h + "px", this.el.style.top = d + "px"
            }
        }, render: function(t, e) {
            var i = this._o, n = new Date, s = g(t, e), a = new Date(t, e, 1).getDay(), o = [], r = [];
            m(n), i.firstDay > 0 && (a -= i.firstDay, a < 0 && (a += 7));
            for (var h = s + a, d = h; d > 7;) d -= 7;
            h += 7 - d;
            for (var l = 0, c = 0; l < h; l++) {
                var u = new Date(t, e, 1 + (l - a)), f = !!_(this._d) && v(u, this._d), b = v(u, n),
                    y = l < a || l >= s + a, C = i.startRange && v(i.startRange, u), D = i.endRange && v(i.endRange, u),
                    E = i.startRange && i.endRange && i.startRange < u && u < i.endRange,
                    I = i.minDate && u < i.minDate || i.maxDate && u > i.maxDate || i.disableWeekends && p(u) || i.disableDayFn && i.disableDayFn(u),
                    w = {
                        day: 1 + (l - a),
                        month: e,
                        year: t,
                        isSelected: f,
                        isToday: b,
                        isDisabled: I,
                        isEmpty: y,
                        isStartRange: C,
                        isEndRange: D,
                        isInRange: E
                    };
                r.push(O(w)), 7 === ++c && (i.showWeekNumber && r.unshift(S(l - a, e, t)), o.push(T(r, i.isRTL)), r = [], c = 0)
            }
            return x(i, o)
        }, isVisible: function() {
            return this._v
        }, show: function() {
            this._v || (c(this.el, "is-hidden"), this._v = !0, this.draw(), this._o.bound && (a(n, "click", this._onClick), this.adjustPosition()), "function" == typeof this._o.onOpen && this._o.onOpen.call(this))
        }, hide: function() {
            var t = this._v;
            t !== !1 && (this._o.bound && o(n, "click", this._onClick), this.el.style.position = "static", this.el.style.left = "auto", this.el.style.top = "auto", l(this.el, "is-hidden"), this._v = !1, void 0 !== t && "function" == typeof this._o.onClose && this._o.onClose.call(this))
        }, destroy: function() {
            this.hide(), o(this.el, "mousedown", this._onMouseDown, !0), o(this.el, "change", this._onChange), this._o.target && (o(this._o.target, "change", this._onInputChange), this._o.bound && (o(this._o.trigger, "click", this._onInputClick), o(this._o.trigger, "focus", this._onInputFocus), o(this._o.trigger, "blur", this._onInputBlur))), this.el.parentNode && this.el.parentNode.removeChild(this.el)
        }
    }
}(HeO2_legacy), function(t, e) {
    "use strict";
    t.UI.Progress = t.Class.extend({
        _DEFAULTS: {
            callbacks: {renderProgressContainer: null, renderOverlay: null},
            css: {bar: "progress-bar", overlay: "overlay", radial: "progress-radial"},
            labelFont: "Tahoma 15px",
            size: "40px",
            type: "radial",
            target: null
        },
        _FIND_PROGRESS_REGEX: /progress-\d+/,
        _FIND_FONT_FAMILY: /\d*[em|px|cm|mm|in|pt|pc|%|]*([A-Za-z ]+)\d*[em|px|cm|mm|in|pt|pc|%|]*/,
        _FIND_FONT_SIZE: /\d+[em|px|cm|mm|in|pt|pc|%|]+/,
        _progressNode: null,
        _overlayNode: null,
        _options: null,
        _progress: 0,
        init: function(t) {
            this.setOptions(t)
        },
        destroy: function(t) {
            return "function" == typeof t ? t(e(this._progressNode)) : t ? e(this._progressNode).detach() : e(this._progressNode).empty(), this._progressNode = null, this._overlayNode = null, this
        },
        progress: function(t) {
            return this._progress = Math.floor(t >= 0 ? t <= 100 ? t : 100 : 0), this._setProgressCss(), this._setLabel(), this
        },
        setOptions: function(t) {
            return this._options = e.extend({}, this._options || this._DEFAULTS, t), this._attach(), this
        },
        _attach: function() {
            var t = e("<label></label>").addClass(this._options.css.overlay).css({
                fontFamily: this._FIND_FONT_FAMILY.exec(this._options.labelFont)[1].trim(),
                fontSize: this._FIND_FONT_SIZE.exec(this._options.labelFont)[0].trim()
            }), i = e(this._options.target).addClass(this._options.css[this._options.type]).addClass("progress-0").css({
                width: this._options.size,
                height: this._options.size,
                lineHeight: .75 * parseInt(this._options.size) + "px"
            }).append(t);
            "function" == typeof this._options.callbacks.renderProgressContainer && this._options.callbacks.renderProgressContainer(i), "function" == typeof this._options.callbacks.renderOverlay && this._options.callbacks.renderOverlay(t), this._progressNode = i[0], this._overlayNode = t[0]
        },
        _setLabel: function() {
            this._overlayNode.innerHTML = this._progress + ""
        },
        _setProgressCss: function() {
            this._progressNode.className = this._progressNode.className.replace(this._FIND_PROGRESS_REGEX, "progress-" + this._progress)
        }
    })
}(HeO2_legacy, jQuery), function(t, e) {
    t.UI.Tags = t.EventingClass.extend({
        _DEFAULTS: {
            css: {container: t.CONST.UI_CLASSES.INPUT_STYLE, input: "", tagIcon: "tag-icon"},
            flash: {color: "#fff", duration: 500, easing: "easeOutCirc"},
            target: null
        },
        _$input: null,
        _$tags: null,
        _$target: null,
        _options: null,
        _tagIcons: null,
        _tags: null,
        init: function(t) {
            this._super(), this._tags = [], this._tagIcons = {}, this._createTagsContainer(), this.setOptions(t), this._options.tags && this.tags(this._options.tags)
        },
        setOptions: function(e) {
            return this._options = t.Helper.merge(!0, this._options || this._DEFAULTS, e), this._createInput(), this._attach(), this
        },
        tags: function(e, i) {
            return i = i || !1, void 0 === e ? this._tags : (e = e || [], this._tags = i ? e instanceof Array ? e : [e] : t.Helper.concatUnique(this._tags, e), this._update(), this)
        },
        val: function(t) {
            return this.tags(t, !0)
        },
        _input_blur: function(t) {
            var e = this._$input.val();
            e && (this._addTag(e), this._$input.val(""))
        },
        _input_keydown: function(e) {
            e.keyCode === t.CONST.VK_CODES.SPACE || e.keyCode === t.CONST.VK_CODES.TAB || e.keyCode === t.CONST.VK_CODES.ENTER ? (this._addTag(this._$input.val()), this._$input.val(""), e.preventDefault()) : e.keyCode === t.CONST.VK_CODES.BACKSPACE && "" === this._$input.val() && this._removeLast()
        },
        _tag_click: function(t) {
            this._removeTag(e(t.target).text()), this._$input.focus()
        },
        _addTag: function(t) {
            t = t.trim(), t && this._tags.indexOf(t) === -1 ? (this._tags.push(t), this._renderTag(t), this._flashTag(t)) : this._flashTag(t);
        },
        _adjustInput: function(t) {
            this._$input.css({paddingLeft: t + "px"})
        },
        _attach: function() {
            this._options.target && (this._$target = e(this._options.target).data(t.UI.Tags.DATA_ID, this).addClass(t.CONST.UI_CLASSES.CUSTOM_INPUT).addClass(t.CONST.UI_CLASSES.TAGS_INPUT).addClass(this._options.css.container).css("position", "relative").empty().append(this._$tags).append(this._$input))
        },
        _createInput: function() {
            this._$input = e("<input />").blur(this._input_blur.bind(this)).keydown(this._input_keydown.bind(this)).addClass(this._options.css.input).addClass(t.CONST.UI_CLASSES.SKIP_INPUT).css({
                position: "absolute",
                display: "inline-block",
                margin: 0,
                padding: "0 .2em",
                width: "100%",
                height: "100%",
                backgroundColor: "transparent",
                border: "none",
                cursor: "text"
            })
        },
        _createTagsContainer: function() {
            this._$tags = e("<div></div>").css({position: "absolute", margin: 0, padding: 0})
        },
        _flashTag: function(t) {
            var e = this._tagIcons[t];
            if (e) {
                var i = e.css("background-color");
                e.css({backgroundColor: this._options.flash.color}).animate({backgroundColor: i}, this._options.flash.duration, this._options.flash.easing)
            }
        },
        _measureTags: function() {
            var t = 0;
            this._$tags.each(function(e) {
                t += this._$tags.eq(e).outerWidth()
            }.bind(this)), this._adjustInput(t)
        },
        _renderTag: function(t) {
            var i = e("<span></span>").click(this._tag_click.bind(this)).addClass(this._options.css.tagIcon).text(t);
            this._tagIcons[t] = i, this._$tags.append(i), this._measureTags()
        },
        _removeLast: function() {
            this._tags.length && this._removeTag(this._$tags.children().last().text())
        },
        _removeTag: function(t) {
            var e = this._tags.indexOf(t);
            e !== -1 && (this._tags.splice(e, 1), this._tagIcons[t].detach(), this._measureTags())
        },
        _update: function() {
            this._$tags.empty(), this._tagIcons.length = 0, this._tags.forEach(function(t) {
                this._renderTag(t)
            }.bind(this)), this._measureTags()
        }
    }), t.UI.Tags.DATA_ID = "_tagsObject", t.UI.Tags.create = function(e) {
        return new t.UI.Tags(e)
    }
}(HeO2_legacy, jQuery), function(t, e) {
    "use strict";
    t.Form = t.EventingClass.extend({
        _DEFAULTS: {target: null}, _$target: null, _inputs: null, _options: null, init: function(t) {
            this._super(t), this._inputs = Object.create(null), this._options = e.extend({}, this._DEFAULTS, t), this._attach()
        }, list: function() {
            var t = Object.create(null);
            for (var e in this._inputs) t[e] = this.val(e);
            return t
        }, val: function(t, e) {
            return this._inputs[t] ? this._inputs[t].mediator.val(e) : null
        }, clear: function() {
            for (var t in this._inputs) this.val(t, "")
        }, restore: function(t) {
            Object.keys(t).forEach(function(e) {
                this._inputs[e] && this._inputs[e].mediator.val(t[e])
            }.bind(this))
        }, setOptions: function(t) {
            this._options = e.extend({}, this._options, t), this._attach()
        }, simpleValidate: function() {
            var t = !0;
            for (var e in this._inputs) t &= this._inputs[e].$ref[0].checkValidity();
            return t
        }, _attach: function() {
            this._$target = e(this._options.target), this._cache()
        }, _cache: function() {
            this._$target.find("input:not(." + t.CONST.UI_CLASSES.SKIP_INPUT + "),textarea,select,." + t.CONST.UI_CLASSES.CUSTOM_INPUT).each(function(t, i) {
                var n = i.getAttribute("name") || i.getAttribute("id");
                n && (this._inputs[n] = {$ref: e(i), mediator: this._captureMediator(i)})
            }.bind(this))
        }, _captureMediator: function(e) {
            var i = -1, n = null;
            return Object.keys(t.Form.mediators).forEach(function(s) {
                var a = t.Form.mediators[s], o = ["low", "normal", "high", "perfect"].indexOf(a.test(e));
                o > i && (i = o, n = a)
            }), n.capture(e)
        }
    }), t.Form.mediators = {}, t.Form.mediators.Generic = {
        capture: function(t) {
            var i = e(t);
            return {
                val: function(t) {
                    if (void 0 === t) return i.val();
                    var e = i.val(t);
                    return i.change(), e
                }
            }
        }, test: function(t) {
            return "low"
        }
    }, t.Form.mediators.SingleSelect = {
        capture: function(t) {
            var i = e(t);
            return {
                val: function(t) {
                    return void 0 === t ? i.val() : void i.val("").children("option").removeAttr("selected").each(function(e, n) {
                        n.attributes.value.value != t && n.innerHTML != t || (void 0 !== n.attributes.value ? i.val(n.attributes.value.value) : n.setAttribute("selected", "selected"))
                    })
                }
            }
        }, test: function(t) {
            return "SELECT" !== t.nodeName || void 0 !== t.attributes.multiple && t.attributes.multiple !== !1 ? null : "perfect"
        }
    }, t.Form.mediators.MultiSelect = {
        capture: function(t) {
            var i = e(t);
            return {
                val: function(t) {
                    if ("" === t && (t = []), void 0 === t) {
                        if ("object" === i.attr("data-valFormat")) {
                            var n = {};
                            return i.children("option").each(function(t, i) {
                                var s = e(i), a = Object.create(null);
                                a.state = s.is(":selected"), e.each(i.attributes, function(t, e) {
                                    0 === e.nodeName.indexOf("data-value-") && (a[e.nodeName.substr(11)] = e.nodeValue)
                                }), n[s.attr("value")] = a
                            }), n
                        }
                        return i.val()
                    }
                    if (!(t instanceof Array)) {
                        if ("object" === i.attr("data-valFormat")) return Object.keys(t).forEach(function(n) {
                            var s = i.children('option[value="' + n + '"]').prop("selected", ["on", "true"].indexOf(t[n].state) !== -1);
                            s.length && (e.each(s[0].attributes, function(t, e) {
                                e.nodeName.indexOf("data-value-") && s.removeAttr("data-value-" + e)
                            }), Object.keys(t[n]).forEach(function(e) {
                                "state" !== e && s.attr("data-value-" + e, t[n][e])
                            }))
                        }), i;
                        throw new TypeError("Form/MultiSelect | Cannot handle format")
                    }
                    i.val(t)
                }
            }
        }, test: function(t) {
            return "SELECT" === t.nodeName && void 0 !== t.attributes.multiple ? "perfect" : null
        }
    }, t.Form.mediators.PropertiesEditor = {
        capture: function(i) {
            var n = e(i).data(t.UI.PropertiesEditor.DATA_ID);
            if (!(n instanceof t.UI.PropertiesEditor)) throw new ReferenceError("Cannot retrieve the properties editor object");
            return {
                val: function(t) {
                    return void 0 === t ? n.list() : void n.restore(t)
                }
            }
        }, test: function(e) {
            return e.className.indexOf(t.CONST.UI_CLASSES.PROPERTIES_EDITOR_INPUT) !== -1 ? "perfect" : null
        }
    }, t.Form.mediators.Tags = {
        capture: function(i) {
            var n = e(i).data(t.UI.Tags.DATA_ID);
            if (!n instanceof t.UI.Tags) throw new ReferenceError("Cannot retrieve the tags object");
            return {val: n.val.bind(n)}
        }, test: function(e) {
            return e.className.indexOf(t.CONST.UI_CLASSES.TAGS_INPUT) !== -1 ? "perfect" : null
        }
    }, t.Form.mediators.CheckBox = {
        capture: function(t) {
            var i = e(t);
            return {
                val: function(t) {
                    return void 0 !== t ? i.prop("checked", "true" === t || t === !0) : i.prop("checked")
                }
            }
        }, test: function(t) {
            return "INPUT" === t.nodeName.toUpperCase() && t.attributes.type && "checkbox" === t.attributes.type.value.toLowerCase() ? "perfect" : null
        }
    }, t.Form.create = function(e) {
        return new t.Form(e)
    }
}(HeO2_legacy, jQuery);
