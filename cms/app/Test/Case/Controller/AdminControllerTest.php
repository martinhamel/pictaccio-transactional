<?php
/*
 * Copyright © 2015-2024, loufa - All Right Reserved
 */

App::uses('AppController', 'Controller');
App::uses('Path', 'Lib');

class AdminControllerTest extends ControllerTestCase {
	public function testIndex() {
		$this->testAction('/admin/index');
	}

	public function testDropins() {
		$dropinFolderHandler = opendir(Path::join(APP, 'Controller', 'AdminDropins'));
		while ($file = readdir($dropinFolderHandler)) {
			$dropinPath = Path::join(APP, 'Controller', 'AdminDropins', $file);
			if (Path::isDirectory($dropinPath, true) && substr($file, -strlen('Dropin') === 'Dropin')) {
				$manifest = json_decode(file_get_contents(Path::join($dropinPath, 'manifest')), true);
				$this->testAction('/admin/' . $manifest['uuid']);
			}
		}
	}
}
