<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::uses('XmlParser', 'Lib' . DS . 'XmlParser');
App::uses('HttpClient', 'Lib' . DS . 'HttpClient');
App::uses('L10n', 'Cake/I18n');

define('CANADA_POST_REQUEST', <<<XML
<?xml version="1.0" encoding="UTF-8"?>
<mailing-scenario xmlns="http://www.canadapost.ca/ws/ship/rate-v2">
  <customer-number>%s</customer-number>
  <parcel-characteristics>
    <weight>%s</weight>
    %s
  </parcel-characteristics>
  <origin-postal-code>%s</origin-postal-code>
  <destination>
    <domestic>
      <postal-code>%s</postal-code>
    </domestic>
  </destination>
</mailing-scenario>
XML
);

define('CANADA_POST_DIMENSIONS_PORTION', <<<XML
<dimensions>
	<length>%s</length>
	<width>%s</width>
	<height>%s</height>
</dimensions>
XML
);

define('CANADA_POST_URL', Configure::read('CanadaPost.apiUrl'));

class CanadaPostShippingSource implements ShippingSourceInterface {
    const _CANADA_POST_MAX_WEIGHT = 30;
    const _REQUEST = CANADA_POST_REQUEST;
    const _DIMENSIONS_PORTION = CANADA_POST_DIMENSIONS_PORTION;
    const _URL = CANADA_POST_URL;

    private $_httpClient = null;
    private $_params = null;
    private $_weightFixFactor = 1;
    private $_xml = null;

    public function __construct() {
        $http = new HttpClient();
        $this->_httpClient = $http->create();

        $httpClientCaps = $this->_httpClient->getCaps();
        if (empty($httpClientCaps['methodPost']) || empty($httpClientCaps['setHeaders']) || empty($httpClientCaps['https']) ||
            empty($httpClientCaps['setVerifyHost']) || empty($httpClientCaps['setVerifyPeer']) || empty($httpClientCaps['setCA']) ||
            empty($httpClientCaps['authBasic'])) {
            throw new ConfigureException('CanadaPostShippingSource: HttpClient does not support the request');
        }
    }

    public function getRates(array $params) {
        $this->_params = $params;
        $request = $this->_prepareRequest();

        if ($request) {
            $this->_httpClient->send([
                'method' => 'post',
                'url' => self::_URL,
                'headers' => [
                    'Content-Type' => 'application/vnd.cpc.ship.rate-v2+xml',
                    'Accept' => 'application/vnd.cpc.ship.rate-v2+xml',
                    'Accept-Language' => $this->_makeAcceptLanguage()
                ],
                'fields' => $this->_prepareRequest(),
                'sslVerifyPeer' => true,
                'sslVerifyHost' => 2,
                'caInfo' => Configure::read('CanadaPost.certificate'),
                'auth' => [
                    'method' => 'basic',
                    'username' => Configure::read('CanadaPost.username'),
                    'password' => Configure::read('CanadaPost.password')
                ]
            ]);
        }

        return $this->_parseResponse();
    }

    /* PRIVATE */
    private function _clean($string) {
        return preg_replace('/<.*?>/', '', $string);
    }

    private function _fixWeight($weight) {
        $weight = $weight / 1000;

        if ($weight <= self::_CANADA_POST_MAX_WEIGHT) {
            $this->_weightFixFactor = 1;
            return $weight;
        }

        $this->_weightFixFactor = $weight / self::_CANADA_POST_MAX_WEIGHT;
        return self::_CANADA_POST_MAX_WEIGHT;
    }

    private function _getOptions($priceQuote) {
        $options = [];

        foreach ($priceQuote->{'price-details'}->children('http://www.canadapost.ca/ws/ship/rate-v2')->{'options'}->children('http://www.canadapost.ca/ws/ship/rate-v2') as $option) {
            $options[] = [
                'name' => $this->_clean($option->{'option-name'}->asXML()),
                'price' => $this->_clean($option->{'option-price'}->asXML())
            ];
        }

        return $options;
    }

    private function _loadXml() {
        libxml_use_internal_errors(true);
        $this->_xml = simplexml_load_string('<root>' . preg_replace('/<\?xml.*\?>/', '', $this->_httpClient->getResponse()['body']) . '</root>');

        $loaded = !empty($this->_xml);
        if (!$loaded) {
            CakeLog::write('debug', 'CanadaPostShippingSource: Received a bad XML response from Canada Post\'s servers');
        }

        return $loaded;
    }

    private function _makeAcceptLanguage() {
        $l10n = new L10n();

        $threeLetterLanguage = $l10n->catalog(CakeSession::read('Config.language'));
        switch ($threeLetterLanguage['localeFallback']) {
        case 'ger':
        case 'eng':
            return 'en-ca';

        case 'fra':
            return 'fr-ca';
        }
    }

    private function _parseResponse() {
        $response = [];

        $this->_loadXml();

        if (!empty($this->_xml->{'price-quotes'})) {
            foreach ($this->_xml->{'price-quotes'}->children('http://www.canadapost.ca/ws/ship/rate-v2') as $priceQuote) {
                $response[] = [
                    'code' => $this->_clean($priceQuote->{'service-code'}->asXML()),
                    'name' => $this->_clean($priceQuote->{'service-name'}->asXML()),
                    'price' => $this->_clean($priceQuote->{'price-details'}->{'due'}->asXML()) * $this->_weightFixFactor,
                    'transitTime' => $this->_clean($priceQuote->{'service-standard'}->{'expected-transit-time'}->asXML()),
                    'expectedDeliveryDate' => $this->_clean($priceQuote->{'service-standard'}->{'expected-delivery-date'}->asXML()),
                    'extra' => [
                        'options' => $this->_getOptions($priceQuote)
                    ]
                ];
            }
        }

        return $response;
    }

    private function _prepareRequest() {
        $dimensionPortion = '';

        if (empty($this->_params['weight']) || empty($this->_params['origin']['postalCode']) || empty($this->_params['destination']['postalCode'])) {
            CakeLog::write('debug', 'CanadaPostShippingSource: Canada Post\'s api requires all of the following to be set origin address, destination address and weight, aborting.');
            return false;
        }

        if (!empty($this->_params['dimensions'])) {
            if (empty($this->_params['dimensions']['length']) || empty($this->_params['dimensions']['width']) || empty($this->_params['dimensions']['height']) ||
                !is_numeric($this->_params['dimensions']['length']) || !is_numeric($this->_params['dimensions']['width']) || !is_numeric($this->_params['dimensions']['height'])) {
                CakeLog::write('debug', 'CanadaPostShippingSource: Canada Post\'s api requires all 3 length, width and height when the dimensions element is present and of the number type, aborting.');
                return false;
            }

            $dimensionPortion = sprintf(self::_DIMENSIONS_PORTION,
                $this->_params['dimensions']['length'],
                $this->_params['dimensions']['width'],
                $this->_params['dimensions']['height']
            );
        }

        return sprintf(self::_REQUEST,
            Configure::read('CanadaPost.customerNumber'),
            $this->_fixWeight($this->_params['weight']),
            $dimensionPortion,
            strtoupper(str_replace(' ', '', $this->_params['origin']['postalCode'])),
            strtoupper(str_replace(' ', '', $this->_params['destination']['postalCode']))
        );
    }
}
