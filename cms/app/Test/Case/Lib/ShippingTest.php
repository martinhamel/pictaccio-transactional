<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::uses('ShippingFactory', 'Lib/Shipping');
App::Uses('CsvReader', 'Lib');
App::uses('Stream','Lib/Streams');

class ShippingTest extends CakeTestCase {
	public function test_createCanadaPost() {
		$this->assertEquals('CanadaPostShippingSource', get_class(ShippingFactory::create('canadapost')));
	}

	public function test_createInvalid() {
		$this->assertNull(ShippingFactory::create('invalid'));
	}

	public function test_getRates() {
		$all = ShippingFactory::getRates(array(
				'origin' => array('postalCode' => 'G0F 3D6'),
				'destination' => array('postalCode' => 'H7N 4N8'),
				'weight' => 1
		));

		$this->assertTrue(isset($all['canadapost']));
		$this->assertTrue(isset($all['canadapost'][0]));
		foreach ($all['canadapost'] as $service) {
			$this->assertTrue(isset($service['code']));
			$this->assertTrue(isset($service['name']));
			$this->assertTrue(isset($service['price']));
			$this->assertTrue(isset($service['expectedDeliveryDate']));
		}

		$all = ShippingFactory::getRates(array(
				'origin' => array('postalCode' => 'G0F3D6'),
				'destination' => array('postalCode' => 'H7N4N8'),
				'weight' => 1
		));

		$this->assertTrue(isset($all['canadapost']));
		$this->assertTrue(isset($all['canadapost'][0]));
		foreach ($all['canadapost'] as $service) {
			$this->assertTrue(isset($service['code']));
			$this->assertTrue(isset($service['name']));
			$this->assertTrue(isset($service['price']));
			$this->assertTrue(isset($service['expectedDeliveryDate']));
		}
	}

	public function test_addresses() {
        $reader = CsvReader::create(null, ['hasHeader' => true]);
        $reader->read(Stream::create('../Test/Resources/contacts.csv'));
        while (1) {
            $contact = $reader->parseRow();
            if ($contact === false) {
                break;
            }

            $rates = ShippingFactory::getRates(array(
                'origin' => [
                    'civicNumber' => $contact[0],
                    'streetName' => $contact[1],
                    'city' => $contact[2],
                    'province' => $contact[3],
                    'country' => 'Canada',
                    'postalCode' => $contact[4],
                ],
                'destination' => array('postalCode' => 'H7N4N8'),
                'weight' => 1
            ));

            if (count($rates['canadapost']) === 0) {
                $this->assertTrue(false);
            }
        }
    }
}
