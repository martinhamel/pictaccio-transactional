<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::uses('DeliveryOptions', 'Lib' . DS . 'DeliveryOptions');

class DeliveryOptionsTest extends CakeTestCase {
	public function test_enum() {
		$sources = DeliveryOptions::enum();

		$this->assertEquals(4, count($sources));
		$this->assertTrue(isset($sources['pickup']));
		$this->assertEquals(array('class' => 'PickupDeliveryOptionSource', 'friendlyId' => 'pickup'), $sources['pickup']);
		$this->assertTrue(isset($sources['school']));
		$this->assertEquals(array('class' => 'SchoolDeliveryOptionSource', 'friendlyId' => 'school'), $sources['school']);
		$this->assertTrue(isset($sources['canadapost']));
		$this->assertEquals(array('class' => 'CanadaPostDeliveryOptionSource', 'friendlyId' => 'canadapost'), $sources['canadapost']);
		$this->assertTrue(isset($sources['fixed-rate']));
		$this->assertEquals(array('class' => 'FixedDeliveryOptionSource', 'friendlyId' => 'fixed-rate'), $sources['fixed-rate']);
	}

	public function test_createSuccess() {
		$sources = DeliveryOptions::enum();

		foreach ($sources as $source) {
			$deliveryOption = DeliveryOptions::create($source);
			$this->assertEquals($source['class'], get_class($deliveryOption));
		}
		$this->assertEquals('PickupDeliveryOptionSource', get_class(DeliveryOptions::create(array('class' => 'PickupDeliveryOptionSource'))));
		$this->assertEquals('PickupDeliveryOptionSource', get_class(DeliveryOptions::create(array('friendlyId' => 'invalid', 'class' => 'PickupDeliveryOptionSource'))));
	}

	public function test_createFail() {
		$this->assertNull(DeliveryOptions::create('invalid'));
	}

}
