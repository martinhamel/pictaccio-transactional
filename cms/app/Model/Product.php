<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

class Product extends AppModel {
    public $actsAs = ['Locale', 'Containable'];
    public $hasAndBelongsToMany = [
        'ProductCatalog' => [
            'className' => 'ProductCatalog',
            'joinTable' => 'product_catalogs_products_map',
            'foreignKey' => 'product_id',
            'associationForeignKey' => 'product_catalog_id'
        ]
    ];
    public $belongsTo = [
        'ProductTypeTheme' => [
            'className' => 'ProductTypeTheme',
            'foreignKey' => 'theme_id'
        ],
        'ProductTypeCustom' => [
            'className' => 'ProductTypeCustom',
            'foreignKey' => 'custom_id'
        ],
        'ProductCategory' => [
            'className' => 'ProductCategory',
            'foreignKey' => 'category_id'
        ]
    ];
    public $validate = [
        'id' => 'blank'
    ];
    public $fileUploads = [
        'images' => [
            'allow' => true,
            'mime' => 'image/*'
        ]
    ];

    public function getOrganizedByIds() {
        $rows = $this->find('all', [
            'contain' => [
                'ProductCatalog',
                'ProductCategory',
                'ProductTypeTheme',
                'ProductTypeCustom'
            ]
        ]);
        $rowsByIds = [];

        foreach($rows as $row) {
            $rowsByIds[$row['Product']['id']] = $row['Product'];
        }

        return $rowsByIds;
    }

    public function findByIdOrSlug($idOrSlug, $findImages = false) {
        return $this->find('first', [
            'conditions' => [(is_numeric($idOrSlug) ? 'Product.id' : 'Product.slug') => $idOrSlug],
            'recursive' => $findImages ? 2 : 1
        ]);
    }

    public function findIds($ids) {
        return $this->find('all', [
            'conditions' => ['Product.id' => $ids],
            'contain' => [
                'ProductCatalog',
                'ProductCategory',
                'ProductTypeTheme',
                'ProductTypeCustom'
            ]
        ]);
    }
}
