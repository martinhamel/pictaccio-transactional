(function(HeO2, $) {
    "use strict";

    const EventingClass = HeO2.require('HeO2.EventingClass');

    /* CONTROLLER */
    const Gallery = EventingClass.extend({
        init: function (host, options) {
            this._createElements();
        },

        hide: function() {
            this._modalElement.hide();
        },

        show: function(images) {
            "export";

            this._updateImages(images);
            this._modalElement.show();
            this._imageListElement.children().first().click();
        },


        /* EVENT HANDLER */
        _galleryClose_click: function(event) {
            this.hide();
        },

        _imageListImg_click: function(event) {
            $(event.currentTarget).parent().find('img').removeClass('selected');
            $(event.currentTarget).addClass('selected');

            this._setImage($(event.currentTarget).attr('src'));
        },


        /* PRIVATE */
        _createElements: function() {
            let containerElement = $('<div class="__gallery-container">');

            this._viewerElement = $('<div class="__gallery-viewer"><div class="__gallery-image-container"><img id="__gallery-image"></div></div>');
            this._imageListElement = $('<div class="__gallery-image-list">')
                .on('click', 'img', this._imageListImg_click.bind(this));

            containerElement.append(this._viewerElement, this._imageListElement);

            this._modalElement = $('<div class="__gallery-modal">')
                .append(containerElement)
                .append($('<i class="__gallery-close fas fa-times">')
                    .click(this._galleryClose_click.bind(this)));

            $(() => {
                $('body').append(this._modalElement);
            });
        },

        _makeSrcArray: function(elements) {
            if (elements instanceof $) {
                elements = elements.toArray();
            }

            return elements.map(i => i.src);
        },

        _prepareImages: function(images) {
            let srcs = [];

            if (images instanceof $) {
                if (images.length === 1) {
                    // Assume a container of imgs was passed
                    srcs = this._makeSrcArray(images.find('img'));
                } else if (images.length > 1) {
                    // Assume images is a collection of img
                    srcs = images;
                } else {
                    throw new Error('Unhandled case');
                }
            } else if (Array.isArray(images)) {
                // Assume array of string srcs
                srcs = images;
            } else {
                throw new Error('Unhandled case');
            }

            return srcs.map(i => $(`<img src=${i}>`));
        },

        _setImage: function(url) {
            this._viewerElement.find('#__gallery-image').attr('src', url);
        },

        _updateImages: function(images) {
            let imageElements = this._prepareImages(images);

            this._viewerElement.find('div').css('background-image', `unset`);
            this._imageListElement
                .empty()
                .append(imageElements);
        }
    });


    HeO2.UI.Widgets.Gallery = Gallery;
}(HeO2, jQuery));
