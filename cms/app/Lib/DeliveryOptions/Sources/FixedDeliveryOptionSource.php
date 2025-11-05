<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::uses('Properties', 'Lib');
App::uses('Address', 'Lib');

class FixedDeliveryOptionSource implements DeliveryOptionSourceInterface {
    private $_propertiesTemplate = [];
    private $_properties;

    public static function friendlyId() {
        return 'fixed-rate';
    }

    public function __construct() {
        $this->_properties = new Properties($this->_propertiesTemplate);
    }

    public function configure($properties) {
        $this->_properties->fromArray($properties);
    }

    public function enumProperties() {
        return $this->_properties->toArray();
    }

    public function eta() {
        return time() + $this->_properties->general->leadTime * 86400;
    }

    public function hasLateFees() {
        return false;
    }

    public function id() {
        return $this->_properties->general->id;
    }

    public function label($html = false) {
        $daysText = __d('heo2-lib', 'DELIVERY_OPTION_AROUND', floor($this->eta() - time()) / DAY_IN_SECONDS);
        $price = CakeNumber::currency($this->price());

        return "{$this->name()}";
    }

    public function name() {
        return $this->_properties->general->name;
    }

    public function price() {
        return $this->_properties->general->basePrice;
    }

    public function priceLate() {
        return 0.0;
    }

    public function setDestination($address) {
        if (!is_object($address) || (is_object($address) && get_class($address) !== 'Address')) {
            $address = Address::create($address);
        }
        $this->_address = $address;
    }

    public function setWeight($weight) {

    }

    public function visible() {
        return true;
    }
}
