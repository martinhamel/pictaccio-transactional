<?php
/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2015-2019, Heliox - All Right Reserved
 */

class ProductBuildYourOwn extends AppModel {
    public $actsAs = ['Locale'];
    public $validate = [
        'id' => 'blank',
        'internal_name' => array('isunique')
    ];

    public function listInternalNames() {
        $rows = $this->find('all');

        return array_map(function($row) {
            return [
                'id' => $row['ProductBuildYourOwn']['id'],
                'text' => $row['ProductBuildYourOwn']['internal_name']
            ];
        }, $rows);
    }
}