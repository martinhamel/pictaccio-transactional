<?php
/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2015-2019, Heliox - All Right Reserved
 */

class ProductGroup extends AppModel {
    public $actsAs = ['Locale'];
    public $validate = [
        'id' => 'blank',
        //'slug' => array('alphanumeric', 'isunique')//,
        //'weight' => array('custom', '/[0-9a-z\. ]*/i')
    ];

    public function findProductsById($id) {
        $row = $this->findId($id);
        if (empty($row)) {
            return null;
        }

        return $row['ProductGroup']['products_json'];
    }
}
