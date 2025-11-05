<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

class CashRegister {
    private $_descriptor = null;
    private $_values = [];

    public static function create($descriptor = '') {
        if (empty($descriptor)) {
            switch (Configure::read('Taxes.locality')) {
            case 'ca-qc':
                $descriptor = Configure::read('CashRegister.quebec');
                break;

            case 'ca-on':
                $descriptor = Configure::read('CashRegister.ontario');
                break;

            case 'ca-ab':
                $descriptor = Configure::read('CashRegister.alberta');
                break;

            case 'ca-sk':
                $descriptor = Configure::read('CashRegister.saskatchewan');
                break;

            case 'ca-bc':
                $descriptor = Configure::read('CashRegister.british-columbia');
                break;

            case 'ca-mb':
                $descriptor = Configure::read('CashRegister.manitoba');
                break;

            case 'ca-nb':
                $descriptor = Configure::read('CashRegister.new-brunswick');
                break;

            case 'ca-nl':
                $descriptor = Configure::read('CashRegister.newfoundland-and-labrador');
                break;

            case 'ca-ns':
                $descriptor = Configure::read('CashRegister.nova-scotia');
                break;

            case 'ca-nt':
                $descriptor = Configure::read('CashRegister.northwest-territories');
                break;

            case 'ca-nu':
                $descriptor = Configure::read('CashRegister.nunavut');
                break;

            case 'ca-pe':
                $descriptor = Configure::read('CashRegister.prince-edward-island');
                break;

            case 'ca-yt':
                $descriptor = Configure::read('CashRegister.yukon');
                break;
            }
        }
        return new CashRegister($descriptor);
    }

    public function __construct($descriptor) {
        $this->_descriptor = $descriptor;
        $this->_prepare();
    }

    public function __get($name) {
        if (!isset($this->_values[$name])) {
            throw new UnknownPropertyException("Unknown property {$name}");
        }

        return $this->_values[$name];
    }

    public function __isset($name) {
        return isset($this->_values[$name]);
    }

    public function __set($name, $value) {
        if (!isset($this->_values[$name])) {
            throw new UnknownPropertyException("Unknown property {$name}");
        }

        $this->_values[$name] = $this->_round($value);
        $this->_calculate();
    }

    public function serialize() {
        return json_encode([
            'order' => array_keys($this->_descriptor),
            'operations' => $this->_descriptor
        ]);
    }

    /* PRIVATE */
    private function _calculate() {
        foreach ($this->_descriptor as $name => $item) {
            if (is_array($item)) {
                foreach ($item as $action => $params) {
                    $this->_values[$name] =
                        $this->_round(
                            $this->{'_action_' . $action}($this->_values[$name], $params)
                        );
                }
            }
        }
    }

    private function _prepare() {
        foreach ($this->_descriptor as $name => $item) {
            $this->_values[$name] = 0;

            if (is_numeric($item)) {
                $this->_values[$name] = $item;
            } else if (is_array($item)) {
                foreach ($item as $action => $params) {
                    $this->_values[$name] =
                        $this->_round(
                            $this->{'_action_' . $action}($this->_values[$name], $params)
                        );
                }
            }
        }
    }

    private function _round($value) {
        return round($value * 100) / 100;
    }


    /* ACTIONS */
    private function _action_subtract($value, $params) {
        $first = true;
        $value = (is_numeric($params[0]) ? $params[0] : $this->{$params[0]});
        foreach ($params as $param) {
            if (!$first) {
                $value = $this->_round(
                    $value -
                    (is_numeric($param) ? $param : $this->{$param}));
            }
            $first = false;
        }

        return $value;
    }

    private function _action_sum($value, $params) {
        $value = 0;
        foreach ($params as $param) {
            $value = $this->_round(
                $value +
                (is_numeric($param) ? $param : $this->{$param}));
        }

        return $value;
    }

    private function _action_multiply($value, $params) {
        if (count($params) !== 2) {
            throw new InvalidArgumentException('CashRegister::_action_multiply | Expecting 2 arguments');
        }

        return (is_numeric($params[0]) ? $params[0] : $this->{$params[0]}) *
            (is_numeric($params[1]) ? $params[1] : $this->{$params[1]});
    }
}
