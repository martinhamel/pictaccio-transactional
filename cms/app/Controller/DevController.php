<?php
/*
 * HeO2 - Proprietary RAD Web Framework
 * Copyright © 2015-2019, Heliox - All Right Reserved
 */

if (Configure::read('debug') !== 0) {

    class DevController extends AppController {
        public function index() {
            die('null');
        }

        public function testGet($val1, $val2) {
            if (!$this->request->is('get')) {
                throw new BadRequestException('Expecting GET request');
            }

            $this->_sendJsonHeaders();
            $this->_renderJson([
                'val1' => $val1,
                'val2' => $val2
            ]);
        }

        public function testPost() {
            if (!$this->request->is('post')) {
                throw new BadRequestException('Expecting POST request');
            }
            $this->_sendJsonHeaders();
            $this->_renderJson([
                'val1' => $this->request->data['val1'],
                'val2' => $this->request->data['val2']
            ]);
        }

        public function testError403() {
            $this->_sendJsonHeaders();
            throw new ForbiddenException('Testing 403');
        }

        public function testError404() {
            $this->_sendJsonHeaders();
            throw new NotFoundException('Testing 404');
        }

        public function testError500() {
            $this->_sendJsonHeaders();
            throw new InternalErrorException('Testing 500');
        }
    }
}
