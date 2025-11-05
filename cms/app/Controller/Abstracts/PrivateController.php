<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::uses('AppController', 'Controller');

class PrivateController extends AppController {
    public function beforeFilter() {
        parent::beforeFilter();

        $this->User->requestPermission('admin-access');
    }
}
