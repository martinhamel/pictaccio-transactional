<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::uses('HttpClient', 'Lib' . DS . 'HttpClient');

class YahooFinanceRateSource implements RateSourceInterface {
    const _QUERY_URL = "http://download.finance.yahoo.com/d/quotes.csv?e=.csv&f=sl1d1t1&s=%s%s=X";

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
        $explodedBody = explode(',', $body);
        return floatval($explodedBody[1]);
    }
}
