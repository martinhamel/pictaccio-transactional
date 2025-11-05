<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::uses('MimeChecker', 'Lib');

class MimeCheckerTest extends CakeTestCase {
	public function test_extIs() {
		$this->assertTrue(MimeChecker::extIs('zip', 'application/zip'));
		$this->assertFalse(MimeChecker::extIs('txt', 'image/png'));
		$this->assertNull(MimeChecker::extIs('invalid-extension', 'invalid-mime'));
	}

	public function test_is() {
		$this->assertTrue(MimeChecker::is('image', 'image/jpeg'));
		$this->assertFalse(MimeChecker::is('document', 'video/x-flv'));
		$this->assertNull(MimeChecker::is('unknown-type', 'unknown-mime'));
	}

	public function test_isArchive() {
		$this->assertTrue(MimeChecker::isArchive('application/zip'));
		$this->assertFalse(MimeChecker::isArchive('application/pdf'));
	}

	public function test_isAV() {
		$this->assertTrue(MimeChecker::isAV('audio/mpeg'));
		$this->assertFalse(MimeChecker::isAV('application/pdf'));
	}

	public function test_isDocument() {
		$this->assertTrue(MimeChecker::isDocument('application/pdf'));
		$this->assertFalse(MimeChecker::isDocument('application/zip'));
	}

	public function test_isFlash() {
		$this->assertTrue(MimeChecker::isFlash('application/x-shockwave-flash'));
		$this->assertFalse(MimeChecker::isFlash('application/pdf'));
	}

	public function test_isImage() {
		$this->assertTrue(MimeChecker::isImage('image/png'));
		$this->assertFalse(MimeChecker::isImage('application/pdf'));
	}

	public function test_isText() {
		$this->assertTrue(MimeChecker::isText('text/plain'));
		$this->assertFalse(MimeChecker::isText('application/pdf'));
	}

	public function test_isScript() {
		$this->assertTrue(MimeChecker::isScript('text/javascript'));
		$this->assertFalse(MimeChecker::isScript('application/pdf'));
	}
}
