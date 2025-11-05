<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::uses('HttpClient', 'Lib' . DS . 'HttpClient');

class YahooApiRateSource implements RateSourceInterface {
    const _QUERY_URL = 'http://query.yahooapis.com/v1/public/yql?q=select%%20*%%20from%%20yahoo.finance.xchange%%20where%%20pair%%20in%%20(%%22%s%s%%22)&env=store://datatables.org/alltableswithkeys';

    private $_from = null;
    private $_to = null;

    public function getRate($from, $to) {
        $this->_from = $from;
        $this->_to = $to;

        return $this->_queryYahoo();
    }

    /* PRIVATE */
    private function _queryYahoo() {
        $http = HttpClient::create();
        $http->send([
            'url' => sprintf(self::_QUERY_URL, $this->_from, $this->_to)
        ]);

        $response = $http->getResponse();
        return $this->_parseAnswer($response['body']);
    }

    private function _parseAnswer($body) {
        $ratePos = strpos($body, '<Rate>') + 6;
        $endRatePos = strpos($body, '</Rate>', $ratePos) - $ratePos;
        return floatval(substr($body, $ratePos, $endRatePos));
    }
}
