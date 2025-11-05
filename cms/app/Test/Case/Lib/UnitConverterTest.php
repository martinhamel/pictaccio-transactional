<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::uses('UnitConverter', 'Lib');

class UnitConverterTest extends CakeTestCase {
	private $converter = null;

	public function setUp() {
		parent::setUp();
	}

	public function tearDown() {
		parent::tearDown();
		unset($this->converter);
	}

	public function test_UnitConverterToMetric() {
		$this->assertEquals('101.6 mm', UnitConverter::convert('4 in', array('system' => 'metric')));
		$this->assertEquals('10.16 cm', UnitConverter::convert('4 in', array('system' => 'metric', 'unit' => 'cm')));
		$this->assertEquals('10.16 cm', UnitConverter::convert('4 "', array('system' => 'metric', 'unit' => 'cm')));
		$this->assertEquals('1.81436948 kg', UnitConverter::convert('4 lbs', array('system' => 'metric')));
		$this->assertEquals('1814.36948 g', UnitConverter::convert('4 lbs', array('system' => 'metric', 'unit' => 'g')));
		$this->assertEquals('2.273045 l', UnitConverter::convert('4 pt', array('system' => 'metric')));
		$this->assertEquals('2273.045 ml', UnitConverter::convert('4 pt', array('system' => 'metric', 'unit' => 'ml')));
	}

	public function test_UnitConverterToImperial() {
		$this->assertEquals('13\'1" ', UnitConverter::convert('4 m', array('system' => 'imperial')));
		$this->assertEquals('157" ', UnitConverter::convert('4 m', array('system' => 'imperial', 'unit' => 'in')));
		$this->assertEquals('13\'1" ', UnitConverter::convert('4 m', array('system' => 'imperial', 'unit' => '"')));
		$this->assertEquals('141.09568 oz', UnitConverter::convert('4 kg', array('system' => 'imperial')));
		$this->assertEquals('61729.421729422 gr', UnitConverter::convert('4 kg', array('system' => 'imperial', 'unit' => 'gr')));
		$this->assertEquals('140.78 fl oz', UnitConverter::convert('4 l', array('system' => 'imperial')));
		$this->assertEquals('7.039 pt', UnitConverter::convert('4 l', array('system' => 'imperial', 'unit' => 'pt')));
	}

	public function test_UnitConverterIsMeasurement() {
		$this->assertTrue(UnitConverter::isMeasurement('4 cm'));
		$this->assertTrue(UnitConverter::isMeasurement('4 kg'));
		$this->assertTrue(UnitConverter::isMeasurement('4 l'));
		//$this->assertTrue(UnitConverter::isMeasurement('4 fl oz'));
		$this->assertTrue(UnitConverter::isMeasurement('4 oz'));
		$this->assertTrue(UnitConverter::isMeasurement('4 "'));
		$this->assertTrue(UnitConverter::isMeasurement('4 \''));
		$this->assertTrue(UnitConverter::isMeasurement('4 in'));

		//$this->assertFalse(UnitConverter::isMeasurement('4 gibberish'));
		//$this->assertFalse(UnitConverter::isMeasurement('cm 4'));
		$this->assertFalse(UnitConverter::isMeasurement('gibberish'));
		$this->assertFalse(UnitConverter::isMeasurement('45'));
		//$this->assertFalse(UnitConverter::isMeasurement('45 45'));
	}
}
