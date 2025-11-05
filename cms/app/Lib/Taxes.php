<?php

class Taxes {
    public static function get() {
        switch (Configure::read('Taxes.locality')) {
        case 'ca-qc':
            return ['gst', 'qst'];

        case 'ca-on':
            return ['hst'];

        case 'ca-ab':
            return ['gst'];

        case 'ca-sk':
            return ['gst', 'pst'];

        case 'ca-bc':
            return ['gst', 'pst'];

        case 'ca-mb':
            return ['gst', 'pst'];

        case 'ca-nb':
            return ['hst'];

        case 'ca-nl':
            return ['hst'];

        case 'ca-ns':
            return ['hst'];

        case 'ca-nt':
            return ['gst'];

        case 'ca-nu':
            return ['gst'];

        case 'ca-pe':
            return ['hst'];

        case 'ca-yt':
            return ['gst'];
        }
    }
 }
