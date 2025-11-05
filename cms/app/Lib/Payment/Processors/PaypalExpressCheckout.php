<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::uses('CakeNumber', 'Utility');
App::uses('HttpClient', 'Lib' . DS . 'HttpClient');
App::uses('Event', 'Lib');
App::uses('DeliveryOptionsComponent', 'Controller/Component');

class PaypalExpressCheckout implements PaymentProcessorInterface {
    const _MODULE_NAME = 'PaypalExpressCheckout';
    const _METHOD_PREPARE_CHECKOUT = 'SetCheckoutExpress';
    const _METHOD_DO_CHECKOUT = 'DoCheckoutExpress';
    const _METHOD_FAILED = 'Failed';
    const _ENDPOINT = [
        'debug' => 'https://api-3t.sandbox.paypal.com/nvp',
        'production' => 'https://api-3t.paypal.com/nvp'
    ];
    const _URL = [
        'debug' => 'https://www.sandbox.paypal.com/webscr&cmd=_express-checkout&token=%s',
        'production' => 'https://www.paypal.com/webscr&cmd=_express-checkout&token=%s'
    ];
    const _VERSION = '93';

    private $_LOCALE_MAP = [
        'fra' => 'fr_CA',
        'fr' => 'fr_CA',
        'fr_FR' => 'fr_FR',
        'fr_CA' => 'fr_CA',
        'eng' => 'en_US',
        'en' => 'en_US',
        'en_CA' => 'en_US',
        'en_US' => 'en_US',
        'en_GB' => 'en_GB',
        'default' => 'fr_CA'
    ];

    private $_httpClient = null;

    public function __construct() {
        $http = new HttpClient();
        $this->_httpClient = $http::create();

        if (array_search(Configure::read('BuildInfo.runMode'), ['debug', 'production']) === false) {
            $runMode = Configure::read('BuildInfo.runMode');
            throw new RuntimeException("ConvergeVirtualTerminal: Unknown run mode {$runMode}");
        }

        $httpClientCaps = $this->_httpClient->getCaps();
        if (empty($httpClientCaps['methodPost']) || empty($httpClientCaps['setHeaders']) || empty($httpClientCaps['https']) ||
            empty($httpClientCaps['setVerifyHost']) || empty($httpClientCaps['setVerifyPeer']) || empty($httpClientCaps['setCA']) ||
            empty($httpClientCaps['authBasic'])) {
            throw new ConfigureException('PaypalExpressCheckout: HttpClient does not support the request');
        }
    }

    public function callback($method, &$params) {
        switch ($method) {
        case 'SetCheckoutExpress':
            HeO2Log::paypalEC('SetCheckoutExpress callback invoked');
            $this->_setCheckoutExpress();
            break;

        case 'DoCheckoutExpress':
            HeO2Log::paypalEC('DoCheckoutExpress callback invoked');
            HeO2Log::dump('paypalEC', $params);
            $this->_doCheckoutExpress($params);
            break;

        case 'Failed':
            HeO2Log::paypalEC('Failed callback invoked');
            HeO2Log::dump('paypalEC', $params);
            $this->_failed($params);
            break;
        }
    }

    public function getLink() {
        return '<form id="payment-paypal-ec-form" action="' .
            Router::url(['controller' => 'Pay', 'action' => 'hook', self::_MODULE_NAME, self::_METHOD_PREPARE_CHECKOUT], true) .
            '" METHOD="POST"><input type="image" name="submit" src="https://www.paypal.com/' .
            $this->_makeLocaleString() . '/i/btn/btn_xpressCheckout.gif" border="0" align="top" alt="' . __('PAYMENT_CHECKOUT_WITH_PAYPAL') . '"/></form>';
    }

    /* PRIVATE */
    private function _doCheckoutExpress($params) {
        $deliveryOptionsComponent = new DeliveryOptionsComponent(new ComponentCollection());
//         $promoShippingModel = ClassRegistry::init('StoreConfig');

        $response = $this->_postDoCheckoutExpress($params);

        $cashRegister = CashRegister::create();
        $cashRegister->orderSubtotal = CakeSession::read('Order.cashSubtotal');
        $cashRegister->shipping = CakeSession::read('Order.cashShipping');
        $cashRegister->promo = CakeSession::read('Order.cashPromo');

        if ($response['ACK'] === 'Success') {
            Event::emit('Order.complete', [
                'cash' => $cashRegister,
                'order_id' => CakeSession::read('Order.id'),
                'order' => CakeSession::read('Order'),
                'products' => json_decode(CakeSession::read('Order.products'), true),
                'shipping_id' => null
            ]);
        }

        Event::emit('PaypalExpressCheckout.complete', ['response' => [
            PaymentProcessorInterface::RESPONSE_STATUS_KEY => $response['ACK'] === 'Success' ? PaymentProcessorInterface::STATUS_APPROVED : PaymentProcessorInterface::STATUS_ERROR,
            PaymentProcessorInterface::RESPONSE_TRANSACTION_ID => isset($response['PAYMENTINFO_0_TRANSACTIONID']) ? $response['PAYMENTINFO_0_TRANSACTIONID'] : '',
            PaymentProcessorInterface::RESPONSE_TRANSACTION_TIMESTAMP => isset($response['PAYMENTINFO_0_ORDERTIME']) ? $response['PAYMENTINFO_0_ORDERTIME'] : time(),
            PaymentProcessorInterface::RESPONSE_RAW => $params
        ]]);
    }

    private function _failed($params) {
        Event::emit('PaypalExpressCheckout.complete', ['response' => [
            PaymentProcessorInterface::RESPONSE_STATUS_KEY => PaymentProcessorInterface::STATUS_DECLINED,
            PaymentProcessorInterface::RESPONSE_TRANSACTION_ID => '<none>',
            PaymentProcessorInterface::RESPONSE_TRANSACTION_TIMESTAMP => time(),
            PaymentProcessorInterface::RESPONSE_RAW => $params
        ]]);
    }

    private function _getPaymentInformation() {
        $cashRegister = CashRegister::create();
        $cashRegister->orderSubtotal = CakeSession::read('Order.cashSubtotal');
        $cashRegister->shipping = CakeSession::read('Order.cashShipping');
        $cashRegister->promo = CakeSession::read('Order.cashPromo');

        $payment = [];
        $payment['subtotal'] = CakeNumber::precision($cashRegister->subtotalPromo - $cashRegister->shipping, 2);
        $payment['taxes'] = CakeNumber::precision(CakeSession::read('Order.taxesTotal'), 2);
        $payment['shipping'] = CakeNumber::precision($cashRegister->shipping, 2);
        $payment['total'] = CakeNumber::precision($cashRegister->total, 2);
        $payment[self::REQUEST_CURRENCY] = 'CAD';

        CakeSession::write(self::_MODULE_NAME, $payment);
        return $payment;
    }

    private function _makeLocaleString() {
        $sessionLocale = CakeSession::read('Config.language');
        if (empty($this->_LOCALE_MAP[$sessionLocale])) {
            return $this->_LOCALE_MAP['default'];
        }
        return $this->_LOCALE_MAP[$sessionLocale];
    }

    private function _post($methodName, $params) {
        $params['METHOD'] = urlencode($methodName);
        $params['VERSION'] = urlencode(self::_VERSION);
        $params['USER'] = urlencode(Configure::read('Paypal.username'));
        $params['PWD'] = urlencode(Configure::read('Paypal.password'));
        $params['SIGNATURE'] = urlencode(Configure::read('Paypal.signature'));
        $data = [
            'method' => 'post',
            'url' => self::_ENDPOINT[Configure::read('Paypal.endpoint')],
            'sslVerifyPeer' => false,
            'sslVerifyHost' => false,
            'fields' => http_build_query($params)
        ];

        HeO2Log::paypalEC("Posting to {$methodName}");
        HeO2Log::dump('paypalEC-1', $data);

        $this->_httpClient->send($data);

        parse_str($this->_httpClient->getResponse()['body'], $response);
        HeO2Log::dump('paypalEC-1', $response);
        return $response;
    }

    private function _postDoCheckoutExpress($params) {
        return $this->_post('DoExpressCheckoutPayment', [
            'TOKEN' => $params['token'],
            'PAYERID' => $params['PayerID'],
            'PAYMENTREQUEST_0_PAYMENTACTION' => 'Sale',
            'PAYMENTREQUEST_0_AMT' => CakeSession::read(self::_MODULE_NAME . '.total'),
            'PAYMENTREQUEST_0_CURRENCYCODE' => CakeSession::read(self::_MODULE_NAME . '.currency')
        ]);
    }

    private function _postSetCheckoutExpress($paymentInformation) {
        CakeSession::write(self::_MODULE_NAME . '.total',
            $paymentInformation[self::REQUEST_TOTAL]
        );

        $params = [
            'PAYMENTREQUEST_0_ITEMAMT' => CakeNumber::precision($paymentInformation[self::REQUEST_SUBTOTAL], 2),
            'PAYMENTREQUEST_0_SHIPPINGAMT' => CakeNumber::precision($paymentInformation[self::REQUEST_SHIPPING], 2),
            'PAYMENTREQUEST_0_TAXAMT' => CakeNumber::precision($paymentInformation[self::REQUEST_TAXES], 2),
            'PAYMENTREQUEST_0_AMT' => CakeNumber::precision($paymentInformation[self::REQUEST_TOTAL], 2),
            'PAYMENTREQUEST_0_CURRENCYCODE' => $paymentInformation[self::REQUEST_CURRENCY],
            'L_PAYMENTREQUEST_0_NAME0' => 'Pictaccio #' . CakeSession::read('Order.id'),
            'L_PAYMENTREQUEST_0_QTY0' => 1,
            'L_PAYMENTREQUEST_0_AMT0' => CakeNumber::precision($paymentInformation[self::REQUEST_SUBTOTAL], 2),
            'PAYMENTREQUEST_0_PAYMENTACTION' => 'Sale',
            'PAYMENTREQUEST_0_DESC' => 'Pictaccio #' . CakeSession::read('Order.id'),
            'RETURNURL' => Router::url(['controller' => 'Pay', 'action' => 'hook', self::_MODULE_NAME, self::_METHOD_DO_CHECKOUT], true),
            'CANCELURL' => Router::url(['controller' => 'Pay', 'action' => 'hook', self::_MODULE_NAME, self::_METHOD_FAILED], true),
        ];
        return $this->_post('SetExpressCheckout', $params);
    }

    private function _setCheckoutExpress() {
        $response = $this->_postSetCheckoutExpress(
            $this->_getPaymentInformation()
        );

        if ($response['ACK'] === 'Success') {
            header('Location: ' . sprintf(self::_URL[Configure::read('Paypal.endpoint')], $response['TOKEN']));
            exit;
        } else{
            throw new ErrorException($response['L_SHORTMESSAGE0'] . ' --- ' . $response['L_LONGMESSAGE0']);
        }
    }
}
