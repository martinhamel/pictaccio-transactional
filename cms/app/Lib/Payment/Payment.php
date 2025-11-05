<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

require_once APP . 'Lib' . DS . 'Payment' . DS . 'config.php';
require_once __DIR__ . DS . 'PaymentProcessorInterface.php';

class Payment {
    private $_processors = [];

    public static function create() {
        return new Payment();
    }

    public function __construct() {
        if (empty($this->_processors)) {
            $this->_loadProcessors();
        }
    }

    public function callback($module, $method, &$params) {
        if (isset($this->_processors[$module])) {
            return $this->_processors[$module]->callback($method, $params);
        }

        throw new FatalErrorException("Payment module {$module} not found");
    }

    public function getLink($module) {
        if (empty($this->_processors[$module])) {
            throw new FatalErrorException("Payment module {$module} not found.");
        }

        return $this->_processors[$module]->getLink();
    }

    public function getLinks() {
        $links = [];
        foreach ($this->_processors as $module => $processor) {
            $links[$module] = $processor->getLink();
        }

        return $links;
    }

    /* PRIVATE */
    private function _loadProcessors() {
        foreach (PAYMENT_CONFIG::$processors as $processor) {
            require PAYMENT_CONFIG::PAYMENT_PROCESSORS_DIR . $processor . '.php';
            $this->_processors[$processor] = new $processor();
        }
    }
}
