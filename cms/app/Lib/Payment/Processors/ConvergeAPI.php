<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::uses('CakeNumber', 'Utility');
App::uses('HttpClient', 'Lib' . DS . 'HttpClient');
App::uses('Event', 'Lib');
App::uses('ObjectUtility', 'Lib');

class ConvergeAPI implements PaymentProcessorInterface {
    const _MODULE_NAME = 'ConvergeAPI';
    const _METHOD_DO_PAYMENT = 'DoPayment';
    const _PROCESS_URL = [
        'debug' => 'https://demo.myvirtualmerchant.com/VirtualMerchantDemo/process.do',
        'production' => 'https://api.convergepay.com/VirtualMerchant/process.do'
    ];
    const _PROCESS_BATCH_URL = [
        'debug' => 'https://demo.myvirtualmerchant.com/VirtualMerchantDemo/processBatch.do',
        'production' => 'https://api.convergepay.com/VirtualMerchant/processBatch.do'
    ];
    const _PROCESS_XML_URL = [
        'debug' => 'https://demo.myvirtualmerchant.com/VirtualMerchantDemo/processxml.do',
        'production' => 'https://api.convergepay.com/VirtualMerchant/processxml.do'
    ];
    const _PROCESS_XML_BATCH_URL = [
        'debug' => 'https://demo.myvirtualmerchant.com/VirtualMerchantDemo/accountxml.do',
        'production' => 'https://api.convergepay.com/VirtualMerchant/accountxml.do'
    ];
    const _CONVERGEAPI_TEST_MODE = 'false';
    const _CONVERGEAPI_TRANSACTION_TYPE = 'ccsale';
    const _CONVERGEAPI_CVV2CVC2_INDICATOR = '1';

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
            throw new ConfigureException('ConvergeVirtualTerminal: HttpClient does not support the request');
        }
    }


    public function callback($method, &$params) {
        switch ($method) {
        case 'ProcessPayment':
            HeO2Log::convergeAPI('ProcessPayment callback invoked');
            return $this->_processPayment($params);
        }

        return null;
    }


    public function getLink() {
        return '<a href="' .
            Router::url(['controller' => 'pay', 'action' => 'hook', self::_MODULE_NAME, self::_METHOD_DO_PAYMENT]) . '">' .
            __('PAYMENT_CONFIRM_PAYMENT') . '</a>';
    }


    /* PRIVATE */
    private function _parseResponse($response) {
        return array_reduce(explode("\n", $response), function ($carry, $item) {
            $equalPos = strpos($item, '=');
            $carry[substr($item, 0, $equalPos)] = substr($item, $equalPos + 1);
            return $carry;
        }, []);
    }

    private function _post($query) {
        $data = [
            'method' => 'post',
            'url' => self::_PROCESS_URL[Configure::read('BuildInfo.runMode')],
            'sslVerifyPeer' => true,
            'sslVerifyHost' => 2,
            'fields' => http_build_query($query),
        ];

        $this->_httpClient->send($data);

        HeO2Log::convergeAPI('Posting to converge servers');

        $dataFiltered = $data;
        $dataFiltered['fields'] = preg_replace('/&ssl_card_number=(?:\d+\+*){4}/', '', $dataFiltered['fields']);
        HeO2Log::dump('convergeAPI', $dataFiltered);

        $response = $this->_parseResponse($this->_httpClient->getResponse()['body']);
        HeO2Log::dump('convergeAPI', $response);
        return $response;
    }

    private function _processPayment(&$params) {
        $success = false;

        if ($missing = ObjectUtility::check($params, [self::REQUEST_TOTAL, self::REQUEST_CREDITCARD_NUMBER, self::REQUEST_CSC, self::REQUEST_EXPIRY, self::REQUEST_CARDHOLDER_NAME, self::REQUEST_CURRENCY])) {
            throw new InternalErrorException('ConvergeAPI: Missing required parameters: ' . implode(', ', $missing));
        }

        $response = $this->_post([
            'ssl_merchant_id' => Configure::read('ConvergeAPI.merchantId'),
            'ssl_user_id' => Configure::read('ConvergeAPI.userId'),
            'ssl_pin' => Configure::read('ConvergeAPI.pin'),
            'ssl_show_form' => 'false',
            'ssl_result_format' => 'ASCII',
            'ssl_test_mode' => self::_CONVERGEAPI_TEST_MODE,
            'ssl_transaction_type' => self::_CONVERGEAPI_TRANSACTION_TYPE,
            'ssl_amount' => $params[self::REQUEST_TOTAL],
            'ssl_card_number' => $params[self::REQUEST_CREDITCARD_NUMBER],
            'ssl_cvv2cvc2_indicator' => self::_CONVERGEAPI_CVV2CVC2_INDICATOR,
            'ssl_cvv2cvc2' => $params[self::REQUEST_CSC],
            'ssl_exp_date' => $params[self::REQUEST_EXPIRY],
            'ssl_invoice_number' => $params[self::REQUEST_ORDER_ID],
            'ssl_first_name' => $params[self::REQUEST_CARDHOLDER_NAME],
            'ssl_last_name' => $params[self::REQUEST_CARDHOLDER_NAME],
            'ssl_avs_address' => $params[self::REQUEST_ADDRESS],
            'ssl_avs_zip' => $params[self::REQUEST_POSTAL_CODE],
            'ssl_city' => $params[self::REQUEST_CITY],
            'ssl_email' => $params[self::REQUEST_EMAIL],
            'ssl_phone' => $params[self::REQUEST_PHONE],
            'ssl_state' => $params[self::REQUEST_STATE],
            'CardholderName' => $params[self::REQUEST_CARDHOLDER_NAME],
            //'ssl_transaction_currency'	=> $params[self::REQUEST_CURRENCY],
            'extra_data' => '1', //TODO: Make it not junk data
            'items' => 'All the things',
            'Type' => self::_CONVERGEAPI_TRANSACTION_TYPE
        ]);

        if (ObjectUtility::check($response, ['ssl_result', 'ssl_result_message', 'ssl_txn_id', 'ssl_txn_time'])) {
            HeO2Log::convergeAPI('Dumping response:');
            HeO2Log::dump('convergeAPI', $response);

            if (ObjectUtility::check($response, ['errorCode', 'errorName', 'errorMessage'])) {
                throw new FatalErrorException('ConvergeAPI: Received an invalid response from Converge\'s server');
            }

            $params['response'] = [
                self::RESPONSE_STATUS_KEY => $this->_status($response['errorCode'], $response['errorMessage']),
                self::RESPONSE_MESSAGE_KEY => "{$response['errorName']} - {$response['errorMessage']}",
                self::RESPONSE_TRANSACTION_ID => null,
                self::RESPONSE_TRANSACTION_TIMESTAMP => time(),
                self::RESPONSE_RAW => $response
            ];
        } else{
            $params['response'] = [
                self::RESPONSE_STATUS_KEY => $this->_status($response['ssl_result'], $response['ssl_result_message']),
                self::RESPONSE_MESSAGE_KEY => $response['ssl_result_message'],
                self::RESPONSE_TRANSACTION_ID => $response['ssl_txn_id'],
                self::RESPONSE_TRANSACTION_TIMESTAMP => date_parse($response['ssl_txn_time']),
                self::RESPONSE_RAW => $response
            ];
            $success = $response['ssl_result'] === '0';
        }

        HeO2Log::convergeAPI('Parsed response');
        HeO2Log::dump('convergeAPI', $params['response']);

        return $success;
    }

    private function _status($errorCode, $message) {
        $errorCode = (int)$errorCode;

        if ($errorCode === 0  && ($message === 'APPROBAT' || $message === 'APPROVAL')) {
            return self::STATUS_APPROVED;
        } else if ($errorCode >= 3000 && $errorCode < 4000) {
            return self::STATUS_NO_RESPONSE;
        } else if ($errorCode >= 4000 && $errorCode < 5000) {
            return self::STATUS_ERROR;
        } else if ($errorCode >= 5000 && $errorCode < 6000 || $errorCode === 1) {
            return self::STATUS_FAILED;
        } else if ($errorCode >= 6000 && $errorCode < 7000) {
            return self::STATUS_DECLINED;
        }

        return self::STATUS_ERROR;
    }
}
