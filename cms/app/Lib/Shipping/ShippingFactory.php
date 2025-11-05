<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

require_once 'ShippingSourceInterface.php';

class ShippingFactory {
    private static $s_sources;

    public static function create($source) {
        self::_loadSources();

        if (isset(self::$s_sources[$source])) {
            return self::$s_sources[$source];
        }

        return null;
    }

    public static function getRates($params, $source = '') {
        if (!empty($source)) {
            return self::$s_sources->getRates($params);
        }

        $all = [];
        foreach (self::$s_sources as $key => $sourceObject) {
            $all[$key] = $sourceObject->getRates($params);
        }

        return $all;
    }


    /* PRIVATE */
    private static function _loadSources() {
        // TODO: Make this load all shipping sources
        App::uses('CanadaPostShippingSource', 'Lib' . DS . 'Shipping' . DS . 'ShippingSources');
        self::$s_sources['canada-post'] = new CanadaPostShippingSource();
    }
}
