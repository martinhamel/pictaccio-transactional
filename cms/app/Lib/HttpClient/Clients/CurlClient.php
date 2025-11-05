<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

class CurlClient implements HttpClientInterface {
    private $_caps = [
        'addPostFile' => false,

        'methodConnect' => false,
        'methodDelete' => false,
        'methodGet' => true,
        'methodHead' => false,
        'methodOptions' => false,
        'methodPost' => true,
        'methodPut' => true,
        'methodTrace' => false,

        'getBody' => true,
        'getHeaders' => true,
        'setHeaders' => true,

        'https' => true,
        'setVerifyHost' => true,
        'setVerifyPeer' => true,
        'setCA' => true,
        'authBasic' => true,
    ];
    private $_curlHandle = null;
    private $_readyToExec = false;
    private $_response = null;

    public function __construct() {
        $this->_curlHandle = curl_init();
        curl_setopt($this->_curlHandle, CURLOPT_RETURNTRANSFER, true);
        //curl_setopt($this->_curlHandle, CURLOPT_HEADER, 1);
    }

    public function getCaps() {
        return $this->_caps;
    }

    public function isAvailable() {
        return function_exists('curl_version');
    }

    public function open(array $options) {
        $this->_readyToExec = $this->_setCurl($options);
    }

    public function addPostFile() {
        // TODO: Implement addPostFile() method.
    }

    public function send(array $options = null) {
        if (!empty($options)) {
            $this->open($options);
        }

        if ($this->_readyToExec) {
            $this->_response = curl_exec($this->_curlHandle);
        } else{
            throw new ErrorException('CurlClient: Aborted execution, curl improperly configured. Check your params.');
        }
    }

    public function getResponse() {
        return [
            'header' => null,
            'body' => $this->_response
        ];
    }

    /* SET METHODS */
    private function _set_auth($params) {
        if (empty($params['method'])) {
            CakeLog::write('debug', 'CurlClient: Auth missing method param');
            return false;
        }
        if (empty($params['username']) || empty($params['password'])) {
            CakeLog::write('debug', 'CurlClient: Missing username and/or password');
            return false;
        }

        $auth = null;
        switch ($params['method']) {
        case 'basic':
            $auth = CURLAUTH_BASIC;
            break;

        default:
            CakeLog::write('debug', 'CurlClient: Unsupported auth method');
        }

        curl_setopt($this->_curlHandle, CURLOPT_HTTPAUTH, true);
        curl_setopt($this->_curlHandle, CURLOPT_USERPWD, $params['username'] . ':' . $params['password']);

        return true;
    }

    private function _set_caInfo($certificatePath) {
        curl_setopt($this->_curlHandle, CURLOPT_CAINFO, $certificatePath);
        return true;
    }

    private function _set_fields($fields) {
        if (is_array($fields)) {
            $fields = http_build_query($fields);
        }

        curl_setopt($this->_curlHandle, CURLOPT_POSTFIELDS, $fields);
        return true;
    }

    private function _set_headers($headers) {
        $curlHeaders = [];

        if (is_array($headers)) {
            foreach ($headers as $field => $value) {
                $curlHeaders[] = $field . ': ' . $value;
            }
        } else{
            $curlHeaders[] = $headers;
        }

        curl_setopt($this->_curlHandle, CURLOPT_HTTPHEADER, $curlHeaders);
        return true;
    }

    private function _set_method($method) {
        $curlOption = null;

        switch ($method) {
        case 'get':
            $curlOption = CURLOPT_HTTPGET;
            break;

        case 'post':
            $curlOption = CURLOPT_POST;
            break;

        case 'put':
            $curl = CURLOPT_PUT;
            break;

        default:
            CakeLog::write('debug', 'CurlClient: Unsupported HTTP method: ' . $method);
            return false;

        }

        curl_setopt($this->_curlHandle, $curlOption, true);

        return true;
    }

    private function _set_sslVerifyHost($value) {
        curl_setopt($this->_curlHandle, CURLOPT_SSL_VERIFYHOST, 0); //$value);
        return true;
    }

    private function _set_sslVerifyPeer($value) {
        curl_setopt($this->_curlHandle, CURLOPT_SSL_VERIFYPEER, 0); //$value);
        return true;
    }

    private function _set_url($url) {
        curl_setopt($this->_curlHandle, CURLOPT_URL, $url);
        return true;
    }

    /* PRIVATE */
    private function _setCurl($options) {
        $success = true;

        foreach ($options as $option => $value) {
            $setMethod = '_set_' . $option;

            if (method_exists($this, $setMethod)) {
                $success &= $this->{$setMethod}($value);
            }
        }

        return $success;
    }
}
