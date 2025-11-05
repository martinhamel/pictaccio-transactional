<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::uses('Path', 'Lib');

class PathTest extends CakeTestCase {
	private $testAbsolutePath = null;
	private $testRelativePath = null;
	private $resultBasePath = null;
	private $resultBaseFilename = 'unique';
	private $resultExtension = 'txt';
	private $resultFilename = 'unique.txt';

	public function setUp() {
		$this->testAbsolutePath = APP . 'Test' . DS . 'Resources' . DS . $this->resultFilename;
		$this->testRelativePath = '..' . DS . '..' . DS . 'Resources' . DS . $this->resultFilename;
		$this->resultBasePath = APP . 'Test' . DS . 'Resources' . DS;
	}

	public function tearDown() {
		parent::tearDown();
		$dirHandle = opendir(APP . 'Test' . DS . 'Resources' . DS . 'tmp' . DS);
		while($file = readdir($dirHandle)) {
			if (array_search($file, ['.', '..', 'empty']) === false) {
				if (is_dir(APP . 'Test' . DS . 'Resources' . DS . 'tmp' . DS . $file)) {
					$subDirH = opendir(APP . 'Test' . DS . 'Resources' . DS . 'tmp' . DS . $file);
					while (($entry = readdir($subDirH)) !== false) {
						if ($entry !== "." && $entry !== "..") {
							unlink(Path::join(APP . 'Test' . DS . 'Resources' . DS . 'tmp' . DS . $file, $entry));
						}
					}
					rmdir(APP . 'Test' . DS . 'Resources' . DS . 'tmp' . DS . $file);
				} else {
					unlink(APP . 'Test' . DS . 'Resources' . DS . 'tmp' . DS . $file);
				}
			}
		}
		closedir($dirHandle);
	}

	public function test_absolute() {
		$this->assertEquals($this->testAbsolutePath, Path::absolute($this->testAbsolutePath));
	}

	public function test_base() {
		$this->assertEquals($this->resultBasePath, Path::base($this->testAbsolutePath));
	}

	public function test_baseFilename() {
		$this->assertEquals($this->resultBaseFilename, Path::baseFilename($this->testAbsolutePath));
		$this->assertEquals('filename', Path::baseFilename('/test/path/filename'));
		$this->assertEquals('filename', Path::baseFilename('/test/path/filename.ext'));
		$this->assertEquals('filename', Path::baseFilename('filename.ext'));
		$this->assertEquals('filename', Path::baseFilename('filename'));
	}

	public function test_exist() {
		$this->assertTrue(Path::exist($this->testAbsolutePath));
		$this->assertFalse(Path::exist('/invalid/path'));
	}

	public function test_extension() {
		$this->assertEquals($this->resultExtension, Path::extension($this->testAbsolutePath));
		$this->assertEquals('', Path::extension('/test/path/filename'));
	}

	public function test_filename() {
		$this->assertEquals($this->resultFilename, Path::filename($this->testAbsolutePath));
		$this->assertEquals('filename', Path::filename('/test/path/filename'));
	}

	public function test_follow() {
		//TODO: Create test case
	}

	public function test_isDirectoryOnDirectory() {
		$this->assertTrue(Path::isDirectory($this->resultBasePath));
	}

	public function test_isDirectoryOnFile() {
		$this->assertFalse(Path::isDirectory($this->testAbsolutePath));
	}

	public function test_isDirectoryRejectCurrentParentIsolated() {
		$this->assertFalse(Path::isDirectory('.', true));
		$this->assertFalse(Path::isDirectory('..', true));
	}

	public function test_isDirectoryRejectCurrentParentAsComponent() {
		$this->assertFalse(Path::isDirectory('/some/directory/.'));
		$this->assertFalse(Path::isDirectory('/some/directory/..'));
	}

	public function test_isDirectoryRejectCurrentParentOnDirectory() {
		$this->assertTrue(Path::isDirectory($this->resultBasePath, true));
	}

	public function test_isDirectoryRejectCurrentParentOnFile() {
		$this->assertFalse(Path::isDirectory($this->testAbsolutePath, true));
	}

	public function test_isFileOnFile() {
		//$this->skipIf(true);
		$this->assertTrue(Path::isFile(APP . 'Test' . DS . 'Resources' . DS . 'tmp' . DS . 'unique.txt'));
	}

	public function test_isFileOnDirectory() {
		$this->assertFalse(Path::isFile(APP . 'Test' . DS . 'Resources' . DS . 'tmp' . DS));
		$this->assertFalse(Path::isFile(APP . 'Test' . DS . 'Resources' . DS . 'tmp'));
	}

	public function test_isRelative() {
		$this->assertTrue(Path::isRelative($this->testRelativePath));
		$this->assertFalse(Path::isRelative($this->testAbsolutePath));
	}

	public function test_joinFromArray() {
		$this->assertEquals($this->testAbsolutePath, Path::join(array(APP, 'Test', 'Resources', $this->resultFilename)));
	}

	public function test_joinFromParams() {
		$this->assertEquals($this->testAbsolutePath, Path::join(APP, 'Test', 'Resources', $this->resultFilename));
	}

	public function test_joinWithExtension() {
		$this->assertEquals('/dummy/path/with/extension.txt', Path::join('/dummy', 'path', 'with', 'extension', '.txt'));
		$this->assertEquals('dummy/relative/path/..', Path::join('dummy', 'relative', 'path', '..'));
	}

	public function test_relative() {
		$this->assertEquals('../Controller/AdminDropins/TemplateDropin/', Path::relative('/home/roxy/dev/photosfv2/cms/app/Controller/AdminDropins/TemplateDropin/', '/home/roxy/dev/photosfv2/cms/app/View'));
		$this->assertEquals('static/', Path::relative('/home/user/dev/photosfv2/cms/app/webroot/static/', '/home/user/dev/photosfv2/cms/app/webroot/'));
		$this->assertEquals('static/file.txt', Path::relative('/home/user/dev/photosfv2/cms/app/webroot/static/file.txt', '/home/user/dev/photosfv2/cms/app/webroot/'));
		$this->assertEquals('static/file.txt', Path::relative('c:/home/user/dev/photosfv2/cms/app/webroot/static/file.txt', 'c:/home/user/dev/photosfv2/cms/app/webroot/'));
	}

	public function test_makeDirectory() {
		$dir = Path::makeDirectory(APP . 'Test/Resources/tmp/dir1/dir2');
		$this->assertTrue(file_exists($dir));
		rmdir($dir);
	}

	public function test_uniqueDirectory() {
		$dir1 = Path::makeUniqueDirectory(APP . 'Test/Resources/tmp');
		$dir2 = Path::makeUniqueDirectory(APP . 'Test/Resources/tmp');
		$this->assertNotEquals($dir1, $dir2);
		rmdir($dir1);
		rmdir($dir2);
	}

	public function test_uniqueFile() {
		$file1 = Path::uniqueFilename(APP . 'Test/Resources/tmp');
		$file2 = Path::uniqueFilename(APP . 'Test/Resources/tmp');
		$this->assertTextNotContains('.', substr($file1, strrpos($file1, DS)));
		$this->assertNotEquals($file1, $file2);

		$file3 = Path::uniqueFilename(APP . 'Test/Resources/tmp', '.jpg');
		$this->assertEquals('.jpg', substr($file3, -4));
		$file4 = Path::uniqueFilename(APP . 'Test/Resources/tmp', 'image.jpg');
		$this->assertEquals('image.jpg', substr($file4, -9));
	}

	public function test_delete() {
		mkdir(APP . 'Test/Resources/tmp/test');
		file_put_contents(APP . 'Test/Resources/tmp/test.txt', 'Some text');

		$this->assertTrue(Path::delete(APP . 'Test/Resources/tmp/test'));
		$this->assertTrue(Path::delete(APP . 'Test/Resources/tmp/test.txt'));

		$this->assertFalse(file_exists(APP . 'Test/Resources/tmp/test'));
		$this->assertFalse(file_exists(APP . 'Test/Resources/tmp/test.txt'));

		if (file_exists(APP . 'Test/Resources/tmp/test')) {
			rmdir(APP . 'Test/Resources/tmp/test');
		}
		if (file_exists(APP . 'Test/Resources/tmp/test.txt')) {
			unlink(APP . 'Test/Resources/tmp/test.txt');
		}
	}

	public function test_deleteDirectoryWithChildren() {
		mkdir(APP . 'Test/Resources/tmp/test');
		file_put_contents(APP . 'Test/Resources/tmp/test/test.txt', 'Some text');

		$this->assertFalse(Path::delete(APP . 'Test/Resources/tmp/test'));
		$this->assertTrue(Path::delete(APP . 'Test/Resources/tmp/test', true));
		$this->assertFalse(file_exists(APP . 'Test/Resources/tmp/test'));
	}

	public function test_isReadable() {
		$this->assertTrue(Path::isReadable(APP . '/tmp'));
		//TODO: Find or create fixture unreadable folder
	}

	public function test_directoryHasChildren() {
		mkdir(APP . 'Test/Resources/tmp/test');
		$this->assertTrue(Path::directoryHasChildren(APP . 'Test/Resources'));
		$this->assertFalse(Path::directoryHasChildren(APP . 'Test/Resources/tmp/test'));
		rmdir(APP . 'Test/Resources/tmp/test');
	}

	public function test_filter() {
		$this->assertEquals([Path::join(APP . 'Test/Resources', 'unique.txt')], Path::filter('*.txt', APP . 'Test/Resources'));
		$this->assertEquals([], Path::filter('*.invalid', APP . 'Test/Resources'));
		$this->assertEquals([Path::join(APP . 'Test/Resources', 'image.gif'), Path::join(APP . 'Test/Resources', 'image.jpg'), Path::join(APP . 'Test/Resources', 'image.png')],
			Path::filter('image.*', APP . 'Test/Resources'));
	}

	public function test_move() {
		mkdir(APP . 'Test/Resources/tmp/test');
		file_put_contents(APP . 'Test/Resources/tmp/test.txt', 'Some text');
		$this->assertTrue(Path::move(APP . 'Test/Resources/tmp/test', APP . 'Test/Resources/tmp/test2'));
		$this->assertTrue(Path::move(APP . 'Test/Resources/tmp/test.txt', APP . 'Test/Resources/tmp/test2.txt'));
		$this->assertFalse(Path::move('/invalid/path', 'invalid/destination'));

		$this->assertTrue(file_exists(APP . 'Test/Resources/tmp/test2'));
		$this->assertTrue(file_exists(APP . 'Test/Resources/tmp/test2.txt'));

	}
}
