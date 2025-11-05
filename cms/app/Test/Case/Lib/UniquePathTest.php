<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::uses('UniquePath', 'Lib');

class UniquePathTest extends CakeTestCase {
	const _TEST_FILE = 'unique.txt';
	private $basePath = '';
	private $uniquePath = null;
	private $safeFile = array('.', '..', 'empty');

	public function setUp() {
		parent::setUp();
		$this->basePath = APP . 'Test' . DS . 'Resources' . DS . 'tmp' . DS;
		$this->uniquePath = new UniquePath($this->basePath);
	}

	public function tearDown() {
		parent::tearDown();
		$dirHandle = opendir($this->basePath);
		while($file = readdir($dirHandle)) {
			if (array_search($file, $this->safeFile) === false) {
				if (is_dir($this->basePath . DS . $file)) {
					rmdir($this->basePath . DS . $file);
				} else {
					unlink($this->basePath . DS . $file);
				}
			}
		}
		closedir($dirHandle);
	}

	public function test_makeSeededFilename() {
		$baseline = $this->uniquePath->makeSeededFilename(self::_TEST_FILE, 'txt');
		$this->assertNotEquals($baseline, $this->uniquePath->makeSeededFilename(self::_TEST_FILE, 'txt'));
		$this->assertTextContains(self::_TEST_FILE, $baseline);
	}
}
