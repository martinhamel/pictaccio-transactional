<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

define('PAYMENT_PROCESSORS_DIR', APP . 'Lib' . DS . 'Payment' . DS . 'Processors' . DS);

class PAYMENT_CONFIG {
    const PAYMENT_PROCESSORS_DIR = PAYMENT_PROCESSORS_DIR;

    public static $processors = [
        'PaypalExpressCheckout',
        'ConvergeAPI',
        'Stripe'
    ];
}
