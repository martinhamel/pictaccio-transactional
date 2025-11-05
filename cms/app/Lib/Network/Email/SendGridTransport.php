<?php

require_once ROOT . DS . 'lib/vendors/sendgrid/sendgrid-php.php';

App::uses('AbstractTransport', 'Network/Email');

class SendGridTransport extends AbstractTransport {
    public function send(CakeEmail $Email) {
        $sgEmail = new \SendGrid\Mail\Mail();
        foreach ($Email->from() as $address => $name) {
            $sgEmail->setFrom($address, $name);
        }
        $sgEmail->setSubject($Email->subject());
        foreach ($Email->to() as $address => $name) {
            $sgEmail->addTo($address, $name);
        }
        $sgEmail->addContent(
            $Email->emailFormat() === 'html'
                ? 'text/html'
                : 'text/plain',
            join($Email->message(), '')
        );
        $sendgrid = new \SendGrid($this->_config['apikey']);
        try {
            $response = $sendgrid->send($sgEmail);
            $test = 0;
        } catch (Exception $e) {
            throw new RuntimeException('');
        }
    }
}
