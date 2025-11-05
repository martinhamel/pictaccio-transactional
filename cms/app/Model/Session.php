<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

class Session extends AppModel {
    public $actsAs = ['Locale', 'Containable'];
    public $hasAndBelongsToMany = [
        'ProductCatalog' => [
            'className' => 'ProductCatalog',
            'joinTable' => 'sessions_product_catalogs_map',
            'foreignKey' => 'session_id',
            'associationForeignKey' => 'product_catalog_id'
        ],
        'DeliveryOptionGroup' => [
            'className' => 'DeliveryOptionGroup',
            'joinTable' => 'sessions_delivery_option_groups_map',
            'foreignKey' => 'session_id',
            'associationForeignKey' => 'delivery_option_group_id'
        ],
        'PromoCodeCampaign' => [
            'className' => 'PromoCodeCampaign',
            'joinTable' => 'promo_code_campaigns_sessions_map',
            'foreignKey' => 'session_id',
            'associationForeignKey' => 'promo_code_campaign_id'
        ]
    ];
    public $belongsTo = [
        'ProductCrosssell' => [
            'className' => 'ProductCrosssell',
            'foreignKey' => 'product_crosssell_id'
        ]
    ];
    public $validate = [
        'id' => 'blank'
    ];

    public function findById($id, $withExpired = true) {
        if (!is_numeric($id)) {
            throw new InvalidArgumentException("Non numerical id: {$id}");
        }
        return $this->find('first', [
            'conditions' => [
                'Session.id' => $id,
                'Session.expire_date >=' => date('Y-m-d'),
                'Session.publish_date <=' => date('Y-m-d'),
                'Session.archived' => false
            ],
            'contain' => [
                'ProductCatalog' => [
                    'Product'
                ],
                'DeliveryOptionGroup' => [
                    'DeliveryOption'
                ],
                'ProductCrosssell'
            ]
        ]);
    }

    public function findDeliveryOptions($id) {
        if (!is_numeric($id)) {
            throw new InvalidArgumentException("Non numerical id: {$id}");
        }
        $session = $this->findById($id);
        if (empty($session) || empty($session['DeliveryOptionGroup'])) {
            throw new ErrorException("No session or session has no delivery options. Session id: ${id}");
        }

        return array_reduce(
            $session['DeliveryOptionGroup'],
            function ($carry, $group) {
                return empty($group)
                    ? $carry
                    : array_merge($carry, $group['DeliveryOption']);
            }, []);
    }

    public function findNonExpired() {
        return $this->find('all', ['conditions' => ['Session.expire_date >=' => date('Y-m-d')]]);
    }

    /* PRIVATE */
}
