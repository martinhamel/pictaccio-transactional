<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

class FileGetContentClient implements HttpClientInterface {
    private $_caps = [
        'addPostFile' => false,

        'methodConnect' => false,
        'methodDelete' => false,
        'methodGet' => true,
        'methodHead' => false,
        'methodOptions' => false,
        'methodPost' => false,
        'methodPut' => false,
        'methodTrace' => false,

        'getBody' => true,
        'getHeaders' => false,
        'setHeaders' => false,
    ];
    private $_options = [
        'url' => ''
    ];
    private $_response = [];

    public function getCaps() {
        return $this->_caps;
    }

    public function isAvailable() {
        return true;
    }

    public function open(array $options) {
        $this->_options = $options;
        return true;
    }

    public function addPostFile() {
        return false;
    }

    public function send(array $options = null) {
        $options = empty($options) ? $this->_options : $options;

        $this->_response['body'] = file_get_contents($options['url']);
    }

    public function getResponse() {
        return $this->_response;
    }
}
