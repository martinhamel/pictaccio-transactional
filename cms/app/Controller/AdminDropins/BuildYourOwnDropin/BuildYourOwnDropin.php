<?php
/*
* HeO2 - Proprietary RAD Web Framework
* Copyright © 2015-2019, Heliox - All Right Reserved
*/

App::uses('Event', 'Lib');
App::uses('DbTable', 'Lib');

class BuildYourOwnDropin extends AdminDropin {
    public function index() {
        $this->_loadModel('ProductBuildYourOwn');
        $this->_set('buildYourOwnTable', json_encode($this->ProductBuildYourOwn->findDbTable('all')));
    }

    public function buildYourOwn_dbTable() {
        if ($this->_request->is('post')) {
            $this->_loadModel('ProductBuildYourOwn');
            $dbTable = new DbTable($this->ProductBuildYourOwn);
            $results = $dbTable->process($this->_request->data);

            $this->_host->renderJson(['status' => empty($results) ? 'failed' : 'ok', 'results' => $results]);
        } else{
            throw new BadRequestException();
        }
    }
}
