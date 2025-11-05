<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::uses('CashRegister', 'Lib');

class CashRegisterTest extends CakeTestCase {
	public function test_subtotalShippingTaxesTotal() {
		$register = CashRegister::create(array(
			'productTotal' => null,
			'shipping' => null,
			'subtotal' => array(
					'sum' => array('productTotal', 'shipping')
				),
			'gst' => array(
					'multiply' => array('subtotal', .05)
				),
			'qst' => array(
					'multiply' => array('subtotal', .09975)
				),
			'total' => array(
					'sum' => array('subtotal', 'qst', 'gst')
				)
		));

		$register->productTotal = 10;
		$this->assertEquals(10, $register->subtotal);
		$this->assertEquals(.50, $register->gst);
		$this->assertEquals(1, $register->qst);
		$this->assertEquals(11.50, $register->total);

		$register->shipping = 5;
		$this->assertEquals(15, $register->subtotal);
		$this->assertEquals(1.5, $register->qst);
		$this->assertEquals(.75, $register->gst);
		$this->assertEquals(17.25, $register->total);
	}

	public function test_sanity() {
		$register = CashRegister::create(Configure::read('CashRegister.quebec'));

		$register->productTotal = 100;
		$this->assertEquals(100, $register->subtotal);
		$this->assertEquals(5, $register->gst);
		$this->assertEquals(9.98, $register->qst);
		$this->assertEquals(114.98, $register->total);
		$register->shipping = 15;
		$this->assertEquals(115, $register->subtotal);
		$this->assertEquals(5.75, $register->gst);
		$this->assertEquals(11.47, $register->qst);
		$this->assertEquals(132.22, $register->total);

		$register->productTotal = 58;
		$register->shipping = 0;
		$this->assertEquals(58, $register->subtotal);
		$this->assertEquals(2.9, $register->gst);
		$this->assertEquals(5.79, $register->qst);
		$this->assertEquals(66.69, $register->total);
		$register->shipping = 4.78;
		$this->assertEquals(62.78, $register->subtotal);
		$this->assertEquals(3.14, $register->gst);
		$this->assertEquals(6.26, $register->qst);
		$this->assertEquals(72.18, $register->total);

		$register->shipping = 0;
		$register->productTotal = 548.62;
		$this->assertEquals(548.62, $register->subtotal);
		$this->assertEquals(27.43, $register->gst);
		$this->assertEquals(54.72, $register->qst);
		$this->assertEquals(630.77, $register->total);
		$register->shipping = 60.09;
		$this->assertEquals(608.71, $register->subtotal);
		$this->assertEquals(30.44, $register->gst);
		$this->assertEquals(60.72, $register->qst);
		$this->assertEquals(699.87, $register->total);

		$register->shipping = 0;
		$register->productTotal = 5846.27;
		$this->assertEquals(5846.27, $register->subtotal);
		$this->assertEquals(292.31, $register->gst);
		$this->assertEquals(583.17, $register->qst);
		$this->assertEquals(6721.75, $register->total);
		$register->shipping = 400.33;
		$this->assertEquals(6246.6, $register->subtotal);
		$this->assertEquals(312.33, $register->gst);
		$this->assertEquals(623.1, $register->qst);
		$this->assertEquals(7182.03, $register->total);

		$register->shipping = 0;
		$register->productTotal = 975463115.54;
		$this->assertEquals(975463115.54, $register->subtotal);
		$this->assertEquals(48773155.78, $register->gst);
		$this->assertEquals(97302445.78, $register->qst);
		$this->assertEquals(1121538717.1, $register->total);
		$register->shipping = 14510182148.7;
		$this->assertEquals(15485645264.24, $register->subtotal);
		$this->assertEquals(774282263.21, $register->gst);
		$this->assertEquals(1544693115.11, $register->qst);
		$this->assertEquals(17804620642.56, $register->total);
	}

	public function test_serializeForJs() {
		$register = CashRegister::create(array(
			'productTotal' => null,
			'shipping' => null,
			'subtotal' => array(
				'sum' => array('productTotal', 'shipping')
			),
			'qst' => array(
				'multiply' => array('subtotal', .095)
			),
			'gst' => array(
				'multiply' => array('subtotal', .05)
			),
			'total' => array(
				'sum' => array('subtotal', 'qst', 'gst')
			)
		));

		$this->assertEquals(
			'{"order":["productTotal","shipping","subtotal","qst","gst","total"],"operations":{"productTotal":null,"shipping":null,"subtotal":{"sum":["productTotal","shipping"]},"qst":{"multiply":["subtotal",0.095]},"gst":{"multiply":["subtotal",0.05]},"total":{"sum":["subtotal","qst","gst"]}}}',
			$register->serialize()
		);
	}
}
