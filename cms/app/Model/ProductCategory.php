<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

class ProductCategory extends AppModel {
    public $actsAs = ['Locale', 'Containable'];

    public $validate = [
        'id' => 'blank',
        'internal_name' => array('alphanumeric', 'isunique')
    ];

    public function listInternalNames() {
        $rows = $this->find('all');

        return array_map(function($row) {
                return [
                    'id' => $row['ProductCategory']['id'],
                    'text' => $row['ProductCategory']['internal_name']
                ];
            }, $rows);
    }
}
