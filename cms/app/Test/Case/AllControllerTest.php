<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

class AllControllerTest extends CakeTestSuite {
	public static function suite() {
		$suite = new CakeTestSuite('All Controller Tests');
		$suite->addTestDirectory(TESTS . 'Case/Controller');
		return $suite;
	}
}
