<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::uses('AppController', 'Controller');

class OrderControllerTest extends ControllerTestCase {
	public function test_Index() {
		$this->testAction('/order');
	}

	public function test_Choose() {
		$this->testAction('/order/choose/0513366');
	}

	public function test_Packages() {
		//$this->testAction('/order/packages');
	}

	public function test_Overview() {
		//$this->testAction('/order/overview');
	}
}
