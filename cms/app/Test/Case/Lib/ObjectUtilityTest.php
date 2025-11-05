<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::uses('ObjectUtility', 'Lib');

class ObjectUtilityTest extends CakeTestCase {
	private $testMapperArray = array(
		array(
			'Table_ID' => array(
				'id' => 1,
				'text' => 'Not Good1'
			),
			'Table_Value' => array(
				'id' => 1001,
				'text' => "Good1"
			)
		),
		array(
			'Table_ID' => array(
				'id' => 2,
				'text' => 'Not Good2'
			),
			'Table_Value' => array(
				'id' => 2001,
				'text' => "Good2"
			)
		),
		array(
			'Table_ID' => array(
				'id' => 3,
				'text' => 'Not Good3'
			),
			'Table_Value' => array(
				'id' => 3001,
				'text' => "Good3"
			)
		),
		array(
			'Table_ID' => array(
				'id' => 4,
				'text' => 'Not Good4'
			),
			'Table_Value' => array(
				'id' => 4001,
				'text' => "Good4"
			)
		)
	);
	private $testMapperArraySingle = array(
		'Table_ID' => array(
			'id' => 1,
			'text' => 'Not Good1'
		),
		'Table_Value' => array(
			'id' => 1001,
			'text' => "Good1"
		)
	);
	private $resultMapperObject = array(
		array(
			'key' => 1,
			'value' => 'Good1'
		),
		array(
			'key' => 2,
			'value' => 'Good2'
		),
		array(
			'key' => 3,
			'value' => 'Good3'
		),
		array(
			'key' => 4,
			'value' => 'Good4'
		),
	);
	private $resultMapperObjectSingle = array(
			'key' => 1,
			'value' => 'Good1'
		);
	private $resultMapperArray = array(
		'Good1', 'Good2', 'Good3', 'Good4'
	);
	private $testParseObjectArray = array(
		'a1p1' => 'a1v1',
		'a1p2' => 'a1v2',
		'a1p3' => array(
			'a2p1' => 'a2v1',
			'a2p2' => 'a2v2',
			'a2p3' => 'a2p3'
		)
	);
	private $testArraySearchArray = array(
		array(
			'id' => 1,
			'value' => 'value1'
		),
		array(
			'id' => 2,
			'value' => 'value2'
		),
		array(
			'id' => 3,
			'value' => 'value3'
		)
	);

	public function testMap() {
		$this->assertEquals($this->resultMapperObject,
			ObjectUtility::map($this->testMapperArray,
				array(	array('key' => 'Table_ID.id', 'becomes' => 'key'),
						array('key' => 'Table_Value.text', 'becomes' => 'value')
				)
			));
		$this->assertEquals($this->resultMapperObjectSingle,
			ObjectUtility::map($this->testMapperArraySingle,
				array(	array('key' => 'Table_ID.id', 'becomes' => 'key'),
					array('key' => 'Table_Value.text', 'becomes' => 'value')
				)
			));
		$this->assertEquals($this->resultMapperArray, ObjectUtility::map($this->testMapperArray, array('makeArray' => true, 'Table_Value.text')));
	}

	public function testParseObject() {
		$this->assertEquals('a2v1', ObjectUtility::parseObject('a1p3.a2p1', $this->testParseObjectArray));
		$this->assertEquals(null, ObjectUtility::parseObject('invalid.key', $this->testParseObjectArray));
	}

	public function testArraySearch() {
		$this->assertEquals($this->testArraySearchArray[1], ObjectUtility::arraySearch(2, 'id', $this->testArraySearchArray));
		$this->assertEquals(null, ObjectUtility::arraySearch('invalid', 'id', $this->testArraySearchArray));
	}

	public function testCheck() {

	}
}
