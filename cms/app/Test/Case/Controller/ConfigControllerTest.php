<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::uses('AppController', 'Controller');
App::uses('CakeSession', 'Model/Datasource');

class ConfigControllerTest extends ControllerTestCase {
	public function test_configSetLangEng() {
		$this->testAction('/config/lang', array('data' => array('lang' => 'eng'), 'method' => 'post'));
		$this->assertEquals('eng', CakeSession::read('Config.language'));
	}

	public function test_configSetLangFra() {
		$this->testAction('/config/lang', array('data' => array('lang' => 'fra'), 'method' => 'post'));
		$this->assertEquals('fra', CakeSession::read('Config.language'));
	}
}
