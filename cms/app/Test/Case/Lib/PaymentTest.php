<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::uses('Payment', 'Lib/Payment');

class PaymentTest extends CakeTestCase {
	private $_payment;

	public function setUp() {
		$this->_payment = new Payment();
	}

	public function tearDown() {
		unset($this->_payment);
	}

	public function test_getLinks() {
		$expected = array('<form action="/Pay/hook/PaypalExpressCheckout/SetCheckoutExpress" METHOD="POST"><input type="image" name="submit" src="https://www.paypal.com/en_US/i/btn/btn_xpressCheckout.gif" border="0" align="top" alt="Check out with PayPal"/></form>');
		$this->assertEquals($expected, $this->_payment->getLinks());
	}
}
