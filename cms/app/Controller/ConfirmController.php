<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

class ConfirmController extends AppController {
    public function beforeFilter() {
        parent::beforeFilter();
        if (CakeSession::check('Order.cleared')) {
            $this->redirect(Configure::read('URL.root'));
        }
    }

    public function afterFilter() {
        parent::afterFilter();
        if (CakeSession::check('Order.processed') && CakeSession::check('Order.emailed')) {
            CakeSession::delete('Order');
            CakeSession::write('Order.cleared', true);
        }
    }

    public function index() {
        //$this->_checkSession(array('Order.shipping', 'Order.contact'));
        $this->loadModel('DeliveryOption');

        $this->set('deliveryOption', $this->DeliveryOption->findById(CakeSession::read('Order.shipping_id')));
        $this->render($this->_loadComponent('LocalizedView')->getMostAppropriateView());
    }

    public function fail() {
        $this->render($this->_loadComponent('LocalizedView')->getMostAppropriateView());
    }
}
