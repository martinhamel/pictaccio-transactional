<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

class ProductCustomTemplate extends AppModel {
    public $actsAs = ['Locale'];
    public $validate = [
        'id' => 'blank',
        'internal_name' => array('isunique')
    ];

    public function listInternalNames() {
        $rows = $this->find('all');

        return array_map(function($row) {
            return [
                'id' => $row['ProductCustomTemplate']['id'],
                'text' => $row['ProductCustomTemplate']['internal_name']
            ];
        }, $rows);
    }
}
