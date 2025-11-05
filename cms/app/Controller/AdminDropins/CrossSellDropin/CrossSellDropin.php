<?php
/*
* HeO2 - Proprietary RAD Web Framework
* Copyright © 2015-2019, Heliox - All Right Reserved
*/

App::uses('Event', 'Lib');
App::uses('DbTable', 'Lib');

class CrossSellDropin extends AdminDropin {
    public function index() {
        $this->_loadModel('ProductCrossSell');
        $this->_set('productCrossSellTable', json_encode($this->ProductCrossSell->findDbTable('all')));
    }

    public function productCrossSell_dbTable() {
        if ($this->_request->is('post')) {
            $this->_loadModel('ProductCrossSell');
            $dbTable = new DbTable($this->ProductCrossSell);
            $results = $dbTable->process($this->_request->data);

            $this->_host->renderJson(['status' => empty($results) ? 'failed' : 'ok', 'results' => $results]);
        } else {
            throw new BadRequestException();
        }
    }

    public function listProducts() {
        $this->_loadModel('Product');
        $results = $this->Product->find('all');
        $results = array_map(function ($item) {
            return [
                'id' => $item['Product']['id'],
                'text' => $item['Product']['name_locale']
            ];
        }, $results);

        $this->_host->renderJson(['status' => empty($results) ? 'failed' : 'ok', 'results' => $results]);
    }
}
