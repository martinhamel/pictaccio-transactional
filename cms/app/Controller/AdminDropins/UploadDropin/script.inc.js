

function admin_loaded() {
    "use strict";

    (function(HeO2_legacy, $, global) {
        new (HeO2_legacy.Client.extend({
            /* FIELDS */
            _PROGRESS_TIMEOUT: 1500,
            _SERVER_CONFIG: {
                add: {},
                edit: {},
                remove: {}
            },

            _$packageFilenameLabel: null,
            _id: null,
            _uploads: 0,
            _uploadOverlay: null,
            _uploadCancelPromise: null, // Is rejected on Dialog close to cancel the upload

            /* PUBLIC */
            init: function() {
                this._super();

                this._photos = [];

                this._createUploadOverlay();
                this._attach();
            },


            /* EVENT HANDLERS */
            _sessionUpload_click: function(event) {
                $('#upload-overlay-title').text($(event.target).attr('data-name'));
                this._id = $(event.target).attr('data-id');
                this._uploadOverlay.show();

                $('<div></div>')
                    .css({
                        position: 'absolute',
                        marginLeft: '-45px',
                        marginTop: '-25px'
                    });
            },

            _uploadPackage_click: function(event) {
                if (!this._uploadCancelPromise) {
                    this._talk('modal-message', {
                        title: $.i18n('GENERIC_WARNING'),
                        text: $.i18n('MESSAGE_NO_PACKAGE_CHOSEN'),
                        buttons: 'ok'
                    });
                    return;
                }

                this._uploadCancelPromise.resolve();
                this._uploadOverlay.close();
            },

            _window_beforeUnload: function(event) {
                if (this._uploads > 0) {
                    return $.i18n('MESSAGE_UPLOAD_IN_PROGRESS_LEAVE_ANYWAY');
                }
            },


            /* PRIVATE */
            _attach: function() {
                $(global).on('beforeunload', this._window_beforeUnload.bind(this));
                $('.upload-session-link').click(this._sessionUpload_click.bind(this));
                $('#upload-package-button').click(this._uploadPackage_click.bind(this));
                this._$packageFilenameLabel = $('#package-filename-label');
            },

            _createProgressCircle: function(id) {
                var $container = $('<div></div>')
                    .css({
                        position: 'absolute',
                        marginLeft: '-45px',
                        marginTop: '-25px'
                    });

                $('[data-id="' + id + '"]').parent().append($container);
                return new HeO2_legacy.UI.Progress({
                    target: $container,
                    size: '35px'
                });
            },

            _createUploadOverlay: function() {
                this._uploadOverlay = new HeO2_legacy.UI.ModalOverlay({
                        width: '500px',
                        height: '195px',
                        callbacks: {
                            contentDraw: function($context) {
                                $context.append($('#upload-overlay').show());
                            }
                        }
                    })
                    .on('closed', function() {
                        if (this._uploadCancelPromise !== null) {
                            this._uploadCancelPromise.reject();
                            this._uploadCancelPromise = null;
                        }
                        this._$packageFilenameLabel.text('');
                    }.bind(this));

                this._loadComponent('Files', {
                        browse: {
                            use: true,
                            target: '#package-browse-trigger-link'
                        },
                        drop: {
                            use: true,
                            target: '#upload-overlay'
                        },
                        upload: {
                            use: true,
                            url: global.location.origin + global.location.pathname + '/' + 'upload'
                        }
                    })
                    .on('adding', function(event) {
                        if (event.file.name === 'group.pak') {
                            this._$packageFilenameLabel.text(event.file.name);
                            event.cancel = this._uploadCancelPromise = HeO2_legacy.Promise.create();
                            event.file.circle = this._createProgressCircle(this._id);
                        } else {
                            this._talk('modal-message', {
                                title: $.i18n('GENERIC_WARNING'),
                                text: $.i18n('MESSAGE_REQUIRE_GROUP_PAK'),
                                buttons: 'ok'
                            });
                            event.cancel = true;
                        }
                    }.bind(this))
                    .on('uploading', function(event) {
                        event.defaultFields['id'] = this._id;
                        ++this._uploads;
                    }.bind(this))
                    .on('progress', function(event) {
                        event.file.circle.progress(event.progress * 100);
                    }.bind(this))
                    .on('uploaded', function(event) {
                        --this._uploads;
                        event.file.circle.progress(100);
                        setTimeout(function() {
                            event.file.circle.destroy(function($container) {
                                $container.fadeOut('slow', function() {
                                    $container.detach();
                                });
                            });
                        }, this._PROGRESS_TIMEOUT);
                    }.bind(this))
                    .on('failure', function(event) {
                        --this._uploads;
                    }.bind(this));
            }
        }));
    }(HeO2_legacy, jQuery, window));
}
