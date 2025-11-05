<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::uses('Stream', 'Lib/Streams');

class StreamTest extends CakeTestCase {
	public function test_openString() {
		$stream = Stream::create("First line\nSome more test on line 2\nAnd this is the final line!");
		$this->assertEquals('StringStream', get_class($stream));
		$this->assertEquals("First line\nSome more test on line 2\nAnd this is the final line!", $stream->read());
		$stream->close();
	}

	public function test_openPath() {
		$stream = Stream::create(APP . 'Test/Resources/unique.txt');
		$this->assertEquals('FileStream', get_class($stream));
		$this->assertEquals("First line\nSome more test on line 2\nAnd this is the final line!\n", $stream->read());
		$stream->close();

		/*$stream = Stream::create('c:\Test\Resources\unique.txt');
		$this->assertEquals('FileStream', get_class($stream));
		$this->assertEquals('c:\Test\Resources\unique.txt', $stream->readStream());
		$stream->close();*/
	}

	public function test_openUrl() {
		$stream = Stream::create('http://heliox-creation.com');
		$this->assertEquals('StringStream', get_class($stream));
		$this->assertEquals('http://heliox-creation.com', $stream->read());
		$stream->close();
	}

	public function test_openNumber() {
		$stream = Stream::create(100);
		$this->assertEquals('StringStream', get_class($stream));
		$this->assertEquals("100", $stream->read());
		$stream->close();

		$stream = Stream::create(100.1);
		$this->assertEquals('StringStream', get_class($stream));
		$this->assertEquals("100.1", $stream->read());
		$stream->close();
	}

	public function test_openArray() {
		$stream = Stream::create(array(1,2,3,4));
		$this->assertEquals('StringStream', get_class($stream));
		$this->assertEquals("[1,2,3,4]", $stream->read());
		$stream->close();
	}

	public function test_openObject() {
		$stream = Stream::create(array('prop1' => 'value1', 'prop2' => 'value2'));
		$this->assertEquals('StringStream', get_class($stream));
		$this->assertEquals('{"prop1":"value1","prop2":"value2"}', $stream->read());
		$stream->close();
	}
}
