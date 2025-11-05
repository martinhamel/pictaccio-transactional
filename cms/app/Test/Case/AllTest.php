<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

class AllTest extends CakeTestSuite {
	public static function suite() {
		$suite = new CakeTestSuite('All Tests');
		$suite->addTestDirectory(TESTS . 'Case/Controller');
		$suite->addTestDirectory(TESTS . 'Case/Lib');
		return $suite;
	}
}
