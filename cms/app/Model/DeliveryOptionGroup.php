<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

class DeliveryOptionGroup extends AppModel {
    public $actsAs = ['Locale', 'Containable'];
    public $hasAndBelongsToMany = [
        'DeliveryOption' => [
            'className' => 'DeliveryOption',
            'with' => 'DeliveryOptionGroupsMap',
            'joinTable' => 'delivery_option_groups_delivery_options_map',
            'foreignKey' => 'delivery_option_group_id',
            'associationForeignKey' => 'delivery_option_id'
        ]
    ];
    public $validate = [
        'id' => 'blank'
    ];
}
