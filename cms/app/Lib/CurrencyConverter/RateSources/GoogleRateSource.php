<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::uses('HttpClient', 'Lib' . DS . 'HttpClient');

class GoogleRateSource implements RateSourceInterface {
    const _QUERY_URL = "http://rate-exchange.appspot.com/currency?from=%s&to=%s";

    private $_from = null;
    private $_to = null;

    public function getRate($from, $to) {
        $this->_from = $from;
        $this->_to = $to;

        return $this->_queryGoogle();
    }

    /* PRIVATE */
    private function _queryGoogle() {
        $http = HttpClient::create();
        $http->send([
            'url' => sprintf(self::_QUERY_URL, $this->_from, $this->_to)
        ]);

        $response = $http->getResponse();
        return $this->_parseAnswer($response['body']);
    }

    private function _parseAnswer($body) {
        $jsonBody = json_decode($body, true);
        return floatval($jsonBody['rate']);
    }
}
