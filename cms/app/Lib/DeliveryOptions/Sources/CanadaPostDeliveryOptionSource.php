<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::uses('Properties', 'Lib');
App::uses('ShippingFactory', 'Lib/Shipping');

class CanadaPostDeliveryOptionSource implements DeliveryOptionSourceInterface {
    private $_propertiesTemplate = [
        'info' => [
            'daysLeadTime' => ['type' => 'number'],
            'originPostalCode' => ['type' => 'text'],
            'productCode' => ['type' => 'text'],
            'parcelThreshold' => ['type' => 'number'],
            'envelopePrice' => ['type' => 'number'],
            'envelopeEta' => ['type' => 'number']
        ]
    ];
    private $_address;
    private $_canadaPost;
    private $_invalid = false;
    private $_properties;
    private $_shipEta;
    private $_shipPrice;
    private $_weight;

    public static function friendlyId() {
        return 'canada-post';
    }

    public function __construct() {
        $this->_properties = new Properties($this->_propertiesTemplate);

        $this->_canadaPost = ShippingFactory::create('canada-post');
    }

    public function configure($properties) {
        $this->_properties->fromArray($properties);
    }

    public function enumProperties() {
        return $this->_properties->toArray();
    }

    public function eta() {
        return time() + ($this->_shipEta * 86400) + $this->_properties->info->daysLeadTime * 86400;
    }

    public function hasLateFees() {
        return false;
    }

    public function id() {
        return $this->_properties->general->id;
    }

    public function label($html = false) {
        $daysText = __d('heo2-lib', 'DELIVERY_OPTION_AROUND', $this->eta());

        return "{$this->name()}";
    }

    public function name() {
        return $this->_properties->general->name;
    }

    public function price() {
        return $this->_shipPrice + $this->_properties->general->basePrice;
    }

    public function priceLate() {
        return 0.0;
    }

    public function setDestination($address) {
        if (!is_object($address) || (is_object($address) && get_class($address) !== 'Address')) {
            $address = Address::create($address);
        }
        $this->_address = $address;

        $this->_checkRequest();
    }

    public function setWeight($weight) {
        $this->_weight = $weight;
        $this->_checkRequest();
    }

    public function visible() {
        return !$this->_invalid;
    }


    /* PRIVATE */
    private function _checkRequest() {
        if (!empty($this->_address) && !empty($this->_weight)) {
            if ($this->_weight >= $this->_properties->info->parcelThreshold) {
                $this->_request();
            } else {
                $this->_shipEta = $this->_properties->info->envelopeEta;
                $this->_shipPrice = $this->_properties->info->envelopePrice;
            }
        }
    }

    private function _request() {
        $params = [
            'origin' => [
                'postalCode' => $this->_properties->info->originPostalCode,
            ],
            'destination' => [
                'streetAddress1' => $this->_address->streetAddress1(),
                'streetAddress2' => $this->_address->streetAddress2(),
                'city' => $this->_address->city(),
                'region' => $this->_address->region(),
                'country' => $this->_address->country(),
                'postalCode' => $this->_address->postalCode(),
            ],
            'weight' => $this->_weight,
            'dimensions' => [
                'width' => 1,
                'height' => 1,
                'length' => 1
            ]
        ];

        $products = $this->_canadaPost->getRates($params);
        $product = $this->_getShipProduct($products);
        if ($product) {
            $this->_shipEta = $product['transitTime'];
            $this->_shipPrice = $product['price'];
        } else {
            $this->_invalid = true;
        }
    }

    private function _getShipProduct($products) {
        foreach ($products as $product) {
            if ($product['code'] === $this->_properties->info->productCode) {
                return $product;
            }
        }

        return false;
    }
}
