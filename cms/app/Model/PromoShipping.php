<?php
/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2015-2019, Heliox - All Right Reserved
 */

App::uses('CakeSession', 'Model/Datasource');

class PromoShipping extends AppModel {
    public $useTable = 'promo_shipping';
    public $primaryKey = 'id';
    public $validate = [
        'id' => 'blank'
    ];

    private $_config;

    public function config() {
        $this->_load();
        return $this->_config;
    }

    public function enabled($value = null) {
        $this->_load();
        if ($value !== null) {
            $this->_config['enabled'] = $value === true;
            $this->_save();
        }

        return $this->_config['enabled'];
    }

    public function threshold($value = null) {
        $this->_load();
        if ($value !== null) {
            $this->_config['threshold'] = $value;
            $this->_save();
        }

        return $this->_config['threshold'];
    }


    /* PRIVATE */
    private function _load() {
        $this->_config =
            $this->find('first', ['conditions' => ['PromoShipping.id' => 1]])['PromoShipping']['options_json'];
    }

    private function _save() {
        $this->id = 1;
        $this->save([
            'options_json' => json_encode($this->_config)
        ]);
    }
}
