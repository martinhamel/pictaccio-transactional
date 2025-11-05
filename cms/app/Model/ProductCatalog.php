<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

class ProductCatalog extends AppModel {
    public $actsAs = ['Locale', 'Containable'];
    public $hasAndBelongsToMany = [
        'Product' => [
            'className' => 'Product',
            'joinTable' => 'product_catalogs_products_map',
            'foreignKey' => 'product_catalog_id',
            'associationForeignKey' => 'product_id'
        ]
    ];
    public $validate = [
        'id' => 'blank',
        //'slug' => array('alphanumeric', 'isunique')//,
        //'weight' => array('custom', '/[0-9a-z\. ]*/i')
    ];

    public function findProducts($id) {
        $row = $this->findId($id);
        if (empty($row)) {
            return null;
        }

        return array_map(function($product) { return $product['id']; }, $row['Product']);
    }

    public function findProductsById($id) {
        $row = $this->findId($id);
        if (empty($row)) {
            return null;
        }

        return array_map(function($product) { return $product['id']; }, $row['Product']);
    }
}
