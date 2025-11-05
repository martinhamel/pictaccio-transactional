<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::uses('AppComponent', 'Controller' . DS . 'Component');

class AccessComponent extends AppComponent {
    public $components = ['Acl', 'Auth'];
    private $user;

    function initialize(Controller $controller) {
        parent::initialize($controller);

        $this->user = $this->Auth->user();
    }

    function check($aco, $action = '*') {
        return !empty($this->user) && $this->Acl->check('User::' . $this->user['user_email'], $aco, $action);
    }

}

