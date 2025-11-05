!function(t) {
    "use strict";
    t.HeO2_legacy.ElementsGroup = t.HeO2_legacy.Class.extend({
        init: function(t) {
            "string" == typeof t ? (this._index = [], this._parsed = $.parseHTML(t), this._scanAttr()) : (this._parsed = t, this._index = arguments[1])
        }, clone: function() {
            return new t.HeO2_legacy.ElementGroup(this._clone(), this._index)
        }, get: function(t) {
            return void 0 !== t ? this._update(this._clone(), t) : this._parsed
        }, _clone: function() {
            for (var t = this._parsed.length, e = [], i = 0; i < t; ++i) e.push(this._parsed[i].cloneNode(!0));
            return e
        }, _makePathArray: function(t) {
            for (var e = t.split("|"), i = e.length, n = 0; n < i; ++n) e[n] = Number(e[n]);
            return e
        }, _update: function(t, e) {
            for (var i = this._index.length, n = 0; n < i; ++n) {
                for (var s = t, r = this._index[n].pathArray, o = r.length, a = this._index[n].attributes, d = a.length, h = 0; h < o; ++h) s = void 0 !== s.children ? s.children[r[h]] : s[r[h]];
                for (var h = 0; h < d; ++h) s.setAttribute(a[h].name, a[h].originalValue.replace(/%%/i, e))
            }
            return t
        }, _scanAttr: function(t, e) {
            t = t || this._parsed, e = e || "";
            for (var i = t.length, n = 0; n < i; ++n) {
                for (var s = e + n.toString() + "|", r = [], o = t[n].attributes.length, a = 0; a < o; ++a) /%%/i.test(t[n].attributes[a].value) && r.push({
                    name: t[n].attributes[a].name,
                    originalValue: t[n].attributes[a].value
                });
                r.length && this._index.push({
                    pathArray: this._makePathArray(s.slice(0, -1)),
                    attributes: r
                }), t[n].children.length && this._scanAttr(t[n].children, s)
            }
        }
    })
}(window), function(t, e) {
    "use strict";
    t.HeO2_legacy.Uploader = t.HeO2_legacy.EventingClass.extend({
        _DRAG_TIMEOUT: 50,
        _DEFAULTS: {
            css: "uploader-target",
            emptyCss: "empty",
            target: void 0,
            url: void 0,
            spinnerCss: "uploader-spinner",
            spinnerImageCss: void 0,
            attachFileButton: void 0
        },
        init: function(t) {
            this._super(), this.fileUploads = [], this._dragging = !1, this._elementCount = 0, this._options = e.extend({}, this._DEFAULTS, t), this._fileInputs = [], void 0 !== this._options.target && (this._$target = e(this._options.target), this._trapBodyFileEvents(), this._attach(), this._createSpinner())
        },
        addElement: function(t, i) {
            return 0 === this._elementCount && this._$target.removeClass(this._options.emptyCss).empty(), e(t).is("img") && (t = this._addImageClose(t, i)), this._$target.append(t), ++this._elementCount, this
        },
        capture: function() {
            return this._attach(), this
        },
        checkSupport: function() {
            return window.File && window.FileReader && window.FileList && window.Blob
        },
        _attachToFile_click: function(t) {
            var t = {cancel: !1};
            this.emit("attachToFile", t), t.cancel || e('<input type="file" />').change(this._fileInput_change.bind(this)).click()
        },
        _addElement_callback: function(t) {
            this._this.addElement(t, this.fileUpload), this._this._spinner.hide()
        },
        _body_drag_attract: function(t) {
            "dragenter" === t.type || "dragover" === t.type ? (clearTimeout(this._dragTimeout), this._$target.addClass("attract"), this._dragging = !0) : (this._dragging = !1, this._dragTimeout = setTimeout(function() {
                this._$target.removeClass("attract")
            }.bind(this), this._DRAG_TIMEOUT)), this._target_noop(t)
        },
        _elementRemove_click: function(t) {
            var i = e(t.target).data("$fileInput"),
                n = {cancel: !1, element: t.target, fileUpload: e(t.target).data("fileUpload"), fileInput: i};
            if (this.emit("elementRemove", n), !n.cancel && (e(t.target).data("$container").remove(), --this._elementCount, !this.checkSupport())) for (var s = this._fileInputs.length, r = 0; r < s; ++r) if (this._fileInputs[r] === i) {
                this._fileInputs.splice(r, 1);
                break
            }
        },
        _fileInput_change: function(t) {
            var i = e(t.target).off("click");
            "" !== i.val() && (this.checkSupport() ? this._processFile(i[0].files[0]) : this._processFileUnsupported(i), this._fileInputs.push(i))
        },
        _fileupload_complete: function(t, e) {
            var i = {
                raw: t,
                fileUpload: e,
                element: void 0,
                callback: this._addElement_callback.bind({_this: this, fileUpload: e})
            };
            this.emit("addElement", i), void 0 !== i.element && this._addElement(addElementEvent.element), this.emit("complete", i), this._spinner.show()
        },
        _target_drag_lock: function(t) {
            "dragenter" === t.type || "dragover" === t.type ? (clearTimeout(this._dragTimeoutLock), this._$target.addClass("locked"), this._dragging = !0) : (this._dragging = !1, this._dragTimeoutLock = setTimeout(function() {
                this._$target.removeClass("locked")
            }.bind(this), this._DRAG_TIMEOUT)), this._target_noop(t)
        },
        _target_drop: function(t) {
            for (var e = t.originalEvent.dataTransfer.files, i = e.length, n = 0; n < i; ++n) this._processFile(e[n]);
            this._target_noop(t)
        },
        _target_noop: function(t) {
            t.originalEvent.stopPropagation(), t.originalEvent.preventDefault()
        },
        _acquireAttachToFile: function() {
            void 0 !== this._options.attachFileButton && e(this._options.attachFileButton).off().click(this._attachToFile_click.bind(this))
        },
        _addImageClose: function(t, i) {
            var n = e("<div></div>");
            return n.css({
                position: "relative",
                display: "inline-block"
            }).append(t).append(e("<div></div>").addClass("close-x").css({
                position: "absolute",
                right: 0,
                top: 0
            }).data("$container", n).data("fileUpload", i).on("click", this._elementRemove_click.bind(this))), n
        },
        _attach: function() {
            this._$target.addClass(this._options.css), this.checkSupport() && (this._$target.on("drop", this._target_drop.bind(this)).on("dragenter dragover dragleave drop", this._target_drag_lock.bind(this)), 0 === this._$target.children().length && this._showDropTarget()), this._acquireAttachToFile()
        },
        _createSpinner: function() {
            var i = e("<div></div>").addClass(this._options.spinnerCss).addClass(this._options.spinnerImageCss).hide();
            this._$target.append(i), i.css({
                top: this._$target.height() / 2 - i.height() / 2,
                left: this._$target.width() / 2 - i.width() / 2
            }), this._spinner = new t.HeO2_legacy.Spinner({target: i})
        },
        _getFilename: function(t) {
            var e = t.indexOf("\\") >= 0 ? t.lastIndexOf("\\") : t.lastIndexOf("/"), i = t.substring(e);
            return 0 !== i.indexOf("\\") && 0 !== i.indexOf("/") || (i = i.substring(1)), i
        },
        _emitFileAdded: function(t, e) {
            var i = {fileUpload: e, rawFile: t, cancel: !1, url: void 0, requestData: void 0};
            return this.emit("fileAdded", i), i
        },
        _processFile: function(t) {
            var e = new FileUpload(t, {url: this._options.url}), i = this._emitFileAdded(t, e);
            i.cancel || (this.fileUploads.push(e), e.on("complete", this._fileupload_complete.bind(this)), i.fileUpload.upload(i.requestData), this._$target.append(this._spinner._$target), this._spinner.show())
        },
        _processFileUnsupported: function(t) {
            var i = this._emitFileAdded(t, void 0);
            if (!i.cancel) {
                var n = e("<div></div>").addClass("uploader-text-item").html(this._getFilename(t.val()));
                this._$target.append(n.append(e("<div></div>").addClass("close-x").data("$container", n).data("$fileInput", t).click(this._elementRemove_click.bind(this)))), this.emit("addElement", {element: n})
            }
        },
        _showDropTarget: function() {
            this._$target.addClass(this._options.emptyCss).append(e("<div></div>").html(e.i18n("MESSAGE_DRAG_TO_UPLOAD")))
        },
        _trapBodyFileEvents: function() {
            e("body").on("dragenter dragover dragleave drop", this._body_drag_attract.bind(this)).on("drop", this._target_noop.bind(this))
        }
    })
}(window, jQuery), function(t, e) {
    "use strict";
    t.HeO2_legacy.FileUpload = t.HeO2_legacy.EventingClass.extend({
        _DEFAULTS: {url: null}, init: function(t, i) {
            this._super(), this._options = e.extend({}._DEFAULTS, i), this.file = t, this._deferred = e.Deferred()
        }, deferred: function() {
            return this._deferred
        }, upload: function(t) {
            return this.file && this._upload(t), this
        }, _fileXhr_onError: function() {
            this.emit("error"), this._deferred.reject()
        }, _fileXhr_onLoad: function(t) {
            this.emit("complete", {
                file: this.file,
                raw: t
            }), this._fileXhr_onProgress(t), this._deferred.resolve(), this._destroy()
        }, _fileXhr_onProgress: function(t) {
            var e = {current: t.loaded, file: this.file, progress: t.loaded / t.total, total: t.total, raw: t};
            this.emit("progress", e)
        }, _fileXhr_onReadyStateChange: function(t) {
            if (4 === t.target.readyState) {
                var e = t.target.getAllResponseHeaders(), i = t.target.response,
                    n = e.substring(e.indexOf("Content-Type") + 14, e.indexOf(";", e.indexOf("Content-Type")));
                "application/json" !== n && "text/json" !== n || (i = JSON.parse(i)), this.emit("response", i)
            }
        }, _addRequestData: function(t, e) {
            for (var i in e) e.hasOwnProperty(i) && t.append(i, e[i])
        }, _create: function() {
            this._fileXhr = new t.XMLHttpRequest, this._fileXhr_onProgress_binded = this._fileXhr_onProgress.bind(this), this._fileXhr_onLoad_binded = this._fileXhr_onLoad.bind(this), this._fileXhr_onError_binded = this._fileXhr_onError.bind(this), this._filexhr_onReadyStateChange_binded = this._fileXhr_onReadyStateChange.bind(this)
        }, _destroy: function() {
            this._fileXhr.upload.removeEventListener("progress", this._fileXhr_onProgress_binded), this._fileXhr.upload.removeEventListener("progress", this._fileXhr_onLoad_binded), this._fileXhr.upload.removeEventListener("progress", this._fileXhr_onError_binded), this._fileXhr.upload.removeEventListener("progress", this._fileXhr_onError_binded), delete this._fileXhr
        }, _upload: function(t) {
            var e = new FormData;
            e.append(this.file.name, this.file), this._addRequestData(e, t), this._create(), this._fileXhr.open("POST", this._options.url, !0), this._fileXhr.upload.addEventListener("progress", this._fileXhr_onProgress_binded, !1), this._fileXhr.upload.addEventListener("load", this._fileXhr_onLoad_binded, !1), this._fileXhr.upload.addEventListener("error", this._fileXhr_onError_binded, !1), this._fileXhr.upload.addEventListener("abort", this._fileXhr_onError_binded, !1), this._fileXhr.addEventListener("readystatechange", this._filexhr_onReadyStateChange_binded, !1), this._fileXhr.send(e)
        }
    })
}(window, jQuery), function(t, e) {
    "use strict";
    t.Class.registerComponent("Files", t.EventingClass.extend({
        _DEFAULTS: {
            drop: {use: !1, target: null, hintTextKey: "MESSAGE_FILE_DROP_HINT", callbacks: {hintRender: null}},
            browse: {use: !1, multiple: !1, trigger: null},
            upload: {use: !1, url: null, callbacks: {needFormat: null}},
            limit: 0
        }, _$dropHint: null, _$dropTarget: null, _files: null, _options: null, init: function(t, i) {
            this._super(), this._files = [], this._options = e.extend(!0, this._DEFAULTS, i), this._attach()
        }, checkSupport: function() {
            return Boolean(window.File && window.FileReader && window.FileList && window.Blob)
        }, get: function() {
            return this._files
        }, reset: function() {
            this._files.length = 0, this._emitUpdated()
        }, _body_dragdrop: function(t) {
            this._drawDropHint(), this._noop(t)
        }, _body_dragleave: function(t) {
            this._hideDropHint(), this._noop(t)
        }, _browserTrigger_change: function(t) {
            Array.prototype.forEach.call(t.target.files, function(t) {
                this._addFile(t, "browse")
            }.bind(this))
        }, _browseTrigger_click: function(t) {
            this._canUpload() && e('<input type="file"' + (this._options.browse.multiple ? " multiple " : "") + "/>").change(this._browserTrigger_change.bind(this)).click()
        }, _noop: function(t) {
            t.originalEvent.stopPropagation(), t.originalEvent.preventDefault()
        }, _target_dragdrop: function(t) {
            this._canUpload() && this._drawDropHint(), this._noop(t)
        }, _target_drop: function(t) {
            this._canUpload() && (this._hideDropHint(), Array.prototype.forEach.call(t.originalEvent.dataTransfer.files, function(t) {
                this._addFile(t, "drop")
            }.bind(this)))
        }, _target_leave: function(t) {
            this._hideDropHint()
        }, _addFile: function(t, e) {
            var i = this._emitAddingFile(e, t);
            i && (this._files.push(t), this._emitAddedFile(t), this._options.upload.use && (i.success ? i.success(function() {
                this._upload(t)
            }.bind(this)) : this._upload(t)))
        }, _attach: function() {
            this._options.drop.use && this.checkSupport() && this._attachDropTarget(), this._options.browse.use && e(this._options.browse.target).click(this._browseTrigger_click.bind(this))
        }, _attachDropTarget: function() {
            this._$dropTarget = e(this._options.drop.target).on("dragenter dragover drop", this._target_dragdrop.bind(this)).on("dragleave", this._target_leave.bind(this)).on("drop", this._target_drop.bind(this)), e(document.body).on("dragenter dragover drop", this._body_dragdrop.bind(this)).on("dragleave", this._body_dragleave.bind(this)).on("drop", this._noop.bind(this))
        }, _canUpload: function() {
            return 0 === this._options.limit || this._options.limit > this._files.length
        }, _drawDropHint: function() {
            this._$dropHint ? this._$dropHint.show() : (this._$dropHint = this._options.drop.callbacks.hintRender && this._options.drop.callbacks.hintRender() || e("<div></div>").css({
                position: "absolute",
                left: 0,
                top: 0,
                width: this._$dropTarget.width() + "px",
                textAlign: "center",
                lineHeight: this._$dropTarget.height() + "px",
                border: "3px dashed #ccc",
                borderRadius: "5px"
            }).text(e.i18n(this._options.drop.hintTextKey)), this._$dropTarget.append(this._$dropHint))
        }, _hideDropHint: function() {
            this._$dropHint.hide()
        }, _upload: function(e) {
            var i = {}, n = new t.FileUpload(e, {url: this._options.upload.url});
            i[e.name + "-upload"] = this._talk("random-string") + "-" + e.name, this._emitUploading(e, n, i), n.upload(this._options.upload.callbacks.needFormat && this._options.callbacks.needFormat() || i).on("progress", function(t) {
                this.emit("progress", t)
            }.bind(this)).on("response", function(t) {
                this._emitUploaded(e, t)
            }.bind(this)).on("error", function() {
                this._emitUploadFailure(e)
            }.bind(this))
        }, _emitAddingFile: function(e, i) {
            var n = {cancel: null, method: e, file: i};
            return this.emit("adding", n), n.cancel instanceof t.Promise ? n.cancel : !n.cancel
        }, _emitAddedFile: function(t) {
            var e = {file: t};
            this._emitUpdated(), this.emit("added", e)
        }, _emitUpdated: function() {
            this.emit("updated", {})
        }, _emitUploading: function(t, e, i) {
            var n = {defaultFields: i, file: t, fileUpload: e};
            this.emit("uploading", n)
        }, _emitUploaded: function(t, e) {
            var i = {file: t, response: e};
            this.emit("uploaded", i)
        }, _emitUploadFailure: function(t) {
            var e = {file: t};
            this.emit("failure", e)
        }
    }))
}(HeO2_legacy, jQuery);
