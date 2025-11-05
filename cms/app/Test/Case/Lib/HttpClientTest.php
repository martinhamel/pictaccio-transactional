<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

require APP . 'Lib/HttpClient/HttpClient.php';

class HttpClientTest extends CakeTestCase {
	public function setUp() {
		HttpClient::release();
	}

	public function test_createFileGet() {
		HTTP_CLIENT_CONFIG::$config['fallback'] = array('FileGetContentClient');
		$client = HttpClient::create();
		$this->assertEquals('FileGetContentClient', get_class($client));
	}

	public function test_createCurl() {
		HTTP_CLIENT_CONFIG::$config['fallback'] = array('CurlClient');
		$client = HttpClient::create();
		$this->assertEquals('CurlClient', get_class($client));
	}

	public function test_fileGetReadHeliox() {
		HTTP_CLIENT_CONFIG::$config['fallback'] = array('FileGetContentClient');
		$client = HttpClient::create();
		$client->send(array('url' => 'http://heliox-creation.com'));
		$this->assertTextContains('Heliox', $client->getResponse()['body']);
	}

	public function test_curlReadHeliox() {
		HTTP_CLIENT_CONFIG::$config['fallback'] = array('CurlClient');
		$client = HttpClient::create();
		$client->send(array('url' => 'http://heliox-creation.com'));
		$this->assertTextContains('Heliox', $client->getResponse()['body']);
	}
}
