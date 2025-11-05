<?php

App::uses('AppComponent', 'Controller' . DS . 'Component');

class CartPersistComponent extends AppComponent {
    public function persistOrder() {
        $this->_controller->loadModel('Order');
        $id = $this->_controller->Order->saveOverviewStage(
            CakeSession::read('Order.session_id'),
            CakeSession::read('Tracking.id'),
            CakeSession::read('Order.selection'),
            CakeSession::read('Order.receipt'),
            CakeSession::read('Order.comment'),
            CakeSession::read('Order.order_id')
        );
        CakeSession::write('Order.order_id', $id);
    }
}
