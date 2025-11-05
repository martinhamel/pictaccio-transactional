<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

class ProductThemeSet extends AppModel {
    public $validate = [
        'id' => 'blank',
    ];

    public function findIds($ids) {
        return $this->find('all', [
            'conditions' => ['id' => $ids]
        ]);
    }
}
