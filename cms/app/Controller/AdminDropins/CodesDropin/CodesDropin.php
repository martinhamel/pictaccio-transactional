<?php
/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2015-2019, Heliox - All Right Reserved
 */

App::uses('UniquePath', 'Lib');
App::uses('TempFiles', 'Lib');
App::uses('Path', 'Lib');

class CodesDropin extends AdminDropin {
    public function index() {
    }

    public function generate() {
        $this->_loadModel('Picture');

        $codes = [];
        $startTime = microtime();
        while (true) {
            $tryCode = substr(str_shuffle($this->_request->query['chars']), 0, $this->_request->query['length']);
            if (!$this->Picture->codeExist($tryCode)) {
                $codes[] = $tryCode;

                if (count($codes) >= $this->_request->query['how-many']) {
                    break;
                }
            }

            if (microtime() - $startTime > 5000) {
                $this->_set('timeout', true);
                break;
            }
        }

        $this->_set('codes', $codes);
    }


    /* PRIVATE */
}
