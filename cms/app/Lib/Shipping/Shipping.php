<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

require_once 'ShippingSourceInterface.php';

class Shipping {
    const _CIVIC_NUMBER_REGEX = '/\d+/';

    private $_defaultParams = [];
    private $_sources = [];

    public function __construct() {
        $this->_loadSources();
    }

    public function setParams($params) {
        $this->_defaultParams = $this->_prepare($params);
    }

    public function getRates($params) {
        return $this->_sources[0]->getRates(array_merge(
            $this->_defaultParams,
            $this->_prepare($params)
        ));
    }

    /* PRIVATE */
    private function _extractString($str, $regex) {
        return [
            'value' => preg_match($regex, $str),
            'newString' => preg_replace($regex, '', $str)
        ];
    }

    private function _loadSources() {
        // TODO: Make this load all shipping sources
        App::uses('CanadaPostShippingSource', 'Lib' . DS . 'Shipping' . DS . 'ShippingSources');
        $this->_sources[] = new CanadaPostShippingSource();
    }

    private function _prepare($params) {
        return $this->_prepareAddresses($params);
    }

    private function _prepareAddress($address) {
        if (empty($address['civicNumber']) && !empty($address['street'])) {
            list($address['civicNumber'], $address['street']) = $this->_extractString($address['street'], self::_CIVIC_NUMBER_REGEX);
        }

        if (!empty($address['postalCode'])) {
            $address['postalCode'] = str_replace(' ', '', $address['postalCode']);
        }

        return $address;
    }

    private function _prepareAddresses($params) {
        if (!empty($params['origin'])) {
            $params['origin'] = $this->_prepareAddress($params['origin']);
        }
        if (!empty($params['destination'])) {
            $params['destination'] = $this->_prepareAddress($params['destination']);
        }

        return $params;
    }
}
