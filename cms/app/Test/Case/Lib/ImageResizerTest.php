<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::uses('ImageResizer', 'Lib');

define('SOURCE_FOLDER', APP . DS . 'Test' . DS . 'Resources' . DS);
define('DESTINATION_FOLDER', APP . DS . 'Test' . DS . 'Resources' . DS . 'tmp' . DS);

class ImageResizerTest extends CakeTestCase {
	private $basePath = '';
	private $safeFile = array('.', '..', 'empty');

	public function setUp() {
		parent::setUp();
		$this->basePath = APP . 'Test' . DS . 'Resources' . DS . 'tmp' . DS;
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

	public function testPng_resize() {
		$this->assertTrue(ImageResizer::resize(SOURCE_FOLDER . 'image.png', DESTINATION_FOLDER . 'image.png', 250, 250, false));
		$this->assertTrue(file_exists(DESTINATION_FOLDER . 'image.png'));
	}

	public function testGif_resize() {
		$this->assertTrue(ImageResizer::resize(SOURCE_FOLDER . 'image.gif', DESTINATION_FOLDER . 'image.gif', 250, 250, false));
		$this->assertTrue(file_exists(DESTINATION_FOLDER . 'image.gif'));
	}

	public function testJpg_resize() {
		$this->assertTrue(ImageResizer::resize(SOURCE_FOLDER . 'image.jpg', DESTINATION_FOLDER . 'image.jpg', 250, 250, false));
		$this->assertTrue(file_exists(DESTINATION_FOLDER . 'image.jpg'));
	}
}
