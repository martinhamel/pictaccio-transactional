<?php
/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2015-2019, Heliox - All Right Reserved
 */

class DeliveryOptionGroupMap extends AppModel {
    public $useTable = 'delivery_option_group_map';
    public $actsAs = ['Locale'];
    public $belongsTo = ['DeliveryOption', 'DeliveryOptionGroup'];

    public function findByGroup($groupId) {
        if (!is_numeric($groupId)) {
            throw new InvalidArgumentException("Non numerical id: {$groupId}");
        }
        return $this->find('all', [
            'conditions' => ['DeliveryOptionGroup.id' => $groupId]
        ]);
    }
}
