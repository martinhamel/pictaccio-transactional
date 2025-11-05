(function (HeO2, $) {
    "use strict";

    const ViewComponent = HeO2.require('HeO2.View.Component');
    const helpers = HeO2.require('HeO2.common.helpers');
    const domHelpers = HeO2.require('HeO2.common.domHelpers');
    const sha1 = HeO2.require('HeO2.vendor.sha1');
    const logger = HeO2.require('HeO2.common.logger');

    const DEFAULT_OPTIONS = {
        accept: '',
        drophint: null,
        gallery: false,
        groupFiles: false,
        multiple: false,
        parent: null,
        trigger: null,
    };

    const DROPHINT_CLASS = 'heo2-uploads-drophint';
    const DROPHING_HOVER_CLASS = 'hover';

    const UploadsComponent = ViewComponent.extend({
        asDataUrl: function(file, callback) {
            if (!file) {
                return null;
            }

            let reader = new FileReader();

            reader.addEventListener('load', () => {
                callback(reader.result);
            });
            reader.readAsDataURL(file);
        },

        callbacks: function(callbacks) {
            this._callbacks = callbacks;
            return this;
        },

        clear: function(groupName) {
            if (groupName) {
                for (let i = 0, length = this._files.length; i < length; ++i) {
                    if (this._files[i].groupName === groupName) {
                        if (this._files.galleryIcon) {
                            this._files.galleryIcon.detach();
                        }
                        this._files.splice(i, 1);
                        --i;
                    }
                }
            } else {
                for (let i = 0, length = this._files.length; i < length; ++i) {
                    if (this._files[i].galleryIcon) {
                        this._files[i].galleryIcon.detach();
                    }
                }
                this._files = [];
            }
            return this;
        },

        files: function(groupName) {
            let files = [];

            for (let file of this._files) {
                if (file.groupName === groupName || groupName === undefined) {
                    files.push(file);
                }
            }

            return files;
        },

        restore: function(images) {
            if (!images) {
                return;
            }

            if (typeof images === 'object') {
                images = Object.entries(images);
            } else if (!Array.isArray(images)) {
                images = [images].entries();
            }

            for (let [id, image] of images) {
                let file = new File([], image);
                file._heo2_id = id;
                file._heo2_restore = true;

                this._addToGallery(image, null, id);
                this._files.push(file);
            }
        },

        /* LIFE CYCLE */
        _prepareOptions: function(options) {
            return helpers.merge(true, DEFAULT_OPTIONS, options);
        },

        _initialize: function() {
            this._drophints = [];
            this._files = [];
            this._lastDrophintTargetNode = null;
        },

        _attach: function() {
            if (this._options.trigger) {
                if (typeof this._options.trigger === 'string') {
                    $(this._options.trigger).click(this._trigger_click.bind(this));
                } else {
                    $(this._options.trigger.parent).on('click', this._options.trigger.delegate, this._trigger_click.bind(this));
                }
            }

            if (this._options.drophint) {
                $('body')
                    .on('dragenter', this._body_dragenter.bind(this))
                    .on('dragover', this._body_dragdrop_noop.bind(this))
                    .on('drop dragleave', this._body_dragend.bind(this));
            }
        },


        /* EVENT HANDLER */
        _body_dragenter: function(event) {
            this._drawDropHint();

            event.originalEvent.stopPropagation();
            event.originalEvent.preventDefault();
        },

        _body_dragdrop_noop: function(event) {
            event.originalEvent.stopPropagation();
            event.originalEvent.preventDefault();
        },

        _body_dragend: function(event) {
            if (     event.type === 'drop' ||
                    (event.type === 'dragleave' && event.clientX === 0 && event.clientY === 0)) {
                this._removeDrophints();
            }

            event.originalEvent.stopPropagation();
            event.originalEvent.preventDefault();
        },

        _dropzone_dragenterleave: function(event) {
            let currentTargetNode = $(event.currentTarget);
            let ignoreNext = false;

            if (this._lastDrophintTargetNode && this._lastDrophintTargetNode.ignoreNext) {
                this._lastDrophintTargetNode.ignoreNext = false;
                return;
            }

            if (     this._lastDrophintTargetNode &&
                    (this._lastDrophintTargetNode.lastEvent !== 'dragleave' && this._lastDrophintTargetNode[0] !== currentTargetNode[0]) ||
                    (event.type === 'dragleave' && this._lastDrophintTargetNode[0] === currentTargetNode[0]) ) {
                this._lastDrophintTargetNode.removeClass(DROPHING_HOVER_CLASS);

                if (this._lastDrophintTargetNode.lastEvent !== 'dragleave' && this._lastDrophintTargetNode[0] !== currentTargetNode[0]) {
                    ignoreNext = true;
                }
            }
            if (!this._lastDrophintTargetNode || currentTargetNode[0] !== this._lastDrophintTargetNode[0]) {
                currentTargetNode.addClass(DROPHING_HOVER_CLASS);
            }

            this._lastDrophintTargetNode = currentTargetNode;
            this._lastDrophintTargetNode.lastEvent = event.type;
            this._lastDrophintTargetNode.ignoreNext = ignoreNext;
        },

        _dropzone_drop: function(event) {
            if (event.originalEvent.dataTransfer.files.length) {
                this._emitAddingFile(event.originalEvent.dataTransfer.files, $(event.currentTarget).data('senderId'));
            }
        },

        _trigger_click: function(triggerEvent) {
            if (!this._emitTriggerClick(triggerEvent.currentTarget.id)) {
                $('<input type="file" ' + (this._options.multiple ? 'multiple' : '') + ' accept="' + (this._options.accept) + '">')
                    .change(
                        (event) => {
                            if (event.target.files.length) {
                                this._emitAddingFile(event.target.files, triggerEvent.currentTarget.id);
                            }
                        })
                    .click();

            }
        },


        /* PRIVATE */
        _addToGallery: function(file, senderId, fileId) {
            if (file instanceof File && fileId === undefined) {
                // TODO: Update all dependencies to use fileId instead.. leaving both for now
                file._heo2_id = fileId = sha1(`${file.name}${(new Date()).getTime()}`);
            }

            this._emitRenderGallery(file, senderId, (icon, gallery) => {
                // TODO: This check might break things
                if (typeof file === 'object') {
                    file.galleryIcon = icon;
                }
                if (typeof this._callbacks.renderIcon === 'function') {
                    this._callbacks.renderIcon(icon, gallery);
                } else {
                    $(gallery).append(icon);
                }
            }, fileId);
        },

        _drawDropHint: function() {
            let drophint = this._options.drophint || this._emitDrophint();

            if (drophint && this._drophints.length === 0) {
                $(drophint).each(
                    (index, element) => {
                        let elementPageRect = domHelpers.getPageBoundingRect(element);
                        let drophintNode = $('<div></div>')
                            .addClass(DROPHINT_CLASS)
                            .css({
                                position: 'absolute',
                                left: elementPageRect.left,
                                top: elementPageRect.top,
                                width: elementPageRect.width,
                                height: elementPageRect.height
                            })
                            .data('senderId', element.id)
                            .on('drop', this._dropzone_drop.bind(this))
                            .on('dragenter dragleave', this._dropzone_dragenterleave.bind(this));

                        this._emitRenderDrophint(drophintNode, element.id);
                        this._drophints.push(drophintNode);
                        $('body').append(drophintNode);
                    });
            }
        },

        // Emitted when each time a file is added either through the trigger or via drag n' drop
        _emitAddingFile: function(files, senderId) {
            for (let i = 0, length = files.length; i < length; ++i) {
                let event = {
                    file: files[i],
                    senderId: senderId,
                    index: helpers.isNumeric(senderId[senderId.length - 1]) ? helpers.getLastInt(senderId) : undefined,
                    keep: function(index, groupName) {
                            files[index].senderId = senderId;
                            files[index].groupName = groupName;
                            this._addToGallery(files[index], senderId);
                            this._files.push(files[index]);
                        }.bind(this, i)
                };

                this.emit('adding-file', event);
            }
        },

        // Emitted when Uploads wants to determine where the drophint(s) should be drawn
        _emitDrophint: function() {
            let drophint;

            this.emit('drophint', {
                drophint: (value) => {
                    drophint = value;
                }
            });

            return drophint;
        },

        // Emitted for each drophints when Uploads is about to draw drophints to allow the hosting view to customize them
        _emitRenderDrophint: function(drophintNode, senderId) {
            this.emit('render-drophint', {
                drophintNode: drophintNode,
                index: senderId ? helpers.isNumeric(senderId[senderId.length - 1]) ? helpers.getLastInt(senderId) : undefined : undefined,
                senderId: senderId
            });
        },

        _emitRenderGallery: function(file, senderId, render, fileId) {
            this.emit('render-gallery-icon', {
                file: file,
                fileId: fileId,
                index: senderId ? helpers.isNumeric(senderId[senderId.length - 1]) ? helpers.getLastInt(senderId) : undefined : undefined,
                senderId: senderId,
                render: (icon, gallery) => {
                    render(icon, gallery);
                }
            });
        },

        // Emitted when a browse file trigger was clicked
        _emitTriggerClick: function(senderId) {
            let cancelAction = false;
            let event = {
                senderId: senderId,
                index: helpers.isNumeric(senderId[senderId.length - 1]) ? helpers.getLastInt(senderId) : undefined,
                cancel: (cancel) => {
                    if (!cancel) {
                        return cancelAction;
                    }

                    cancelAction = Boolean(cancel);
                }
            };
            this.emit('trigger-click', event);
            return cancelAction;
        },

        _removeDrophints: function() {
            for (let i = 0, length = this._drophints.length; i < length; ++i) {
                this._drophints[i].remove();
            }
            this._drophints.length = 0;
        }
    });

    ViewComponent.add('Uploads', UploadsComponent);
}(HeO2, jQuery));
