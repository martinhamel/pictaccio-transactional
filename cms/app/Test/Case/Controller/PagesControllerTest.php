<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::uses('AppController', 'Controller');

class PagesControllerTest extends ControllerTestCase {
	public function test_Home() {
		$this->testAction('/');
	}

	public function test_AbousUs() {
		$this->testAction('/about-us');
	}
}
