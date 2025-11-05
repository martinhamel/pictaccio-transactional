<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::uses('StringStream', 'Lib/Streams');

class StringStreamTest extends CakeTestCase {
	private $_sample = "First line\nSome more test on line 2\nAnd this is the final line!";

	public function test_implementsStreamInterface() {
		$this->assertTrue(in_array('StreamInterface', class_implements('StringStream')));
	}

	public function test_createSuccess() {
		$stream = StringStream::create(APP . 'Test/Resources/unique.txt');
		$this->assertEquals('StringStream', get_class($stream));
		$stream->close();
	}

	public function test_bound() {
		$stream = StringStream::create($this->_sample);
		$this->assertTrue($stream->bound());
		$stream->close();

		$stream = StringStream::create();
		$stream->open($this->_sample);
		$this->assertTrue($stream->bound());
		$stream->close();
	}

	public function test_notBound() {
		$stream = StringStream::create();
		$this->assertFalse($stream->bound());
		$stream->close();

		$stream = StringStream::create();
		$stream->open($this->_sample);
		$stream->close();
		$this->assertFalse($stream->bound());
	}

	public function test_canBindString() {
		$this->assertTrue(StringStream::canBind($this->_sample));
	}

	public function test_canBindPath() {
		$this->assertTrue(StringStream::canBind(APP . 'Test/Resources/unique.txt'));
		$this->assertTrue(StringStream::canBind('c:\Test\Resources\unique.txt'));
	}

	public function test_canBindUrl() {
		$this->assertTrue(StringStream::canBind('http://heliox-creation.com'));
	}

	public function test_canBindNumber() {
		$this->assertTrue(StringStream::canBind(100));
		$this->assertTrue(StringStream::canBind(100.1));
	}

	public function test_canBindArray() {
		$this->assertTrue(StringStream::canBind(array(1,2,3,4)));
	}

	public function test_canBindObject() {
		$this->assertTrue(StringStream::canBind(array('prop1' => 'value1', 'prop2' => 'value2')));
	}

	public function test_openSuccess() {
		$stream = StringStream::create();
		$this->assertTrue($stream->open(''));
		$stream->close();
	}

	public function test_openString() {
		$stream = StringStream::create();
		$this->assertTrue($stream->open($this->_sample));
		$this->assertEquals($this->_sample, $stream->read());
		$stream->close();
	}

	public function test_openPath() {
		$stream = StringStream::create();
		$this->assertTrue($stream->open(APP . 'Test/Resources/unique.txt'));
		$this->assertEquals(APP . 'Test/Resources/unique.txt', $stream->read());
		$stream->close();

		$stream = StringStream::create();
		$this->assertTrue($stream->open('c:\Test\Resources\unique.txt'));
		$this->assertEquals('c:\Test\Resources\unique.txt', $stream->read());
		$stream->close();
	}

	public function test_openUrl() {
		$stream = StringStream::create();
		$this->assertTrue($stream->open('http://heliox-creation.com'));
		$this->assertEquals('http://heliox-creation.com', $stream->read());
		$stream->close();
	}

	public function test_opendNumber() {
		$stream = StringStream::create();
		$this->assertTrue($stream->open(100));
		$this->assertEquals("100", $stream->read());
		$stream->close();

		$stream = StringStream::create();
		$this->assertTrue($stream->open(100.1));
		$this->assertEquals("100.1", $stream->read());
		$stream->close();
	}

	public function test_openArray() {
		$stream = StringStream::create();
		$this->assertTrue($stream->open(array(1,2,3,4)));
		$this->assertEquals("[1,2,3,4]", $stream->read());
		$stream->close();
	}

	public function test_openObject() {
		$stream = StringStream::create();
		$this->assertTrue($stream->open(array('prop1' => 'value1', 'prop2' => 'value2')));
		$this->assertEquals('{"prop1":"value1","prop2":"value2"}', $stream->read());
		$stream->close();
	}

	public function test_readStream() {
		$stream = StringStream::create();
		$stream->open($this->_sample);
		$this->assertEquals($this->_sample, $stream->read());
		$stream->close();
	}

	public function test_readLine() {
		$stream = StringStream::create();
		$stream->open($this->_sample);
		$this->assertEquals('First line', $stream->readLine());
		$this->assertEquals('Some more test on line 2', $stream->readLine());
		$this->assertEquals('And this is the final line!', $stream->readLine());
		$stream->close();
	}

	public function test_testReadBytes() {
		$stream = StringStream::create();
		$stream->open($this->_sample);
		$this->assertEquals('First', $stream->read(5));
		$this->assertEquals(' line', $stream->read(5));
		$stream->close();
	}

	public function test_readLineGenerator() {
		$stream = StringStream::create();
		$stream->open($this->_sample);

		$i = 0;
		$lines = ['First line', 'Some more test on line 2', 'And this is the final line!'];
		foreach ($stream->lines() as $line) {
			$this->assertEquals($lines[$i++], $line);
		}

		$stream->close();
	}

	public function test_consumeBound() {
		$stream = StringStream::create();
		$stream->open($this->_sample);
		$stream->consume(function($stream) {
			$this->assertEquals($this->_sample, $stream->read());
		});
	}

	public function test_openAndConsume() {
		$stream = StringStream::create();
		$stream->consume(function($stream) {
			$this->assertEquals($this->_sample, $stream->read());
		}, $this->_sample);
	}

	public function test_readLineWindowsNewLine() {
		$stream = StringStream::create();
		$stream->open("First line\n\rSome more test on line 2\n\rAnd this is the final line!", array('newLine' => '\n\r'));
		$this->assertEquals("First line\n\rSome more test on line 2\n\rAnd this is the final line!", $stream->read());
		$stream->close();
	}

	public function test_readAfterClose() {
		$this->setExpectedException('IoException', 'Attempting to access an unbound stream');
		$stream = StringStream::create();
		$stream->open($this->_sample);
		$stream->close();
		$stream->readLine();
	}

	public function test_seekAbsolute() {
		$stream = StringStream::create($this->_sample);
		$stream->cursor(5);
		$this->assertEquals(' line', $stream->read(5));
		$stream->cursor(0);
		$this->assertEquals('First', $stream->read(5));
		$stream->cursor(-5);
		$this->assertEquals('line!', $stream->read(5));
	}

	public function test_seekRelative() {
		$stream = StringStream::create($this->_sample);
		$stream->cursor(5, true);
		$this->assertEquals(' line', $stream->read(5));
		$stream->cursor(-5, true);
		$this->assertEquals(' line', $stream->read(5));
		$stream->cursor(10, true);
		$this->assertEquals(' test', $stream->read(5));
	}

	public function test_endOfStreamAfterReadAll() {
		$stream = StringStream::create($this->_sample);
		$stream->read();
		$this->assertTrue($stream->endOfStream());
	}

	public function test_endOfStreamAfterReadBytes() {
		$stream = StringStream::create($this->_sample);
		$stream->read(11);
		$stream->read(25);
		$stream->read(27);
		$this->assertTrue($stream->endOfStream());
	}

	public function test_endOfStreamAfterReadLines() {
		$stream = StringStream::create($this->_sample);
		while($stream->readLine());
		$this->assertTrue($stream->endOfStream());
	}

	public function test_endOfStreamAfterGenerator() {
		$stream = StringStream::create($this->_sample);
		foreach($stream->lines() as $line);
		$this->assertTrue($stream->endOfStream());
	}

	public function test_seekAfterEofUpdatesEof() {
		$stream = StringStream::create($this->_sample);
		$stream->read();
		$stream->cursor(0);
		$this->assertFalse($stream->endOfStream());
	}

	public function test_seekToEofUpdatesEof() {
		$stream = StringStream::create($this->_sample);
		$stream->cursor(64);
		$this->assertTrue($stream->endOfStream());
	}
}
