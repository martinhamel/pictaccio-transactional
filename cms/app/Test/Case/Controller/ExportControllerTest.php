<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::uses('AppController', 'Controller');

class ExportControllerTest extends ControllerTestCase {
	public function test_Config() {
		//$this->skipIf(true);
		$this->testAction('/exports/config');
	}

	public function test_LocaleEng() {
		$this->skipIf(true);
		$this->testAction('/exports/locale/eng.json');
	}

	public function test_LocaleFra() {
		//$this->skipIf(true);
		$this->testAction('/exports/locale/fra.json');
	}
}
