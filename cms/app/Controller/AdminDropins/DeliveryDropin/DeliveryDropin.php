<?php
/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2015-2019, Heliox - All Right Reserved
 */

App::uses('DeliveryOptions', 'Lib' . DS . 'DeliveryOptions');

class DeliveryDropin extends AdminDropin {
    public function index() {
        $this->_loadModel('DeliveryOption');
        $this->_loadModel('DeliveryOptionGroup');
        $this->_loadModel('DeliveryOptionGroupMap');

        //$this->DeliveryOptionGroup->unbindModel(['hasMany' => ['DeliveryOptionGroupMap']]);

        $groupRows = $this->DeliveryOptionGroup->find('all');
        $groups = [];
        foreach ($groupRows as $group) {
            $groups[] = [
                'DeliveryOptionGroup' => array_merge(
                    $group['DeliveryOptionGroup'],
                    ['map' => array_map(function($i) {return $i['delivery_option_id'];}, $group['DeliveryOptionGroupMap'])]
                )
            ];
        }

        $this->_set('deliveryOptionsArray', $this->DeliveryOption->find('all'));
        $this->_set('groups', json_encode($groups));
        $this->_set('deliveryOptionProps', json_encode($this->_getDeliveryOptions()));
    }

    public function addDelivery() {
        $this->_loadModel('DeliveryOption');

        $data = [
            'name_locale_json' => json_encode([
                'fra' => $this->_request->data['name-fra'],
                'eng' => $this->_request->data['name-eng']
            ]),
            'leadtime' => $this->_request->data['lead-time'],
            'base_price' => $this->_request->data['base-price'],
            'method' => $this->_request->data['method'],
            'options_json' => json_encode($this->_request->data['delivery-option-properties'])
        ];
        if (!$this->DeliveryOption->save($data)) {
            $this->_host->throwBadRequest();
        }

        $this->_host->renderJson(['id' => $this->DeliveryOption->id]);
    }

    public function addGroup() {
        $this->_loadModel('DeliveryOptionGroup');
        $this->_loadModel('DeliveryOptionGroupMap');

        $data = [
            'name_locale_json' => json_encode([
                'fra' => $this->_request->data['group-name-fra'],
                'eng' => $this->_request->data['group-name-eng']
            ])
        ];
        if (!$this->DeliveryOptionGroup->save($data)) {
            $this->_host->throwBadRequest();
        }

        $deliveryOptionGroupId = $this->DeliveryOptionGroup->id;
        foreach ($this->_request->data['delivery-options'] as $optionId) {
            $this->DeliveryOptionGroupMap->save([
                'delivery_option_group_id' => $deliveryOptionGroupId,
                'delivery_option_id' => $optionId
            ]);
        }

        $this->_host->renderJson(['id' => $deliveryOptionGroupId]);
    }

    public function editDelivery() {
        $this->_loadModel('DeliveryOption');

        if (is_numeric($this->_request->data['id']) &&
            $this->DeliveryOption->exists($this->_request->data['id'])) {
            $this->DeliveryOption->id = $this->_request->data['id'];
            if (!$this->DeliveryOption->save([
                'name_locale_json' => json_encode([
                    'fra' => $this->_request->data['name-fra'],
                    'eng' => $this->_request->data['name-eng']
                ]),
                'leadtime' => $this->_request->data['lead-time'],
                'base_price' => $this->_request->data['base-price'],
                'method' => $this->_request->data['method'],
                'options_json' => json_encode($this->_request->data['delivery-option-properties'])
            ])) {
                $this->_host->throwBadRequest();
            }
        } else{
            $this->_host->throwNotFound();
        }

        $this->_host->silence();
    }

    public function editGroup() {
        $this->_loadModel('DeliveryOptionGroup');
        $this->_loadModel('DeliveryOptionGroupMap');

        $this->DeliveryOptionGroupMap->unbindModel(['belongsTo' => ['DeliveryOptionGroup', 'DeliveryOption']]);

        if (is_numeric($this->_request->data['id']) &&
            $this->DeliveryOptionGroup->exists($this->_request->data['id'])) {
            $this->DeliveryOptionGroup->id = $this->_request->data['id'];
            if (!$this->DeliveryOptionGroup->save([
                'name_locale_json' => json_encode([
                    'fra' => $this->_request->data['group-name-fra'],
                    'eng' => $this->_request->data['group-name-eng']
                ])
            ])) {
                $this->_host->throwBadRequest();
            }

            $this->DeliveryOptionGroupMap->deleteAll(
                ['DeliveryOptionGroupMap.delivery_option_group_id' => $this->_request->data['id']], false
            );

            foreach ($this->_request->data['delivery-options'] as $optionId) {
                $this->DeliveryOptionGroupMap->save([
                    'delivery_option_group_id' => $this->_request->data['id'],
                    'delivery_option_id' => $optionId
                ]);
            }
        } else {
            $this->_host->throwNotFound();
        }

        $this->_host->silence();
    }

    public function removeDelivery() {
        $this->_loadModel('DeliveryOption');

        if (is_numeric($this->_request->data['id']) &&
            $this->DeliveryOption->exists($this->_request->data['id'])) {
            $this->DeliveryOption->delete($this->_request->data['id']);
        } else{
            $this->_host->throwNotFound();
        }

        $this->_host->silence();
    }

    public function removeGroup() {
        $this->_loadModel('DeliveryOptionGroup');
        $this->_loadModel('DeliveryOptionGroupMap');

        if (is_numeric($this->_request->data['id']) &&
            $this->DeliveryOptionGroup->exists($this->_request->data['id'])) {
            $this->DeliveryOptionGroup->delete($this->_request->data['id']);
            //$this->DeliveryOptionGroupMap->deleteAll(array('DeliveryOptionGroupMap.delivery_option_id' => $this->_request->data['id']));
        } else{
            $this->_host->throwNotFound();
        }

        $this->_host->silence();
    }


    /* PRIVATE */
    private function _getDeliveryOptions() {
        $sources = DeliveryOptions::enum();
        $options = [];
        foreach ($sources as $source) {
            $deliveryOption = DeliveryOptions::create($source);
            $options[$deliveryOption::friendlyId()] = $deliveryOption->enumProperties();
        }

        return $options;
    }
}
