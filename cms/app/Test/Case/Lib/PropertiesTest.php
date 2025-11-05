<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::uses('Properties', 'Lib');

class PropertiesTest extends CakeTestCase {
	private $_json = '{"group1":{"prop1":{"type":"text","default":"test","value":"test"},"prop2":{"type":"number","default":1,"value":1},"prop3":{"type":"list","list":["item1","item2","item3"],"default":"item2","value":"item2"},"prop4":{"type":"bool","default":false,"value":false}},"group2":{"prop1":{"type":"range","min":0,"max":100,"default":50,"value":50},"prop2":{"type":"list","list":["item1","item2","item3"],"default":"invalid","value":"item1"},"prop3":{"type":"text","value":""},"prop4":{"type":"number","value":0},"prop5":{"type":"list","list":["item1","item2","item3"],"value":"item1"},"prop6":{"type":"bool","value":false},"prop7":{"type":"range","min":0,"max":100,"value":0}}}';
	private $_template = array(
		'group1' => array(
			'prop1' => array(
				'type' => 'text',
				'default' => 'test'
			),
			'prop2' => array(
				'type' => 'number',
				'default' => 1
			),
			'prop3' => array(
				'type' => 'list',
				'list' => array('item1', 'item2', 'item3'),
				'default' => 'item2'
			),
			'prop4' => array(
				'type' => 'bool',
				'default' => false
			)
		),
		'group2' => array(
			'prop1' => array(
				'type' => 'range',
				'min' => 0,
				'max' => 100,
				'default' => 50
			),
			'prop2' => array(
				'type' => 'list',
				'list' => array('item1', 'item2', 'item3'),
				'default' => 'invalid'
			),
			'prop3' => array(
				'type' => 'text'
			),
			'prop4' => array(
				'type' => 'number'
			),
			'prop5' => array(
				'type' => 'list',
				'list' => array('item1', 'item2', 'item3')
			),
			'prop6' => array(
				'type' => 'bool'
			),
			'prop7' => array(
				'type' => 'range',
				'min' => 0,
				'max' => 100
			)
		)
	);
	private $_props;

	public function setUp() {
		$this->_props = new Properties($this->_template);
	}

	public function test_create() {
		$this->assertEquals('Properties', get_class($this->_props));
	}

	public function test_groupSuccess() {
		$this->assertTrue(isset($this->_props->group1));
	}

	public function test_groupFail() {
		$this->setExpectedException('UnknownException', 'Properties | Unknown property: \'invalid\'');
		$this->_props->invalid;
		$this->assertFalse(isset($this->_props->invalid));
	}

	public function test_propFail() {
		$this->setExpectedException('UnknownException', 'Properties | Unknown property: \'invalid\'');
		$this->_props->invalid;
	}

	public function test_stringDefault() {
		$this->assertEquals('test', $this->_props->group1->prop1);
	}

	public function test_stringNoDefault() {
		$this->assertEquals('', $this->_props->group2->prop3);
	}

	public function test_stringWrite() {
		$this->_props->group1->prop1 = 'edit';
		$this->assertEquals('edit', $this->_props->group1->prop1);
	}

	public function test_numberDefault() {
		$this->assertEquals(1, $this->_props->group1->prop2);
	}

	public function test_numberNoDefault() {
		$this->assertEquals(0, $this->_props->group2->prop4);
	}

	public function test_numberWrite() {
		$this->_props->group1->prop2 = 10;
		$this->assertEquals(10, $this->_props->group1->prop2);
	}

	public function test_numberWriteFloat() {
		$this->_props->group1->prop2 = 3.141592;
		$this->assertEquals(3.141592, $this->_props->group1->prop2);
	}

	public function test_numberWriteStringFail() {
		$this->setExpectedException('TypeException', 'Properties | Cannot coerce \'string\' to number');
		$this->_props->group1->prop2 = 'string';
	}

	public function test_listDefault() {
		$this->assertEquals('item2', $this->_props->group1->prop3);
	}

	public function test_listNoDefault() {
		$this->assertEquals('item1', $this->_props->group2->prop5);
	}

	public function test_listWrite() {
		$this->_props->group1->prop3 = 'item3';
		$this->assertEquals('item3', $this->_props->group1->prop3);
	}

	public function test_listWriteOutOfRangeFail() {
		$this->setExpectedException('RangeException', 'Properties | Value \'invalid\' is out of range');
		$this->_props->group1->prop3 = 'invalid';
	}

	public function test_listMalformedPlanFail() {
		$this->setExpectedException('MissingAttributeException', 'Properties | Plan for property \'prop\' is missing attribute \'list\'');
		new Properties(array('prop' => array('type' => 'list')));
	}

	public function test_boolDefault() {
		$this->assertFalse($this->_props->group1->prop4);
	}

	public function test_boolNoDefault() {
		$this->assertFalse($this->_props->group2->prop6);
	}

	public function test_boolWrite() {
		$this->_props->group1->prop4 = true;
		$this->assertTrue($this->_props->group1->prop4);
	}

	public function test_rangeDefault() {
		$this->assertEquals(50, $this->_props->group2->prop1);
	}

	public function test_rangeNoDefault() {
		$this->assertEquals(0, $this->_props->group2->prop7);
	}

	public function test_rangeWrite() {
		$this->_props->group2->prop1 = 10;
		$this->assertEquals(10, $this->_props->group2->prop1);
	}

	public function test_rangeWriteOutOfRange() {
		$this->setExpectedException('RangeException', 'Properties | Value \'prop1\' is outside min \'0\' and max \'100\'');
		$this->_props->group2->prop1 = 200;
	}

	public function test_rangeMalformedPlanFail() {
		$this->setExpectedException('MissingAttributeException', 'Properties | Plan for property \'prop\' is missing attribute \'min\' and/or \'max\'');
		new Properties(array('prop' => array('type' => 'range')));
	}

	public function test_toArray() {
		$this->assertEquals(json_decode($this->_json, true), $this->_props->toArray());
	}

	public function test_toJson() {
		$this->assertEquals(
				$this->_json,
				$this->_props->toJson()
			);
	}

	public function test_fromArray() {
		$props = new Properties(array(
				'group' => array(
					'prop1' => array('type' => 'text'),
					'prop2' => array('type' => 'number')
				)
			));
		$props->fromArray(array(
				'group' => array(
					'prop1' => array('type' => 'text', 'value' => 'test'),
					'prop2' => array('type' => 'number', 'value' => 50)
				)
			));
		$this->assertEquals(array(
				'group' => array(
					'prop1' => array('type' => 'text', 'value' => 'test'),
					'prop2' => array('type' => 'number', 'value' => 50)
				)
			), $props->toArray());
	}

	public function test_fromArrayFail() {
		$this->setExpectedException('TypeException', 'Properties | Cannot coerce \'string\' to number');
		$props = new Properties(array(
				'group' => array(
					'prop1' => array('type' => 'text'),
					'prop2' => array('type' => 'number')
				)
			));
		$props->fromArray(array(
				'group' => array(
					'prop1' => array('type' => 'text', 'value' => 'test'),
					'prop2' => array('type' => 'number', 'value' => 'string')
				)
			));
	}

	public function test_fromJson() {
		$props = new Properties(array(
				'group' => array(
					'prop1' => array('type' => 'text'),
					'prop2' => array('type' => 'number')
				)
			));
		$props->fromJson(json_encode(array(
				'group' => array(
					'prop1' => array('type' => 'text', 'value' => 'test'),
					'prop2' => array('type' => 'number', 'value' => 50)
				)
			)));
		$this->assertEquals(json_encode(array(
				'group' => array(
					'prop1' => array('type' => 'text', 'value' => 'test'),
					'prop2' => array('type' => 'number', 'value' => 50)
				)
			)), $props->toJson());
	}

	public function test_fromJsonFail() {
		$this->setExpectedException('TypeException', 'Properties | Cannot coerce \'string\' to number');
		$props = new Properties(array(
				'group' => array(
					'prop1' => array('type' => 'text'),
					'prop2' => array('type' => 'number')
				)
			));
		$props->fromJson(json_encode(array(
				'group' => array(
					'prop1' => array('type' => 'text', 'value' => 'test'),
					'prop2' => array('type' => 'number', 'value' => 'string')
				)
			)));
	}
}
