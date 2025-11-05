<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::uses('CakeSession', 'Model/Datasource');

class StoreConfig extends AppModel {
    public $useDbConfig = 'public';
    public $useTable = 'store_config';
    public $primaryKey = 'key';
    public $validate = [
        'id' => 'blank'
    ];

    private $_config = [];

    public function configFreeShipping() {
        $this->_loadFreeShipping();
        return $this->_config['promo-free-shipping'];
    }


    /* PRIVATE */
    private function _loadFreeShipping() {
        $promoShipping = $this->find('first', ['conditions' => ['StoreConfig.key' => 'promo-free-shipping']]);
        $this->_config['promo-free-shipping'] = count($promoShipping) > 0
            ? json_decode($promoShipping['StoreConfig']['value'], true)
            : [
                'enabled' => false,
                'threshold' => 0
            ];
    }
}
