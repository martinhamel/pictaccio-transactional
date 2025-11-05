<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::uses('TempFiles', 'Lib');

class TempFilesTest extends CakeTestCase {
	public static function setupBeforeClass() {
		$_FILES = array(
				'test' => array(
						'name' => 'test.jpg',
						'type' => 'image/jpeg',
						'size' => 542,
						'tmp_name' => __DIR__ . '/_files/source-test.jpg',
						'error' => 0
				),
				'test2' => array(
						'name' => 'test.jpg',
						'type' => 'image/jpeg',
						'size' => 542,
						'tmp_name' => __DIR__ . '/_files/source-test2.jpg',
						'error' => 0
				)
		);
	}

	public function setUp() {
		$_FILES['test']['unittest'] = true;
		$_FILES['test2']['unittest'] = true;
	}

	public function test_create() {
		$tempFiles = new TempFiles();
		$this->assertEquals('TempFiles', get_class($tempFiles));
	}

	public function test_createInvalidFiles() {
		$_FILES['test']['unittest'] = false;
		$_FILES['test2']['unittest'] = false;

		$this->setExpectedException('ForbiddenException');
		$tempFiles = new TempFiles();
	}

	public function test_getFiles() {
		$tempFiles = new TempFiles();
		$files = $tempFiles->get();
		$this->assertTrue(isset($files['test']));
		$this->assertEquals('UploadedFile', get_class($files['test']));
		$this->assertTrue(isset($files['test2']));
		$this->assertEquals('UploadedFile', get_class($files['test2']));
	}
}
