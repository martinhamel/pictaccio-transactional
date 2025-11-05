<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::uses('FileStream', 'Lib/Streams');

class FileStreamTest extends CakeTestCase {
	public function test_implementsStreamInterface() {
		$this->assertTrue(in_array('StreamInterface', class_implements('FileStream')));
	}

	public function test_createSuccess() {
		$file = FileStream::create(APP . 'Test/Resources/unique.txt');
		$this->assertEquals('FileStream', get_class($file));
		$file->close();
	}

	public function test_bound() {
		$file = FileStream::create(APP . 'Test/Resources/unique.txt');
		$this->assertTrue($file->bound());
		$file->close();

		$file = FileStream::create();
		$file->open(APP . 'Test/Resources/unique.txt');
		$this->assertTrue($file->bound());
		$file->close();
	}

	public function test_notBound() {
		$file = FileStream::create();
		$this->assertFalse($file->bound());
		$file->close();

		$file = FileStream::create();
		$file->open(APP . 'Test/Resources/unique.txt');
		$file->close();
		$this->assertFalse($file->bound());
	}

	public function test_canBindString() {
		$this->assertFalse(FileStream::canBind("First line\nSome more test on line 2\nAnd this is the final line!"));
	}

	public function test_canBindPath() {
		$this->assertTrue(FileStream::canBind(APP . 'Test/Resources/unique.txt'));
		//$this->assertTrue(StringStream::canBind('c:\Test\Resources\unique.txt'));
	}

	public function test_canBindUrl() {
		$this->assertFalse(FileStream::canBind('http://heliox-creation.com'));
	}

	public function test_canBindNumber() {
		$this->assertFalse(FileStream::canBind(100));
		$this->assertFalse(FileStream::canBind(100.1));
	}

	public function test_canBindArray() {
		$this->assertFalse(FileStream::canBind(array(1,2,3,4)));
	}

	public function test_canBindObject() {
		$this->assertFalse(FileStream::canBind(array('prop1' => 'value1', 'prop2' => 'value2')));
	}

	public function test_createFail() {
		$this->setExpectedException('IoException', "Cannot open file stream. File '/invalid/path' cannot be found.");
		FileStream::create('/invalid/path');
	}

	public function test_openSuccess() {
		$file = FileStream::create();
		$this->assertTrue($file->open(APP . 'Test/Resources/unique.txt'));
		$file->close();
	}

	public function test_openString() {
		$stream = FileStream::create();
		$this->assertFalse($stream->open("First line\nSome more test on line 2\nAnd this is the final line!"));
		$stream->close();
	}

	public function test_openPath() {
		$stream = FileStream::create();
		$this->assertTrue($stream->open(APP . 'Test/Resources/unique.txt'));
		$stream->close();

		/*$stream = FileStream::create();
		$this->assertTrue($stream->open('c:\Test\Resources\unique.txt'));
		$this->assertEquals('c:\Test\Resources\unique.txt', $stream->readStream());
		$stream->close();*/
	}

	public function test_openUrl() {
		$stream = FileStream::create();
		$this->assertFalse($stream->open('http://heliox-creation.com'));
		$stream->close();
	}

	public function test_opendNumber() {
		$stream = FileStream::create();
		$this->assertFalse($stream->open(100));
		$stream->close();

		$stream = FileStream::create();
		$this->assertFalse($stream->open(100.1));
		$stream->close();
	}

	public function test_openArray() {
		$stream = FileStream::create();
		$this->assertFalse($stream->open(array(1,2,3,4)));
		$stream->close();
	}

	public function test_openObject() {
		$stream = FileStream::create();
		$this->assertFalse($stream->open(array('prop1' => 'value1', 'prop2' => 'value2')));
		$stream->close();
	}

	public function test_openFail() {
		$file = FileStream::create();
		$this->assertFalse($file->open('/invalid/path'));
		$file->close();
	}

	public function test_readStream() {
		$file = FileStream::create();
		$file->open(APP . 'Test/Resources/unique.txt');
		$stream = $file->read();
		$this->assertEquals("First line\nSome more test on line 2\nAnd this is the final line!\n", $stream);
		$file->close();
	}

	public function test_readLine() {
		$file = FileStream::create();
		$file->open(APP . 'Test/Resources/unique.txt');
		$this->assertEquals('First line', $file->readLine());
		$this->assertEquals('Some more test on line 2', $file->readLine());
		$this->assertEquals('And this is the final line!', $file->readLine());
	}

	public function test_testReadBytes() {
		$file = FileStream::create();
		$file->open(APP . 'Test/Resources/unique.txt');
		$this->assertEquals('First', $file->read(5));
		$this->assertEquals(' line', $file->read(5));
		$file->close();
	}

	public function test_readLineGenerator() {
		$file = FileStream::create();
		$file->open(APP . 'Test/Resources/unique.txt');

		$i = 0;
		$lines = ['First line', 'Some more test on line 2', 'And this is the final line!'];
		foreach ($file->lines() as $line) {
			$this->assertEquals($lines[$i++], $line);
		}

		$file->close();
	}

	public function test_consumeBound() {
		$file = FileStream::create();
		$file->open(APP . 'Test/Resources/unique.txt');
		$file->consume(function($file) {
			$this->assertEquals("First line\nSome more test on line 2\nAnd this is the final line!", $file->read());
		});
	}

	public function test_openAndConsume() {
		$file = FileStream::create();
		$file->consume(function($file) {
			$this->assertEquals("First line\nSome more test on line 2\nAnd this is the final line!", $file->read());
		}, APP . 'Test/Resources/unique.txt');
	}

	public function test_readAfterClose() {
		$this->setExpectedException('IoException', 'Attempting to access an unbound stream');
		$file = FileStream::create();
		$file->open(APP . 'Test/Resources/unique.txt');
		$file->close();
		$file->readLine();
	}

	public function test_seekAbsolute() {
		$stream = FileStream::create(APP . 'Test/Resources/unique.txt');
		$stream->cursor(5);
		$this->assertEquals(' line', $stream->read(5));
		$stream->cursor(0);
		$this->assertEquals('First', $stream->read(5));
		$stream->cursor(-6);
		$this->assertEquals('line!', $stream->read(5));
	}

	public function test_seekRelative() {
		$stream = FileStream::create(APP . 'Test/Resources/unique.txt');
		$stream->cursor(5, true);
		$this->assertEquals(' line', $stream->read(5));
		$stream->cursor(-5, true);
		$this->assertEquals(' line', $stream->read(5));
		$stream->cursor(10, true);
		$this->assertEquals(' test', $stream->read(5));
	}

	public function test_endOfStreamAfterReadAll() {
		$stream = FileStream::create(APP . 'Test/Resources/unique.txt');
		$stream->read();
		$this->assertTrue($stream->endOfStream());
	}

	public function test_endOfStreamAfterReadBytes() {
		$stream = FileStream::create(APP . 'Test/Resources/unique.txt');
		$stream->read(11);
		$stream->read(25);
		$stream->read(29);
		$this->assertTrue($stream->endOfStream());
	}

	public function test_endOfStreamAfterReadLines() {
		$stream = FileStream::create(APP . 'Test/Resources/unique.txt');
		while($stream->readLine());
		$this->assertTrue($stream->endOfStream());
	}

	public function test_endOfStreamAfterGenerator() {
		$stream = FileStream::create(APP . 'Test/Resources/unique.txt');
		foreach($stream->lines() as $line);
		$this->assertTrue($stream->endOfStream());
	}

	public function test_seekAfterEofUpdatesEof() {
		$stream = FileStream::create(APP . 'Test/Resources/unique.txt');
		$stream->read();
		$stream->cursor(0);
		$this->assertFalse($stream->endOfStream());
	}

	public function test_seekToEofUpdatesEof() {
		$stream = FileStream::create(APP . 'Test/Resources/unique.txt');
		$stream->cursor(65);
		$this->assertTrue($stream->endOfStream());
	}
}
