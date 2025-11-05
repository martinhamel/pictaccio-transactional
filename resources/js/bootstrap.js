window.bootstrap = (function() {
    "use strict";
    var BootstrapLoader = function () {
        this.lateIncludes = [];
        this.loaded = [];
    };

    BootstrapLoader.prototype.init = function () {
        if (typeof btJsPath !== 'undefined') {
            if (btJsPath.slice(-1) !== '/') {
                btJsPath += '/';
            }

            window.require = function (collection, callback) {
                this.lateIncludes.push({
                    collection: collection,
                    callback: callback
                });
            }.bind(this);

            this._load();
        } else {
            throw ('ERROR: btJsPath is undefined. Set btJsPath before running the bootstrapper.');
        }
    };

    BootstrapLoader.prototype._injectRequire = function () {
        window.require = function (collections, callback) {
            var collectionSplit = collections.split(' ');
            var collectionTemp = [];
            for (var i = 0, length = collectionSplit.length; i < length; ++i) {
                if (btJsIncludes[collectionSplit[i]] !== undefined) {
                    collectionTemp = collectionTemp.concat(btJsIncludes[collectionSplit[i]]);
                } else {
                    console.error('ERROR: Cannot find collection ' + collectionSplit[i] + '. Check your includes.js');
                }
            }

            this._loadNext.bind({collection: collectionTemp, callback: callback, next: 0, loader: this}).call();
        }.bind(this);
    };

    BootstrapLoader.prototype._load = function () {
        this._loadScript('includes.js', function () {
            this._injectRequire();

            for (var i in this.lateIncludes) {
                require(this.lateIncludes[i].collection, this.lateIncludes[i].callback);
            }
        }.bind(this));
    };

    BootstrapLoader.prototype._loadNext = function () {
        if (this.next === this.collection.length) {
            if (this.callback) {
                this.callback.call(null);
            }
            return;
        }

        this.loader._loadScript(this.collection[this.next++], this.loader._loadNext.bind(this));
    };

    BootstrapLoader.prototype._loadScript = function (jsScriptPath, callback) {
        // This helps the browser load the previous resource and avoid missing dependencies
        var url = btJsPath + jsScriptPath;

        if (this.loaded.indexOf(url) === -1) {
            var script = document.createElement('script');

            this.loaded.push(url);

            script.src = url;
            script.onload = callback;
            script.addEventListener('error', function () {
                throw ('ERROR: Cannot load ' + btJsPath + jsScriptPath + '. Does the file exist?');
            });

            document.getElementsByTagName('head')[0].appendChild(script);
        } else {
            callback();
        }
    };

    return BootstrapLoader.prototype.init.bind(new BootstrapLoader());
}());
