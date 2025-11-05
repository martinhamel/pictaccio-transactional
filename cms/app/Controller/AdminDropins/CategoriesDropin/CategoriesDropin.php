<?php
/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2015-2019, Heliox - All Right Reserved
 */

class CategoriesDropin extends AdminDropin {
    public function index() {
        $this->_loadModel('Category');
        $this->_loadModel('ProductGroup');
        $this->_loadModel('DeliveryOptionGroup');
        $this->_set('categories', json_encode($this->Category->find('all')));
        $this->_set('productGroupsArray', $this->ProductGroup->find('all'));
        $this->_set('deliveryOptionGroupsArray', $this->DeliveryOptionGroup->find('all'));
    }

    public function add() {
        $this->_loadModel('Category');

        if (!$this->Category->save([
            'name_locale_json' => json_encode([
                'eng' => $this->_request->data['eng'],
                'fra' => $this->_request->data['fra']
            ]),
            'apply_json' => json_encode([
                'productGroups' => $this->_request->data['product-groups'],
                'deliveryOptionGroups' => $this->_request->data['delivery-option-groups']
            ])
        ])) {
            $this->_host->throwBadRequest();
        }

        $this->_host->renderJson(['id' => $this->Category->id]);
    }

    public function edit() {
        $this->_loadModel('Category');

        if (is_numeric($this->_request->data['id']) &&
            $this->Category->exists($this->_request->data['id'])) {
            $this->Category->id = $this->_request->data['id'];
            if (!$this->Category->save([
                'name_locale_json' => json_encode([
                    'eng' => $this->_request->data['eng'],
                    'fra' => $this->_request->data['fra']
                ]),
                'apply_json' => json_encode([
                    'productGroups' => $this->_request->data['product-groups'],
                    'deliveryOptionGroups' => $this->_request->data['delivery-option-groups']
                ])
            ])) {
                $this->_host->throwBadRequest();
            }
        } else{
            $this->_host->throwNotFound();
        }

        $this->_host->silence();
    }

    public function remove() {
        $this->_loadModel('Category');

        if (is_numeric($this->_request->data['id']) &&
            $this->Category->exists($this->_request->data['id'])) {
            $this->Category->delete($this->_request->data['id']);
        } else{
            $this->_host->throwNotFound();
        }

        $this->_host->silence();
    }

}
