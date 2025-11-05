<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

class EstablishmentDeliveryOptionSource implements DeliveryOptionSourceInterface {
    private $_propertiesTemplate = [
        'info' => [
            'expireDay' => ['type' => 'number'],
            'expireMonth' => ['type' => 'number'],
            'expireYear' => ['type' => 'number'],
            'increaseDay' => ['type' => 'number'],
            'increaseMonth' => ['type' => 'number'],
            'increaseYear' => ['type' => 'number'],
            'increasedPrice' => ['type' => 'number'],
            'etaDay' => ['type' => 'number'],
            'etaMonth' => ['type' => 'number'],
            'etaYear' => ['type' => 'number']
        ]
    ];
    private $_properties;

    public static function friendlyId() {
        return 'establishment';
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
        return mktime(0, 0, 0, $this->_properties->info->etaMonth, $this->_properties->info->etaDay, $this->_properties->info->etaYear);
    }

    public function hasLateFees() {
        return mktime(0, 0, 0, $this->_properties->info->increaseMonth, $this->_properties->info->increaseDay, $this->_properties->info->increaseYear) < time();
    }

    public function id() {
        return $this->_properties->general->id;
    }

    public function label($html = false) {
        $daysText = __d('heo2-lib', 'DELIVERY_OPTION_SCHOOL', floor(($this->eta() - time()) / DAY_IN_SECONDS));
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
        return $this->_properties->info->increasedPrice;
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
        $expireEpoch = mktime(0, 0, 0, $this->_properties->info->expireMonth, $this->_properties->info->expireDay, $this->_properties->info->expireYear);
        return $expireEpoch > time();
    }
}
