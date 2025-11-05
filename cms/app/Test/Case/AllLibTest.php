<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

class AllLibTest extends CakeTestSuite {
	public static function suite() {
		$suite = new CakeTestSuite('All Lib Tests');
		$suite->addTestDirectory(TESTS . 'Case/Lib');
		return $suite;
	}
}
