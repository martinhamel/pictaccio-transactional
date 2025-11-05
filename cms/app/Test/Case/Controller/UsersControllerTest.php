<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::uses('AppController', 'Controller');

class UsersControllerTest extends ControllerTestCase {
	public function test_Login() {
		$this->testAction('/users/login');
		//TODO: Setup test account for test
	}

	public function test_Logout() {
		$this->testAction('/users/logout');
	}

	/*public function testAdd() {
		$this->testAction('/users/add');
	}*/
}
