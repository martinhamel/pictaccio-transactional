/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2014-2019, Heliox - All Right Reserved
 */

(function(HeO2, $) {
    "use strict";

    const breakpointObserver = HeO2.require('HeO2.utils.breakpointObserver');
    const EventingClass = HeO2.require('HeO2.EventingClass');

    const Layout = EventingClass.extend({
        init: function() {
            breakpointObserver.on('changed', this._breakpoint_changed.bind(this));
        },


        /* EVENTS */
        _breakpoint_changed: function(event) {
            if (event.new === 'phone') {
                $('#nav-dropdown').prepend($('#nav-home,#nav-order'));
            } else {
                $('#nav-links').prepend($('#nav-home,#nav-order'));
            }
        }

        /* PRIVATE */
    });

    new Layout();
}(HeO2, jQuery));
