<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

class UserHelper extends AppHelper {
    public function isAuthenticated() {
        return CakeSession::check('Auth');
    }

    public function name() {
        if (CakeSession::check('Auth.userData.info_json')) {
            return CakeSession::read('Auth.userData.info_json')['name'];
        }

        return "(null)";
    }

    public function peekPermission($targetPermission) {
        $Permission = ClassRegistry::init('Right');

        if ($this->isAuthenticated()) {
            return $Permission->peekPermission(CakeSession::read('Auth.userData.id'), $targetPermission);
        }

        return false;
    }
}
