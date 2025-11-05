<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::uses('Payment', 'Lib' . DS . 'Payment');

class PayController extends AppController {
    public function hook($module, $method) {
        $payment = new Payment();

        $payment->callback($module, $method, $this->request->query);

        $this->autoRender = false;
    }
}
