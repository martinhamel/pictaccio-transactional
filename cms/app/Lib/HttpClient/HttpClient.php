<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

require 'config.php';
require 'HttpClientInterface.php';

class HttpClient {
    private static $_httpClient = null;

    public static function create() {
        if (empty(self::$_httpClient)) {
            self::_loadClient();
        }

        return self::$_httpClient;
    }

    public static function release() {
        self::$_httpClient = null;
    }

    /* PRIVATE */
    private static function _loadClient() {
        foreach (HTTP_CLIENT_CONFIG::$config['fallback'] as $httpClient) {
            require_once APP . DS . 'Lib' . DS . 'HttpClient' . DS . 'Clients' . DS . $httpClient . '.php';

            $httpClientObject = new $httpClient();
            if ($httpClientObject->isAvailable()) {
                self::$_httpClient = $httpClientObject;
                return true;
            }

            unset($httpClientObject);
        }

        return false;
    }
}
