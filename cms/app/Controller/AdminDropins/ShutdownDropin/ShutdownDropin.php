<?php
/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2015-2019, Heliox - All Right Reserved
 */

App::uses('Path', 'Lib');

class ShutdownDropin extends AdminDropin {
    public function index() {
        $siteState = json_decode(file_get_contents(Configure::read('Paths.siteStateConfig')), true);
        if ($this->_request->is('post')) {
            $siteState['shutdown'] = !empty($this->_request->data['shutdown']);
            $siteState['shutdown-message'] = $this->_request->data['shutdown-message'];
            $siteState['shutdown-allowed-ips'] = explode(' ', $this->_request->data['shutdown-allowed-ips']);
            file_put_contents(Configure::read('Paths.siteStateConfig'), json_encode($siteState));
            header("Refresh: 0");
        }
        $this->_set('siteState', $siteState);
    }
}
