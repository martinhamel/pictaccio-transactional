<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

interface PaymentProcessorInterface {
    const REQUEST_SUBTOTAL = 'subtotal';
    const REQUEST_SHIPPING = 'shipping';
    const REQUEST_TAXES = 'taxes';
    const REQUEST_TOTAL = 'total';
    const REQUEST_CURRENCY = 'currency';
    const REQUEST_ITEMS = 'items';
    const REQUEST_CREDITCARD_NUMBER = 'cc-number';
    const REQUEST_CSC = 'csc';
    const REQUEST_EXPIRY = 'expiry-date';
    const REQUEST_CARDHOLDER_NAME = 'cardholder-name';
    const REQUEST_ORDER_ID = 'order-id';
    const REQUEST_ADDRESS = 'address';
    const REQUEST_POSTAL_CODE = 'postal-code';
    const REQUEST_CITY = 'city';
    const REQUEST_STATE = 'state';
    const REQUEST_PHONE = 'phone';
    const REQUEST_EMAIL = 'email';

    const STATUS_APPROVED = 'approved';
    const STATUS_DECLINED = 'declined';
    const STATUS_ERROR = 'server-error';
    const STATUS_FAILED = 'failed';
    const STATUS_NO_RESPONSE = 'no-response';

    const RESPONSE_STATUS_KEY = 'status';
    const RESPONSE_MESSAGE_KEY = 'message';
    const RESPONSE_TRANSACTION_ID = 'transactionId';
    const RESPONSE_TRANSACTION_TIMESTAMP = 'timestamp';
    const RESPONSE_RAW = 'raw';


    /**
     * @param $method
     * @param $params
     */
    public function callback($method, &$params);

    /**
     * @return string Returns a link formatted as an HTML. Link initiate payment using the payment processor it represent.
     */
    public function getLink();
}
