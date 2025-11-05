<?php

class PhoneNumber {
    private $_CAPTURE_REGEXES = [
        'american' => '/^\+?(1*)\D*(\d{3})\D*(\d{3})\D*(\d{4})$/'
    ];
    private $_FORMATS = [
        'american' => [
            'short' => '(%s) %s-%s',
            'long' => '1 (%s) %s-%s',
            'formal' => '+1-%s-%s-%s'
        ]
    ];

    private $_area = null;
    private $_parsedNumber = null;
    private $_rawNumber = null;

    /**
     * @param $rawNumber {string/number} Raw number to parse
     * @param $area {string} Phone number area, only 'american' is supported at the moment
     * @return PhoneNumber
     */
    public static function create($rawNumber, $area) {
        return new PhoneNumber($rawNumber, $area);
    }

    /**
     * @param $rawNumber {string/number} Raw number to parse
     * @param $area {string} Phone number area, only 'american' is supported at the moment
     */
    public function __construct($rawNumber, $area) {
        /*if (empty($rawNumber) || empty($area) || empty($this->_CAPTURE_REGEXES[$area])) {
            throw new InvalidArgumentException("PhoneNumber__construct | Empty arguments or unsupported area code");
        }*/

        $this->_area = $area;
        $this->_rawNumber = $rawNumber;

        $this->_parseNumber();
    }


    public function format($style) {
        if (empty($this->_FORMATS[$this->_area][$style])) {
            throw new InvalidArgumentException("PhoneNumber::format | Style {$style} not supported");
        }
        if (substr_count($this->_FORMATS[$this->_area][$style], '%s') != count($this->_parsedNumber)) {
            throw new InvalidArgumentException("PhoneNumber::format | Phone number area mismatch");
        }

        return vsprintf($this->_FORMATS[$this->_area][$style], $this->_parsedNumber);
    }

    public function validate(&$details = null) {
        if ($details !== null) {
            $details = [];
            $details['phone'] = !empty($this->_parsedNumber);
        } else if (empty($details)) {
            $details['phone'] = false;
        }
        return !empty($this->_parsedNumber);
    }


    /* PRIVATE */
    private function _parseNumber() {
        if (preg_match($this->_CAPTURE_REGEXES[$this->_area], $this->_rawNumber, $matches)) {
            array_shift($matches);
            array_shift($matches);
            $this->_parsedNumber = $matches;
        }
    }
}
