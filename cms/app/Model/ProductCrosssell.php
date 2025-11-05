<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

class ProductCrosssell extends AppModel {
    public $actsAs = ['Locale'];
    public $validate = [
        'id' => 'blank',
        'internal_name' => array('isunique')
    ];
    public $hasAndBelongsToMany = [
        'Product' => [
            'className' => 'Product',
            'joinTable' => 'product_crosssells_products_map',
            'foreignKey' => 'product_crosssell_id',
            'associationForeignKey' => 'product_id'
        ]
    ];
}
