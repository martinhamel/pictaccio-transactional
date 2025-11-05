<?php

App::uses('SpecialItems', 'Lib' . DS . 'SpecialItems');

class SpecialItemsTest extends CakeTestCase {
	public function test_enum() {
		$specialItems = SpecialItems::enum();
		$this->assertEquals('Pack6SpecialItem', $specialItems['pack6']['class']);
	}

	public function test_get() {
		$this->assertEquals('Pack6SpecialItem', get_class(SpecialItems::get('pack6')));
		$this->assertEquals('Pack6SpecialItem', get_class(SpecialItems::get('pack6')->restore(1)));
	}

	public function test_pack6() {
		$pack6_1 = SpecialItems::get('pack6')->restore(1);
		$pack6_2 = SpecialItems::get('pack6')->restore(2);

		$this->assertFalse($pack6_1->enable());
		$this->assertEquals(45, $pack6_1->item->price);
		$pack6_1->enable(true);
		$pack6_1->item->price = 25;
		$pack6_1->persist(3);

		$this->assertTrue($pack6_2->enable());
		$this->assertEquals(35, $pack6_2->item->price);

		$pack6_3 = SpecialItems::get('pack6')->restore(3);
		$this->assertTrue($pack6_3->enable());
		$this->assertEquals(25, $pack6_3->item->price);

	}
}
