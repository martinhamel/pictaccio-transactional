<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::uses('CakeEmail', 'Network' . DS . 'Email');
App::uses('Payment', 'Lib' . DS . 'Payment');

class NotifyMailer implements ChronicJobInterface {
    public function execute() {
        return null;
    }

    public function onOrderComplete($event) {
        $lang = CakeSession::read('Config.language');
        $defaultLang = Configure::read('Config.default');
        $orderId = $event->data['order_id'];
        $Subject = ClassRegistry::init('Subject');
        $subjects = array_reduce(array_keys($event->data['order']['subjectCode']),
            function($subjects, $code) use($Subject) {
                $subjects[] = $Subject->findByCode($code);
                return $subjects;
            }, []);

        CakeSession::write('Config.language', $defaultLang);

        try {
            $email = new CakeEmail('notify');
            $email->subject("Notification de commande PhotoSF [#{$orderId}]");
            $email->viewVars([
                'receipt' => CakeSession::read('Order.receipt'),
                'contact' => CakeSession::read('Order.contact'),
                'selection' => CakeSession::read('Order.selection'),
                'orderId' => $orderId,
                'childrenInfo' => array_reduce($subjects, function ($childrenInfo, $subject) {
                        $childrenInfo[] = $subject['Subject']['info'];
                        return $childrenInfo;
                    }, [])
            ]);
            $email->to(Configure::read('Notify.addresses'));
            $email->send();
            CakeSession::write('Order.emailed', true);
        } catch (Exception $e) {
            HeO2Log::error('NotifyMailer | Failed to send notify email. ' . $e->getMessage());
        }

        CakeSession::write('Config.language', $lang);
    }
}
