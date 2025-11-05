<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::uses('CakeEmail', 'Network' . DS . 'Email');
App::uses('CashRegister', 'Lib');
App::uses('Payment', 'Lib' . DS . 'Payment');
App::uses('AdminMailer', 'Lib');

class ConfirmMailer implements ChronicJobInterface {
    public function execute() {
        return null;
    }

    public function onOrderComplete($event) {
        try {
            $DeliveryOption = ClassRegistry::init('DeliveryOption');

            $deliveryOption = $DeliveryOption->findById($event->data['shipping_id']);
            $cart = $event->data['order']['cart'];

            $email = new CakeEmail('confirm');
            $email->subject(__d('emails', 'CONFIRM_SUBJECT'));
            $email->viewVars([
                'cart' => $cart,
                'contact' => $event->data['order']['contact'],
                'selection' => $event->data['order']['photoSelection'],
                'cashRegister' => $event->data['cash'],
                'orderId' => $event->data['order_id'],
                'products' => $event->data['products'],
                'deliveryOption' => $deliveryOption
            ]);
            $email->to(CakeSession::read('Order.contact.email'));
            $email->send();
            CakeSession::write('Order.emailed', true);
        } catch (Exception $e) {
            $orderId = CakeSession::read('Order.order_id');
            $contact = CakeSession::read('Order.contact');
            AdminMailer::send("Failed to send confirm mail to {$contact['name']} regarding order {$orderId}. Phone: {$contact['phone']} Email: {$contact['email']}");
            HeO2Log::error('ConfirmMailer | Failed to send confirm email to ' . CakeSession::read('Order.contact.email') . '. ' . $e->getMessage());
        }
    }
}
