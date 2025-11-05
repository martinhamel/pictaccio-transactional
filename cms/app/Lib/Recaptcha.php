<?php
/*
 * Copyright © 2014-2016, Heliox - All Right Reserved
 */

App::uses('HttpClient', 'Lib' . DS . 'HttpClient');

class Recaptcha {
    const _ENDPOINT = 'https://www.google.com/recaptcha/api/siteverify';

    public static function check($recaptchaResponse) {
        $http = HttpClient::create();

        $http->send([
            'method' => 'post',
            'url' => self::_ENDPOINT,
            'sslVerifyPeer' => false,
            'sslVerifyHost' => false,
            'fields' => [
                'secret' => Configure::read('reCaptcha.secret'),
                'response' => $recaptchaResponse,
                'remoteip' => Configure::read('debug') === 0 ? $_SERVER['REMOTE_ADDR'] : Configure::read('reCaptcha.debug_ip')
            ]
        ]);

        $response = json_decode($http->getResponse()['body'], true);
        return !empty($response) && $response['success'];
    }
}
