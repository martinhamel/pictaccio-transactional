<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

require 'RateSourceInterface.php';

class CurrencyConverter {
    const _RATE_SOURCE_SUFFIX = 'RateSource';

    public static function create($source) {
        if (empty($source)) {
            $source = Configure::read('Currency.rateSource');
        }

        return self::_createSource($source);
    }

    public static function convert($amount, $from, $to, $source = '') {
        $source = self::create($source);
        return $amount * $source->getRate($from, $to);
    }

    /* PRIVATE */
    private static function _createSource($source) {
        $rateSourceName = $source . self::_RATE_SOURCE_SUFFIX;
        require_once 'RateSources' . DS . $rateSourceName . '.php';
        return new $rateSourceName();
    }
}
