<?php

App::uses('CakeEmail', 'Network/Email');

class AdminMailer {
    public static function send($message) {
        $lang = CakeSession::read('Config.language');
        $defaultLang = Configure::read('Config.default');

        CakeSession::write('Config.language', $defaultLang);

        try {
            $email = new CakeEmail('incident');
            $email->subject('AdminMailer Incident Report')
                ->viewVars([
                    'message' => $message,
                    'name' => CakeSession::read('Order.contact.first-name'),
                    'phone' => CakeSession::read('Order.contact.phone'),
                    'email' => CakeSession::read('Order.contact.email')
                ])
                ->to(Configure::read('Admin.emails'))
                ->send();
        } catch (Exception $e) {
            HeO2Log::error('AdminMailer | Failed to send. ' . $e->getMessage());
        }

        CakeSession::write('Config.language', $lang);
    }
}
