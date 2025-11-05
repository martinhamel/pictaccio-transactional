<?php

App::uses('PhoneNumber', 'Lib');

class PhoneNumberTest extends CakeTestCase {
	private $_validNumbers = array('5145554387', '1-514-555-4387', '514-555-4387', '15145554387');
	private $_numbersShort = array('(514) 555-4387', '(514) 555-4387', '(514) 555-4387', '(514) 555-4387');
	private $_numbersLong = array('1 (514) 555-4387', '1 (514) 555-4387', '1 (514) 555-4387', '1 (514) 555-4387');
	private $_numbersFormal = array('+1-514-555-4387', '+1-514-555-4387', '+1-514-555-4387', '+1-514-555-4387');
	private $_invalidNumbers = array('555-4387', '789456133', '123123456456798789', '44355564387');
	public function test_valid() {
		foreach ($this->_validNumbers as $number) {
			$this->assertTrue(PhoneNumber::create($number, 'american')->validate());
		}
	}

	public function test_invalid() {
		foreach ($this->_invalidNumbers as $number) {
			$this->assertFalse(PhoneNumber::create($number, 'american')->validate());
		}
	}

	public function test_empty_params() {
		$this->setExpectedException('InvalidArgumentException');
		PhoneNumber::create(null, null);
	}

	public function test_unsupported_area() {
		$this->setExpectedException('InvalidArgumentException');
		PhoneNumber::create('5145555069', 'invalid');
	}

	public function test_format() {
		for ($i = 0; $i < count($this->_validNumbers); ++$i) {
			$this->assertEquals($this->_numbersShort[$i], PhoneNumber::create($this->_validNumbers[$i], 'american')->format('short'));
		}
		for ($i = 0; $i < count($this->_validNumbers); ++$i) {
			$this->assertEquals($this->_numbersLong[$i], PhoneNumber::create($this->_validNumbers[$i], 'american')->format('long'));
		}
		for ($i = 0; $i < count($this->_validNumbers); ++$i) {
			$this->assertEquals($this->_numbersFormal[$i], PhoneNumber::create($this->_validNumbers[$i], 'american')->format('formal'));
		}
	}
}
