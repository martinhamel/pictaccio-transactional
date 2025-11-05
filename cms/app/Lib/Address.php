<?php

class Address {
    const _CAPTURE_CIVIC_NUMBER_REGEX = '/^ *(\d+)[ \w]*/iu';
    const _CAPTURE_STREET_ALONE_REGEX = '/^(?!^\d*$)([a-z0-9éÉèÈêÊàÀâÂùçÇôÔîÎûÛëË][a-z0-9\-\' \/\\.’|éÉèÈêÊàÀâÂùçÇ]*[a-z0-9éÉèÈêÊàÀâÂùçÇôÔîÎûÛëË]*)[\s]*/iu';
    const _CAPTURE_STREET_REGEX = '/^[\s]*(?:#[\da-z])?[\s]*[\d]+[\s.,\-]+([a-z0-9éÉèÈêÊàÀâÂùçÇôÔîÎûÛëË][a-z0-9\-\' \/\\.’|éÉèÈêÊàÀâÂùçÇôÔîÎûÛëË]*[a-z0-9éÉèÈêÊàÀâÂùçÇôÔîÎûÛëË]*)[\s]*/iu';
    const _CAPTURE_APARTMENT_REGEX = '/[\d ]*[\w+ ]*(?:# ?|app ?|app\. ?)+(\d|\w)/iu';
    const _CAPTURE_APARTMENT_HYPHEN_LETTER = '/^\d*-([a-z])/i';

    private $_PROVINCE_MAP = [
        'on' => 'Ontario',
        'ontario' => 'Ontario',
        'qc' => 'Québec',
        'quebec' => 'Québec'
    ];

    private $_rawAddress;
    private $_streetAddress1;
    private $_streetAddress2;
    private $_city;
    private $_country;
    private $_postalCode;
    private $_region;

    public static function create($address) {
        return new Address($address);
    }

    public function __construct($address)
    {
        HeO2Log::address('Parsing...');
        HeO2Log::dump('address', $address);
        $this->setRawAddress($address);
    }

    public function city() {
        if (empty($this->_city)) {
            $this->_city = $this->_findCity();
        }
        return $this->_city;
    }

    public function country() {
        if (empty($this->_country)) {
            $this->_country = $this->_findCountry();
        }

        return $this->_country;
    }

    public function postalCode() {
        if (empty($this->_postalCode)) {
            $this->_postalCode = $this->_findPostalCode();
        }
        return $this->_postalCode;
    }

    public function setRawAddress($address) {
        $this->_rawAddress = $address;
    }

    public function region() {
        if (empty($this->_region)) {
            $this->_region = $this->_findRegion();
        }
        return $this->_region;
    }

    public function streetAddress1() {
        if (empty($this->_streetAddress1)) {
            $this->_streetAddress1 = $this->_findStreetAddress1();
        }
        return $this->_streetAddress1;
    }

    public function streetAddress2() {
        if (empty($this->_streetAddress1)) {
            $this->_streetAddress2 = $this->_findStreetAddress2();
        }
        return $this->_streetAddress2;
    }

    public function validate(&$details = null) {
        if ($details !== null) {
            $details = [];
            $details['city'] = !empty(trim($this->city()));
            $details['postal-code'] = !empty(trim($this->postalCode()));
            $details['region'] = !empty(trim($this->region()));
            $details['country'] = !empty(trim($this->country()));
            $details['street-address-1'] = !empty(trim($this->streetAddress1()));
        }

        return
            $this->city() !== null &&
            $this->postalCode() !== null &&
            $this->region() !== null &&
            $this->country() !== null &&
            $this->streetAddress1() !== null;
    }

    /* PRIVATE */
    private function _findCity() {
        if (!empty($this->_rawAddress['city'])) {
            return $this->_rawAddress['city'];
        }

        return null;
    }

    private function _findCountry() {
        if (!empty($this->_rawAddress['country'])) {
            return $this->_rawAddress['country'];
        }

        return null;
    }

    private function _findPostalCode() {
        foreach (['postal', 'postal-code', 'code', 'postal_code', 'postalcode', 'postalCode'] as $code) {
            if (!empty($this->_rawAddress[$code])) {
                return mb_strtolower($this->country()) === 'canada'
                    ? $this->_formatCanadianPostalCode($this->_rawAddress[$code])
                    : $this->_rawAddress[$code];
            }
        }

        return null;
    }

    private function _findRegion() {
        foreach (['state', 'province', 'region'] as $state) {
            if (!empty($this->_rawAddress[$state])) {
                return isset($this->_PROVINCE_MAP[mb_strtolower($this->_rawAddress[$state])]) ?
                    $this->_PROVINCE_MAP[mb_strtolower($this->_rawAddress[$state])] :
                    $this->_rawAddress[$state];
            }
        }

        return null;
    }

    private function _findStreetAddress1() {
        if (!empty($this->_rawAddress['street-address-1'])) {
            return $this->_rawAddress['street-address-1'];
        }

        return null;
    }

    private function _findStreetAddress2() {
        if (!empty($this->_rawAddress['street-address-2'])) {
            return $this->_rawAddress['street-address-2'];
        }

        return null;
    }

    private function _formatCanadianPostalCode($postalCode) {
        return mb_strtoupper(substr(trim($postalCode), 0, 3) . ' ' . trim(mb_substr(trim($postalCode), 3)));
    }
}
