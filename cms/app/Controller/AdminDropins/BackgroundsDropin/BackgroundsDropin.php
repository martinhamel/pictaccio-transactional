<?php
/*
* HeO2 - Proprietary RAD Web Framework
* Copyright © 2015-2019, Heliox - All Right Reserved
*/

App::uses('Event', 'Lib');
App::uses('DbTable', 'Lib');

class BackgroundsDropin extends AdminDropin {
    public function index() {
        $this->_loadModel('Background');
        $this->_loadModel('BackgroundCategory');
        $this->_set('backgroundCategoriesTable', json_encode($this->BackgroundCategory->findDbTable('all')));
        $this->_set('backgroundTable', json_encode($this->Background->findDbTable('all')));
    }

    public function background_dbTable() {
        if ($this->_request->is('post')) {
            $this->_loadModel('Background');
            $dbTable = new DbTable($this->Background);
            $results = $dbTable->process($this->_request->data);

            $this->_host->renderJson(['status' => empty($results) ? 'failed' : 'ok', 'results' => $results]);
        } else{
            throw new BadRequestException();
        }
    }

    public function backgroundCategory_dbTable() {
        if ($this->_request->is('post')) {
            $this->_loadModel('BackgroundCategory');
            $dbTable = new DbTable($this->BackgroundCategory);
            $results = $dbTable->process($this->_request->data);

            $this->_host->renderJson(['status' => empty($results) ? 'failed' : 'ok', 'results' => $results]);
        } else{
            throw new BadRequestException();
        }
    }

    public function update() {
        $this->_host->silence();
        Event::emit('Backgrounds.update');
    }

    public function updateFeaturedStatus() {
        $this->_host->checkPost(['id', 'featured']);
        $this->_loadModel('Background');
        $this->Background->updateFeaturedStatus($this->_request->data['id'], $this->_request->data['featured']);
        $this->_host->renderJson(['status' => 'ok']);
    }
}
