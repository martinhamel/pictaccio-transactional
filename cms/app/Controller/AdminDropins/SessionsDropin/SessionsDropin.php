<?php
/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2015-2019, Heliox - All Right Reserved
 */

class SessionsDropin extends AdminDropin {
    public function index() {
        $this->_loadModel('Session');
        $this->_loadModel('Category');
        $this->_loadModel('ProductGroup');
        $this->_loadModel('DeliveryOptionGroup');
        $this->_loadModel('ProductCrossSell');
        $this->_set('categoriesArray', $this->Category->find('all'));
        $this->_set('sessions', json_encode($this->Session->find('all')));
        $this->_set('productGroupsArray', $this->ProductGroup->find('all'));
        $this->_set('deliveryOptionGroupsArray', $this->DeliveryOptionGroup->find('all'));
        $this->_set('productCrossSellArray', $this->ProductCrossSell->find('all'));
    }

    public function add() {
        $this->_loadModel('Session');

        $prepareApplyJson = $this->_prepareApplyJson();

        if ($this->_request->data['color'][0] === '#') {
            $this->_request->data['color'] = substr($this->_request->data['color'], 1);
        }

        if (!$this->Session->save([
            'category_id' => $this->_request->data['categories'],
            'name_locale_json' => json_encode([
                'eng' => $this->_request->data['name-eng'],
                'fra' => $this->_request->data['name-fra']
            ]),
            'date' => $this->_request->data['date'],
            'expiration_date' => $this->_request->data['expiration-date'],
            'apply_json' => json_encode([
                'productGroups' => $prepareApplyJson['productGroups'],
                'deliveryOptionGroups' => $prepareApplyJson['deliveryOption'],
                'color' => $this->_request->data['color'],
                'crossSell' => $this->_request->data['cross-sell'],
                'allowDigitalGroupPictures' => $this->_request->data['allow-digital-group-picture']
            ])])) {
            $this->_host->throwBadRequest();
        }

        $this->_host->renderJson(['id' => $this->Session->id]);
    }

    public function edit() {
        $this->_loadModel('Session');

        $prepareApplyJson = $this->_prepareApplyJson();

        if ($this->_request->data['color'][0] === '#') {
            $this->_request->data['color'] = substr($this->_request->data['color'], 1);
        }

        if (is_numeric($this->_request->data['id']) &&
            $this->Session->exists($this->_request->data['id'])) {
            $this->Session->id = $this->_request->data['id'];
            if (!$this->Session->save([
                'name_locale_json' => json_encode([
                    'eng' => $this->_request->data['name-eng'],
                    'fra' => $this->_request->data['name-fra']
                ]),
                'date' => $this->_request->data['date'],
                'expiration_date' => $this->_request->data['expiration-date'],
                'apply_json' => json_encode([
                    'productGroups' => $prepareApplyJson['productGroups'],
                    'deliveryOptionGroups' => $prepareApplyJson['deliveryOption'],
                    'color' => $this->_request->data['color'],
                    'crossSell' => $this->_request->data['cross-sell'],
                    'allowDigitalGroupPictures' => $this->_request->data['allow-digital-group-picture']
                ])])) {
                $this->_host->throwBadRequest();
            }
        } else{
            $this->_host->throwNotFound();
        }

        $this->_host->silence();
    }

    public function remove() {
        $this->_loadModel('Session');

        /*if (	is_numeric($this->_request->data['id']) &&
                $this->Session->exists($this->_request->data['id'])) {
            $this->Session->delete($this->_request->data['id']);
        } else {
            $this->_host->throwNotFound();
        }*/

        $this->_host->silence();
    }


    /* PRIVATE */
    private function _prepareApplyJson() {
        return [
            'productGroups' => array_reduce(array_chunk($this->_request->data['product-groups'], 1, true), function($productGroups, $item) {
                if (current($item)['state'] === 'true') {
                    $productGroups[] = key($item);
                }
                return $productGroups;
            }, []),

            'deliveryOption' => array_reduce(array_chunk($this->_request->data['delivery-option-groups'], 1, true), function($deliveryOption, $item) {
                if (current($item)['state'] === 'true') {
                    $deliveryOption[] = key($item);
                }
                return $deliveryOption;
            }, [])
        ];
    }
}
