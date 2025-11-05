<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::uses('LanguageFallback', 'Lib');

class LanguageFallbackTest extends CakeTestCase {
	// Only appropriate if the host app support eng and fra only; needs to
	// be updated if the host has support for other languages
	private $resultGetFallbackPriorityArray = array(
			'en-us', 'eng', 'fra'
		);
	private $testFindAppropriateArray1 = array('spa', 'fra');
	private $testFindAppropriateArray2 = array('en-us', 'eng');
	private $testFindAppropriateArray3 = array('de-de', 'deu');
	private $testFindAppropriateArray4 = array('en-ca', 'en-us');

	private $languageFallback = null;

	public function setUp() {
		parent::setUp();
		Configure::write('Config.language', 'en-us');
		$this->languageFallback = new LanguageFallback();
	}

	public function tearDown() {
		parent::tearDown();
		unset($this->languageFallback);
	}

	public function test_getFallbackPriorityArray() {
		$this->assertEquals($this->resultGetFallbackPriorityArray, LanguageFallback::getFallbackPriorityArray());
	}

	public function test_findAppropriate() {
		$this->assertEquals('fra', $this->languageFallback->findAppropriate($this->testFindAppropriateArray1));
		$this->assertEquals('en-us', $this->languageFallback->findAppropriate($this->testFindAppropriateArray2));
		$this->assertEquals('eng', $this->languageFallback->findAppropriate($this->testFindAppropriateArray4));
		$this->assertNull($this->languageFallback->findAppropriate($this->testFindAppropriateArray3));
	}

	public function test_findAppropriateStatic() {
		$this->assertEquals('fra', LanguageFallback::findAppropriateStatic($this->testFindAppropriateArray1));
	}
}
