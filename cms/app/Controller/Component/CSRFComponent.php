<?php
/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2015-2019, Heliox - All Right Reserved
 */

App::uses('AppComponent', 'Controller' . DS . 'Component');

class CSRFComponent extends AppComponent {
    public function get() {
        return CakeSession::read('Config.csrf');
    }

    public function refresh() {
        if (!CakeSession::check('Config.csrf')) {
            CakeSession::write('Config.csrf', $this->_generateToken());
        }
    }

    public function protect($token) {
//        if (is_array($token) && !empty($token['heo2-csrf-token'])) {
//            $token = $token['heo2-csrf-token'];
//        }
//
//        $sessionToken = CakeSession::read('Config.csrf');
//        if ($sessionToken === '') {
//            throw new FatalErrorException('No CSRF token in session');
//        }
//        if ($sessionToken !== $token) {
//            throw new FatalErrorException('CSRF token mismatch');
//        }
    }


    /* PRIVATE */
    private function _generateToken() {
        return preg_replace('/[=+\/]/', '', base64_encode(openssl_random_pseudo_bytes(42)));
    }
}
