/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2014-2019, Heliox - All Right Reserved
 */

(function(HeO2) {
    const EventingClass = HeO2.require('HeO2.EventingClass');
    const helpers = HeO2.require('HeO2.common.helpers');

    const CHROMA_KEY_WORKER = serverUrl + 'js/chromaKeyWorker.js';
    const CONFIG_DEFAULTS = {
        image: null,
        colorKey: null,
        tolerance: 150
    };

    HeO2.effects.ChromaKey = EventingClass.extend({
        init: function(options) {
            this._super();

            this._calculatedColorKey = Object.create(null);
            this._colorKeyPoints = [];

            this.setOptions(options);
        },

        draw: async function(background) {
            try {
                let foregroundImage = await this._loadImage(this._options.image);
                let backgroundImage = await this._loadImage(background);
                let width = foregroundImage.width;
                let height = foregroundImage.height;
                let foregroundCanvas = this._createCanvas(width, height);
                let foregroundContext = foregroundCanvas.getContext('2d');
                let resultCanvas = this._createCanvas(width, height);
                let resultContext;
                let foregroundImageData;

                foregroundContext.drawImage(foregroundImage, 0, 0);
                foregroundImageData = foregroundContext.getImageData(0, 0, width, height);
                this._calculateChromaKey(foregroundCanvas, foregroundImageData);
                foregroundContext.putImageData(
                    await this._chromaKeyImage(foregroundImageData, this._options.tolerance, this._calculatedColorKey), 0, 0);
                resultContext = resultCanvas.getContext('2d');
                resultContext.drawImage(backgroundImage, 0, 0, width, height);
                resultContext.drawImage(foregroundCanvas, 0, 0);

                return resultCanvas.toDataURL();
            } catch (e) {
                throw new Error('ChromaKey::draw: Failed to draw. ' + e);
            }
        },

        getCalculatedColorKey: async function() {
            if (helpers.isEmpty(this._calculatedColorKey) || helpers.isEmpty(this._colorKeyPoints)) {
                try {
                    let foregroundImage = await this._loadImage(this._options.image);
                    let width = foregroundImage.width;
                    let height = foregroundImage.height;
                    let foregroundCanvas = this._createCanvas(width, height);
                    let foregroundContext = foregroundCanvas.getContext('2d');

                    foregroundContext.drawImage(foregroundImage, 0, 0);
                    foregroundImageData = foregroundContext.getImageData(0, 0, width, height);
                    this._calculateChromaKey(foregroundCanvas, foregroundImageData);

                } catch (e) {
                    throw new Error('ChromaKey::getCalculatedColorKey: Failed to getCalculatedColorKey. ' + e);
                }
            }

            return {
                calculatedColorKey: this._calculatedColorKey,
                colorKeyPoints: this._colorKeyPoints
            }
        },

        setOptions: function(options) {
            this._options = helpers.merge(true, this._options || CONFIG_DEFAULTS, options);

            if (	this._options.colorKey.x !== undefined && this._options.colorKey.y !== undefined &&
                !(this._options.colorKey instanceof Array)	) {
                this._options.colorKey = [this._options.colorKey];
            }

            if (typeof this._options.tolerance === 'number') {
                this._options.tolerance = {
                    r: this._options.tolerance,
                    g: this._options.tolerance,
                    b: this._options.tolerance
                }
            }
        },


        /* PRIVATE */
        _calculateChromaKey: function(canvas, imageData) {
            if (this._options.colorKey instanceof Array) {
                this._calculatedColorKey.r = 0;
                this._calculatedColorKey.g = 0;
                this._calculatedColorKey.b = 0;
                this._calculatedColorKey.a = 0;
                this._colorKeyPoints.length = 0;
                for (let i = 0, length = this._options.colorKey.length; i < length; ++i) {
                    let x = typeof this._options.colorKey[i].x === 'string' && this._options.colorKey[i].x.includes('%') ?
                            (parseInt(this._options.colorKey[i].x, 10) / 100 * canvas.width) - 1
                            : Number(this._options.colorKey[i].x);
                    let y = typeof this._options.colorKey[i].y === 'string' && this._options.colorKey[i].y.includes('%') ?
                            (parseInt(this._options.colorKey[i].y, 10) / 100 * canvas.height) - 1
                            : Number(this._options.colorKey[i].y);
                    let cursor = ((Math.floor(y) * canvas.width) + Math.floor(x)) * 4;
                    this._calculatedColorKey.r = i ? (this._calculatedColorKey.r + imageData.data[cursor]) : imageData.data[cursor];
                    this._calculatedColorKey.g = i ? (this._calculatedColorKey.g + imageData.data[cursor + 1]) : imageData.data[cursor + 1];
                    this._calculatedColorKey.b = i ? (this._calculatedColorKey.b + imageData.data[cursor + 2]) : imageData.data[cursor + 2];
                    this._calculatedColorKey.a = i ? (this._calculatedColorKey.a + imageData.data[cursor + 3]) : imageData.data[cursor + 3];
                    if (i + 1 === this._options.colorKey.length) {
                        this._calculatedColorKey.r = this._calculatedColorKey.r / (i + 1);
                        this._calculatedColorKey.g = this._calculatedColorKey.g / (i + 1);
                        this._calculatedColorKey.b = this._calculatedColorKey.b / (i + 1);
                        this._calculatedColorKey.a = this._calculatedColorKey.a / (i + 1);
                    }
                    this._colorKeyPoints.push({
                        r: imageData.data[cursor],
                        g: imageData.data[cursor + 1],
                        b: imageData.data[cursor + 2],
                        a: imageData.data[cursor + 3]
                    });
                }

            } else if (typeof this._options.colorKey === 'object' &&
                typeof this._options.colorKey.r !== 'undefined' &&
                typeof this._options.colorKey.g !== 'undefined' &&
                typeof this._options.colorKey.b !== 'undefined') {

                this._calculatedColorKey = this._options.colorKey;
                if (typeof this._options.colorKey.a === 'undefined') {
                    this._calculatedColorKey.a = 255;
                }

            } else if (typeof this._options.colorKey === 'string' &&
                (this._options.colorKey.substr(0, 2) === '0x' || this._options.colorKey.substr(0, 1) === '#')) {

                if (this._options.colorKey.substr(0, 1) === '#') {
                    this._options.colorKey.replace('#', '0x');
                }
                let value = parseInt(this._options.colorKey);
                this._calculatedColorKey = {
                    r: (value & (0xff << 24)) >>> 24,
                    g: (value & (0xff << 16)) >>> 16,
                    b: (value & (0xff << 8)) >>> 8,
                    a: (value & 0xff) / 0xff
                }

            } else {
                throw new Error('[ChromaKey] The type of options.chromeKey is unsupported');
            }
        },

        _chromaKeyImage: function(imageData, tolerance, colorKey) {
            return new Promise((resolve, reject) => {
                 let worker = new Worker(CHROMA_KEY_WORKER);

                 worker.onmessage = (result) => {
                     resolve(result.data);
                 };
                 worker.postMessage({imageData, tolerance, colorKey});
            });
        },

        _createCanvas: function(width, height) {
            let canvas = document.createElement('canvas');

            canvas.width = width;
            canvas.height = height;

            return canvas;
        },

        _loadImage: function(image) {
            return new Promise((resolve, reject) => {
                if (typeof image === 'string') {
                    let imgElement = document.createElement('img');
                    imgElement.src = image.startsWith(serverUrl) || image.startsWith('data:')
                        ? image
                        : serverUrl + (image.startsWith('/') ? image.substring(1) : image);
                    imgElement.onload = (event) => {
                        resolve(imgElement);
                    };
                } else if (image instanceof HTMLImageElement) {
                    resolve(image);
                } else {
                    reject(new Error('ChromaKey::_loadImage: Unknown image'));
                }
            });
        }
    })
}(HeO2));
