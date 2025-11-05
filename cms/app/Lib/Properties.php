<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

class Properties {
    private $_template;
    private $_properties = [];

    public static function create($template, $props = null) {
        $obj = new Properties($template);
        if (!empty($props)) {
            if (is_array($props)) {
                $obj->fromArray($props);
            } else if (is_string($props)) {
                $obj->fromJson($props);
            }
        }

        return $obj;
    }

    public function __construct($template) {
        $this->_template = $template;
        $this->_preparePlan();
    }

    public function __get($property) {
        if (empty($this->_properties[$property])) {
            throw new UnknownException("Properties | Unknown property: {$property}");
        }

        if ($this->_properties[$property]['node'] === 'group') {
            return $this->_properties[$property]['properties'];
        }
        return $this->_properties[$property]['value'];
    }

    public function __isset($property) {
        return isset($this->_properties[$property]);
    }

    public function __set($property, $value) {
        if (empty($this->_properties[$property])) {
            throw new UnknownException("Properties | Unknown property: {$property}");
        }
        $this->{'_write_' . $this->_properties[$property]['type']}($property, $value);
    }

    public function fromArray($array) {
        foreach ($array as $name => $prop) {
            if (!isset($prop['type'])) {
                if (!isset($this->_properties[$name])) {
                    $this->_properties[$name] = [
                        'node' => 'group',
                        'properties' => new Properties($prop)
                    ];
                } else if (is_array($prop)) {
                    $this->_properties[$name]['properties']->fromArray($prop);
                }
            }

            if (is_string($prop) || is_numeric($prop)) {
                $this->{$name} = $prop;
            }
            if (!empty($prop['value'])) {
                $this->{$name} = $prop['value'];
            }
        }
    }

    public function fromJson($json) {
        $this->fromArray(json_decode($json, true));
    }

    public function toArray() {
        $obj = [];
        foreach ($this->_properties as $name => $prop) {
            if ($prop['node'] === 'group') {
                $obj[$name] = $prop['properties']->toArray();
            } else{
                $obj[$name] = $prop;
                unset($obj[$name]['node']);
            }
        }

        return $obj;
    }

    public function toJson() {
        $obj = [];
        foreach ($this->_properties as $name => $prop) {
            if ($prop['node'] === 'group') {
                $obj[$name] = $prop['properties']->toArray();
            } else{
                $obj[$name] = $prop;
            }
        }

        return json_encode($obj);
    }


    /* PRIVATE */
    private function _preparePlan() {
        if (!empty($this->_template)) {
            foreach ($this->_template as $name => $templateItem) {
                if (!isset($templateItem['type'])) {
                    $this->_properties[$name] = [
                        'node' => 'group',
                        'properties' => new Properties($templateItem)
                    ];
                } else{
                    $this->_properties[$name] = array_merge(
                        $templateItem,
                        [
                            'node' => 'item',
                            'value' => $this->{'_create_' . $templateItem['type']}($name, $templateItem)
                        ]);
                }
            }
        }
    }


    /* CREATORS */
    private function _create_text($name, $templateItem) {
        return isset($templateItem['value']) ? $templateItem['value'] :
            (isset($templateItem['default']) ? $templateItem['default'] : '');
    }

    private function _create_number($name, $templateItem) {
        $value = isset($templateItem['value']) ? $templateItem['value'] :
            (isset($templateItem['default']) ? $templateItem['default'] : 0);
        $float = floatval($value);
        $int = intval($value);
        // Using coercing operator on purpose here, type isn't going to be the same just want to check if the values are not equal
        $value = ($float && $int != $float) ? $float : $int;
        return $value;
    }

    private function _create_range($name, $templateItem) {
        if (!isset($templateItem['min']) || !isset($templateItem['max'])) {
            throw new MissingAttributeException("Properties | Plan for property '{$name}' is missing attribute 'min' and/or 'max'");
        }
        $value = isset($templateItem['value']) ? $templateItem['value'] : $templateItem['min'];
        if (isset($templateItem['default']) && $templateItem['default'] > $templateItem['min'] && $templateItem['default'] < $templateItem['max']) {
            $value = $templateItem['default'];
        }

        $float = floatval($value);
        $int = intval($value);
        // Using coercing operator on purpose here, type isn't going to be the same just want to check if the values are not equal
        $value = ($float && $int != $float) ? $float : $int;
        return $value;
    }

    private function _create_list($name, $templateItem) {
        if (empty($templateItem['list'])) {
            throw new MissingAttributeException("Properties | Plan for property '{$name}' is missing attribute 'list'");
        }

        $value = $templateItem['list'][0];
        if (isset($templateItem['default']) && in_array($templateItem['default'], $templateItem['list'])) {
            $value = $templateItem['default'];
        }
        if (isset($templateItem['value']) && in_array($templateItem['value'], $templateItem['list'])) {
            $value = $templateItem['value'];
        }

        return $value;
    }

    private function _create_bool($name, $templateItem) {
        return isset($templateItem['default']) ? (bool)$templateItem['default'] : false;
    }


    /* WRITERS */
    private function _write_text($property, $value) {
        $this->_properties[$property]['value'] = $value;
    }

    private function _write_number($property, $value) {
        if ($value === '') {
            $value = 0;
        }
        if (!is_numeric($value)) {
            throw new TypeException("Properties | Cannot coerce '{$value}' to number");
        }
        $float = floatval($value);
        $int = intval($value);
        // Using coercing operator on purpose here, type isn't going to be the same just want to check if the values are not equal
        $this->_properties[$property]['value'] = ($float && $int != $float) ? $float : $int;
    }

    private function _write_range($property, $value) {
        if (!is_numeric($value)) {
            throw new TypeException("Properties | Cannot coerce '{$value}' to number");
        }
        $float = floatval($value);
        $int = intval($value);
        // Using coercing operator on purpose here, type isn't going to be the same just want to check if the values are not equal
        $value = ($float && $int != $float) ? $float : $int;

        if ($value < $this->_properties[$property]['min'] || $value > $this->_properties[$property]['max']) {
            throw new RangeException("Properties | Value '{$property}' is outside min '0' and max '100'");
        }
        $this->_properties[$property]['value'] = $value;
    }

    private function _write_bool($property, $value) {
        $this->_properties[$property]['value'] = (bool)$value;
    }

    private function _write_list($property, $value) {
        if (!in_array($value, $this->_properties[$property]['list'])) {
            throw new RangeException("Properties | Value '{$value}' is out of range");
        }

        $this->_properties[$property]['value'] = $value;
    }
}
