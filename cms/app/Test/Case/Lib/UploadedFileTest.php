<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::uses('UploadedFile', 'Lib');

class UploadedFileTest extends CakeTestCase {
	private $_file;

	public function setUp() {
		$this->_file = array(
				'name' => 'test.jpg',
				'type' => 'image/jpeg',
				'size' => 542,
				'tmp_name' => __DIR__ . '/_files/source-test.jpg',
				'error' => 0,
				'unittest' => true
		);
	}

	public function test_create() {
		$file = new UploadedFile($this->_file);
		$this->assertEquals('UploadedFile', get_class($file));
	}

	public function test_createMoveFile() {
		$file = new UploadedFile($this->_file);
		$this->assertTrue($file->move('/some/path'));
	}

	public function test_createMoveInvalidFile() {
		$this->_file['unittest'] = false;

		$this->setExpectedException('ForbiddenException');
		$file = new UploadedFile($this->_file);
		$this->assertTrue($file->move('/some/path'));
	}

	public function test_returnCorrectMimeType() {
		$file = new UploadedFile($this->_file);
		$this->assertEquals('image/jpeg', $file->mimeType());
	}

	public function test_testMimeType() {
		$file = new UploadedFile($this->_file);
		$this->assertTrue($file->mimeIs('image/jpeg'));
	}

	public function test_testMimeTypeFail() {
		$file = new UploadedFile($this->_file);
		$this->assertFalse($file->mimeIs('text/plain'));
	}

	public function test_testIsOfType() {
		$file = new UploadedFile($this->_file);
		$this->assertTrue($file->is('image'));
	}

	public function test_testIsOfTypefail() {
		$file = new UploadedFile($this->_file);
		$this->assertFalse($file->is('text'));
	}
}
