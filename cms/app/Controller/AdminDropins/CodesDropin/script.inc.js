/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2015-2019, Heliox - All Right Reserved
 */

function admin_loaded() {
    "use strict";

    (function(global, $) {
        new (global.HeO2.Client.extend({
            /* FIELDS */
            _assetsGrid: null,

            /* PUBLIC */
            init: function() {
                this._createAssetsGrid();
            },


            /* PRIVATE */
            _createAssetsGrid: function() {
                this._assetsGrid = new global.HeO2.Grid({debug: global.HeO2.CONST.DEBUG});
                this._assetsGrid
                    .addView('main', 'static', {
                        target: '#assets-grid'
                    })
                    .open(this._retrieveAssetsTableData(), 'application/cakephp-records');
            },

            _retrieveAssetsTableData: function() {
                return $('#DATA-assetsTable').text() || '{}';
            }
        }))
    }(window, jQuery));
}
